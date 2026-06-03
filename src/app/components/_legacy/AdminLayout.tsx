import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { RightInformationPanel } from "./RightInformationPanel";

export function AdminLayout() {
  return (
    <div className="grid h-screen grid-cols-[240px_1fr_300px] bg-slate-100 text-slate-900">
      <Sidebar />

      <main className="min-h-0 overflow-y-auto">
        <Outlet />
      </main>

      <RightInformationPanel />
    </div>
  );
}