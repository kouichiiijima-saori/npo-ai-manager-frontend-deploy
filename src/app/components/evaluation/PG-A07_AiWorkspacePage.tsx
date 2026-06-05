import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Save,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

type EvaluationState = "NOT_STARTED" | "RUNNING" | "COMPLETED";
type AiResult = "MATCH" | "CHECK_REQUIRED" | "NOT_MATCH";
type ReviewResult = "" | "APPLY_PREPARATION" | "DECLINED" | "PENDING";

const grant = {
  id: 1,
  name: "地域子ども支援活動助成",
  provider: "公益財団法人 未来地域財団",
  amount: "上限 100万円",
  deadline: "2026-06-28",
  summary:
    "子どもの居場所づくり、学習支援、食支援を行う団体を対象とした助成。",
};

const organizationSources = [
  {
    title: "団体基本情報",
    status: "登録済み",
    description: "所在地、活動目的、団体概要を判定材料として利用します。",
  },
  {
    title: "定款",
    status: "登録済み",
    description: "団体目的、事業内容、活動範囲を確認します。",
  },
  {
    title: "活動実績",
    status: "登録済み",
    description: "子ども食堂、農業体験、居場所づくりの実績を確認します。",
  },
];

const aiEvaluation = {
  result: "MATCH" as AiResult,
  reason:
    "団体の活動目的、子ども支援の実績、地域での居場所づくりの方向性が、公募の対象事業と高く一致しています。",
  evidence: [
    "活動実績に子ども食堂・学習支援が登録されている",
    "定款上の目的に地域福祉・子ども支援と整合する記載がある",
    "所在地が助成対象地域内である",
  ],
  missingInfo: [
    "前年度決算書の添付状況",
    "事業収支計画の具体性",
  ],
  additionalChecks: [
    "対象経費に人件費・食材費が含まれるか確認する",
    "申請時に必要な添付資料一覧を確認する",
  ],
};

const aiResultLabel: Record<AiResult, string> = {
  MATCH: "適合",
  CHECK_REQUIRED: "要確認",
  NOT_MATCH: "不適合",
};

const aiResultStyle: Record<AiResult, string> = {
  MATCH: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  CHECK_REQUIRED: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  NOT_MATCH: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

export function PGA07AiWorkspacePage() {
  const navigate = useNavigate();

  const [evaluationState, setEvaluationState] =
    useState<EvaluationState>("NOT_STARTED");
  const [selectedReviewResult, setSelectedReviewResult] =
    useState<ReviewResult>("");
  const [reviewMemo, setReviewMemo] = useState("");

  const isNotStarted = evaluationState === "NOT_STARTED";
  const isRunning = evaluationState === "RUNNING";
  const isCompleted = evaluationState === "COMPLETED";

  const reviewMemoLabel =
    selectedReviewResult === "DECLINED" ? "辞退理由" : "検討メモ";

  const reviewMemoPlaceholder =
    selectedReviewResult === "DECLINED"
      ? "【必須】今回の公募を見送る理由を入力してください（例：人的リソース不足、対象経費不一致など）"
      : "例：決算書を確認する、対象経費に人件費が含まれるか確認する、募集要項を再確認する";

  const canSaveReview =
    isCompleted &&
    selectedReviewResult !== "" &&
    !(
      selectedReviewResult === "DECLINED" &&
      reviewMemo.trim() === ""
    );

  const handleRunEvaluation = () => {
    setEvaluationState("RUNNING");

    window.setTimeout(() => {
      setEvaluationState("COMPLETED");
    }, 1200);
  };

  const handleBackToGrantList = () => {
    if (isRunning) {
      alert("AI判定中は画面を移動できません。");
      return;
    }

    navigate("/admin/grants");
  };

  const handleSaveReview = () => {
    if (!canSaveReview) {
      return;
    }

    if (selectedReviewResult === "APPLY_PREPARATION") {
      alert("検討結果を保存しました。助成金案件一覧へ移動します。");
      navigate("/admin/grant-cases");
      return;
    }

    if (selectedReviewResult === "DECLINED") {
      alert("見送り結果を保存しました。判定履歴へ移動します。");
      navigate("/admin/evaluations/histories");
      return;
    }

    if (selectedReviewResult === "PENDING") {
      alert("保留結果を保存しました。助成金公募管理へ戻ります。");
      navigate("/admin/grants");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {isRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-8 text-center shadow-2xl shadow-cyan-950/40">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
              <Loader2 className="animate-spin" size={28} />
            </div>

            <h2 className="text-xl font-bold text-white">
              判定中です...
            </h2>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>団体基本情報を確認しています</p>
              <p>定款と活動実績を照合しています</p>
              <p>公募要件との適合性を整理しています</p>
            </div>
          </div>
        </div>
      )}

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/60 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Sparkles size={16} />
                PG-A07 AI判定ワークスペース
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white">
                AI判定ワークスペース
              </h1>
            </div>

            <button
              type="button"
              onClick={handleBackToGrantList}
              disabled={isRunning}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={18} />
              助成金公募管理へ戻る
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <WorkspaceCard
              icon={<FileText size={20} />}
              title="判定対象の公募"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-2xl font-bold text-white">
                  {grant.name}
                </h2>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>{grant.provider}</span>
                  <span>締切：{grant.deadline}</span>
                  <span>{grant.amount}</span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {grant.summary}
                </p>
              </div>
            </WorkspaceCard>

            <WorkspaceCard
              icon={<BookOpen size={20} />}
              title="判定に利用する情報"
            >
              <div className="grid gap-3">
                {organizationSources.map((source) => (
                  <div
                    key={source.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {source.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {source.description}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                        {source.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </WorkspaceCard>

            <WorkspaceCard
              icon={<SearchCheck size={20} />}
              title="AI判定実行"
            >
              {isNotStarted && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm leading-7 text-slate-300">
                    判定対象と利用情報を確認してから、AI判定を実行してください。
                    判定が完了すると、判定結果と検討結果の保存エリアが表示されます。
                  </p>

                  <button
                    type="button"
                    onClick={handleRunEvaluation}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                  >
                    <Sparkles size={18} />
                    AI判定を実行
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-100">
                  AI判定が完了しました。判定結果を確認し、検討結果を保存してください。
                </div>
              )}
            </WorkspaceCard>

            {isCompleted && (
              <WorkspaceCard
                icon={<BadgeCheck size={20} />}
                title="AI判定結果"
              >
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="mb-3 text-sm font-semibold text-white">結果</p>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${aiResultStyle[aiEvaluation.result]}`}
                    >
                      <CheckCircle2 size={14} />
                      {aiResultLabel[aiEvaluation.result]}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="mb-3 text-sm font-semibold text-white">判定理由</p>

                    <p className="text-sm leading-7 text-slate-300">
                      {aiEvaluation.reason}
                    </p>
                  </div>

                  <ResultList
                    title="根拠"
                    items={aiEvaluation.evidence}
                    markerClassName="bg-emerald-300"
                  />

                  <ResultList
                    title="不足情報"
                    items={aiEvaluation.missingInfo}
                    markerClassName="bg-amber-300"
                  />

                  <ResultList
                    title="追加確認事項"
                    items={aiEvaluation.additionalChecks}
                    markerClassName="bg-cyan-300"
                  />
                </div>
              </WorkspaceCard>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
              <h2 className="text-lg font-semibold text-white">
                画面ガイド
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <p>
                  登録済み公募に対してAI判定を実行します。
                </p>

                <p>
                  AIは参考情報を提示し、検討結果は担当者が確認して保存します。
                </p>

                <p>
                  判定中は画面内の操作をロックします。
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
              <h2 className="text-lg font-semibold text-white">
                注意事項
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <p>
                  判定結果は最終判断ではありません。
                </p>

                <p>
                  見送る場合は辞退理由の入力が必須です。
                </p>

                <p>
                  進める場合、検討メモは案件側へ引き継がれます。
                </p>
              </div>
            </div>

            {isNotStarted && (
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                <h2 className="text-lg font-semibold text-white">
                  検討結果
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  AI判定を実行すると、検討結果の保存エリアが表示されます。
                </p>
              </div>
            )}

            {isCompleted && (
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                <h2 className="text-lg font-semibold text-white">
                  検討結果
                </h2>

                <div className="mt-5 grid gap-3">
                  <ReviewOption
                    label="進める"
                    description="申請準備へ進め、助成金案件として管理します。"
                    checked={selectedReviewResult === "APPLY_PREPARATION"}
                    onChange={() => setSelectedReviewResult("APPLY_PREPARATION")}
                  />

                  <ReviewOption
                    label="見送る"
                    description="今回は申請しない判断として、判定履歴へ保存します。"
                    checked={selectedReviewResult === "DECLINED"}
                    onChange={() => setSelectedReviewResult("DECLINED")}
                  />

                  <ReviewOption
                    label="保留する"
                    description="検討中として保存し、公募管理へ戻ります。"
                    checked={selectedReviewResult === "PENDING"}
                    onChange={() => setSelectedReviewResult("PENDING")}
                  />
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">
                    {reviewMemoLabel}
                  </span>

                  <textarea
                    value={reviewMemo}
                    onChange={(event) => setReviewMemo(event.target.value)}
                    rows={5}
                    placeholder={reviewMemoPlaceholder}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                  />
                </label>

                {selectedReviewResult === "DECLINED" &&
                  reviewMemo.trim() === "" && (
                    <p className="mt-2 text-sm text-amber-200">
                      見送る場合は辞退理由を入力してください。
                    </p>
                  )}

                <button
                  type="button"
                  onClick={handleSaveReview}
                  disabled={!canSaveReview}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300 disabled:shadow-none"
                >
                  <Save size={18} />
                  検討結果を保存
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

type WorkspaceCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

const WorkspaceCard = ({ icon, title, children }: WorkspaceCardProps) => {
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

type ResultListProps = {
  title: string;
  items: string[];
  markerClassName: string;
};

const ResultList = ({ title, items, markerClassName }: ResultListProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="mb-3 text-sm font-semibold text-white">
        {title}
      </p>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-6 text-slate-300"
          >
            <span
              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${markerClassName}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

type ReviewOptionProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

const ReviewOption = ({
  label,
  description,
  checked,
  onChange,
}: ReviewOptionProps) => {
  return (
    <label
      className={
        checked
          ? "cursor-pointer rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-4"
          : "cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/10"
      }
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="mt-1 h-4 w-4 accent-cyan-400"
        />

        <div>
          <p className="text-sm font-semibold text-white">
            {label}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </label>
  );
};