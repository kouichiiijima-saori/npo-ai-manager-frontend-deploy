import React from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "./components/Layout/AdminLayout";

import { PGA02DashboardPage } from "./components/Layout/dashboard/PG-A02_DashboardPage";
import { PGA03OrganizationProfilePage } from "./components/organization/PG-A03_OrganizationProfilePage";
import { PGA04ArticlePage } from "./components/organization/PG-A04_ArticlePage";
import { PGA05ProjectPage } from "./components/organization/PG-A05_ProjectPage";
import { PGA06GrantListPage } from "./components/grants/PG-A06_GrantListPage";
import { PGA07AiWorkspacePage } from "./components/evaluation/PG-A07_AiWorkspacePage";
import { PGA08EvaluationHistoryPage } from "./components/evaluation/PG-A08_EvaluationHistoryPage";
import { PGA09GrantCaseListPage } from "./components/evaluation/PG-A09_GrantCaseListPage";
import { PGA10GrantCaseDetailPage } from "./components/evaluation/PG-A10_GrantCaseDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 初期遷移 */}
        <Route path="/" element={<Navigate to="/admin/home" replace />} />

        {/* 管理画面共通レイアウト */}
        <Route element={<AdminLayout />}>
          {/* PG-A02 管理者ダッシュボード */}
          <Route path="/admin/home" element={<PGA02DashboardPage />} />

          {/* PG-A03 団体基本情報管理 */}
          <Route
            path="/admin/organization/profile"
            element={<PGA03OrganizationProfilePage />}
          />

          {/* PG-A04 定款条文管理 */}
          <Route
            path="/admin/organization/articles"
            element={<PGA04ArticlePage />}
          />

          {/* PG-A05 活動実績管理 */}
          <Route
            path="/admin/organization/projects"
            element={<PGA05ProjectPage />}
          />

          {/* PG-A06 助成金一覧 */}
          <Route path="/admin/grants" element={<PGA06GrantListPage />} />

          {/* PG-A07 AI判定ワークスペース */}
          <Route
            path="/admin/evaluations/workspace"
            element={<PGA07AiWorkspacePage />}
          />

          {/* PG-A08 AI判定履歴 */}
          <Route
            path="/admin/evaluations/histories"
            element={<PGA08EvaluationHistoryPage />}
          />

          {/* PG-A09 助成金案件一覧 */}
          <Route
            path="/admin/grant-cases"
            element={<PGA09GrantCaseListPage />}
          />

          {/* PG-A10 助成金案件詳細 */}
          <Route
            path="/admin/grant-cases/:caseId"
            element={<PGA10GrantCaseDetailPage />}
          />

          {/* 未定義の管理画面URL */}
          <Route
            path="/admin/*"
            element={<Navigate to="/admin/home" replace />}
          />
        </Route>

        {/* 未定義URL */}
        <Route path="*" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}