import type {
    CaseStage,
} from "./CaseStage";

export type GrantCaseView = {
    id: number;
    caseName: string;
    grantName: string;
    provider: string;
    stage: CaseStage;
    deadline: string;
    nextAction: string;
    nextActionDueDate: string;
    reviewMemo: string;
    updatedAt: string;
    archived: boolean;
    archiveReason: string | null;
};