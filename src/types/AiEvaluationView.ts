import type {
  AiResult,
} from "./AiResult";

export type AiEvaluationView = {
  grantCaseId: number;
  evaluationHistoryId: number;
  result: AiResult;
  recommendationLevel: string;
  reason: string;
  evidence: string[];
  missingInfo: string[];
  additionalChecks: string[];
};