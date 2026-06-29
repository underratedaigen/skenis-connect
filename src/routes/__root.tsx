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
      { property: "og:title", content: "Skenis.lt" },
      {
        property: "og:description",
        content:
          "Programuojamos akrilinės QR kortelės ir stendai Google atsiliepimams."
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "lt_LT" }
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
