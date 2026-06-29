import type { QrBatch, RedirectLink } from "@/lib/types";
import { productTypeLabels, redirectStatusLabels } from "@/lib/labels";

type BatchForExport = QrBatch & {
  links: RedirectLink[];
};

function xmlEscape(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cell(value: unknown) {
  return `<c t="inlineStr"><is><t>${xmlEscape(value)}</t></is></c>`;
}

function row(values: unknown[], index: number) {
  return `<row r="${index}">${values.map(cell).join("")}</row>`;
}

export async function buildBatchWorkbook(batch: BatchForExport, baseUrl: string) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const rows: string[] = [];

  rows.push(row(["Batch name", batch.name], 1));
  rows.push(row(["Batch ID", batch.id], 2));
  rows.push(row(["Manufacturer notes", batch.manufacturerNote || ""], 3));
  rows.push(row(["Created date", batch.createdAt], 4));
  rows.push(row([], 5));
  rows.push(
    row(
      [
        "Batch name",
        "Batch ID",
        "Row number",
        "Token",
        "Short URL",
        "QR code image URL",
        "Product type",
        "Status",
        "Assigned company name",
        "Final redirect URL",
        "Manufacturer notes",
        "Created date"
      ],
      6
    )
  );

  batch.links.forEach((link, index) => {
    rows.push(
      row(
        [
          batch.name,
          batch.id,
          index + 1,
          link.token,
          link.shortUrl,
          `${baseUrl}/api/public/qr/${link.token}`,
          productTypeLabels[link.productType],
          redirectStatusLabels[link.status],
          link.companyName || "",
          link.destinationUrl || "",
          batch.manufacturerNote || "",
          link.createdAt
        ],
        index + 7
      )
    );
  });

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
  );

  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  );

  zip.file(
    "xl/workbook.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="QR kodai" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
  );

  zip.file(
    "xl/_rels/workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
  );

  zip.file(
    "xl/worksheets/sheet1.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${rows.join("")}</sheetData>
</worksheet>`
  );

  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}
