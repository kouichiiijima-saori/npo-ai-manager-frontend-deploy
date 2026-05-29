import React from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  FileText,
  Activity,
  LayoutDashboard,
  Settings,
  BrainCircuit,
  Send,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "../../utils/cn";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  badge?: string;
}

function NavItem({
  icon: Icon,
  label,
  to,
  isActive,
  badge,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-neutral-800 text-neutral-100"
            : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-100"
        )
      }
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-4 w-4",
            isActive
              ? "text-neutral-100"
              : "text-neutral-500 group-hover:text-neutral-400"
          )}
        />
        <span>{label}</span>
      </div>

      {badge && (
        <span className="flex h-5 items-center rounded-full bg-neutral-800 px-2 text-[10px] font-medium text-neutral-400 group-hover:bg-neutral-700 group-hover:text-neutral-300">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <div className="flex w-64 flex-col border-r border-neutral-800 bg-neutral-950 px-3 py-4">
      <div className="mb-6 flex items-center gap-2 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800">
          <Building2 className="h-4 w-4 text-neutral-100" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-100">
            NPO運営AIマネージャー
          </span>
          <span className="text-[10px] text-neutral-500">
            助成金応募意思決定OS
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">

        {/* OVERVIEW */}
        <div className="mb-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            OVERVIEW
          </p>

          <NavItem
            icon={LayoutDashboard}
            label="ダッシュボード"
            to="/admin/home"
          />
        </div>

        {/* 組織知管理 */}
        <div className="mb-4 space-y-1">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            ORGANIZATION KNOWLEDGE
          </p>

          <NavItem
            icon={Building2}
            label="団体基本情報"
            to="/admin/organization/profile"
          />

          <NavItem
            icon={FileText}
            label="定款条文管理"
            to="/admin/organization/articles"
          />

          <NavItem
            icon={Activity}
            label="活動実績管理"
            to="/admin/organization/projects"
          />
        </div>

        {/* 助成金管理 */}
        <div className="mb-4 space-y-1">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            GRANTS
          </p>

          <NavItem
            icon={FileText}
            label="助成金一覧"
            to="/admin/grants"
          />

          <NavItem
            icon={BrainCircuit}
            label="AI判定ワークスペース"
            to="/admin/evaluations/workspace"
          />
        </div>

        {/* 意思決定管理 */}
        <div className="mb-4 space-y-1">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            GOVERNANCE
          </p>

          <NavItem
            icon={Send}
            label="応募意思決定履歴"
            to="/admin/evaluations/histories"
            badge="3"
          />

          <NavItem
            icon={ClipboardCheck}
            label="応募結果管理"
            to="/admin/evaluations/results"
          />
        </div>

      </nav>
      <div className="mt-auto border-t border-neutral-800 pt-4">
        <NavItem icon={Settings} label="設定" to="/admin/settings" />
      </div>
    </div>
  );
}