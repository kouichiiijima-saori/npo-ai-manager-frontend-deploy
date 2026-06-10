export type CharterArticle = {
    id: number;
    organizationId: number;
    articleNumber: number;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
};