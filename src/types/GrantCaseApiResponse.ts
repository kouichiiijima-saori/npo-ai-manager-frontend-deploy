import type {
    CaseStage,
} from "./CaseStage";

export type GrantCaseApiResponse = {
    id: number;
    organizationId: number;
    grantMasterId: number;
    caseName: string;
    caseStage: CaseStage;
    examinationStatus: string;
    externalAuditStatus: string;
    examinationMemo: string | null;
    nextAction: string | null;
    nextActionDueDate: string | null;
    archived: boolean;
    archivedAt: string | null;
    archiveReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};