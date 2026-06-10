import type {
  AiEvaluationResult,
} from "./AiEvaluationResult";

export type EvaluationHistoryView = {
  id: number;
  historyCode: string;
  grantCaseId: number;
  grantName: string;
  provider: string;
  evaluatedAt: string;
  fiscalYear: string;
  evaluatorName: string;
  aiResult: AiEvaluationResult;
  recommendationLevel: string;
  aiReason: string;
  aiEvidence: string;
  reviewStatus: string;
  reviewMemo: string;
  reviewedAt: string;
};