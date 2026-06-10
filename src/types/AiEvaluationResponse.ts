export type AiEvaluationResponse = {
  grantCaseId: number;
  evaluationHistoryId: number;
  aiSuitability: string;
  aiRecommendationLevel: string;
  aiReason: string;
  aiEvidence: string;
  examinationStatus: string;
  externalAuditStatus: string;
};