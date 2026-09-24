import { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "./Sidebar";
{/** import { RightInformationPanel } from "./RightInformationPanel"; **/ }

export function AdminLayout() {
    const location = useLocation();
    const mainRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        mainRef.current?.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [location.key]);

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-950 text-neutral-100">
            {/* 左サイドバー */}
            <Sidebar />

            {/* メインコンテンツ */}
            <main
                ref={mainRef}
                className="flex-1 overflow-y-auto hide-scrollbar"
            >
                <Outlet />
            </main>

            {/* 右情報パネル */}
            {/* <RightInformationPanel /> */}
        </div>
    );
}
