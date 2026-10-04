import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const root = document.getElementById("root")!;

// Pages are prerendered at build time (scripts/prerender.mjs). Hydrate those so
// the server HTML stays on screen while the page's code loads; fall back to a
// plain render for anything served from the bare index.html shell.
if (root.dataset.prerendered) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
