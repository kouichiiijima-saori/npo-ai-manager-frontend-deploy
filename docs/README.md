# Design Portal

NPO運営AIマネージャーの設計ドキュメントです。

本プロジェクトでは、要件定義、画面設計、データベース設計、API設計を行った上で実装を進めています。

---

# Requirements

- [Requirements Definition](00_requirements/requirements-definition.md)

---

# Screen Design

## Common Layout

- [CM-L01 Common Admin Layout](01_screen-design/CM-L01_CommonAdminLayout.md)

## Screen Flow

- [DF-01 Screen Flow Diagram](01_screen-design/DF-01_ScreenFlowDiagram.md)
- [DF-02 Grant Workflow Diagram](01_screen-design/DF-02_GrantWorkflowDiagram.md)

## Pages

- [PG-A01 Login Page](01_screen-design/PG-A01_LoginPage.md)
- [PG-A02 Dashboard Page](01_screen-design/PG-A02_DashboardPage.md)
- [PG-A03 Organization Profile Page](01_screen-design/PG-A03_OrganizationProfilePage.md)
- [PG-A04 Article Page](01_screen-design/PG-A04_ArticlePage.md)
- [PG-A05 Project Page](01_screen-design/PG-A05_ProjectPage.md)
- [PG-A06 Grant List Page](01_screen-design/PG-A06_GrantListPage.md)
- [PG-A06B Grant Form Page](01_screen-design/PG-A06B_GrantFormPage.md)
- [PG-A07 AI Workspace Page](01_screen-design/PG-A07_AiWorkSpacePage.md)
- [PG-A08 Evaluation History Page](01_screen-design/PG-A08_EvaluationHistoryPage.md)
- [PG-A08B Evaluation History Detail Page](01_screen-design/PG-A08B_EvaluationHistoryDetailPage.md)
- [PG-A09 Grant Case List Page](01_screen-design/PG-A09_GrantCaseListPage.md)
- [PG-A10 Grant Case Detail Page](01_screen-design/PG-A10_GrantCaseDetailPage.md)
- [PG-A11 Setting Page](01_screen-design/PG-A11_SettingPage.md)

---

# Architecture

- [System Overview](02_architecture/system-overview.md)
- [Design Principles](02_architecture/design-principles.md)
- [Database Design](02_architecture/database-design.md)
- [API Design](02_architecture/api-design.md)
- [Backend Structure](02_architecture/backend-structure.md)
- [Frontend Structure](02_architecture/frontend-structure.md)

---

# Future Roadmap

- [Roadmap Overview](03_future-roadmap/roadmap-overview.md)
- [Grant Lifecycle Management](03_future-roadmap/grant-lifecycle-management.md)
- [Organization Knowledge Base](03_future-roadmap/organization-knowledge-base.md)
- [Rejection Analysis](03_future-roadmap/rejection-analysis.md)
- [RAG and Local LLM](03_future-roadmap/rag-and-local-llm.md)

---

# Technology Stack

## Frontend

- React
- TypeScript
- React Router
- Material UI
- Tailwind CSS

## Backend

- Java
- Spring Boot
- Spring Security
- MyBatis

## Database

- MySQL

## Infrastructure

- Docker

## Cloud

- Render
- Railway

## AI

- Gemini API
