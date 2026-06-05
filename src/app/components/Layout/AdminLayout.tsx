import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";
{/** import { RightInformationPanel } from "./RightInformationPanel"; **/ }

export function AdminLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-neutral-950 text-neutral-100">
            {/* 左サイドバー */}
            <Sidebar />

            {/* メインコンテンツ */}
            <main className="flex-1 overflow-y-auto hide-scrollbar">
                <Outlet />
            </main>

            {/* 右情報パネル */}
            {/* <RightInformationPanel /> */}
        </div>
    );
}