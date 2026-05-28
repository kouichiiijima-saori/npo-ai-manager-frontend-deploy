import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  PlayCircle,
  ListChecks,
} from "lucide-react";

const evidenceList = [
  {
    type: "対象事業",
    title: "募集要項 第3条 対象事業",
    content:
      "地域住民と協働して実施する継続的な環境保全活動を対象とする。",
    reason: "法人の過去活動実績と一致する可能性が高い。",
  },
  {
    type: "対象団体",
    title: "募集要項 第5条 対象団体",
    content: "非営利法人、地域団体、NPO法人を対象とする。",
    reason: "法人種別の条件を満たす可能性が高い。",
  },
  {
    type: "対象経費",
    title: "募集要項 第7条 対象経費",
    content:
      "消耗品費、会場費、広報費、外部講師謝金を対象経費とする。",
    reason: "申請予定経費との照合が必要。",
  },
];

const analysisLog = [
  { date: "2026-05-20 10:00", event: "PDFアップロード完了" },
  { date: "2026-05-20 10:01", event: "OCR処理完了" },
  { date: "2026-05-20 10:02", event: "条件抽出完了" },
  { date: "2026-05-20 10:03", event: "適合性判定完了" },
];

export function AiAnalysisWorkspace() {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-900 p-8">
      <div className="mx-auto max-w-5xl space-y-10 pb-12">
        {/* Header */}
        <header className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-neutral-400 hover:text-neutral-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧へ戻る
          </Button>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium text-neutral-500">
                  AN-2026-001
                </span>
                <Badge variant="secondary">解析待ち</Badge>
              </div>
              <h1 className="text-2xl font-semibold leading-tight text-neutral-100 md:text-3xl">
                AI解析実行
              </h1>
              <p className="text-sm text-neutral-400">
                募集要項PDFを解析し、応募可否判断に必要な条件・リスク・根拠を抽出します。
              </p>
            </div>
            <div className="flex items-start md:items-end">
              <Button className="gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20">
                <PlayCircle className="h-4 w-4" />
                解析開始
              </Button>
            </div>
          </div>
        </header>

        {/* Section 1: PDF Upload */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <UploadCloud className="h-4 w-4" /> Upload
            Requirement Document
          </h2>
          <Card className="border-neutral-800 bg-neutral-900/40 shadow-none">
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-950/50 py-10 transition-colors hover:border-neutral-500 hover:bg-neutral-950">
                <UploadCloud className="mb-4 h-10 w-10 text-neutral-500" />
                <h3 className="mb-2 font-medium text-neutral-200">
                  募集要項PDFをアップロード
                </h3>
                <p className="text-sm text-neutral-500">
                  PDF / 最大20MB / 募集要項・申請要領に対応
                </p>
              </div>

              {/* Uploaded File Card */}
              <div className="flex items-center justify-between rounded-lg border border-neutral-800/60 bg-neutral-900/80 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
                    <FileText className="h-5 w-5 text-neutral-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-200">
                      environment_grant_guideline_2026.pdf
                    </span>
                    <span className="text-xs text-neutral-500">
                      2.4 MB
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                >
                  アップロード済
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Analysis Status */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <RefreshCw className="h-4 w-4" /> AI Analysis Status
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-emerald-500/20 bg-emerald-950/5 shadow-none">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <Badge variant="success">完了</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-200">
                    PDF読み取り
                  </h4>
                  <p className="mt-1 text-xs text-neutral-400">
                    テキスト抽出・構造解析
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-950/5 shadow-none">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                    <ListChecks className="h-4 w-4" />
                  </div>
                  <Badge variant="success">完了</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-200">
                    条件抽出
                  </h4>
                  <p className="mt-1 text-xs text-neutral-400">
                    必須要件・対象経費の特定
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/40 shadow-none">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 text-neutral-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <Badge variant="success">完了</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-200">
                    適合性判定
                  </h4>
                  <p className="mt-1 text-xs text-neutral-400">
                    団体情報とのクロスチェック
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Analysis Preview */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <Sparkles className="h-4 w-4" /> Analysis Preview
          </h2>
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-none">
            <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3 md:gap-12">
              <div className="space-y-6 md:col-span-1">
                <div>
                  <div className="mb-2 text-sm text-neutral-400">
                    要件適合率
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-light tracking-tight text-emerald-400">
                      82
                    </span>
                    <span className="text-lg text-emerald-500/50">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-neutral-800 pt-4">
                  <div>
                    <div className="mb-1 text-xs text-neutral-500">
                      信頼度
                    </div>
                    <div className="text-sm font-medium text-neutral-300">
                      High
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-neutral-500">
                      推奨判断
                    </div>
                    <div className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      応募候補
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:col-span-2">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-300">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>不足条件</span>
                      </div>
                      <ul className="space-y-2 text-sm text-neutral-400">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 text-neutral-600">
                            -
                          </span>
                          <span>最新の財務諸表</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 text-neutral-600">
                            -
                          </span>
                          <span>事業計画書の収支内訳</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-xl border border-red-500/10 bg-red-950/10 p-4">
                      <h4 className="mb-2 text-xs font-medium text-red-400/80">
                        注意リスク
                      </h4>
                      <ul className="space-y-1.5 text-sm text-red-200/80">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 text-red-500/50">
                            -
                          </span>
                          <span>
                            事業完了報告の提出期限が短い
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 text-red-500/50">
                            -
                          </span>
                          <span>
                            対象経費の一部に確認が必要
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/10 p-4">
                      <h4 className="mb-2 text-xs font-medium text-emerald-400/80">
                        推奨アクション
                      </h4>
                      <p className="text-sm leading-relaxed text-emerald-200/80">
                        不足書類を準備した上で、応募判断画面へ進む
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Extracted Evidence */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <FileText className="h-4 w-4" /> Extracted Evidence
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {evidenceList.map((item, idx) => (
              <Card
                key={idx}
                className="border-neutral-800 bg-neutral-900/40 shadow-none"
              >
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-neutral-800/80"
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-200">
                    {item.title}
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-neutral-800/60 bg-neutral-950/50 p-3">
                      <div className="mb-1.5 text-[11px] text-neutral-500">
                        抽出テキスト
                      </div>
                      <p className="text-xs leading-relaxed text-neutral-300">
                        "{item.content}"
                      </p>
                    </div>
                    <div className="px-1">
                      <div className="mb-1 text-[11px] text-neutral-500">
                        AI判定理由
                      </div>
                      <p className="text-xs leading-relaxed text-neutral-400">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 5: Analysis Log */}
        <section className="space-y-6 pt-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <Clock className="h-4 w-4" /> Analysis Log
          </h2>
          <div className="ml-3 space-y-6 border-l border-neutral-800 pl-8 pb-4">
            {analysisLog.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[37px] mt-1 h-2 w-2 rounded-full border border-neutral-900 bg-neutral-600 ring-4 ring-neutral-900" />
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs text-neutral-500">
                    {item.date}
                  </span>
                  <span className="text-sm font-medium text-neutral-300">
                    {item.event}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}