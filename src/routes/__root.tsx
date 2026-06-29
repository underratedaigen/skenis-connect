import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type React from "react";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Skenis.lt | Programuojami Google atsiliepimų QR stendai"
      },
      {
        name: "description",
        content:
          "Programuojamos akrilinės QR kortelės ir stendai, nukreipiantys klientus į jūsų Google atsiliepimų puslapį."
      },
      { property: "og:title", content: "Skenis.lt | Programuojami Google atsiliepimų QR stendai" },
      {
        property: "og:description",
        content:
          "Programuojamos akrilinės QR kortelės ir stendai, nukreipiantys klientus į jūsų Google atsiliepimų puslapį."
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "lt_LT" }
      { name: "twitter:title", content: "Skenis.lt | Programuojami Google atsiliepimų QR stendai" },
      { name: "twitter:description", content: "Programuojamos akrilinės QR kortelės ir stendai, nukreipiantys klientus į jūsų Google atsiliepimų puslapį." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7fc0bafc-562f-4a86-8e6b-da68d89f2d90/id-preview-3610db1d--57903c2a-92a6-42b3-8b1f-79e9e984dd85.lovable.app-1782758085767.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7fc0bafc-562f-4a86-8e6b-da68d89f2d90/id-preview-3610db1d--57903c2a-92a6-42b3-8b1f-79e9e984dd85.lovable.app-1782758085767.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootDocument,
  component: RootComponent
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
