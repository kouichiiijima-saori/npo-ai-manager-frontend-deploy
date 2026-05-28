import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle,
  Scale,
  Send,
  Archive,
} from "lucide-react";

export function Workspace() {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-900 p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <Badge variant="warning">応募判断待ち</Badge>
            <span className="text-sm text-neutral-500">
              助成金応募候補 #892
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">
            環境保全プロジェクト 2026
          </h1>
          <p className="mt-2 text-neutral-400">
            助成金要項と、NPOの定款条文・活動実績を照合し、応募判断に必要な材料を整理します。
          </p>
        </header>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 bg-neutral-900/40 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-neutral-500" />
                <CardTitle className="text-sm">
                  最新AI判定 (Latest AI Review)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-end gap-4">
                <div className="text-4xl font-light text-neutral-100">
                  85<span className="text-2xl text-neutral-500">%</span>
                </div>
                <div className="mb-1 text-sm text-neutral-400">
                  要件整合状況 (Requirement Alignment)
                </div>
              </div>
              <p className="text-sm leading-relaxed text-neutral-300">
                本プロジェクトは、定款第3条に記載された環境保全活動の目的と概ね整合しています。
                一方で、本助成金区分では前年度の収支報告書および詳細な予算内訳が必要条件として求められており、現時点では一部資料が不足しています。
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm text-amber-500">
                  不足条件 (Missing Conditions)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>2025年度 収支報告書</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>2026年度 第1四半期の詳細予算内訳</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-neutral-900/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-neutral-500" />
              <CardTitle className="text-sm">
                根拠表示 (Evidence & Grounds)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    適合条文 (Matched Article)
                  </span>
                  <Badge variant="outline">定款 第3条</Badge>
                </div>
                <p className="border-l-2 border-neutral-700 pl-3 text-sm italic text-neutral-300">
                  「この法人は、地域の自然環境保全および持続可能な地域社会の形成に関する活動を行う。」
                </p>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    過去事例 (Past Precedent)
                  </span>
                  <Badge variant="outline">助成金 #441</Badge>
                </div>
                <p className="text-sm text-neutral-300">
                  2024年度に類似プロジェクトで応募実績あり。ただし、その申請では環境影響評価資料が添付されており、今回の応募候補では同資料が不足しています。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-700 bg-neutral-900 shadow-lg shadow-black/20">
          <CardHeader>
            <CardTitle>応募意思決定フォーム (Application Decision)</CardTitle>
            <CardDescription>
              AI判定は参考情報です。最終的な応募判断と理由は、NPO管理者が記録します。
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  応募判断理由
                </label>
                <textarea
                  className="min-h-[100px] w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  placeholder="不足条件を踏まえた応募判断理由、補足資料の準備方針、見送り理由などを入力してください。"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-neutral-800/50 pt-6">
            <Button variant="outline">
              <Archive className="mr-2 h-4 w-4" />
              下書き保存
            </Button>

            <Button variant="danger">今回は見送る</Button>

            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
              <Send className="mr-2 h-4 w-4" />
              応募する
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}