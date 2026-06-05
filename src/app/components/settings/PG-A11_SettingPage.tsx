import React from "react";
import {
    Bell,
    CheckCircle2,
    Database,
    KeyRound,
    Layers3,
    MonitorCog,
    Palette,
    Server,
    ShieldCheck,
    Sparkles,
    Wrench,
} from "lucide-react";

type StatusItem = {
    label: string;
    value: string;
    status: "READY" | "COUNT";
};

type FutureFeature = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

// TODO: API実装後に件数を取得する
const statusItems: StatusItem[] = [
    {
        label: "団体情報",
        value: "登録済",
        status: "READY",
    },
    {
        label: "定款",
        value: "登録済",
        status: "READY",
    },
    {
        label: "活動実績",
        value: "登録済",
        status: "READY",
    },
    {
        label: "助成金公募",
        value: "3件",
        status: "COUNT",
    },
    {
        label: "判定履歴",
        value: "5件",
        status: "COUNT",
    },
    {
        label: "助成金案件",
        value: "4件",
        status: "COUNT",
    },
];

const futureFeatures: FutureFeature[] = [
    {
        title: "認証設定",
        description: "ユーザー管理、権限管理、パスワード変更を扱います。",
        icon: <KeyRound size={20} />,
    },
    {
        title: "テーマ変更",
        description: "ライト・ダーク・独自テーマ、表示密度、フォントサイズを設定します。",
        icon: <Palette size={20} />,
    },
    {
        title: "通知設定",
        description: "締切通知、報告期限通知、案件更新通知を設定します。",
        icon: <Bell size={20} />,
    },
    {
        title: "バックアップ設定",
        description: "データのエクスポート、バックアップ、復元を扱います。",
        icon: <Database size={20} />,
    },
];

export function PGA11SettingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <main className="relative mx-auto max-w-7xl px-6 py-8">
                <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/60 backdrop-blur">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                            <Sparkles size={16} />
                            PG-A11 設定
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-white">
                            設定
                        </h1>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                            MVPではシステム情報と登録状況を確認する画面として利用します。
                            認証設定や通知設定などは将来実装予定です。
                        </p>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <SettingCard
                            icon={<MonitorCog size={20} />}
                            title="システム情報"
                        >
                            <div className="grid gap-3 md:grid-cols-2">
                                <InfoRow label="アプリ名" value="NPO運営AIマネージャー" />
                                <InfoRow label="バージョン" value="v0.1.0 MVP" />
                                <InfoRow label="バージョン更新日" value="2026-06-05" />
                                <InfoRow label="画面区分" value="システム情報・設定" />
                            </div>
                        </SettingCard>

                        <SettingCard
                            icon={<Server size={20} />}
                            title="システム構成"
                        >
                            <div className="grid gap-3 md:grid-cols-2">
                                <InfoRow label="フロントエンド" value="React / TypeScript" />
                                <InfoRow label="バックエンド" value="Spring Boot" />
                                <InfoRow label="データベース" value="MySQL" />
                                <InfoRow label="動作形態" value="ローカル環境（MVP）" />
                            </div>
                        </SettingCard>

                        <SettingCard
                            icon={<Layers3 size={20} />}
                            title="登録状況サマリー"
                        >
                            <div className="grid gap-3 md:grid-cols-2">
                                {statusItems.map((item) => (
                                    <StatusRow
                                        key={item.label}
                                        label={item.label}
                                        value={item.value}
                                        status={item.status}
                                    />
                                ))}
                            </div>
                        </SettingCard>

                        <SettingCard
                            icon={<Wrench size={20} />}
                            title="将来実装機能"
                        >
                            <div className="grid gap-3 md:grid-cols-2">
                                {futureFeatures.map((feature) => (
                                    <FutureFeatureCard
                                        key={feature.title}
                                        title={feature.title}
                                        description={feature.description}
                                        icon={feature.icon}
                                    />
                                ))}
                            </div>
                        </SettingCard>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                システム利用ガイド
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="AI判定は最終判断ではありません。" />
                                <GuideLine text="助成金案件はPG-A09で管理します。" />
                                <GuideLine text="判定履歴はPG-A08で確認できます。" />
                                <GuideLine text="採択後も、実施・報告・精算まで案件管理を継続します。" />
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                MVP制限事項
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="認証機能は未実装です。" />
                                <GuideLine text="AI判定はモック結果です。" />
                                <GuideLine text="データ保存はAPI実装後に接続します。" />
                                <GuideLine text="通知機能は未実装です。" />
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                            <h2 className="text-lg font-semibold text-white">
                                バージョン情報
                            </h2>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                <p className="text-lg font-bold text-white">
                                    NPO運営AIマネージャー
                                </p>

                                <p className="mt-2 text-sm text-slate-400">
                                    Version 0.1.0 MVP
                                </p>

                                <p className="mt-4 text-sm leading-6 text-slate-300">
                                    助成金活用支援、AI判定、案件管理を行うためのMVP版です。
                                </p>

                                <p className="mt-4 text-xs text-slate-500">
                                    Copyright © 2026
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                画面ポリシー
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="MVPでは編集機能を持たない参照専用画面です。" />
                                <GuideLine text="認証機能実装後に本来の設定画面へ拡張します。" />
                                <GuideLine text="テーマ変更、通知、バックアップは将来実装予定です。" />
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

type SettingCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const SettingCard = ({ icon, title, children }: SettingCardProps) => {
    return (
        <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">
                    {icon}
                </div>

                <h2 className="text-lg font-semibold text-white">
                    {title}
                </h2>
            </div>

            {children}
        </section>
    );
};

type InfoRowProps = {
    label: string;
    value: string;
};

const InfoRow = ({ label, value }: InfoRowProps) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
                {value}
            </p>
        </div>
    );
};

type StatusRowProps = {
    label: string;
    value: string;
    status: "READY" | "COUNT";
};

const StatusRow = ({ label, value, status }: StatusRowProps) => {
    const statusClassName =
        status === "READY"
            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
            : "border-cyan-400/40 bg-cyan-400/10 text-cyan-200";

    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-semibold text-white">
                {label}
            </p>

            <span
                className={`rounded-full border px-3 py-1 text-xs ${statusClassName}`}
            >
                {value}
            </span>
        </div>
    );
};

type FutureFeatureCardProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

const FutureFeatureCard = ({
    title,
    description,
    icon,
}: FutureFeatureCardProps) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 opacity-60">
            <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white/10 p-2 text-slate-300">
                    {icon}
                </div>

                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white">
                            {title}
                        </p>

                        <span className="rounded-full border border-slate-500/40 bg-slate-500/20 px-2 py-0.5 text-[11px] text-slate-300">
                            将来実装予定
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

type GuideLineProps = {
    text: string;
};

const GuideLine = ({ text }: GuideLineProps) => {
    return (
        <div className="flex gap-2">
            <CheckCircle2
                size={16}
                className="mt-1 shrink-0 text-cyan-200"
            />

            <p>{text}</p>
        </div>
    );
};