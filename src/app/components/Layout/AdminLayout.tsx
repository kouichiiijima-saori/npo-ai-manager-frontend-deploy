import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { HistoryPanel } from "./HistoryPanel";

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      <Sidebar />

      <main
        className="
          flex-1
          min-h-0
          overflow-y-auto
          hide-scrollbar
        "
      >
        <Outlet />
      </main>

      <HistoryPanel />
    </div>
  );
}