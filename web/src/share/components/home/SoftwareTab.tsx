"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, CircleUserRound, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import Link from "next/link";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

type TabKey = "web" | "mobile" | "amibroker" | "excel" | "infographic" | "ai";

const TAB_ITEMS: Array<{
    key: TabKey;
    label: string;
    desc: string;
    icon?: string;
    tag?: string;
}> = [
    {
        key: "web",
        label: "Web - PC",
        desc: "Nền tảng phân tích trên máy tính",
        icon: "/icons/desktop.png",
    },
    {
        key: "mobile",
        label: "Mobile",
        desc: "Theo dõi & đầu tư trên điện thoại",
        icon: "/icons/phone.png",
    },
    {
        key: "amibroker",
        label: "AmiBroker",
        desc: "Dữ liệu cho AmiBroker/MetaStock",
        icon: "/icons/ami.png",
    },
    {
        key: "excel",
        label: "Excel",
        desc: "Khai thác dữ liệu trên Excel",
        icon: "/icons/excel.png",
    },
    {
        key: "infographic",
        label: "Infographic",
        desc: "Báo cáo phân tích cập nhật",
        icon: "/icons/infographic.png",
    },
    {
        key: "ai",
        label: "AI Copilot",
        desc: "Trợ lý AI cho NĐT CK",
        icon: "/icons/ai-copilot.png",
        tag: "NEW",
    },
];

// ====== Placeholder data (bạn thay link ảnh sau) ======
const WEB_CONTENT = {
    title: "Nền tảng phân tích, công cụ đầu tư chứng khoán trên máy tính",
    featuresLeft: [
        "Công nghệ hiện đại",
        "Phân tích kỹ thuật nhiều biểu đồ, nhiều khung thời gian",
        "Cộng đồng sôi nổi, nhiều chuyên gia",
    ],
    featuresRight: [
        "Tùy biến giao diện linh hoạt",
        "Tin tức đa chiều, cập nhật liên tục",
        "Các công cụ phân tích, tìm kiếm cơ hội",
    ],
    images: [
        "/img/web-widescreen.jpg",
        "/img/web-features-01.jpg",
        "/img/web-features-02.jpg",
    ],
};

export default function FireAntSoftware() {
    const [active, setActive] = useState<TabKey>("web");

    const fade = useMemo(
        () => ({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: {
                duration: 0.28,
                ease: easeInOut,
            },
        }),
        []
    );

    return (
        <main
            className={cn("px-4 py-6 font-sans text-[#0F172A]", inter.variable)}
            style={{ fontFamily: "var(--font-inter)" }}
        >
            {/* HEADER */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-[15px]">
                        Phần mềm FireAnt
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-[#1D5EFF]">
                        <button className="cursor-pointer flex items-center gap-1 hover:underline">
                            <Link
                                href="/ve-chung-toi"
                                className="flex items-center gap-[0.2rem]"
                            >
                                <BookOpen size={16} />
                                Giới thiệu
                            </Link>
                        </button>
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <button className="flex items-center gap-1 hover:underline">
                                    <HelpCircle size={16} /> Hướng dẫn
                                </button>
                            </HoverCardTrigger>

                            <HoverCardContent className="w-64">
                                <p>
                                    Đây là hướng dẫn thao tác chi tiết từng
                                    bước. Click vào từng mục để xem video, ảnh
                                    minh họa và các tip nâng cao.
                                </p>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>

                <Card className="flex items-center justify-between p-3 border-[#E2E8F0] shadow-none">
                    <div className="flex items-center gap-2 text-sm">
                        <CircleUserRound className="text-[#1D5EFF]" size={20} />
                        <span>
                            Bạn đang dùng gói{" "}
                            <span className="text-[#E11D48] font-medium">
                                Hội viên Miễn phí
                            </span>
                        </span>
                    </div>

                    <Button
                        size="sm"
                        className="bg-[#1D5EFF] hover:bg-[#154BDB] text-white text-[13px] font-semibold"
                    >
                        Nâng cấp/Gia hạn
                    </Button>
                </Card>
            </div>

            {/* BODY */}
            <div className="">
                <Tabs
                    value={active}
                    onValueChange={(v) => setActive(v as TabKey)}
                    className="w-full"
                >
                    {/* Khối viền chung kiểu FireAnt */}
                    <section className="grid grid-cols-[1fr_2fr] rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                        <div className="bg-white w-full">
                            <TabsList
                                className={cn(
                                    "w-full flex flex-col items-start h-fit bg-white rounded-none p-0 min-h-fit border-r border-transparent"
                                )}
                            >
                                {TAB_ITEMS.map((item) => {
                                    const isActive = active === item.key;
                                    return (
                                        <TabsTrigger
                                            key={item.key}
                                            value={item.key}
                                            className={cn(
                                                "group w-full relative justify-start items-start rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:text-[#1D5EFF] px-4 py-3 border-b text-left",
                                                "border-b-[#E2E8F0] data-[state=active]:border-b-[#E2E8F0]",
                                                "data-[state=active]:before:content-[''] data-[state=active]:before:absolute data-[state=active]:before:left-0 data-[state=active]:before:top-0 data-[state=active]:before:bottom-0 data-[state=active]:before:w-[3px] data-[state=active]:before:bg-[#1D5EFF]",
                                                `${
                                                    isActive
                                                        ? ""
                                                        : "border-r-[#E2E8F0]"
                                                } `
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-start gap-3"
                                                )}
                                            >
                                                {item.icon && (
                                                    <div
                                                        className={cn(
                                                            "w-[1.8rem] h-[1.8rem] flex items-center justify-center"
                                                        )}
                                                    >
                                                        <Image
                                                            src={item.icon}
                                                            alt={item.label}
                                                            width={28}
                                                            height={28}
                                                            className="object-contain w-[1.8rem] h-[1.8rem]"
                                                        />
                                                    </div>
                                                )}

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1 font-semibold text-[0.75rem] leading-tight">
                                                        <span
                                                            className={
                                                                isActive
                                                                    ? "text-[#1D5EFF]"
                                                                    : "text-gray-800"
                                                            }
                                                        >
                                                            {item.label}
                                                        </span>
                                                        {item.tag && (
                                                            <span className="ml-1 bg-[#FF0000] text-white text-[0.4rem] font-bold px-[0.5rem] py-[0.2rem] rounded-md">
                                                                {item.tag}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p
                                                        className={cn(
                                                            "text-[13px] leading-snug mt-[0.5rem]",
                                                            isActive
                                                                ? "text-[#1D5EFF]"
                                                                : "text-gray-500"
                                                        )}
                                                    >
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Connector trắng để liền khối với content */}
                                            {isActive && (
                                                <span className="absolute right-0 top-0 h-full w-[1px] bg-white" />
                                            )}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>

                        {/* RIGHT: Content box (cross-fade) */}
                        <div className="relative w-full p-6">
                            <AnimatePresence mode="wait">
                                {/* WEB */}
                                {active === "web" && (
                                    <motion.div
                                        key="web"
                                        {...fade}
                                        className="w-full"
                                    >
                                        <h3 className="text-[1rem] font-semibold text-center mb-4 leading-snug">
                                            {WEB_CONTENT.title}
                                        </h3>

                                        <div className="flex justify-center gap-2 mb-6">
                                            <Button
                                                type="button"
                                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-[#154BDB] text-white text-[0.75rem] font-semibold px-5"
                                            >
                                                <Link href="/dashboard">
                                                    Truy cập ngay
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-[#CBD5E1] text-[#0F172A] text-[0.75rem] font-semibold px-5"
                                            >
                                                Bản cũ
                                            </Button>
                                        </div>

                                        <div className=" mb-6 text-[0.75rem] text-[#0F172A]">
                                            <ul className="grid grid-cols-2 gap-3">
                                                {[
                                                    ...WEB_CONTENT.featuresLeft,
                                                    ...WEB_CONTENT.featuresRight,
                                                ].map((f) => (
                                                    <li
                                                        key={f}
                                                        className="flex gap-2"
                                                    >
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            {WEB_CONTENT.images.map(
                                                (src, i) => (
                                                    <div
                                                        key={i}
                                                        className="rounded-lg overflow-hidden border border-[#E2E8F0]"
                                                    >
                                                        <Image
                                                            src={src}
                                                            alt={`preview-${i}`}
                                                            width={360}
                                                            height={200}
                                                            className="object-cover w-full h-[7rem]"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* MOBILE (Phone-left / QR-right như bạn chốt) */}
                                {active === "mobile" && (
                                    <motion.div
                                        key="mobile"
                                        {...fade}
                                        className="w-full"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                            {/* Phone mockup (placeholder) */}
                                            <div className="flex justify-center md:justify-start">
                                                <div className="w-[220px] h-[440px] rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden flex items-center justify-center">
                                                    {/* Thay ảnh điện thoại thật ở đây */}
                                                    <div className="text-xs text-gray-500">
                                                        Phone Mockup Placeholder
                                                    </div>
                                                </div>
                                            </div>

                                            {/* QR + badges + bullet */}
                                            <div className="space-y-4">
                                                <h3 className="text-[18px] font-semibold leading-snug">
                                                    Ứng dụng FireAnt Mobile
                                                </h3>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-[96px] h-[96px] border border-[#E2E8F0] rounded-md bg-white flex items-center justify-center">
                                                        {/* QR placeholder */}
                                                        <span className="text-[10px] text-gray-500">
                                                            QR
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="w-[160px] h-[48px] border border-[#E2E8F0] rounded-md bg-white flex items-center justify-center">
                                                            Google Play Badge
                                                        </div>
                                                        <div className="w-[160px] h-[48px] border border-[#E2E8F0] rounded-md bg-white flex items-center justify-center">
                                                            App Store Badge
                                                        </div>
                                                    </div>
                                                </div>

                                                <ul className="mt-2 text-[13px] space-y-2">
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Theo dõi realtime
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Biểu đồ/Watchlist đồng
                                                        bộ
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Thông báo cảnh báo nhanh
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* AMIBROKER */}
                                {active === "amibroker" && (
                                    <motion.div
                                        key="amibroker"
                                        {...fade}
                                        className="w-full"
                                    >
                                        <div className="space-y-5">
                                            <h3 className="text-[18px] font-semibold leading-snug text-center md:text-left">
                                                Dữ liệu cho AmiBroker /
                                                MetaStock
                                            </h3>

                                            {/* Stats/tiles */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    "Realtime",
                                                    "EOD",
                                                    "Intraday",
                                                    "Lịch sử dài",
                                                ].map((t) => (
                                                    <div
                                                        key={t}
                                                        className="rounded-lg border border-[#E2E8F0] p-3 text-center"
                                                    >
                                                        <p className="text-[12px] text-gray-500">
                                                            {t}
                                                        </p>
                                                        <p className="text-[16px] font-semibold mt-1">
                                                            Placeholder
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Download + list */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <Button className="bg-[#1D5EFF] hover:bg-[#154BDB] text-white text-[13px] font-semibold px-5">
                                                        Tải bộ cài / Hướng dẫn
                                                    </Button>
                                                    <ul className="text-[13px] space-y-2">
                                                        <li className="flex gap-2">
                                                            <span className="text-[#1D5EFF]">
                                                                ✔
                                                            </span>
                                                            Tích hợp plugin hỗ
                                                            trợ
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <span className="text-[#1D5EFF]">
                                                                ✔
                                                            </span>
                                                            Data chuẩn, ổn định
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <span className="text-[#1D5EFF]">
                                                                ✔
                                                            </span>
                                                            Phù hợp
                                                            Backtest/Indicator
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Ảnh minh họa */}
                                                <div className="w-full h-[180px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">
                                                        AmiBroker Preview
                                                        Placeholder
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* EXCEL */}
                                {active === "excel" && (
                                    <motion.div
                                        key="excel"
                                        {...fade}
                                        className="w-full"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                            {/* Illustration */}
                                            <div className="w-full h-[220px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] flex items-center justify-center">
                                                <span className="text-xs text-gray-500">
                                                    Excel Template Preview
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-4">
                                                <h3 className="text-[18px] font-semibold leading-snug">
                                                    Khai thác dữ liệu trên Excel
                                                </h3>
                                                <ul className="text-[13px] space-y-2">
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Pivot/Chart/PowerQuery
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Kết nối cập nhật theo
                                                        phiên
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Mẫu báo cáo sẵn có
                                                    </li>
                                                </ul>
                                                <div className="flex gap-2">
                                                    <Button className="bg-[#1D5EFF] hover:bg-[#154BDB] text-white text-[13px] font-semibold px-5">
                                                        Tải mẫu
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="border-[#CBD5E1] text-[13px] font-semibold px-5"
                                                    >
                                                        Xem hướng dẫn
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* INFOGRAPHIC */}
                                {active === "infographic" && (
                                    <motion.div
                                        key="infographic"
                                        {...fade}
                                        className="w-full"
                                    >
                                        <div className="space-y-5">
                                            <h3 className="text-[18px] font-semibold leading-snug text-center md:text-left">
                                                Infographic báo cáo phân tích
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="rounded-lg overflow-hidden border border-[#E2E8F0]"
                                                    >
                                                        <div className="w-full h-[160px] bg-[#F8FAFC] flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">
                                                                Infographic {i}{" "}
                                                                Placeholder
                                                            </span>
                                                        </div>
                                                        <div className="p-3">
                                                            <p className="text-[13px] font-medium">
                                                                Tiêu đề mẫu #{i}
                                                            </p>
                                                            <p className="text-[12px] text-gray-500 mt-1">
                                                                Mô tả ngắn cho
                                                                infographic.
                                                                (Placeholder)
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* AI COPILOT */}
                                {active === "ai" && (
                                    <motion.div
                                        key="ai"
                                        {...fade}
                                        className="w-full"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                            {/* Chat mock */}
                                            <div className="rounded-lg border border-[#E2E8F0] p-3 bg-[#F8FAFC]">
                                                <div className="h-[260px] overflow-hidden space-y-2">
                                                    <div className="max-w-[80%] rounded-lg bg-white border border-[#E2E8F0] p-2 text-[12px]">
                                                        Xin chào! Tôi là AI
                                                        Copilot — tôi có thể
                                                        giúp gì cho bạn?
                                                    </div>
                                                    <div className="ml-auto max-w-[80%] rounded-lg bg-[#1D5EFF] text-white p-2 text-[12px]">
                                                        Gợi ý cổ phiếu breakout
                                                        hôm nay?
                                                    </div>
                                                    <div className="max-w-[80%] rounded-lg bg-white border border-[#E2E8F0] p-2 text-[12px]">
                                                        Đây là một số mã cần chú
                                                        ý (placeholder)…
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content + CTA */}
                                            <div className="space-y-4">
                                                <h3 className="text-[18px] font-semibold leading-snug">
                                                    AI Copilot cho nhà đầu tư
                                                </h3>
                                                <ul className="text-[13px] space-y-2">
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Hiểu ngôn ngữ tài chính
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Trả lời theo dữ liệu thị
                                                        trường
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="text-[#1D5EFF]">
                                                            ✔
                                                        </span>
                                                        Tùy biến theo chiến lược
                                                        của bạn
                                                    </li>
                                                </ul>

                                                <div className="flex gap-2">
                                                    <Button className="bg-[#1D5EFF] hover:bg-[#154BDB] text-white text-[13px] font-semibold px-5">
                                                        Dùng thử ngay
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="border-[#CBD5E1] text-[13px] font-semibold px-5"
                                                    >
                                                        Hướng dẫn
                                                    </Button>
                                                </div>

                                                {/* Hình minh họa */}
                                                <div className="w-full h-[140px] border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">
                                                        AI Illustration
                                                        Placeholder
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                </Tabs>
            </div>
        </main>
    );
}
