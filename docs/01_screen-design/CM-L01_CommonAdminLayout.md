# CM-L01 管理画面共通レイアウト

## 1. 画面概要

### 画面ID

```text
CM-L01
```

### 画面名

```text
管理画面共通レイアウト
```

### ScreenDesignファイル

```text
CM-L01_CommonAdminLayout.md
```

### レイアウト説明TSX

```text
src/app/screen-layouts/CommonAdminLayout.tsx
```

### 画面実装ファイル

```text
src/app/layouts/CommonAdminLayout.tsx
```

### コンポーネント名

```text
CommonAdminLayout
```

---

## 利用対象画面

CM-L01は、PG-A02〜PG-A11の管理画面共通土台として利用する。

PG-A01 ログイン画面は単独ページであり、CM-L01の対象外とする。

| 図面番号 | 画面名               | Layout設計書                            | レイアウト説明TSX                 | 画面実装ファイル                                 | URL                          |
| -------- | -------------------- | --------------------------------------- | --------------------------------- | ------------------------------------------------ | ---------------------------- |
| PG-A02   | 管理者ダッシュボード | PG-A02_DashboardPageLayout.md           | DashboardPageLayout.tsx           | src/app/organization/DashboardPage.tsx           | /dashboard                   |
| PG-A03   | 団体基本情報管理     | PG-A03_OrganizationProfilePageLayout.md | OrganizationProfilePageLayout.tsx | src/app/organization/OrganizationProfilePage.tsx | /organization-profile        |
| PG-A04   | 定款条文管理         | PG-A04_ArticlePageLayout.md             | ArticlePageLayout.tsx             | src/app/organization/ArticlePage.tsx             | /articles                    |
| PG-A05   | 活動実績管理         | PG-A05_ProjectPageLayout.md             | ProjectPageLayout.tsx             | src/app/organization/ProjectPage.tsx             | /projects                    |
| PG-A06   | 助成金一覧           | PG-A06_GrantListPageLayout.md           | GrantListPageLayout.tsx           | src/app/grants/GrantListPage.tsx                 | /grants                      |
| PG-A07   | AI判定ワークスペース | PG-A07_AiWorkSpacePageLayout.md         | AiWorkSpacePageLayout.tsx         | src/app/grants/AiWorkSpacePage.tsx               | /ai-workspace/:grantMasterId |
| PG-A08   | AI判定履歴           | PG-A08_EvaluationHistoryPageLayout.md   | EvaluationHistoryPageLayout.tsx   | src/app/evaluation/EvaluationHistoryPage.tsx     | /evaluation-histories        |
| PG-A09   | 助成金案件一覧       | PG-A09_GrantCaseListPageLayout.md       | GrantCaseListPageLayout.tsx       | src/app/evaluation/GrantCaseListPage.tsx         | /grant-cases                 |
| PG-A10   | 助成金案件詳細       | PG-A10_GrantCaseDetailPageLayout.md     | GrantCaseDetailPageLayout.tsx     | src/app/evaluation/GrantCaseDetailPage.tsx       | /grant-cases/:id             |
| PG-A11   | 設定                 | PG-A11_SettingPageLayout.md             | SettingPageLayout.tsx             | src/app/settings/SettingPage.tsx                 | /settings                    |

---

## 2. 目的

管理画面全体で共通するレイアウトを定義する。

各画面で共通する以下の要素を一元管理する。

```text
左サイドメニュー
中央メインコンテンツ
右サイド情報パネル
右サイドパネル開閉
共通ナビゲーション
画面操作ロック
PDFプレビュー領域
ログアウト処理
```

---

## 3. レイアウト構成

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├───────────────┬──────────────────────────────┬───────────────┤
│ Sidebar       │ Outlet                       │ RightInfoPanel │
│               │                              │               │
│ 左メニュー    │ 各画面コンテンツを注入        │ 補助情報        │
│               │                              │               │
└───────────────┴──────────────────────────────┴───────────────┘
```

| 領域           | 内容                         |
| -------------- | ---------------------------- |
| Header         | 共通ヘッダー                 |
| Sidebar        | 左サイドメニュー             |
| Outlet         | 各画面固有コンテンツ注入領域 |
| RightInfoPanel | 右サイド情報パネル           |

---

## 4. 左サイドメニュー

### 表示項目

```text
ダッシュボード

団体基本情報

定款条文

活動実績

助成金一覧

AI判定ワークスペース

AI判定履歴

助成金案件一覧

━━━━━━━━━━━━━━

設定

ログアウト
```

---

### 遷移先

| メニュー名           | 遷移先 | URL                          |
| -------------------- | ------ | ---------------------------- |
| ダッシュボード       | PG-A02 | /dashboard                   |
| 団体基本情報         | PG-A03 | /organization-profile        |
| 定款条文             | PG-A04 | /articles                    |
| 活動実績             | PG-A05 | /projects                    |
| 助成金一覧           | PG-A06 | /grants                      |
| AI判定ワークスペース | PG-A07 | /ai-workspace/:grantMasterId |
| AI判定履歴           | PG-A08 | /evaluation-histories        |
| 助成金案件一覧       | PG-A09 | /grant-cases                 |
| 設定                 | PG-A11 | /settings                    |
| ログアウト           | PG-A01 | /login                       |

---

### メニュー生成方針

メニュー名称・URL・表示位置は共通メニュー定義から生成する。

共通メニュー定義は以下と常に一致させる。

```text
画面一覧
DF-01 画面遷移図
routes.ts
CommonAdminLayout
```

---

### ログアウト

ログアウト時はアプリケーション状態を初期化し、PG-A01 ログインへ遷移する。

```text
ログアウト
↓
sessionStorage.clear()
↓
PG-A01 ログイン
```

---

## 5. 中央メインコンテンツ

中央メインコンテンツは、各画面固有のコンテンツを表示するOutlet注入領域である。

CM-L01は画面固有の業務ロジックを直接持たない。

| 図面番号 | 画面実装ファイル        | 構造的役割                                                                 |
| -------- | ----------------------- | -------------------------------------------------------------------------- |
| PG-A02   | DashboardPage           | 団体情報・定款・活動実績・助成金案件・AI判定状況の概要を表示する           |
| PG-A03   | OrganizationProfilePage | 団体基本情報を管理し、AI判定で参照される組織知マスタを整備する             |
| PG-A04   | ArticlePage             | 定款条文を管理し、AI判定根拠として利用可能な形で保持する                   |
| PG-A05   | ProjectPage             | 活動実績を管理し、活動内容と成果情報をAI判定根拠として保持する             |
| PG-A06   | GrantListPage           | 助成金マスター情報を参照し、候補助成金の一覧を表示する                     |
| PG-A07   | AiWorkSpacePage         | 団体情報・定款・活動実績を根拠としてAI判定を実行し、案件化の入口を提供する |
| PG-A08   | EvaluationHistoryPage   | AI判定履歴を不変監査履歴として表示する                                     |
| PG-A09   | GrantCaseListPage       | 助成金案件の現在状態を一覧管理する                                         |
| PG-A10   | GrantCaseDetailPage     | 助成金案件の現在状態、AI判定結果、検討結果、次アクションを詳細管理する     |
| PG-A11   | SettingPage             | MVPではシステム情報のみを表示する                                          |

---

## 6. レイアウト説明TSXとの関係

`src/app/screen-layouts` 配下のTSXは、設計内容を視覚化するためのレイアウト説明用TSXである。

本番フロントエンドではない。

```text
レイアウト説明TSX
↓
設計内容を視覚的に確認するための説明用ファイル

画面実装ファイル
↓
実際に動作する本番画面
```

---

## 7. 右サイド情報パネル

### 役割

画面ごとの補足情報、注意文、関連情報を表示する。

### 初期状態

```text
PG-A02：非表示

PG-A03：表示
PG-A04：表示
PG-A05：表示
PG-A06：表示
PG-A07：表示
PG-A08：表示
PG-A09：表示
PG-A10：表示
PG-A11：表示
```

### 開閉

ユーザーは画面右上の切替ボタンで開閉できる。

---

## 8. PDFプレビュー領域

PDFプレビューは共通コンポーネントとして扱う。

### 対応コンポーネント

```text
PdfPreviewPanel
```

### 表示形式

```text
iframe
```

### 参照URL

```text
/storage/{fileName}
```

### 主な利用画面

```text
PG-A10 助成金案件詳細
```

将来的には以下でも利用可能とする。

```text
PG-A03 団体基本情報管理
PG-A04 定款条文管理
PG-A05 活動実績管理
PG-A06 助成金一覧
```

### ファイル未配置時

```text
PDFが表示されない場合は、対象ファイルが所定の storage フォルダに配置されているか確認してください。
```

---

## 9. 戻る導線ルール

### マスタ系画面

対象画面

```text
PG-A03 団体基本情報管理
PG-A04 定款条文管理
PG-A05 活動実績管理
```

戻るボタンまたはキャンセルボタン押下時は、ブラウザバックを使用しない。

戻り先は必ずPG-A02 管理者ダッシュボードとする。

```text
PG-A03 / PG-A04 / PG-A05
↓
PG-A02 管理者ダッシュボード
```

---

### 助成金案件詳細

PG-A10から戻る場合は、PG-A09 助成金案件一覧へ戻る。

```text
PG-A10 助成金案件詳細
↓
PG-A09 助成金案件一覧
```

---

## 10. 検索条件保持ルール

PG-A09 助成金案件一覧で検索・絞り込みを行った状態から、PG-A10 助成金案件詳細へ遷移した場合、PG-A09へ戻った際に検索条件を復元する。

保存対象例

```text
reviewStatus
aiResult
recommendationRank
deadlineStatus
keyword
```

---

## 11. 操作ロック

### 画面内ローカルロック

保存・更新・登録・削除などの処理中は、画面ごとに画面内ローカルロックを利用できる。

目的

```text
二重押下防止
二重登録防止
二重更新防止
二重削除防止
```

対象例

```text
保存
更新
登録
削除
キャンセル
戻る
```

---

### 全画面インフラロック

PG-A07でAI判定を実行中は、全画面インフラロックを利用する。

目的

```text
画面遷移防止
サイドメニュー遷移防止
ログアウト防止
処理中データ破損防止
```

ロック対象

```text
AI判定実行ボタン
戻るボタン
左サイドメニュー
設定
ログアウト
画面内リンク
```

表示

```text
画面全体にローディングオーバーレイを表示する。
```

---

## 12. AI判定完了後の遷移

AI判定成功時は、返却された grantCaseId を利用して PG-A10へ遷移する。

```text
PG-A07
↓
AI判定実行
↓
grantCaseId取得
↓
PG-A10
```

PG-A09は経由しない。

---

## 13. 右サイドパネル表示内容例

```text
PG-A02：AI判定に必要な登録状況
PG-A03：団体情報の登録状況・AI判定利用項目
PG-A04：定款条文数・AI判定利用内容
PG-A05：活動実績件数・AI判定利用内容
PG-A06：助成金検索の説明
PG-A07：AI判定の注意・根拠確認ガイド
PG-A08：判定履歴・監査履歴の説明
PG-A09：絞り込み条件・検討状況の説明
PG-A10：案件ステージ・検討状況・次アクションガイド
PG-A11：システム情報・ロードマップ・組織知ベース準備状況
```

---

## 14. MVP対象外

本レイアウトでは以下を実装しない。

```text
権限別メニュー制御
複数団体切替
通知ベル
カレンダー連携
メール連携
RAG検索パネル
ローカルLLM設定
認証設定変更
ユーザー管理
```

---

## 15. 実装メモ

本章は画面実装担当者向けの技術メモとする。

```text
routes.loginPage
routes.dashboardPage
routes.organizationProfilePage
routes.articlePage
routes.projectPage
routes.grantListPage
routes.aiWorkSpacePage
routes.evaluationHistoryPage
routes.grantCaseListPage
routes.grantCaseDetailPage
routes.settingPage
```

ログアウト処理では以下を利用する。

```text
sessionStorage.clear()
```

AI判定中は全画面インフラロックを起動する。

検索条件保持には sessionStorage の利用を想定する。

---

## 16. 備考

CM-L01はPG-A02〜PG-A11の共通土台である。

PG-A01は単独ログイン画面であり、CM-L01を利用しない。

各画面はCM-L01を利用し、個別画面内で左サイドメニューや右サイド情報パネルを重複実装しない。

中央メインコンテンツはOutlet注入領域とし、各画面実装ファイルを表示する。

画面遷移・戻る導線・操作ロック・PDFプレビューは、共通レイアウト側の設計方針に従う。

共通メニュー定義、routes定義、画面一覧、画面実装ファイルは互いに対応関係を崩さない。
