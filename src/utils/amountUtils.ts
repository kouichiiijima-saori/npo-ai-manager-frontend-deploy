export const formatGrantAmount = (
    amount: number | null | undefined
): string => {
    if (amount === null || amount === undefined) {
        return "上限額未設定";
    }

    if (amount >= 10000 && amount % 10000 === 0) {
        return `上限 ${amount / 10000}万円`;
    }

    return `上限 ${amount.toLocaleString()}円`;
};