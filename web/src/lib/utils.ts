import { Role } from "@/share/enum";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function renderWithEmbed(html: string) {
    if (!html) return "";

    // Xoá các phần text "Tài liệu đính kèm"
    html = html
        .replace(/<hr[^>]*>/gi, "")
        .replace(/<br\s*\/?>/gi, "")
        .replace(/<[^>]*>\s*Tài liệu đính kèm\s*<\/[^>]*>/gi, "");

    return html; // Giữ lại nội dung text thuần
}


export function canAccess(user: any, requiredRole: Role): boolean {
    if (!user) return requiredRole === Role.Guest;

    const role = user.role as Role;

    // Admin được vào tất cả
    if (role === Role.Admin) return true;

    // Premium được vào Premium, User, Guest
    if (role === Role.Premium) {
        return (
            requiredRole === Role.Premium ||
            requiredRole === Role.User ||
            requiredRole === Role.Guest
        );
    }

    // User được vào User + Guest
    if (role === Role.User) {
        return requiredRole === Role.User || requiredRole === Role.Guest;
    }

    // Guest chỉ vào Guest
    if (role === Role.Guest) {
        return requiredRole === Role.Guest;
    }

    // fallback
    return false;
}