import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import { applyPageMeta } from "./seo";
import { AppShell } from "./AppShell";

const router = createBrowserRouter(routes);

// Keep title/description/canonical in step with client-side navigation.
// The first page's tags are already in the prerendered HTML.
let lastPath = router.state.location.pathname;
router.subscribe(({ location }) => {
  if (location.pathname === lastPath) return;
  lastPath = location.pathname;
  applyPageMeta(location.pathname);
});

export default function App() {
  return (
    <AppShell>
      <RouterProvider router={router} />
    </AppShell>
  );
}
