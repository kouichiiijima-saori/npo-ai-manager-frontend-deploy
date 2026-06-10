import { api } from "./axios";

export const getCharterArticles = async () => {
    const { data } = await api.get(
        "/api/charter-articles"
    );

    return data;
};

export const createCharterArticle = async (
    requestBody: any
) => {
    const { data } = await api.post(
        "/api/charter-articles",
        requestBody
    );

    return data;
};

export const updateCharterArticle = async (
    id: number,
    requestBody: any
) => {

    const { data } = await api.put(
        `/api/charter-articles/${id}`,
        requestBody
    );

    return data;
};

export const deleteCharterArticle = async (
    id: number
) => {
    await api.delete(
        `/api/charter-articles/${id}`
    );
};