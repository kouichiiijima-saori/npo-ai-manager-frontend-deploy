import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
  SearchCheck,
  Sparkles,
} from "lucide-react";

type EvaluationState = "NOT_STARTED" | "RUNNING" | "COMPLETED";
type AiResult = "MATCH" | "CHECK_REQUIRED" | "NOT_MATCH";
type ReviewResult = "" | "APPLY_PREPARATION" | "DECLINED" | "PENDING";

type GrantMasterApiResponse = {
  id: number;
  fiscalYear: number;
  title: string;
  provider: string;
  applicationStartDate: string | null;
  applicationDeadline: string | null;
  maxGrantAmount: number | null;
  summary: string;
  targetTheme: string | null;
  targetProject: string | null;
  targetOrganization: string | null;
  targetArea: string | null;
  requiredDocuments: string | null;
  officialUrl: string | null;
  officialPdfName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type GrantView = {
  id: number;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  summary: string;
};

type AiEvaluationResponse = {
  grantCaseId: number;
  evaluationHistoryId: number;
  aiSuitability: string;
  aiRecommendationLevel: string;
  aiReason: string;
  aiEvidence: string;
  examinationStatus: string;
  externalAuditStatus: string;
};

type AiEvaluationView = {
  grantCaseId: number;
  evaluationHistoryId: number;
  result: AiResult;
  recommendationLevel: string;
  reason: string;
  evidence: string[];
  missingInfo: string[];
  additionalChecks: string[];
};

const API_BASE_URL = "http://localhost:8080";
const ORGANIZATION_ID = 1;

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

const formatGrantAmount = (amount: number | null): string => {
  if (amount === null) {
    return "上限額未設定";
  }

  if (amount >= 10000 && amount % 10000 === 0) {
    return `上限 ${amount / 10000}万円`;
  }

  return `上限 ${amount.toLocaleString()}円`;
};

const convertGrantMasterToGrantView = (
  grantMaster: GrantMasterApiResponse
): GrantView => {
  return {
    id: grantMaster.id,
    name: grantMaster.title,
    provider: grantMaster.provider,
    amount: formatGrantAmount(grantMaster.maxGrantAmount),
    deadline: grantMaster.applicationDeadline ?? "締切未設定",
    summary: grantMaster.summary,
  };
};

const normalizeAiResult = (value: string): AiResult => {
  if (value === "MATCH") {
    return "MATCH";
  }

  if (value === "NOT_MATCH") {
    return "NOT_MATCH";
  }

  return "CHECK_REQUIRED";
};

const splitTextToList = (value: string | null | undefined): string[] => {
  if (!value || value.trim() === "") {
    return ["根拠情報はまだ登録されていません。"];
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

const getExaminationStatusLabel = (status: string): string => {
  switch (status) {
    case "UNCONFIRMED":
      return "未確認";

    case "UNDER_REVIEW":
      return "確認中";

    case "SKIPPED":
      return "見送り";

    default:
      return status;
  }
};

const getExternalAuditStatusLabel = (status: string): string => {
  switch (status) {
    case "NO_RESPONSE":
      return "未回答";

    case "UNDER_AUDIT":
      return "審査中";

    case "ADOPTED":
      return "採択";

    case "REJECTED":
      return "不採択";

    default:
      return status;
  }
};

const convertAiResponseToView = (
  response: AiEvaluationResponse
): AiEvaluationView => {
  return {
    grantCaseId: response.grantCaseId,
    evaluationHistoryId: response.evaluationHistoryId,
    result: normalizeAiResult(response.aiSuitability),
    recommendationLevel: response.aiRecommendationLevel,
    reason: response.aiReason,
    evidence: splitTextToList(response.aiEvidence),
    missingInfo: [
      `書類チェック状況：${getExaminationStatusLabel(response.examinationStatus)}`,
      `外部審査状況：${getExternalAuditStatusLabel(response.externalAuditStatus)}`,
    ],
    additionalChecks: [
      "募集要項の最新PDFを確認する",
      "申請に必要な添付書類を確認する",
      "対象経費と活動内容の整合性を確認する",
    ],
  };
};

export function PGA07AiWorkspacePage() {
  const navigate = useNavigate();
  const { grantMasterId } = useParams<{ grantMasterId: string }>();

  const [grant, setGrant] = useState<GrantView | null>(null);
  const [isLoadingGrant, setIsLoadingGrant] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [evaluationState, setEvaluationState] =
    useState<EvaluationState>("NOT_STARTED");
  const [aiEvaluation, setAiEvaluation] =
    useState<AiEvaluationView | null>(null);

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

  useEffect(() => {
    const fetchGrantMaster = async () => {
      if (!grantMasterId) {
        setErrorMessage("助成金IDが指定されていません。");
        setIsLoadingGrant(false);
        return;
      }

      try {
        setIsLoadingGrant(true);
        setErrorMessage("");

        const response = await fetch(
          `${API_BASE_URL}/api/grant-masters/${grantMasterId}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("助成金公募詳細APIエラー:", errorText);
          throw new Error("助成金公募詳細の取得に失敗しました。");
        }

        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text();
          console.error("JSONではないレスポンス:", responseText);
          throw new Error("助成金公募詳細APIがJSONを返していません。");
        }

        const data: GrantMasterApiResponse = await response.json();
        setGrant(convertGrantMasterToGrantView(data));
      } catch (error) {
        console.error(error);
        setErrorMessage("助成金公募詳細の取得に失敗しました。");
      } finally {
        setIsLoadingGrant(false);
      }
    };

    fetchGrantMaster();
  }, [grantMasterId]);

  const handleRunEvaluation = async () => {
    if (!grant) {
      return;
    }

    try {
      setEvaluationState("RUNNING");
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/api/ai-evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: ORGANIZATION_ID,
          grantMasterId: grant.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI判定APIエラー:", errorText);
        throw new Error("AI判定の実行に失敗しました。");
      }

      const responseData: AiEvaluationResponse = await response.json();
      const convertedEvaluation = convertAiResponseToView(responseData);

      setAiEvaluation(convertedEvaluation);
      setEvaluationState("COMPLETED");

      navigate(`/evaluation-histories/${responseData.evaluationHistoryId}`);

    } catch (error) {
      console.error(error);
      setEvaluationState("NOT_STARTED");
      setErrorMessage("AI判定の実行に失敗しました。");
    }
  };

  const handleGoToGrantCaseDetail = () => {
    if (!aiEvaluation) {
      return;
    }

    navigate(`/grant-cases/${aiEvaluation.grantCaseId}`);
  };

  const handleBackToGrantList = () => {
    if (isRunning) {
      alert("AI判定中は画面を移動できません。");
      return;
    }

    navigate("/admin/grants");
  };

  const handleSaveReview = () => {
    if (!canSaveReview || !aiEvaluation) {
      return;
    }

    if (selectedReviewResult === "APPLY_PREPARATION") {
      alert("検討結果を保存しました。助成金案件詳細へ移動します。");
      navigate(`/grant-cases/${aiEvaluation.grantCaseId}`);
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

        {isLoadingGrant && (
          <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300 backdrop-blur">
            助成金公募情報を読み込み中です。
          </section>
        )}

        {errorMessage && (
          <section className="mb-6 flex items-start gap-3 rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-200 backdrop-blur">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <p>{errorMessage}</p>
          </section>
        )}

        {!isLoadingGrant && grant && (
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
                      判定が完了すると、助成金案件が作成され、案件詳細画面へ移動します。
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
                    AI判定が完了しました。助成金案件詳細へ移動します。
                  </div>
                )}
              </WorkspaceCard>

              {isCompleted && aiEvaluation && (
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
                      <p className="mb-3 text-sm font-semibold text-white">
                        推奨度
                      </p>

                      <p className="text-sm leading-7 text-slate-300">
                        {aiEvaluation.recommendationLevel}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <p className="mb-3 text-sm font-semibold text-white">
                        判定理由
                      </p>

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
                      title="不足情報・状態"
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
                    AIは参考情報を提示し、最終判断は担当者が確認します。
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
                    判定完了後、助成金案件詳細画面で検討状況を管理します。
                  </p>

                  <p>
                    必要な確認事項は案件側で引き続き管理します。
                  </p>
                </div>
              </div>

              {isNotStarted && (
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                  <h2 className="text-lg font-semibold text-white">
                    検討結果
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    AI判定を実行すると、助成金案件が作成されます。
                    検討結果の保存・更新は案件詳細画面で行います。
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
        )}
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