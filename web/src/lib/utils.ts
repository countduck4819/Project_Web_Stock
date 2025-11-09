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
