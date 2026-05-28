import React from "react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import {
  Search,
  Filter,
  ChevronRight,
  History,
} from "lucide-react";

const getResultStatusBadge = (status: string) => {
  switch (status) {
    case "検討中":
      return <Badge variant="secondary">{status}</Badge>;
    case "応募済":
      return <Badge variant="outline">{status}</Badge>;
    case "結果待ち":
      return <Badge variant="warning">{status}</Badge>;
    case "採択":
      return <Badge variant="success">{status}</Badge>;
    case "不採択":
      return <Badge variant="danger">{status}</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const getDecisionBadge = (decision: string) => {
  switch (decision) {
    case "応募する":
      return (
        <span className="font-medium text-emerald-400">
          {decision}
        </span>
      );
    case "見送る":
      return (
        <span className="text-neutral-500">{decision}</span>
      );
    case "未決定":
      return <span className="text-amber-400">{decision}</span>;
    default:
      return (
        <span className="text-neutral-300">{decision}</span>
      );
  }
};

const mockData = [
  {
    id: "GR-2026-001",
    grantName: "令和8年度 環境保全活動支援助成金",
    decision: "応募する",
    aiScore: 85,
    resultStatus: "結果待ち",
    applicationDate: "2026-05-15",
    resultDate: "2026-07-20 (予定)",
  },
  {
    id: "GR-2026-002",
    grantName: "地域コミュニティ活性化基金 2026",
    decision: "未決定",
    aiScore: 68,
    resultStatus: "検討中",
    applicationDate: "-",
    resultDate: "-",
  },
  {
    id: "GR-2025-015",
    grantName: "NPOデジタル化推進助成プログラム",
    decision: "応募する",
    aiScore: 92,
    resultStatus: "採択",
    applicationDate: "2025-11-05",
    resultDate: "2025-12-20",
  },
  {
    id: "GR-2025-012",
    grantName: "次世代教育支援枠 助成金",
    decision: "見送る",
    aiScore: 41,
    resultStatus: "検討中",
    applicationDate: "-",
    resultDate: "-",
  },
  {
    id: "GR-2025-008",
    grantName: "令和7年度 社会課題解決プロジェクト",
    decision: "応募する",
    aiScore: 78,
    resultStatus: "不採択",
    applicationDate: "2025-08-10",
    resultDate: "2025-09-30",
  },
];

export function DecisionHistoryWorkspace() {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-900 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800">
              <History className="h-4 w-4 text-neutral-400" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              Application Decision History
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-neutral-100">
            応募意思決定履歴
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            過去の助成金に対する応募判断、AI判定結果、外部審査結果を管理します。
          </p>
        </header>

        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="助成金名を検索..."
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 py-2 pl-9 pr-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <select className="appearance-none rounded-md border border-neutral-800 bg-neutral-950 py-2 pl-3 pr-8 text-sm text-neutral-300 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500">
              <option>すべての年度</option>
              <option>2026年度</option>
              <option>2025年度</option>
            </select>

            <select className="appearance-none rounded-md border border-neutral-800 bg-neutral-950 py-2 pl-3 pr-8 text-sm text-neutral-300 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500">
              <option>すべての審査結果</option>
              <option>検討中</option>
              <option>応募済</option>
              <option>結果待ち</option>
              <option>採択</option>
              <option>不採択</option>
            </select>

            <Button
              variant="outline"
              className="hidden sm:flex"
            >
              <Filter className="mr-2 h-4 w-4" />
              詳細フィルタ
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-neutral-800 bg-neutral-900/40">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    助成金名
                  </th>
                  <th className="px-6 py-4 font-medium">
                    応募判断
                  </th>
                  <th className="px-6 py-4 font-medium">
                    AI要件適合率
                  </th>
                  <th className="px-6 py-4 font-medium">
                    外部審査結果
                  </th>
                  <th className="px-6 py-4 font-medium">
                    応募日
                  </th>
                  <th className="px-6 py-4 font-medium">
                    結果通知日
                  </th>
                  <th className="w-10 px-6 py-4 font-medium"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-800/50">
                {mockData.map((row) => (
                  <tr
                    key={row.id}
                    className="group cursor-pointer transition-colors hover:bg-neutral-800/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-200">
                          {row.grantName}
                        </span>
                        <span className="mt-1 text-xs text-neutral-500">
                          {row.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getDecisionBadge(row.decision)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-right font-medium text-neutral-300">
                          {row.aiScore}%
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-800">
                          <div
                            className="h-full bg-neutral-400"
                            style={{ width: `${row.aiScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getResultStatusBadge(row.resultStatus)}
                    </td>

                    <td className="px-6 py-4 text-neutral-400">
                      {row.applicationDate}
                    </td>

                    <td className="px-6 py-4 text-neutral-400">
                      {row.resultDate}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-neutral-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}