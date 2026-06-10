import type {
    DeadlineStatus,
} from "./DeadlineStatus";

import type {
    CaseStatus,
} from "./CaseStatus";

export type GrantProgram = {
    id: number;
    name: string;
    provider: string;
    amount: string;
    deadline: string;
    deadlineStatus: DeadlineStatus;
    summary: string;
    target: string;
    url?: string;
    memo?: string;
    tags: string[];
    isArchived: boolean;
    caseStatus: CaseStatus;
    unreviewedHistoryId?: number;
};