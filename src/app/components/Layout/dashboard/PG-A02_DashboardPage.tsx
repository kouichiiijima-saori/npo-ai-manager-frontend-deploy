import React from "react";
import {
  AlertTriangle,
  Bot,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  Gauge,
  Search,
} from "lucide-react";

import { Badge } from "../../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

const summaryCards = [
  {
    title: "団体情報",
    value: "登録済み",
    description: "基本情報・定款・活動実績をAI判定の根拠として利用します。",
    icon: Building2,
    badge: "根拠データ",
  },
  {
    title: "助成金情報",
    value: "12件",
    description: "募集中・確認中の助成金情報を管理しています。",
    icon: ClipboardList,
    badge: "募集中",
  },
  {
    title: "AI判定",
    value: "5件",
    description: "直近で実行されたAI判定と確認事項を確認できます。",
    icon: Bot,
    badge: "判定履歴",
  },
  {
    title: "助成金案件",
    value: "4件",
    description: "検討中、申請候補、見送りなどの案件を管理します。",
    icon: FolderKanban,
    badge: "案件管理",
  },
];

const deadlineItems = [
  {
    title: "地域共生社会づくり助成金 2026",
    deadline: "2026-06-30",
    status: "締切間近",
    tone: "danger",
  },
  {
    title: "子どもの居場所支援助成",
    deadline: "2026-07-15",
    status: "要確認",
    tone: "warning",
  },
  {
    title: "農福連携モデル事業補助金",
    deadline: "2026-08-01",
    status: "申請候補",
    tone: "success",
  },
];

const recentAiItems = [
  {
    grant: "地域共生社会づくり助成金 2026",
    result: "適合",
    score: "A",
    description:
      "団体目的、定款条文、活動実績が助成金の対象分野と概ね一致しています。",
  },
  {
    grant: "子どもの居場所支援助成",
    result: "要確認",
    score: "B",
    description:
      "定款上の活動分野と対象事業の一致確認が必要です。",
  },
];

const nextActions = [
  "締切が近い助成金の対象経費を確認する。",
  "AI判定で要確認となった案件の不足情報を確認する。",
  "活動実績が最新年度まで登録されているか確認する。",
];

export function PGA02DashboardPage() {
  return (
    <div className="min-h-full bg-neutral-950 px-8 py-8 text-neutral-100">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Gauge className="h-4 w-4" />
          PG-A02 管理者ダッシュボード
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          NPO運営AIマネージャー
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
          団体情報、定款、活動実績、助成金、AI判定、助成金案件の状況を確認し、
          次に対応すべき作業へ進むためのダッシュボードです。
        </p>
      </header>

      <main className="space-y-8">
        {/* サマリー */}
        <section className="grid gap-4 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="border-neutral-800 bg-neutral-900/70 text-neutral-100"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-sm text-neutral-400">
                      {item.title}
                    </CardTitle>
                    <div className="mt-2 text-2xl font-bold">
                      {item.value}
                    </div>
                  </div>

                  <div className="rounded-lg bg-neutral-800 p-2">
                    <Icon className="h-5 w-5 text-neutral-300" />
                  </div>
                </CardHeader>

                <CardContent>
                  <Badge variant="secondary" className="mb-3">
                    {item.badge}
                  </Badge>
                  <p className="text-sm leading-6 text-neutral-400">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* 左側メイン */}
          <div className="space-y-6">
            {/* 今週の締切 */}
            <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-amber-400" />
                  <CardTitle>今週・近日中の締切</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {deadlineItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-neutral-500">
                        申請締切：{item.deadline}
                      </div>
                    </div>

                    <Badge
                      variant={
                        item.tone === "danger"
                          ? "danger"
                          : item.tone === "warning"
                            ? "warning"
                            : "success"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 最近のAI判定 */}
            <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-400" />
                  <CardTitle>最近のAI判定</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {recentAiItems.map((item) => (
                  <div
                    key={item.grant}
                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{item.grant}</div>
                        <p className="mt-2 text-sm leading-6 text-neutral-400">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant={
                            item.result === "適合" ? "success" : "warning"
                          }
                        >
                          {item.result}
                        </Badge>
                        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300">
                          推奨度 {item.score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 画面への導線 */}
            <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-neutral-400" />
                  <CardTitle>次に確認する画面</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <a
                    href="/admin/organization/profile"
                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition hover:border-neutral-600"
                  >
                    <Building2 className="h-5 w-5 text-neutral-400" />
                    <div className="mt-3 font-semibold">団体基本情報</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      AI判定に使う団体情報を確認する。
                    </p>
                  </a>

                  <a
                    href="/admin/grants"
                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition hover:border-neutral-600"
                  >
                    <ClipboardList className="h-5 w-5 text-neutral-400" />
                    <div className="mt-3 font-semibold">助成金一覧</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      募集中の助成金を確認する。
                    </p>
                  </a>

                  <a
                    href="/admin/grant-cases"
                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition hover:border-neutral-600"
                  >
                    <FolderKanban className="h-5 w-5 text-neutral-400" />
                    <div className="mt-3 font-semibold">助成金案件一覧</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      検討中の案件と次アクションを確認する。
                    </p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側サブエリア */}
          <div className="space-y-6">
            <Card className="border-amber-900/60 bg-amber-950/30 text-neutral-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <CardTitle>要確認</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-amber-100/90">
                <div className="rounded-lg bg-neutral-950/70 px-3 py-3">
                  対象経費が未確認の助成金があります。
                </div>
                <div className="rounded-lg bg-neutral-950/70 px-3 py-3">
                  最新年度の活動実績が未登録です。
                </div>
                <div className="rounded-lg bg-neutral-950/70 px-3 py-3">
                  AI判定で要確認の案件があります。
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <CardTitle>次アクション</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-sm leading-6 text-neutral-400">
                  {nextActions.map((action) => (
                    <li key={action} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-neutral-400" />
                  <CardTitle>登録状況</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between rounded-lg bg-neutral-950 px-3 py-2">
                  <span className="text-neutral-400">団体基本情報</span>
                  <span className="font-semibold text-emerald-400">登録済み</span>
                </div>
                <div className="flex justify-between rounded-lg bg-neutral-950 px-3 py-2">
                  <span className="text-neutral-400">定款条文</span>
                  <span className="font-semibold text-emerald-400">登録済み</span>
                </div>
                <div className="flex justify-between rounded-lg bg-neutral-950 px-3 py-2">
                  <span className="text-neutral-400">活動実績</span>
                  <span className="font-semibold text-amber-400">要更新</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}