import { createContext, useContext, useEffect } from "react";

const siteUrl = "https://skenis.lt";
const organizationId = `${siteUrl}/#organization`;
const socialImage = `${siteUrl}/skenis-logo.png`;

export type SeoProps = {
  title: string;
  description: string;
  path: string;
  service?: { name: string; description: string };
  noIndex?: boolean;
};

/** Collect the same metadata used by the browser during static rendering. */
export type SeoCollector = { current: SeoProps | null };
const SeoContext = createContext<SeoCollector | null>(null);
export const SeoProvider = SeoContext.Provider;

function canonicalUrl(path: string) {
  const pathname = path.split(/[?#]/, 1)[0];
  return `${siteUrl}${pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}`}`;
}

function structuredData({
  title,
  description,
  path,
  service,
  noIndex,
}: SeoProps) {
  if (noIndex) return null;

  const url = canonicalUrl(path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Skenis",
      url: `${siteUrl}/`,
      logo: socialImage,
      email: "skenis.info@gmail.com",
      telephone: ["+37062357946", "+37062375231"],
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "lt-LT",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": service ? `${url}#service` : organizationId },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Skenis",
      inLanguage: "lt-LT",
      publisher: { "@id": organizationId },
    },
  ];

  if (service) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.name,
      description: service.description,
      url,
      provider: { "@id": organizationId },
    });
  }

  if (url !== `${siteUrl}/`) {
    const crumbs = [{ name: "Pradžia", item: `${siteUrl}/` }];
    if (path.startsWith("/paslaugos/")) {
      crumbs.push({ name: "Paslaugos", item: `${siteUrl}/paslaugos` });
    }
    crumbs.push({
      name:
        service?.name ?? title.replace(/\s*[|–—]\s*Skenis(?:\.lt)?.*$/i, ""),
      item: url,
    });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        ...crumb,
      })),
    });
    graph[1].breadcrumb = { "@id": `${url}#breadcrumbs` };
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function metadata(props: SeoProps) {
  return [
    ["name", "description", props.description],
    [
      "name",
      "robots",
      props.noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large",
    ],
    ["property", "og:title", props.title],
    ["property", "og:description", props.description],
    ["property", "og:url", canonicalUrl(props.path)],
    ["property", "og:type", "website"],
    ["property", "og:site_name", "Skenis"],
    ["property", "og:locale", "lt_LT"],
    ["property", "og:image", socialImage],
    ["property", "og:image:alt", "Skenis – skaitmeniniai sprendimai verslui"],
    ["name", "twitter:card", "summary"],
    ["name", "twitter:title", props.title],
    ["name", "twitter:description", props.description],
    ["name", "twitter:image", socialImage],
    ["name", "twitter:image:alt", "Skenis – skaitmeniniai sprendimai verslui"],
  ];
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

/** Kept independent of the DOM so production HTML has complete route metadata. */
export function renderSeoHead(props: SeoProps) {
  const schema = structuredData(props);
  return [
    `<title>${escapeHtml(props.title)}</title>`,
    ...metadata(props).map(
      ([attribute, key, value]) =>
        `<meta ${attribute}="${key}" content="${escapeHtml(value)}" data-skenis-seo="true" />`,
    ),
    `<link rel="canonical" href="${escapeHtml(canonicalUrl(props.path))}" data-skenis-seo="true" />`,
    schema
      ? `<script id="skenis-structured-data" type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");
}

export function Seo(props: SeoProps) {
  const collector = useContext(SeoContext);
  if (collector) collector.current = props;

  const { title, description, path, service, noIndex } = props;
  const serviceName = service?.name;
  const serviceDescription = service?.description;

  useEffect(() => {
    const currentProps: SeoProps = {
      title,
      description,
      path,
      noIndex,
      service: serviceName
        ? { name: serviceName, description: serviceDescription ?? "" }
        : undefined,
    };
    const previousTitle = document.title;
    const cleanups: (() => void)[] = [];
    document.title = title;

    const setElement = (
      selector: string,
      tagName: "meta" | "link" | "script",
      attributes: Record<string, string>,
      text?: string,
    ) => {
      const existing = document.head.querySelector<HTMLElement>(selector);
      const element = existing ?? document.createElement(tagName);
      const previousAttributes = new Map(
        Object.keys(attributes).map((name) => [
          name,
          element.getAttribute(name),
        ]),
      );
      const previousText = element.textContent;
      for (const [name, value] of Object.entries(attributes))
        element.setAttribute(name, value);
      if (text !== undefined) element.textContent = text;
      if (!existing) document.head.append(element);

      cleanups.push(() => {
        if (!existing) {
          element.remove();
          return;
        }
        for (const [name, value] of previousAttributes) {
          if (value === null) element.removeAttribute(name);
          else element.setAttribute(name, value);
        }
        if (text !== undefined) element.textContent = previousText;
      });
    };

    for (const [attribute, key, content] of metadata(currentProps)) {
      setElement(`meta[${attribute}="${key}"]`, "meta", {
        [attribute]: key,
        content,
        "data-skenis-seo": "true",
      });
    }
    setElement('link[rel="canonical"]', "link", {
      rel: "canonical",
      href: canonicalUrl(path),
      "data-skenis-seo": "true",
    });

    const schema = structuredData(currentProps);
    const previousSchema = document.getElementById("skenis-structured-data");
    if (schema) {
      setElement(
        "#skenis-structured-data",
        "script",
        {
          id: "skenis-structured-data",
          type: "application/ld+json",
        },
        JSON.stringify(schema).replace(/</g, "\\u003c"),
      );
    } else if (previousSchema) {
      previousSchema.remove();
      cleanups.push(() => document.head.append(previousSchema));
    }

    return () => {
      document.title = previousTitle;
      for (const cleanup of cleanups.reverse()) cleanup();
    };
  }, [title, description, path, noIndex, serviceName, serviceDescription]);

  return null;
}
