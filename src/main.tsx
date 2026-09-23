import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./studio.css";
import "./studio-pages.css";
import "./studio-demos.css";
import "./studio-product.css";
import "./studio-responsive.css";
import "./studio-refinement.css";

const root = document.getElementById("root")!;
const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
if (
  root.hasChildNodes() &&
  root.dataset.prerenderPath === currentPath &&
  !window.location.search
) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
