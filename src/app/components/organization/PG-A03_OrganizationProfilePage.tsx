import React, { useState } from "react";
import {
    AlertTriangle,
    Building2,
    CheckCircle2,
    Edit3,
    FileText,
    Save,
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

type OrganizationProfile = {
    organizationName: string;
    representativeName: string;
    location: string;
    establishedDate: string;
    activityArea: string;
    mission: string;
    targetPeople: string;
    mainActivities: string;
};

const initialProfile: OrganizationProfile = {
    organizationName: "特定非営利活動法人 彩央里",
    representativeName: "飯島 紘一",
    location: "埼玉県比企郡鳩山町",
    establishedDate: "2026-04-01",
    activityArea: "地域福祉、農福連携、子どもの居場所づくり",
    mission:
        "農・食・多様性を軸に、地域で支え合いながら暮らせる場をつくる。",
    targetPeople:
        "子ども、障害のある人、社会との接点が少なくなった人、地域住民",
    mainActivities:
        "農業体験、地域交流、子どもの居場所づくり、障害福祉との連携、助成金を活用した地域活動",
};

const fieldLabels: Record<keyof OrganizationProfile, string> = {
    organizationName: "団体名",
    representativeName: "代表者名",
    location: "所在地",
    establishedDate: "設立日",
    activityArea: "活動分野",
    mission: "団体の目的・ミッション",
    targetPeople: "主な対象者",
    mainActivities: "主な活動内容",
};

export function PGA03OrganizationProfilePage() {
    const [profile, setProfile] =
        useState<OrganizationProfile>(initialProfile);
    const [draft, setDraft] =
        useState<OrganizationProfile>(initialProfile);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (
        field: keyof OrganizationProfile,
        value: string,
    ) => {
        setDraft((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleStartEdit = () => {
        setDraft(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraft(profile);
        setIsEditing(false);
    };

    const handleSave = () => {
        setProfile(draft);
        setIsEditing(false);
    };

    return (
        <div className="min-h-full bg-neutral-950 px-8 py-8 text-neutral-100">
            <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Building2 className="h-4 w-4" />
                    PG-A03 団体基本情報管理
                </div>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            団体基本情報
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
                            AI判定の根拠として利用する団体の基本情報を確認・編集します。
                            団体目的、活動分野、対象者、主な活動内容は助成金との適合判定に利用されます。
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
                                編集する
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
                                <span className="text-2xl font-bold">登録済み</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">
                                AI判定に必要な団体基本情報が登録されています。
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
                                助成金の対象分野、応募要件、対象者との照合に利用されます。
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
                                活動分野や主な活動内容が古い場合、AI判定の根拠が弱くなります。
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {isEditing && (
                    <Alert className="border-amber-900/60 bg-amber-950/30 text-amber-100">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>編集中です</AlertTitle>
                        <AlertDescription>
                            キャンセルを押すと、編集中の内容は破棄され、参照モードへ戻ります。
                        </AlertDescription>
                    </Alert>
                )}

                <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-neutral-400" />
                            <CardTitle>基本情報</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {isEditing ? (
                            <div className="grid gap-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <FieldEditor
                                        label={fieldLabels.organizationName}
                                        value={draft.organizationName}
                                        onChange={(value) =>
                                            handleChange("organizationName", value)
                                        }
                                    />

                                    <FieldEditor
                                        label={fieldLabels.representativeName}
                                        value={draft.representativeName}
                                        onChange={(value) =>
                                            handleChange("representativeName", value)
                                        }
                                    />

                                    <FieldEditor
                                        label={fieldLabels.location}
                                        value={draft.location}
                                        onChange={(value) => handleChange("location", value)}
                                    />

                                    <FieldEditor
                                        label={fieldLabels.establishedDate}
                                        value={draft.establishedDate}
                                        onChange={(value) =>
                                            handleChange("establishedDate", value)
                                        }
                                    />

                                    <FieldEditor
                                        label={fieldLabels.activityArea}
                                        value={draft.activityArea}
                                        onChange={(value) =>
                                            handleChange("activityArea", value)
                                        }
                                    />

                                    <FieldEditor
                                        label={fieldLabels.targetPeople}
                                        value={draft.targetPeople}
                                        onChange={(value) =>
                                            handleChange("targetPeople", value)
                                        }
                                    />
                                </div>

                                <TextareaEditor
                                    label={fieldLabels.mission}
                                    value={draft.mission}
                                    onChange={(value) => handleChange("mission", value)}
                                />

                                <TextareaEditor
                                    label={fieldLabels.mainActivities}
                                    value={draft.mainActivities}
                                    onChange={(value) =>
                                        handleChange("mainActivities", value)
                                    }
                                />
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FieldViewer
                                        label={fieldLabels.organizationName}
                                        value={profile.organizationName}
                                    />
                                    <FieldViewer
                                        label={fieldLabels.representativeName}
                                        value={profile.representativeName}
                                    />
                                    <FieldViewer
                                        label={fieldLabels.location}
                                        value={profile.location}
                                    />
                                    <FieldViewer
                                        label={fieldLabels.establishedDate}
                                        value={profile.establishedDate}
                                    />
                                    <FieldViewer
                                        label={fieldLabels.activityArea}
                                        value={profile.activityArea}
                                    />
                                    <FieldViewer
                                        label={fieldLabels.targetPeople}
                                        value={profile.targetPeople}
                                    />
                                </div>

                                <FieldViewer
                                    label={fieldLabels.mission}
                                    value={profile.mission}
                                />

                                <FieldViewer
                                    label={fieldLabels.mainActivities}
                                    value={profile.mainActivities}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
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
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3">
            <div className="text-xs font-semibold text-neutral-500">
                {label}
            </div>
            <div className="mt-2 text-sm leading-6 text-neutral-100">
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