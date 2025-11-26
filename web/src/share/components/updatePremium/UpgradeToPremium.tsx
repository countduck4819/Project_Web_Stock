"use client";

import { Crown } from "lucide-react";
import Link from "next/link";

export default function UpgradeToPremium({
    activeTab,
}: {
    activeTab?: string;
}) {
    return (
        <div className="w-full p-10 border border-purple-200 bg-purple-50 rounded-xl text-center">
            <div className="flex flex-col items-center gap-3">
                <Crown className="w-12 h-12 text-purple-600" />
                <h2 className="text-xl font-semibold text-purple-700">
                    Tính năng dành cho thành viên Premium
                </h2>

                <p className="text-gray-600 max-w-md">
                    {activeTab === "expert"
                        ? `Nâng cấp tài khoản Premium để xem dữ liệu gợi ý đầu tư từ chuyên gia
                    với độ chính xác cao và phân tích chuyên sâu.`
                        : `Nâng cấp tài khoản Premium để xem dữ liệu gợi ý đầu tư từ AI
                    với độ chính xác cao và phân tích chuyên sâu.`}
                </p>

                <Link
                    href="/nang-cap-hoi-vien"
                    className="mt-4 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                >
                    Nâng cấp ngay
                </Link>
            </div>
        </div>
    );
}
