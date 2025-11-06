import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LucideIcon,
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
        title: "Quản lí tài khoản",
        icon: Users,
        href: "/admin/users",
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
