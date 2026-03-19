import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Outlet />
    </div>
  );
}