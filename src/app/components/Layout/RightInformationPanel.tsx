import React from "react";
import {
    AlertCircle,
    CheckCircle2,
    FileText,
    Link2,
    Route,
} from "lucide-react";

export function RightInformationPanel() {
    return (
        <aside className="hidden h-screen w-80 shrink-0 overflow-y-auto hide-scrollbar border-l border-neutral-800 bg-neutral-950 px-5 py-5 text-neutral-100 xl:block">
            <div className="mb-5">
                <div className="text-xs font-semibold text-neutral-500">
                    補足情報
                </div>

                <h2 className="mt-1 text-lg font-bold">
                    画面ガイド
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                    現在の画面で確認する内容と、次の作業につながる情報を表示します。
                </p>
            </div>

            <section className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-neutral-400" />
                    このシステムで扱う情報
                </div>

                <ul className="mt-3 space-y-2 text-sm text-neutral-400">
                    <li>・団体基本情報</li>
                    <li>・定款条文</li>
                    <li>・活動実績</li>
                    <li>・助成金公募</li>
                    <li>・AI判定履歴</li>
                    <li>・助成金案件</li>
                </ul>
            </section>

            <section className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Route className="h-4 w-4 text-cyan-400" />
                    基本フロー
                </div>

                <div className="mt-3 space-y-2 text-sm text-neutral-400">
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        助成金管理
                    </div>
                    <div className="px-3 text-neutral-600">↓</div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        AI判定
                    </div>
                    <div className="px-3 text-neutral-600">↓</div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        AI判定履歴
                    </div>
                    <div className="px-3 text-neutral-600">↓</div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        助成金案件管理
                    </div>
                </div>
            </section>

            <section className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    確認ポイント
                </div>

                <ul className="mt-3 space-y-2 text-sm text-neutral-400">
                    <li>・登録情報に不足がないか</li>
                    <li>・AI判定の根拠として使えるか</li>
                    <li>・検討結果やメモが残っているか</li>
                    <li>・次アクションが明確か</li>
                </ul>
            </section>

            <section className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Link2 className="h-4 w-4 text-neutral-400" />
                    主な関連画面
                </div>

                <div className="mt-3 space-y-2 text-sm text-neutral-400">
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        助成金管理
                    </div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        AI判定履歴
                    </div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        助成金案件一覧
                    </div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        助成金案件詳細
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-amber-900/60 bg-amber-950/30 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                    <AlertCircle className="h-4 w-4" />
                    注意事項
                </div>

                <p className="mt-3 text-sm leading-6 text-amber-200/80">
                    AI判定は参考情報です。検討結果は担当者が確認して保存します。
                </p>
            </section>
        </aside>
    );
}