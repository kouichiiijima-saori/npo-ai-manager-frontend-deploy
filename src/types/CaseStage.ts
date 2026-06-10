export type CaseStage =
    | "APPLY_PREPARATION"
    | "APPLIED"
    | "UNDER_REVIEW"
    | "APPLICATION_REVIEW"
    | "ADOPTED"
    | "IN_PROGRESS"
    | "INTERIM_REPORT"
    | "FINAL_REPORT"
    | "SETTLEMENT"
    | "COMPLETED";

export const normalizeCaseStage = (
    caseStage: CaseStage
): CaseStage => {
    if (
        caseStage === "APPLIED" ||
        caseStage === "UNDER_REVIEW"
    ) {
        return "APPLICATION_REVIEW";
    }

    return caseStage;
};