import { useState } from "react";

type Project = {
    id: number;
    name: string;
    fiscalYear: string;
    target: string;
    participants: string;
    summary: string;
    outcome: string;
};

export function OrganizationProjectWorkspace() {
    const [projects, setProjects] = useState<Project[]>([
        {
            id: 1,
            name: "子ども食堂事業",
            fiscalYear: "2025",
            target: "地域の子ども・保護者",
            participants: "120",
            summary: "月1回、地域の子どもと保護者を対象に食事提供と交流の場を実施した。",
            outcome: "孤立防止と地域交流の機会づくりにつながった。",
        },
        {
            id: 2,
            name: "学習支援事業",
            fiscalYear: "2025",
            target: "小中学生",
            participants: "80",
            summary: "放課後に学習支援と居場所づくりを実施した。",
            outcome: "継続参加者が増え、学習習慣の形成につながった。",
        },
    ]);

    const [name, setName] = useState("");
    const [fiscalYear, setFiscalYear] = useState("");
    const [target, setTarget] = useState("");
    const [participants, setParticipants] = useState("");
    const [summary, setSummary] = useState("");
    const [outcome, setOutcome] = useState("");

    function handleAddProject() {
        if (!name || !fiscalYear || !summary) {
            alert("活動名、実施年度、活動概要を入力してください。");
            return;
        }

        const newProject: Project = {
            id: projects.length + 1,
            name,
            fiscalYear,
            target,
            participants,
            summary,
            outcome,
        };

        setProjects([...projects, newProject]);

        setName("");
        setFiscalYear("");
        setTarget("");
        setParticipants("");
        setSummary("");
        setOutcome("");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-100">
                    活動実績管理
                </h1>
                <p className="mt-1 text-sm text-neutral-400">
                    AI判定で根拠として参照する活動実績を登録・管理します。
                </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    活動実績登録
                </h2>

                <div className="grid gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            活動名
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例：子ども食堂事業"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            実施年度
                        </label>
                        <input
                            value={fiscalYear}
                            onChange={(e) => setFiscalYear(e.target.value)}
                            placeholder="例：2025"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            対象者
                        </label>
                        <input
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="例：地域の子ども・保護者"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            参加人数
                        </label>
                        <input
                            value={participants}
                            onChange={(e) => setParticipants(e.target.value)}
                            placeholder="例：120"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            活動概要
                        </label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={4}
                            placeholder="活動内容を入力してください。"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            成果
                        </label>
                        <textarea
                            value={outcome}
                            onChange={(e) => setOutcome(e.target.value)}
                            rows={4}
                            placeholder="活動によって得られた成果を入力してください。"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <button
                        onClick={handleAddProject}
                        className="w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        活動実績を追加
                    </button>
                </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    登録済み活動実績
                </h2>

                <div className="space-y-3">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                                    {project.fiscalYear}年度
                                </span>
                                <h3 className="font-semibold text-neutral-100">
                                    {project.name}
                                </h3>
                            </div>

                            <p className="text-sm text-neutral-300">
                                対象者：{project.target}
                            </p>
                            <p className="text-sm text-neutral-300">
                                参加人数：{project.participants}名
                            </p>
                            <p className="mt-2 text-sm leading-6 text-neutral-300">
                                {project.summary}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-neutral-400">
                                成果：{project.outcome}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}