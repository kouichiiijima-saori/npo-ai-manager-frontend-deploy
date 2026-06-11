import type {
    AiResult,
} from "../types/AiResult";

export const normalizeAiResult = (
    value: string
): AiResult => {
    if (
        value === "MATCH"
        || value === "SUITABLE"
    ) {
        return "MATCH";
    }

    if (
        value === "NOT_MATCH"
        || value === "UNSUITABLE"
    ) {
        return "NOT_MATCH";
    }

    return "CHECK_REQUIRED";
};

export const splitTextToList = (
    value: string | null | undefined
): string[] => {
    if (!value || value.trim() === "") {
        return [
            "根拠情報はまだ登録されていません。",
        ];
    }

    return value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item !== "");
};