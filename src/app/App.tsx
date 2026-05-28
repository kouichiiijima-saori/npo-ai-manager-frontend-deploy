import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AdminLayout } from "./components/Layout/AdminLayout";

import { AiAnalysisWorkspace } from "./components/evaluation/AiAnalysisWorkspace";

import { DecisionHistoryWorkspace } from "./components/evaluation/DecisionHistoryWorkspace";

import { DecisionDetailWorkspace } from "./components/evaluation/DecisionDetailWorkspace";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 初期遷移 */}
        <Route
          path="/"
          element={
            <Navigate
              to="/admin/evaluations/workspace"
              replace
            />
          }
        />

        {/* 管理画面共通レイアウト */}
        <Route element={<AdminLayout />}>

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