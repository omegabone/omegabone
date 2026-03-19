import { RouterProvider } from "react-router";
import { router } from "./routes";
import { BlogspotProvider } from "./context/BlogspotContext";
import { Component, ReactNode, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Something went wrong. <a href="/" style={{ color: "#1a56db" }}>Go home</a></p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <ErrorBoundary>
      <BlogspotProvider>
        <RouterProvider router={router} />
        {hydrated && <Analytics />}
        {hydrated && <SpeedInsights />}
      </BlogspotProvider>
    </ErrorBoundary>
  );
}