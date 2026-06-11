import { useEffect, useState } from "react";

import {
    getCharterArticles,
    createCharterArticle,
    updateCharterArticle,
    deleteCharterArticle,
} from "../api/charterArticleApi";

import type {
    CharterArticle,
} from "../types/CharterArticle";

export const useCharterArticles = () => {
    const [articles, setArticles] = useState<CharterArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchArticles = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const data = await getCharterArticles() as CharterArticle[];

            setArticles(
                data.sort((a, b) => a.articleNumber - b.articleNumber)
            );
        } catch {
            setErrorMessage(
                "定款条文の取得に失敗しました。Spring Bootが起動しているか確認してください。"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const addArticle = async (article: CharterArticle) => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            const createdArticle =
                await createCharterArticle(article) as CharterArticle;

            setArticles((currentArticles) =>
                [...currentArticles, createdArticle].sort(
                    (a, b) => a.articleNumber - b.articleNumber
                )
            );

            return createdArticle;
        } catch {
            setErrorMessage(
                "定款条文の保存に失敗しました。条番号の重複やAPI接続を確認してください。"
            );

            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const editArticle = async (article: CharterArticle) => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            const updatedArticle =
                await updateCharterArticle(
                    article.id,
                    article
                ) as CharterArticle;

            setArticles((currentArticles) =>
                currentArticles
                    .map((currentArticle) =>
                        currentArticle.id === updatedArticle.id
                            ? updatedArticle
                            : currentArticle
                    )
                    .sort((a, b) => a.articleNumber - b.articleNumber)
            );

            return updatedArticle;
        } catch {
            setErrorMessage(
                "定款条文の保存に失敗しました。条番号の重複やAPI接続を確認してください。"
            );

            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const removeArticle = async (articleId: number) => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            await deleteCharterArticle(articleId);

            const nextArticles = articles.filter(
                (article) => article.id !== articleId
            );

            setArticles(nextArticles);

            return nextArticles;
        } catch {
            setErrorMessage(
                "定款条文の削除に失敗しました。API接続を確認してください。"
            );

            return null;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return {
        articles,
        isLoading,
        isSaving,
        errorMessage,
        setErrorMessage,
        fetchArticles,
        addArticle,
        editArticle,
        removeArticle,
    };
};