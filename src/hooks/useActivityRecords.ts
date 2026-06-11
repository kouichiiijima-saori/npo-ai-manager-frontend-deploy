import { useEffect, useState } from "react";

import {
    getActivityRecords,
    createActivityRecord,
    updateActivityRecord,
    deleteActivityRecord,
} from "../api/activityRecordApi";

import type {
    ActivityRecord,
} from "../types/ActivityRecord";

const sortActivityRecords = (records: ActivityRecord[]) => {
    return [...records].sort(
        (a, b) =>
            b.fiscalYear - a.fiscalYear ||
            a.projectName.localeCompare(b.projectName)
    );
};

export const useActivityRecords = () => {
    const [records, setRecords] = useState<ActivityRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchActivityRecords = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const data = await getActivityRecords() as ActivityRecord[];

            setRecords(sortActivityRecords(data));
        } catch {
            setErrorMessage(
                "活動実績の取得に失敗しました。Spring Bootが起動しているか確認してください。"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const addActivityRecord = async (record: ActivityRecord) => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            const createdRecord =
                await createActivityRecord(record) as ActivityRecord;

            setRecords((currentRecords) =>
                sortActivityRecords([
                    ...currentRecords,
                    createdRecord,
                ])
            );

            return createdRecord;
        } catch {
            setErrorMessage(
                "活動実績の保存に失敗しました。年度と事業名の重複、またはAPI接続を確認してください。"
            );

            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const editActivityRecord = async (record: ActivityRecord) => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            const updatedRecord =
                await updateActivityRecord(
                    record.id,
                    record
                ) as ActivityRecord;

            setRecords((currentRecords) =>
                sortActivityRecords(
                    currentRecords.map((currentRecord) =>
                        currentRecord.id === updatedRecord.id
                            ? updatedRecord
                            : currentRecord
                    )
                )
            );

            return updatedRecord;
        } catch {
            setErrorMessage(
                "活動実績の保存に失敗しました。年度と事業名の重複、またはAPI接続を確認してください。"
            );

            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const removeActivityRecord = async (recordId: number) => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            await deleteActivityRecord(recordId);

            const nextRecords = records.filter(
                (record) => record.id !== recordId
            );

            setRecords(nextRecords);

            return nextRecords;
        } catch {
            setErrorMessage(
                "活動実績の削除に失敗しました。API接続を確認してください。"
            );

            return null;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchActivityRecords();
    }, []);

    return {
        records,
        isLoading,
        isSaving,
        errorMessage,
        setErrorMessage,
        fetchActivityRecords,
        addActivityRecord,
        editActivityRecord,
        removeActivityRecord,
    };
};