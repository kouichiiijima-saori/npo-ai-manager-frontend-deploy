import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    BarChart3,
    Building2,
    ClipboardList,
    FileText,
    FolderKanban,
    Gauge,
    LogOut,
    Settings,
} from "lucide-react";

type SidebarItem = {
    label: string;
    path: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    badge?: string;
};

type SidebarSection = {
    title: string;
    items: SidebarItem[];
};

const sections: SidebarSection[] = [
    {
        title: "概要",
        items: [
            {
                label: "ダッシュボード",
                path: "/admin/home",
                icon: Gauge,
            },
        ],
    },
    {
        title: "組織情報",
        items: [
            {
                label: "団体基本情報",
                path: "/admin/organization/profile",
                icon: Building2,
            },
            {
                label: "定款条文管理",
                path: "/admin/organization/articles",
                icon: FileText,
            },
            {
                label: "活動実績管理",
                path: "/admin/organization/projects",
                icon: BarChart3,
            },
        ],
    },
    {
        title: "助成金",
        items: [
            {
                label: "助成金管理",
                path: "/admin/grants",
                icon: ClipboardList,
            },
        ],
    },
    {
        title: "案件管理",
        items: [
            {
                label: "判定履歴",
                path: "/admin/evaluations/histories",
                icon: FileText,
            },
            {
                label: "助成金案件一覧",
                path: "/admin/grant-cases",
                icon: FolderKanban,
            },
        ],
    },
];

const SidebarNavItem = ({ item }: { item: SidebarItem }) => {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                [
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                    isActive
                        ? "bg-neutral-800 text-white ring-1 ring-white/20"
                        : "text-neutral-300 hover:bg-neutral-900 hover:text-white",
                ].join(" ")
            }
        >
            <div className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-white" />
                <span className="truncate font-medium">{item.label}</span>
            </div>

            {item.badge && (
                <span className="ml-2 rounded-full bg-neutral-700 px-2 py-0.5 text-xs text-neutral-200">
                    {item.badge}
                </span>
            )}
        </NavLink>
    );
};

export function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 text-neutral-100">
            <div className="px-5 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 ring-1 ring-white/10">
                        <Building2 className="h-5 w-5 text-neutral-200" />
                    </div>

                    <div className="min-w-0">
                        <div className="truncate text-sm font-bold">
                            NPO運営AIマネージャー
                        </div>
                        <div className="mt-0.5 truncate text-xs text-neutral-500">
                            助成金活用支援システム
                        </div>
                    </div>
                </div>
            </div>

            <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
                {sections.map((section) => (
                    <div key={section.title}>
                        <div className="mb-2 px-3 text-xs font-semibold text-neutral-500">
                            {section.title}
                        </div>

                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <SidebarNavItem key={item.path} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="shrink-0 border-t border-neutral-800 px-3 py-4">
                <div className="space-y-1">
                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) =>
                            [
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                                isActive
                                    ? "bg-neutral-800 text-white ring-1 ring-white/20"
                                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white",
                            ].join(" ")
                        }
                    >
                        <Settings className="h-4 w-4 text-neutral-400" />
                        <span className="font-medium">設定</span>
                    </NavLink>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
                    >
                        <LogOut className="h-4 w-4 text-neutral-400" />
                        <span className="font-medium">ログアウト</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}