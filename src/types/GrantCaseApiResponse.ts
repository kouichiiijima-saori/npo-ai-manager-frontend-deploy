import type {
    CaseStage,
} from "./CaseStage";

import type {
    ExaminationStatus,
} from "./ExaminationStatus";

import type {
    ExternalAuditStatus,
} from "./ExternalAuditStatus";

export type GrantCaseApiResponse = {
    id: number;
    organizationId: number;
    grantMasterId: number;
    caseName: string;
    caseStage: CaseStage;
    examinationStatus: ExaminationStatus;
    externalAuditStatus: ExternalAuditStatus;
    examinationMemo: string | null;
    nextAction: string | null;
    nextActionDueDate: string | null;
    archived: boolean;
    archivedAt: string | null;
    archiveReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};