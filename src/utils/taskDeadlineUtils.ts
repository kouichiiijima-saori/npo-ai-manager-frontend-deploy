export type TaskDeadlineStatus =
    | "OVERDUE"
    | "DUE_SOON"
    | "NORMAL";

export const getTaskDeadlineStatus = (
    date: string,
    now: Date = new Date()
): TaskDeadlineStatus => {
    if (!date) {
        return "NORMAL";
    }

    const today = new Date(now);
    const dueDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(dueDate.getTime())) {
        return "NORMAL";
    }

    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return "OVERDUE";
    }

    if (diffDays <= 7) {
        return "DUE_SOON";
    }

    return "NORMAL";
};
