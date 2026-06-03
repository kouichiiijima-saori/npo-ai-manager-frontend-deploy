import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  PlayCircle,
  Building2,
  ListChecks,
} from "lucide-react";

const selectedGrant = {
  name: "子どもの居場所づくり助成",
  provider: "こども支援財団",
  category: "子ども・教育",
  deadline: "2026/07/31",
  amount: "上限500,000円",
};

const knowledgeSources = [
  {
    type: "団体基本情報",
    title: "活動地域・ミッション",
    content: "地域の子どもと家庭を支える居場所づくりを目的として活動している。",
  },
  {
    type: "定款条文",
    title: "第4条 事業",
    content: "子ども支援、地域交流、福祉活動に関する事業を行う。",
  },
  {
    type: "活動実績",
    title: "2025年度 子ども食堂事業",
    content: "地域の子ども・保護者を対象に月1回の食事提供と交流の場を実施した。",
  },
];

const evidenceList = [
  {
    type: "適合根拠",
    title: "対象分野との一致",
    content: "助成金の対象分野である子ども支援と、団体の活動実績が一致しています。",
  },
  {
    type: "定款根拠",
    title: "定款第4条",
    content: "定款上、子ども支援および地域交流に関する事業を実施可能です。",
  },
  {
    type: "確認事項",
    title: "予算資料",
    content: "申請時には活動予算書と対象経費の内訳確認が必要です。",
  },
];

export function PGA07AiWorkspacePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-900 p-8">
      <div className="mx-auto max-w-5xl space-y-8 pb-12">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-medium text-neutral-500">
              AI-JUDGE-2026-001
            </span>
            <Badge variant="secondary">判定準備中</Badge>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-100 md:text-3xl">
                AI判定ワークスペース
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                団体情報・定款条文・活動実績と助成金要件を照合し、応募判断の根拠を整理します。
              </p>
            </div>

            <Button className="gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20">
              <PlayCircle className="h-4 w-4" />
              AI判定を実行
            </Button>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <FileText className="h-4 w-4" />
            Selected Grant
          </h2>

          <Card className="border-neutral-800 bg-neutral-900/40 shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-neutral-100">
                {selectedGrant.name}
              </h3>
              <p className="mt-1 text-sm text-neutral-400">
                {selectedGrant.provider}
              </p>

              <div className="mt-4 grid gap-3 text-sm text-neutral-300 md:grid-cols-4">
                <p>分野：{selectedGrant.category}</p>
                <p>締切：{selectedGrant.deadline}</p>
                <p>助成額：{selectedGrant.amount}</p>
                <p>状態：判定対象</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <Building2 className="h-4 w-4" />
            Organization Knowledge
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {knowledgeSources.map((item, index) => (
              <Card
                key={index}
                className="border-neutral-800 bg-neutral-900/40 shadow-none"
              >
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-3 bg-neutral-800/80">
                    {item.type}
                  </Badge>
                  <h3 className="mb-2 text-sm font-medium text-neutral-100">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-6 text-neutral-400">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <Sparkles className="h-4 w-4" />
            AI Judge Result
          </h2>

          <Card className="border-neutral-800 bg-neutral-900/60 shadow-none">
            <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3">
              <div>
                <div className="mb-2 text-sm text-neutral-400">
                  適合率
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-light tracking-tight text-emerald-400">
                    87
                  </span>
                  <span className="text-lg text-emerald-500/50">%</span>
                </div>

                <div className="mt-6 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  応募推奨
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    強い適合ポイント
                  </div>
                  <p className="text-sm leading-6 text-emerald-100/80">
                    助成金の対象である「子どもの居場所づくり」と、団体の定款・活動実績が一致しています。
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/10 bg-amber-950/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    確認が必要な点
                  </div>
                  <p className="text-sm leading-6 text-amber-100/80">
                    活動予算書、対象経費、自己負担の有無を確認してから応募判断する必要があります。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <ListChecks className="h-4 w-4" />
            Evidence
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {evidenceList.map((item, index) => (
              <Card
                key={index}
                className="border-neutral-800 bg-neutral-900/40 shadow-none"
              >
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-3 bg-neutral-800/80">
                    {item.type}
                  </Badge>
                  <h3 className="mb-2 text-sm font-medium text-neutral-100">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-6 text-neutral-400">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <ShieldCheck className="h-4 w-4" />
            Decision
          </h2>

          <Card className="border-neutral-800 bg-neutral-900/40 shadow-none">
            <CardContent className="space-y-4 p-6">
              <label className="block text-sm font-medium text-neutral-300">
                応募判断理由
              </label>
              <textarea
                rows={4}
                placeholder="AI判定結果を参考に、応募する理由または見送る理由を記録してください。"
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              />

              <div className="flex gap-3">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  応募する
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  今回は見送る
                </Button>
                <Link
                  to="/admin/evaluations/histories"
                  className="inline-flex items-center rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  履歴へ戻る
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}