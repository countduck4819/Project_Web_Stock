"use client";

import { HelpCircle, Info, BookOpen, TrendingUp } from "lucide-react";
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";

export default function CKShinhanTab() {
    return (
        <div className="p-6 space-y-10">
            {/* HEADER */}
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#1D5EFF] to-[#5A8BFF] bg-clip-text text-transparent">
                    Chứng Khoán Shinhan (SSV)
                </h2>
                <p className="text-gray-600 max-w-xl">
                    Nền tảng chứng khoán thuộc tập đoàn Shinhan – mạnh về tốc
                    độ, bảo mật và hệ sinh thái tài chính Hàn Quốc.
                </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-6 text-sm text-[#1D5EFF]">
                {/* GIỚI THIỆU */}
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <button className="flex items-center gap-1 hover:underline font-medium">
                            <Info size={16} />
                            Giới thiệu
                        </button>
                    </HoverCardTrigger>

                    <HoverCardContent className="w-72 text-sm shadow-xl rounded-xl border border-[#E5EDFF]">
                        <p className="leading-relaxed">
                            Shinhan Securities Vietnam (SSV) mang đến nền tảng
                            giao dịch nhanh, phí thấp, công nghệ bảo mật chuẩn
                            Hàn Quốc và dịch vụ tư vấn đầu tư chuyên sâu.
                        </p>
                    </HoverCardContent>
                </HoverCard>

                {/* HƯỚNG DẪN */}
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <button className="flex items-center gap-1 hover:underline font-medium">
                            <BookOpen size={16} />
                            Hướng dẫn
                        </button>
                    </HoverCardTrigger>

                    <HoverCardContent className="w-72 text-sm shadow-xl rounded-xl border border-[#E5EDFF]">
                        <p className="leading-relaxed">
                            Bao gồm hướng dẫn mở tài khoản, cách nạp/rút tiền,
                            đặt lệnh, theo dõi danh mục và sử dụng các công cụ
                            phân tích chuyên sâu.
                        </p>
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* INFO CARD */}
            <div className="rounded-2xl p-6 border border-[#E8EEFF] bg-gradient-to-br from-white to-[#F8FAFF] shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#1D5EFF]/10 text-[#1D5EFF]">
                        <TrendingUp size={28} strokeWidth={1.8} />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-[#1D3FFF]">
                            Ưu điểm nổi bật
                        </h3>
                        <ul className="mt-3 space-y-2 text-gray-700 text-sm leading-relaxed">
                            <li>
                                • Phí giao dịch cạnh tranh, tốc độ khớp lệnh
                                nhanh.
                            </li>
                            <li>• Ứng dụng đầu tư thân thiện – dễ dùng.</li>
                            <li>
                                • Mạng lưới Shinhan giúp hỗ trợ tài chính đa
                                dạng.
                            </li>
                            <li>• Hệ thống bảo mật cao, chuẩn Hàn Quốc.</li>
                            <li>• Báo cáo phân tích chuyên sâu theo ngành.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
