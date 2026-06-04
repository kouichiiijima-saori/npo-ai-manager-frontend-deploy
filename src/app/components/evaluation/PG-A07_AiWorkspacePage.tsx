import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Lightbulb,
  Loader2,
  Save,
  Sparkles,
  XCircle,
} from "lucide-react";

type RequirementStatus = "適合" | "要確認" | "未確認" | "不足";
type AiOverallStatus = "適合" | "要確認" | "不適合";
type DecisionType = "APPLY_PREPARATION" | "DECLINE" | "";

type RequirementCheck = {
  id: number;
  requirementText: string;
  status: RequirementStatus;
  evidenceText: string;
  missingText?: string;
  confirmationNote?: string;
};

const grant = {
  name: "地域コミュニティ活動支援助成金",
  organization: "公益財団法人 サンプル財団",
  category: "地域福祉",
  amount: "上限 500,000円",
  deadline: "2026/06/20",
  description:
    "地域住民の交流、居場所づくり、子ども支援活動を対象とする助成金。",
};

const requirementChecks: RequirementCheck[] = [
  {
    id: 1,
    requirementText: "対象法人格に該当すること",
    status: "適合",
    evidenceText:
      "団体基本情報：法人格区分が募集対象に含まれる団体として確認できます。",
  },
  {
    id: 2,
    requirementText: "埼玉県内で活動していること",
    status: "適合",
    evidenceText:
      "団体基本情報：所在地が埼玉県比企郡鳩山町として登録されています。",
  },
  {
    id: 3,
    requirementText: "地域福祉活動の実績があること",
    status: "適合",
    evidenceText:
      "活動実績：2025年度 子ども食堂事業、農業体験・地域交流事業が登録されています。",
  },
  {
    id: 4,
    requirementText: "直近の決算書を提出できること",
    status: "要確認",
    evidenceText:
      "団体基本情報・定款・活動実績だけでは、決算書の提出可否までは確認できません。",
    missingText:
      "決算書・収支計算書・活動計算書などの提出可否を手動確認してください。",
    confirmationNote:
      "将来、提出資料管理機能で確認対象に追加する候補です。",
  },
  {
    id: 5,
    requirementText: "対象経費が募集要項の範囲内であること",
    status: "未確認",
    evidenceText:
      "申請予定事業の経費内訳が未登録のため、現在の情報だけでは判定できません。",
    missingText: "対象経費、対象外経費、自己負担額の確認が必要です。",
  },
];

function getRequirementBadge(status: RequirementStatus) {
  switch (status) {
    case "適合":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
    case "要確認":
      return "border-amber-400/40 bg-amber-400/10 text-amber-300";
    case "不足":
      return "border-rose-400/40 bg-rose-400/10 text-rose-300";
    default:
      return "border-slate-600 bg-slate-800 text-slate-300";
  }
}

function getRequirementIcon(status: RequirementStatus) {
  switch (status) {
    case "適合":
      return <CheckCircle2 size={20} />;
    case "要確認":
      return <AlertTriangle size={20} />;
    case "不足":
      return <XCircle size={20} />;
    default:
      return <HelpCircle size={20} />;
  }
}

function getDecisionButtonClass(decision: DecisionType, canConfirmDecision: boolean) {
  if (!canConfirmDecision) {
    return "cursor-not-allowed bg-slate-700 text-slate-400";
  }

  if (decision === "APPLY_PREPARATION") {
    return "bg-emerald-500 text-white hover:bg-emerald-400";
  }

  if (decision === "DECLINE") {
    return "bg-rose-500 text-white hover:bg-rose-400";
  }

  return "cursor-not-allowed bg-slate-700 text-slate-400";
}

function getDecisionButtonLabel(decision: DecisionType) {
  if (decision === "APPLY_PREPARATION") {
    return "申請準備へ進む";
  }

  if (decision === "DECLINE") {
    return "辞退する";
  }

  return "判断を選択してください";
}

export function PGA07AiWorkspacePage() {
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [decision, setDecision] = useState<DecisionType>("");
  const [reviewMemo, setReviewMemo] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  const summary = useMemo(() => {
    const suitable = requirementChecks.filter(
      (item) => item.status === "適合",
    ).length;
    const reviewNeeded = requirementChecks.filter(
      (item) => item.status === "要確認",
    ).length;
    const unconfirmed = requirementChecks.filter(
      (item) => item.status === "未確認",
    ).length;
    const insufficient = requirementChecks.filter(
      (item) => item.status === "不足",
    ).length;

    return {
      suitable,
      reviewNeeded,
      unconfirmed,
      insufficient,
      total: requirementChecks.length,
    };
  }, []);

  const overallStatus: AiOverallStatus =
    summary.insufficient > 0
      ? "不適合"
      : summary.reviewNeeded > 0 || summary.unconfirmed > 0
        ? "要確認"
        : "適合";

  const canSaveEvaluation = isEvaluated;

  const canConfirmDecision =
    isEvaluated &&
    (decision === "APPLY_PREPARATION" ||
      (decision === "DECLINE" && declineReason.trim().length > 0));

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    window.setTimeout(() => {
      setIsAnalyzing(false);
      setIsEvaluated(true);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <header className="border-b border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-violet-500/10 p-4 text-violet-300">
            <Bot size={28} />
          </div>

          <div>
            <p className="text-sm text-violet-300">PG-A07</p>
            <h1 className="text-3xl font-bold text-white">
              AI判定ワークスペース
            </h1>
          </div>
        </div>

        <p className="mt-6 max-w-4xl leading-8 text-sky-100">
          助成金募集要件と団体情報・定款・活動実績を照合し、
          応募準備へ進むか辞退するかを判断する画面です。
          AIは根拠と確認事項を提示し、最終判断は担当者が行います。
        </p>
      </header>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-7">
        <div className="mb-5 flex items-center gap-3">
          <FileText className="text-sky-300" size={24} />
          <h2 className="text-xl font-bold text-white">
            助成金基本情報
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-sm text-slate-400">助成金名</p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {grant.name}
            </h3>
            <p className="mt-3 leading-7 text-sky-100">
              {grant.description}
            </p>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <div>
              <p className="text-sm text-slate-400">提供団体</p>
              <p className="mt-1 font-semibold text-white">
                {grant.organization}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">分野</p>
                <p className="mt-1 font-semibold text-white">
                  {grant.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">締切</p>
                <p className="mt-1 font-semibold text-amber-300">
                  {grant.deadline}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">助成額</p>
              <p className="mt-1 font-semibold text-white">
                {grant.amount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-7">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <ClipboardCheck
                className="text-emerald-300"
                size={24}
              />
              <h2 className="text-xl font-bold text-white">
                募集要件チェック
              </h2>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              募集ごとに異なる要件を、登録済みの団体情報・定款・活動実績と照合します。
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-6 py-3 font-semibold text-white hover:bg-violet-400 disabled:cursor-wait disabled:bg-slate-700 disabled:text-slate-300"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                AI判定中
              </>
            ) : (
              <>
                <Sparkles size={18} />
                AI判定を実行
              </>
            )}
          </button>
        </div>

        {isAnalyzing && (
          <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 p-8 text-center">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-violet-300"
            />
            <p className="mt-4 text-lg font-semibold text-white">
              AIが募集要件と団体情報を照合しています
            </p>
            <p className="mt-2 text-sm text-violet-100">
              団体基本情報・定款・活動実績をもとに、要件ごとの根拠を確認しています。
            </p>
          </div>
        )}

        {!isAnalyzing && !isEvaluated && (
          <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-8 text-center">
            <p className="text-lg font-semibold text-white">
              AI判定はまだ実行されていません
            </p>
            <p className="mt-2 text-sm text-slate-400">
              募集要件と団体情報を照合するには、AI判定を実行してください。
            </p>
          </div>
        )}

        {!isAnalyzing && isEvaluated && (
          <div className="space-y-4">
            {requirementChecks.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`mt-1 rounded-xl border p-2 ${getRequirementBadge(
                        item.status,
                      )}`}
                    >
                      {getRequirementIcon(item.status)}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {item.requirementText}
                      </h3>

                      <p className="mt-3 leading-7 text-sky-100">
                        根拠：{item.evidenceText}
                      </p>

                      {item.missingText && (
                        <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                          不足・確認事項：
                          {item.missingText}
                        </p>
                      )}

                      {item.confirmationNote && (
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          補足：
                          {item.confirmationNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-1 text-sm ${getRequirementBadge(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isEvaluated && (
        <>
          <section className="grid gap-6 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
              <p className="text-sm text-emerald-300">適合</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {summary.suitable}件
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6">
              <p className="text-sm text-amber-300">要確認</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {summary.reviewNeeded}件
              </p>
            </div>

            <div className="rounded-2xl border border-slate-600 bg-slate-800/70 p-6">
              <p className="text-sm text-slate-300">未確認</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {summary.unconfirmed}件
              </p>
            </div>

            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6">
              <p className="text-sm text-rose-300">不足</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {summary.insufficient}件
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-7">
            <div className="mb-5 flex items-center gap-3">
              <Lightbulb className="text-amber-300" size={24} />
              <h2 className="text-xl font-bold text-white">
                AI判定結果
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <div className="rounded-2xl border border-violet-400/40 bg-violet-400/10 p-6">
                <p className="text-sm text-violet-300">
                  総合評価
                </p>

                <p className="mt-3 text-3xl font-bold text-white">
                  {overallStatus}
                </p>

                <p className="mt-3 text-sm leading-6 text-violet-100">
                  {summary.total}項目中、
                  {summary.suitable}項目が適合しています。
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
                  <h3 className="font-bold text-white">
                    判定理由
                  </h3>

                  <p className="mt-3 leading-7 text-sky-100">
                    団体基本情報・定款・活動実績から、地域福祉活動との関連性は確認できます。
                    一方で、決算書や対象経費など、組織情報だけでは確認できない項目については担当者確認が必要です。
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
                  <h3 className="font-bold text-white">
                    追加確認事項
                  </h3>

                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-sky-100">
                    <li>
                      直近決算書を提出できるか確認してください。
                    </li>
                    <li>
                      対象経費が募集要項の範囲内か確認してください。
                    </li>
                    <li>
                      申請予定事業の予算・実施体制を確認してください。
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section
        className={`rounded-2xl border border-slate-700 bg-slate-900/70 p-7 ${!isEvaluated ? "pointer-events-none opacity-50" : ""
          }`}
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            担当者判断
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            AI判定結果を参考に、判定結果の保存、申請準備、辞退のいずれかを選択します。
          </p>
        </div>

        {!isEvaluated && (
          <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
            AI判定を実行すると、担当者判断を入力できるようになります。
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-300">
              検討メモ
            </label>

            <textarea
              value={reviewMemo}
              onChange={(event) =>
                setReviewMemo(event.target.value)
              }
              rows={5}
              placeholder="確認した内容、判断理由、次に確認すべき事項などを記録します。"
              className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 p-5 leading-7 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <button
              type="button"
              onClick={() => setDecision("APPLY_PREPARATION")}
              className={`rounded-2xl border p-6 text-left ${decision === "APPLY_PREPARATION"
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-slate-700 bg-slate-950/60 hover:bg-slate-800"
                }`}
            >
              <div className="flex items-center gap-3 text-emerald-300">
                <CheckCircle2 size={22} />
                <span className="font-bold">
                  申請準備へ進む
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                判定結果を保存し、助成金案件詳細で申請準備案件として管理します。
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDecision("DECLINE")}
              className={`rounded-2xl border p-6 text-left ${decision === "DECLINE"
                ? "border-rose-400 bg-rose-400/10"
                : "border-slate-700 bg-slate-950/60 hover:bg-slate-800"
                }`}
            >
              <div className="flex items-center gap-3 text-rose-300">
                <XCircle size={22} />
                <span className="font-bold">辞退する</span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                判定結果と辞退理由を、AI判定・検討履歴に保存します。
              </p>
            </button>
          </div>

          {decision === "DECLINE" && (
            <div>
              <label className="text-sm font-semibold text-slate-300">
                辞退理由
              </label>

              <textarea
                value={declineReason}
                onChange={(event) =>
                  setDeclineReason(event.target.value)
                }
                rows={4}
                placeholder="辞退理由を入力してください。例：対象経費が合わない、人的リソース不足、提出資料が不足している等"
                className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 p-5 leading-7 text-white outline-none placeholder:text-slate-500 focus:border-rose-400"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-4 border-t border-slate-800 pt-6">
            <button
              type="button"
              disabled={!canSaveEvaluation}
              className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold ${canSaveEvaluation
                ? "border border-slate-600 text-slate-200 hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-700 text-slate-400"
                }`}
            >
              <Save size={18} />
              判定結果を保存
            </button>

            <button
              type="button"
              disabled={!canConfirmDecision}
              className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold ${getDecisionButtonClass(
                decision,
                canConfirmDecision,
              )}`}
            >
              <Save size={18} />
              {getDecisionButtonLabel(decision)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}