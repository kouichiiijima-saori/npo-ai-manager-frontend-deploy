import { api } from "./axios";

export const getCharterArticles = async () => {
    const { data } = await api.get(
        "/charter-articles"
    );

    return data;
};

export const createCharterArticle = async (
    requestBody: any
) => {
    const { data } = await api.post(
        "/charter-articles",
        requestBody
    );

    return data;
};

export const updateCharterArticle = async (
    id: number,
    requestBody: any
) => {
    await api.put(
        `/charter-articles/${id}`,
        requestBody
    );
};

export const deleteCharterArticle = async (
    id: number
) => {
    await api.delete(
        `/charter-articles/${id}`
    );
};
