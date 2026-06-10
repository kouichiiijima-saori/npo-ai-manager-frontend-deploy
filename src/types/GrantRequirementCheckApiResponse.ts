export type GrantRequirementCheckApiResponse = {
    id: number;
    grantCaseId: number;
    requirementName: string;
    targetFileName: string | null;
    checkStatus: string;
    checkMemo: string | null;
    archived: boolean;
    archivedAt: string | null;
    archiveReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};