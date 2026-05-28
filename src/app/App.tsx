import React from "react";
import { Sidebar } from "./components/Sidebar";
import { AiAnalysisWorkspace } from "./components/AiAnalysisWorkspace";
import { HistoryPanel } from "./components/HistoryPanel";

export default function App() {
  return (
    <div className="flex h-screen w-full bg-neutral-900 text-neutral-100 font-sans selection:bg-neutral-700">
      <Sidebar />
      <AiAnalysisWorkspace />
      <HistoryPanel />
    </div>
  );
}