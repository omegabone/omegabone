import { useEffect, useId, useRef } from "react";

/*
  Renders a live PayPal Hosted Button (the "Buy" button generated in the
  PayPal business dashboard — Hosted Buttons product). Unlike a Payment
  Link (paypal.com/ncp/...), a hosted button has no plain checkout URL —
  it only works by loading PayPal's SDK and rendering it into a container.

  Multiple instances on one page are supported: the SDK script loads once
  (guarded by its own id), and each instance renders into its own
  auto-generated container id.
*/

const PAYPAL_SDK_ID = "paypal-sdk-hosted-buttons";
const PAYPAL_SDK_SRC =
  "https://www.paypal.com/sdk/js?client-id=BAA8iaMr-UgAjpzr8yDYdE2DhUd9VVtYP4-SBSikL4pfq2LF_jgJaiQJUgxDl7vMCoitXd1TyJzpXFGQbg&components=hosted-buttons&enable-funding=venmo&currency=USD";

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (opts: { hostedButtonId: string }) => { render: (selector: string) => void };
    };
  }
}

function loadPayPalSdk(): Promise<void> {
  if (window.paypal) return Promise.resolve();
  const existing = document.getElementById(PAYPAL_SDK_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve(), { once: true }));
  }
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = PAYPAL_SDK_ID;
    script.src = PAYPAL_SDK_SRC;
    script.addEventListener("load", () => resolve(), { once: true });
    document.body.appendChild(script);
  });
}

export function PayPalBookButton({ hostedButtonId = "TC8PM4Y4NQJ36" }: { hostedButtonId?: string }) {
  const containerId = `paypal-container-${useId().replace(/:/g, "")}`;
  const rendered = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadPayPalSdk().then(() => {
      if (cancelled || rendered.current || !window.paypal) return;
      rendered.current = true;
      window.paypal.HostedButtons({ hostedButtonId }).render(`#${containerId}`);
    });
    return () => {
      cancelled = true;
    };
  }, [containerId, hostedButtonId]);

  return <div id={containerId} />;
}
