import React from "react";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  FileCheck2,
  XCircle,
} from "lucide-react";

const historyLogs = [
  {
    id: 1,
    type: "applied",
    user: "田中 由紀",
    action: "応募を決定",
    target: "環境保全プロジェクト 2026",
    time: "10分前",
    icon: Send,
    iconColor: "text-emerald-500",
  },
  {
    id: 2,
    type: "missing",
    user: "AI判定",
    action: "不足条件を検出",
    target: "2025年度 収支報告書",
    time: "2時間前",
    icon: AlertCircle,
    iconColor: "text-amber-500",
  },
  {
    id: 3,
    type: "updated",
    user: "佐藤 健二",
    action: "定款条文を更新",
    target: "定款 第5条 第2項",
    time: "1日前",
    icon: Clock,
    iconColor: "text-blue-500",
  },
];

export function HistoryPanel() {
  return (
    <div className="flex w-80 flex-col gap-6 overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-4">
      <div>
        <h3 className="mb-4 text-sm font-semibold text-neutral-100">
          応募意思決定履歴
        </h3>

        <div className="space-y-4">
          {historyLogs.map((log) => (
            <div key={log.id} className="relative flex gap-3">
              <div className="absolute bottom-[-16px] left-2.5 top-7 w-[1px] bg-neutral-800 last:hidden" />

              <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
                <log.icon
                  className={`h-3 w-3 ${log.iconColor}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm text-neutral-200">
                  <span className="font-medium">
                    {log.user}
                  </span>{" "}
                  が {log.action}
                </p>
                <p className="text-xs text-neutral-400">
                  {log.target}
                </p>
                <p className="text-[10px] text-neutral-500">
                  {log.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-neutral-800 pt-6">
        <h3 className="mb-4 text-sm font-semibold text-neutral-100">
          応募・審査状況
        </h3>

        <Card className="border-dashed bg-transparent">
          <CardContent className="p-4 pt-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  応募判断待ち
                </span>
                <Badge variant="warning">3</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  不足条件あり
                </span>
                <Badge variant="danger">1</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  結果待ち
                </span>
                <Badge variant="outline">4</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  採択済み
                </span>
                <Badge variant="success">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}