import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LucideIcon,
    Layers3,
} from "lucide-react";

export interface SidebarMenuItem {
    title: string;
    icon: LucideIcon | any;
    href?: string;
    children?: {
        title: string;
        href: string;
    }[];
}

export const sidebarMenu: SidebarMenuItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        title: "Quản lý tài khoản",
        icon: Users,
        href: "/admin/users",
    },
    {
        title: "Quản lý nhóm ngành",
        icon: Layers3,
        href: "/admin/industries",
    },
    {
        title: "Quản lý cổ phiếu",
        icon: Layers3,
        href: "/admin/stocks",
    },
    {
        title: "Reports",
        icon: FileText,
        href: "/admin/reports",
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/admin/settings",
    },
];
