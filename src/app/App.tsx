import React from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "./components/Layout/AdminLayout";

import { DashboardWorkspace } from "./components/Layout/dashboard/DashboardWorkspace";
import { AiAnalysisWorkspace } from "./components/evaluation/AiAnalysisWorkspace";
import { DecisionHistoryWorkspace } from "./components/evaluation/DecisionHistoryWorkspace";
import { DecisionDetailWorkspace } from "./components/evaluation/DecisionDetailWorkspace";
import { ApplicationResultWorkspace } from "./components/evaluation/ApplicationResultWorkspace";
import { ApplicationResultDetailWorkspace } from "./components/evaluation/ApplicationResultDetailWorkspace";
// import { OrganizationListWorkspace } from "./components/organization/OrganizationListWorkspace";
// import { OrganizationDetailWorkspace } from "./components/organization/OrganizationDetailWorkspace";
// import { OrganizationEditWorkspace } from "./components/organization/OrganizationEditWorkspace";
import { OrganizationProfileWorkspace } from "./components/organization/OrganizationProfileWorkspace";
import { OrganizationArticleWorkspace } from "./components/organization/OrganizationArticleWorkspace";
import { OrganizationProjectWorkspace } from "./components/organization/OrganizationProjectWorkspace";
import { GrantListWorkspace } from "./components/grants/GrantListWorkspace";
import { GrantDetailWorkspace } from "./components/grants/GrantDetailWorkspace";

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

          {/* 組織知管理 */}
          <Route
            path="/admin/organization/profile"
            element={<OrganizationProfileWorkspace />}
          />

          <Route
            path="/admin/organization/articles"
            element={<OrganizationArticleWorkspace />}
          />

          <Route
            path="/admin/organization/projects"
            element={<OrganizationProjectWorkspace />}
          />

          {/* 助成金管理 */}
          <Route
            path="/admin/grants"
            element={<GrantListWorkspace />}
          />

          <Route
            path="/admin/grants/:grantId"
            element={<GrantDetailWorkspace />}
          />

          {/* AI判定 */}
          <Route
            path="/admin/evaluations/workspace"
            element={<AiAnalysisWorkspace />}
          />

          {/* 応募意思決定管理 */}
          <Route
            path="/admin/evaluations/histories"
            element={<DecisionHistoryWorkspace />}
          />

          <Route
            path="/admin/evaluations/histories/:id"
            element={<DecisionDetailWorkspace />}
          />

          {/* 応募結果管理 */}
          <Route
            path="/admin/evaluations/results"
            element={<ApplicationResultWorkspace />}
          />

          <Route
            path="/admin/evaluations/results/:id"
            element={<ApplicationResultDetailWorkspace />}
          />

          {/* 現在未使用：複数NPO法人管理系ルート */}
          {/* NPO法人一覧 */}
          {/* <Route
      path="/admin/organizations"
      element={<OrganizationListWorkspace />}
    /> */}

          {/* NPO法人詳細 */}
          {/* <Route
      path="/admin/organizations/:id"
      element={<OrganizationDetailWorkspace />}
    /> */}

          {/* NPO法人編集 */}
          {/* <Route
      path="/admin/organizations/:id/edit"
      element={<OrganizationEditWorkspace />}
    /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}