export type ActivityRecord = {
    id: number;
    organizationId: number;
    fiscalYear: number;
    projectName: string;
    content: string;
    result: string;
    reportFileName: string | null;
    createdAt?: string;
    updatedAt?: string;
};