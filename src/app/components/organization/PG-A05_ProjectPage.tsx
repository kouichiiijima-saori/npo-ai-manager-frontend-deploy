import React, { useState } from "react";
import {
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    Edit3,
    FileText,
    Save,
    Users,
    X,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Project = {
    id: string;
    fiscalYear: string;
    title: string;
    targetPeople: string;
    participants: string;
    area: string;
    summary: string;
    outcome: string;
    aiUse: string;
};

const initialProjects: Project[] = [
    {
        id: "project-1",
        fiscalYear: "2025年度",
        title: "子ども食堂事業",
        targetPeople: "地域の子ども・保護者",
        participants: "120名",
        area: "埼玉県比企郡鳩山町",
        summary:
            "月1回、地域の子どもと保護者を対象に食事提供と交流の場を実施した。",
        outcome:
            "孤立防止と地域交流の機会づくりにつながった。",
        aiUse:
            "子ども支援、地域交流、居場所づくりに関する助成金との適合判定に利用する。",
    },
    {
        id: "project-2",
        fiscalYear: "2025年度",
        title: "学習支援事業",
        targetPeople: "小中学生",
        participants: "80名",
        area: "埼玉県比企郡鳩山町",
        summary:
            "放課後に学習支援と居場所づくりを実施した。",
        outcome:
            "継続参加者が増え、学習習慣の形成につながった。",
        aiUse:
            "子どもの学習支援、居場所づくり、教育分野の助成金判定に利用する。",
    },
    {
        id: "project-3",
        fiscalYear: "2024年度",
        title: "農業体験・地域交流事業",
        targetPeople: "地域住民、子ども、障害のある人",
        participants: "150名",
        area: "埼玉県比企郡鳩山町",
        summary:
            "地域の畑を活用し、農業体験、収穫体験、地域交流イベントを実施した。",
        outcome:
            "農を通じた多世代交流と、障害福祉との接点づくりにつながった。",
        aiUse:
            "農福連携、地域交流、多世代交流に関する助成金との適合判定に利用する。",
    },
];

export function PGA05ProjectPage() {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [selectedProjectId, setSelectedProjectId] =
        useState<string>("project-1");
    const [draftProject, setDraftProject] = useState<Project>(
        initialProjects[0],
    );
    const [isEditing, setIsEditing] = useState(false);

    const selectedProject =
        projects.find((project) => project.id === selectedProjectId) ??
        projects[0];

    const handleSelectProject = (project: Project) => {
        if (isEditing) {
            return;
        }

        setSelectedProjectId(project.id);
        setDraftProject(project);
    };

    const handleStartEdit = () => {
        setDraftProject(selectedProject);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraftProject(selectedProject);
        setIsEditing(false);
    };

    const handleSave = () => {
        setProjects((current) =>
            current.map((project) =>
                project.id === draftProject.id ? draftProject : project,
            ),
        );
        setSelectedProjectId(draftProject.id);
        setIsEditing(false);
    };

    const handleChange = (field: keyof Project, value: string) => {
        setDraftProject((current) => ({
            ...current,
            [field]: value,
        }));
    };

    return (
        <div className="min-h-full bg-neutral-950 px-8 py-8 text-neutral-100">
            <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <BarChart3 className="h-4 w-4" />
                    PG-A05 活動実績管理
                </div>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            活動実績管理
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
                            AI判定の根拠として利用する活動実績を確認・編集します。
                            活動分野、対象者、参加人数、成果は、助成金との適合判定に利用されます。
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="border-neutral-700 bg-neutral-950 text-neutral-100 hover:bg-neutral-900"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    キャンセル
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    保存する
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleStartEdit}
                                className="bg-neutral-100 text-neutral-950 hover:bg-white"
                            >
                                <Edit3 className="mr-2 h-4 w-4" />
                                選択中の活動実績を編集
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="space-y-6">
                <section className="grid gap-4 xl:grid-cols-3">
                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-sm text-neutral-400">
                                登録状態
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span className="text-2xl font-bold">
                                    {projects.length}件
                                </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">
                                AI判定に利用する活動実績が登録されています。
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-sm text-neutral-400">
                                AI判定での利用
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary">根拠データ</Badge>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">
                                助成金の対象分野、対象者、活動実績要件との照合に利用されます。
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-900/60 bg-amber-950/30 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm text-amber-300">
                                <AlertTriangle className="h-4 w-4" />
                                確認事項
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-6 text-amber-100/90">
                                活動実績が古い場合、直近の助成金申請で根拠資料として弱くなる可能性があります。
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {isEditing && (
                    <Alert className="border-amber-900/60 bg-amber-950/30 text-amber-100">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>編集中です</AlertTitle>
                        <AlertDescription>
                            活動実績の選択は一時的にロックされます。キャンセルを押すと、編集中の内容は破棄され、参照モードへ戻ります。
                        </AlertDescription>
                    </Alert>
                )}

                <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-neutral-400" />
                                <CardTitle>活動実績一覧</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {projects.map((project) => {
                                const isSelected = project.id === selectedProjectId;

                                return (
                                    <button
                                        key={project.id}
                                        type="button"
                                        disabled={isEditing}
                                        onClick={() => handleSelectProject(project)}
                                        className={[
                                            "w-full rounded-xl border px-4 py-3 text-left transition",
                                            isSelected
                                                ? "border-neutral-500 bg-neutral-800 text-white"
                                                : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600",
                                            isEditing ? "cursor-not-allowed opacity-60" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary">
                                                        {project.fiscalYear}
                                                    </Badge>
                                                    {isSelected && (
                                                        <Badge variant="secondary">選択中</Badge>
                                                    )}
                                                </div>

                                                <div className="mt-3 text-sm font-semibold">
                                                    {project.title}
                                                </div>

                                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">
                                                    {project.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-neutral-400" />
                                <CardTitle>選択中の活動実績</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {isEditing ? (
                                <div className="grid gap-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <FieldEditor
                                            label="活動名"
                                            value={draftProject.title}
                                            onChange={(value) =>
                                                handleChange("title", value)
                                            }
                                        />

                                        <FieldEditor
                                            label="実施年度"
                                            value={draftProject.fiscalYear}
                                            onChange={(value) =>
                                                handleChange("fiscalYear", value)
                                            }
                                        />

                                        <FieldEditor
                                            label="対象者"
                                            value={draftProject.targetPeople}
                                            onChange={(value) =>
                                                handleChange("targetPeople", value)
                                            }
                                        />

                                        <FieldEditor
                                            label="参加人数"
                                            value={draftProject.participants}
                                            onChange={(value) =>
                                                handleChange("participants", value)
                                            }
                                        />

                                        <FieldEditor
                                            label="活動地域"
                                            value={draftProject.area}
                                            onChange={(value) =>
                                                handleChange("area", value)
                                            }
                                        />
                                    </div>

                                    <TextareaEditor
                                        label="活動概要"
                                        value={draftProject.summary}
                                        onChange={(value) =>
                                            handleChange("summary", value)
                                        }
                                    />

                                    <TextareaEditor
                                        label="成果"
                                        value={draftProject.outcome}
                                        onChange={(value) =>
                                            handleChange("outcome", value)
                                        }
                                    />

                                    <TextareaEditor
                                        label="AI判定での利用目的"
                                        value={draftProject.aiUse}
                                        onChange={(value) =>
                                            handleChange("aiUse", value)
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-4">
                                        <div className="text-xs font-semibold text-neutral-500">
                                            活動名
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span className="text-lg font-bold">
                                                {selectedProject.title}
                                            </span>
                                            <Badge variant="secondary">
                                                {selectedProject.fiscalYear}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FieldViewer
                                            label="対象者"
                                            value={selectedProject.targetPeople}
                                        />
                                        <FieldViewer
                                            label="参加人数"
                                            value={selectedProject.participants}
                                        />
                                        <FieldViewer
                                            label="活動地域"
                                            value={selectedProject.area}
                                        />
                                    </div>

                                    <FieldViewer
                                        label="活動概要"
                                        value={selectedProject.summary}
                                    />

                                    <FieldViewer
                                        label="成果"
                                        value={selectedProject.outcome}
                                    />

                                    <FieldViewer
                                        label="AI判定での利用目的"
                                        value={selectedProject.aiUse}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}

function FieldViewer({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-4">
            <div className="text-xs font-semibold text-neutral-500">
                {label}
            </div>
            <div className="mt-2 text-sm leading-7 text-neutral-100">
                {value}
            </div>
        </div>
    );
}

function FieldEditor({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-neutral-300">
                {label}
            </span>
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 border-neutral-700 bg-neutral-950 text-neutral-100"
            />
        </label>
    );
}

function TextareaEditor({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-neutral-300">
                {label}
            </span>
            <Textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 min-h-28 border-neutral-700 bg-neutral-950 text-neutral-100"
            />
        </label>
    );
}