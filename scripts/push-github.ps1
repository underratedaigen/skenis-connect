param(
  [string]$Owner = "underratedaigen",
  [string]$Repo = "skenis-connect",
  [string]$Branch = "main",
  [string]$Message = "Initial Skenis platform implementation",
  [bool]$CreateRepoIfMissing = $true,
  [bool]$Private = $false,
  [bool]$CleanReplace = $true,
  [string[]]$PreserveRemotePaths = @(".lovable")
)

$ErrorActionPreference = "Stop"

$Token = $env:GITHUB_TOKEN

if (-not $Token) {
  $Token = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "User")
}

if (-not $Token) {
  $Token = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "Machine")
}

if (-not $Token) {
  throw "GITHUB_TOKEN is not set. Create a GitHub token with repo write access, set it as an environment variable, then rerun this script."
}

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$RootPath = $Root.Path.TrimEnd("\") + "\"
$ApiBase = "https://api.github.com/repos/$Owner/$Repo"
$Headers = @{
  Authorization          = "Bearer $Token"
  Accept                 = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
  "User-Agent"           = "skenis-upload-script"
}

function Invoke-GitHubJson {
  param(
    [string]$Method,
    [string]$Uri,
    [object]$Body = $null
  )

  if ($null -eq $Body) {
    return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers
  }

  $Json = $Body | ConvertTo-Json -Depth 20 -Compress
  return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -Body $Json -ContentType "application/json"
}

function Test-GitHubRepo {
  try {
    Invoke-GitHubJson -Method GET -Uri $ApiBase | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Ensure-GitHubRepo {
  if (Test-GitHubRepo) {
    Write-Host "Repository $Owner/$Repo is available."
    return
  }

  if (-not $CreateRepoIfMissing) {
    throw "Repository $Owner/$Repo is not available to this token."
  }

  Write-Host "Repository $Owner/$Repo is not available; trying to create it..."

  $OwnerInfo = Invoke-GitHubJson -Method GET -Uri "https://api.github.com/users/$Owner"
  $Body = @{
    name        = $Repo
    private     = $Private
    auto_init   = $false
    description = "Skenis.lt programmable QR review platform"
  }

  if ($OwnerInfo.type -eq "Organization") {
    Invoke-GitHubJson -Method POST -Uri "https://api.github.com/orgs/$Owner/repos" -Body $Body | Out-Null
  } else {
    Invoke-GitHubJson -Method POST -Uri "https://api.github.com/user/repos" -Body $Body | Out-Null
  }

  Write-Host "Created repository $Owner/$Repo."
}

function Test-PreservedRemotePath {
  param([string]$Path)

  foreach ($Preserved in $PreserveRemotePaths) {
    $Normalized = $Preserved.Trim("/").Replace("\", "/")
    if ($Path -eq $Normalized -or $Path.StartsWith("$Normalized/")) {
      return $true
    }
  }

  return $false
}

function Get-RelativeGitPath {
  param([string]$Path)

  $Relative = $Path.Substring($RootPath.Length)
  return $Relative.Replace("\", "/")
}

$ExcludedPathParts = @(
  ".git",
  ".next",
  ".tools",
  "node_modules",
  "coverage",
  "dist"
)

$ExcludedFileNames = @(
  ".env",
  ".env.local",
  "skenis-github-upload.zip"
)

$Files = Get-ChildItem -Path $Root -Recurse -File -Force |
  Where-Object {
    $relative = Get-RelativeGitPath $_.FullName
    $parts = $relative -split "/"
    -not ($parts | Where-Object { $ExcludedPathParts -contains $_ }) -and
    -not ($ExcludedFileNames -contains $_.Name) -and
    -not ($_.Name -like "*.log")
  } |
  Sort-Object FullName

Write-Host "Preparing $($Files.Count) files for $Owner/$Repo on $Branch..."

Ensure-GitHubRepo

$BaseCommitSha = $null
$BaseTreeSha = $null
$RefExists = $false

try {
  $Ref = Invoke-GitHubJson -Method GET -Uri "$ApiBase/git/ref/heads/$Branch"
  $RefExists = $true
  $BaseCommitSha = $Ref.object.sha
  $BaseCommit = Invoke-GitHubJson -Method GET -Uri "$ApiBase/git/commits/$BaseCommitSha"
  $BaseTreeSha = $BaseCommit.tree.sha
  Write-Host "Found existing branch $Branch at $BaseCommitSha"
} catch {
  Write-Host "Branch $Branch does not exist yet; creating an initial commit."
}

$Tree = @()
$LocalPaths = @{}

foreach ($File in $Files) {
  $Path = Get-RelativeGitPath $File.FullName
  $LocalPaths[$Path] = $true
  $Bytes = [System.IO.File]::ReadAllBytes($File.FullName)
  $Content = [Convert]::ToBase64String($Bytes)
  $Blob = Invoke-GitHubJson -Method POST -Uri "$ApiBase/git/blobs" -Body @{
    content  = $Content
    encoding = "base64"
  }

  $Tree += @{
    path = $Path
    mode = "100644"
    type = "blob"
    sha  = $Blob.sha
  }

  Write-Host "Added $Path"
}

if ($CleanReplace -and $BaseTreeSha) {
  $RemoteTree = Invoke-GitHubJson -Method GET -Uri "$ApiBase/git/trees/$BaseTreeSha`?recursive=1"

  foreach ($RemoteItem in $RemoteTree.tree) {
    if ($RemoteItem.type -ne "blob") {
      continue
    }

    if ($LocalPaths.ContainsKey($RemoteItem.path)) {
      continue
    }

    if (Test-PreservedRemotePath -Path $RemoteItem.path) {
      Write-Host "Preserved remote file $($RemoteItem.path)"
      continue
    }

    $Tree += @{
      path = $RemoteItem.path
      mode = $RemoteItem.mode
      type = $RemoteItem.type
      sha  = $null
    }

    Write-Host "Removed remote file $($RemoteItem.path)"
  }
}

$TreeBody = @{
  tree = $Tree
}

if ($BaseTreeSha) {
  $TreeBody.base_tree = $BaseTreeSha
}

$NewTree = Invoke-GitHubJson -Method POST -Uri "$ApiBase/git/trees" -Body $TreeBody

$CommitBody = @{
  message = $Message
  tree    = $NewTree.sha
}

if ($BaseCommitSha) {
  $CommitBody.parents = @($BaseCommitSha)
}

$Commit = Invoke-GitHubJson -Method POST -Uri "$ApiBase/git/commits" -Body $CommitBody

if ($RefExists) {
  Invoke-GitHubJson -Method PATCH -Uri "$ApiBase/git/refs/heads/$Branch" -Body @{
    sha   = $Commit.sha
    force = $false
  } | Out-Null
} else {
  Invoke-GitHubJson -Method POST -Uri "$ApiBase/git/refs" -Body @{
    ref = "refs/heads/$Branch"
    sha = $Commit.sha
  } | Out-Null
}

Write-Host "Pushed commit $($Commit.sha) to https://github.com/$Owner/$Repo/tree/$Branch"
