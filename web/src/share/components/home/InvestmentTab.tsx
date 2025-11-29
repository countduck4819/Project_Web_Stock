"use client";

import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";
import {
    HelpCircle,
    BookOpen,
    LineChart,
    PieChart,
    TrendingUp,
} from "lucide-react";

export default function InvestmentTab() {
    return (
        <div className="p-6 space-y-10">
            {/* HEADER */}
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#7A3BFF] to-[#A67BFF] bg-clip-text text-transparent">
                    Đầu tư & Phân tích
                </h2>
                <p className="text-gray-600 max-w-xl">
                    Tổng hợp các công cụ và phân tích hỗ trợ nhà đầu tư đưa ra
                    quyết định chính xác và tối ưu nhất.
                </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-6 text-sm text-[#7A3BFF]">
                {/* GIỚI THIỆU */}
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <button className="flex items-center gap-1 hover:underline font-medium">
                            <HelpCircle size={16} />
                            Giới thiệu
                        </button>
                    </HoverCardTrigger>

                    <HoverCardContent className="w-72 text-sm shadow-xl rounded-xl border border-[#EDE6FF]">
                        <p className="leading-relaxed">
                            Khám phá các công cụ phân tích danh mục, xu hướng
                            thị trường và chiến lược đầu tư dành cho mọi cấp độ.
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

                    <HoverCardContent className="w-72 text-sm shadow-xl rounded-xl border border-[#EDE6FF]">
                        <p className="leading-relaxed">
                            Bao gồm hướng dẫn phân bổ danh mục, phân tích rủi
                            ro, theo dõi lợi nhuận và cách đọc các chỉ số quan
                            trọng.
                        </p>
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* INVESTMENT INSIGHTS */}
            <div className="rounded-2xl p-6 border border-[#ECE4FF] bg-gradient-to-br from-white to-[#F9F6FF] shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#7A3BFF]/10 text-[#7A3BFF]">
                        <LineChart size={28} strokeWidth={1.8} />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-[#5A2DCC]">
                            Phân tích xu hướng
                        </h3>
                        <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                            Dựa trên dữ liệu lịch sử, khối lượng giao dịch và
                            biến động giá, hệ thống sẽ cung cấp insight giúp bạn
                            nắm bắt xu hướng thị trường.
                        </p>
                    </div>
                </div>
            </div>

            {/* PORTFOLIO HIGHLIGHTS */}
            <div className="rounded-2xl p-6 border border-[#ECE4FF] bg-gradient-to-br from-white to-[#F9F6FF] shadow-md hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#7A3BFF]/10 text-[#7A3BFF]">
                        <PieChart size={28} strokeWidth={1.8} />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-[#5A2DCC]">
                            Danh mục đầu tư
                        </h3>
                        <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                            Xem phân bổ tài sản, rủi ro, hiệu suất, mức tăng
                            trưởng và đề xuất tối ưu danh mục theo từng mục
                            tiêu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
