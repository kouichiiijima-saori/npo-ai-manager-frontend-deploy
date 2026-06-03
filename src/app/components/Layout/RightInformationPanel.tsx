import React from "react";
import { AlertCircle, CheckCircle2, FileText, Link2 } from "lucide-react";

export function RightInformationPanel() {
    return (
        <aside className="hidden h-screen w-80 shrink-0 overflow-y-auto hide-scrollbar border-l border-neutral-800 bg-neutral-950 px-5 py-5 text-neutral-100 xl:block">
            <div className="mb-5">
                <div className="text-xs font-semibold text-neutral-500">補足情報</div>
                <h2 className="mt-1 text-lg font-bold">画面ガイド</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                    現在表示中の画面で確認すべきポイントや、関連画面へのつながりを表示する領域です。
                </p>
            </div>

            <section className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-neutral-400" />
                    画面概要
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                    各画面の目的、入力・確認すべき情報、AI判定や案件管理との関係を補足します。
                </p>
            </section>

            <section className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    確認ポイント
                </div>

                <ul className="mt-3 space-y-2 text-sm text-neutral-400">
                    <li>・登録情報に不足がないか</li>
                    <li>・AI判定の根拠として使えるか</li>
                    <li>・次に確認すべき作業が明確か</li>
                </ul>
            </section>

            <section className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Link2 className="h-4 w-4 text-neutral-400" />
                    関連画面
                </div>

                <div className="mt-3 space-y-2 text-sm text-neutral-400">
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        団体基本情報
                    </div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        定款条文管理
                    </div>
                    <div className="rounded-lg bg-neutral-800/70 px-3 py-2">
                        活動実績管理
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-amber-900/60 bg-amber-950/30 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                    <AlertCircle className="h-4 w-4" />
                    注意事項
                </div>
                <p className="mt-3 text-sm leading-6 text-amber-200/80">
                    AI判定は参考情報です。最終判断は利用者が確認して行います。
                </p>
            </section>
        </aside>
    );
}