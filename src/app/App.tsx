import React from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "./components/Layout/AdminLayout";

import { DashboardWorkspace } from "./components/Layout/dashboard/DashboardWorkspace";
import { AiAnalysisWorkspace } from "./components/evaluation/AiAnalysisWorkspace";
import { DecisionHistoryWorkspace } from "./components/evaluation/DecisionHistoryWorkspace";
import { DecisionDetailWorkspace } from "./components/evaluation/DecisionDetailWorkspace";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 初期遷移 */}
        <Route path="/" element={<Navigate to="/admin/home" replace />} />

        {/* 管理画面共通レイアウト */}
        <Route element={<AdminLayout />}>
          {/* ダッシュボード */}
          <Route path="/admin/home" element={<DashboardWorkspace />} />

          {/* AI判定ワークスペース */}
          <Route
            path="/admin/evaluations/workspace"
            element={<AiAnalysisWorkspace />}
          />

          {/* 応募意思決定履歴 */}
          <Route
            path="/admin/evaluations/histories"
            element={<DecisionHistoryWorkspace />}
          />

          {/* 履歴詳細 */}
          <Route
            path="/admin/evaluations/histories/:id"
            element={<DecisionDetailWorkspace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}