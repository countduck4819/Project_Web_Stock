"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
    Sparkles,
    AreaChart,
    Newspaper,
    Clock,
    Filter,
    LayoutDashboard,
    BellRing,
    Users,
} from "lucide-react";
import Link from "next/link";

/* ========================== FEATURE LIST ========================== */
const features = [
    {
        icon: Sparkles,
        title: "AI Dự báo giá",
        desc: "Dự báo bằng XGBoost và LSTM với dữ liệu real-time.",
    },
    {
        icon: AreaChart,
        title: "Biểu đồ nâng cao",
        desc: "Phân tích đa khung, nhiều indicator và tín hiệu mạnh.",
    },
    {
        icon: Newspaper,
        title: "Tin tức theo mã",
        desc: "Tự động gom tin theo từng cổ phiếu và ngành.",
    },
    {
        icon: Clock,
        title: "Dữ liệu realtime",
        desc: "Độ trễ cực thấp, cập nhật từng giây từ HOSE/HNX/UPCoM.",
    },
    {
        icon: Filter,
        title: "Stock Screener",
        desc: "Lọc cổ phiếu theo FA, TA và tín hiệu AI.",
    },
    {
        icon: LayoutDashboard,
        title: "Dashboard danh mục",
        desc: "Xem P/L, rủi ro, phân bổ và sức mạnh thị trường.",
    },
    {
        icon: BellRing,
        title: "Cảnh báo thông minh",
        desc: "Theo dõi breakout, volume spike và thay đổi xu hướng.",
    },
    {
        icon: Users,
        title: "Cộng đồng FireAnt",
        desc: "Góc nhìn thị trường từ chuyên gia và nhà đầu tư.",
    },
];

/* ========================== REASONS ========================== */
const reasons = [
    {
        num: "01",
        title: "Dữ liệu chính xác",
        desc: "Kết nối trực tiếp từ HOSE, HNX, UPCoM, độ trễ cực thấp.",
    },
    {
        num: "02",
        title: "AI hỗ trợ quyết định",
        desc: "Dự báo xu hướng, điểm mua – bán và mô hình giá.",
    },
    {
        num: "03",
        title: "Trực quan – dễ dùng",
        desc: "Thiết kế tối giản, đẹp, thân thiện cho mọi cấp độ.",
    },
    {
        num: "04",
        title: "Tốc độ vượt trội",
        desc: "Realtime từng giây giúp bạn không bỏ lỡ biến động.",
    },
];

/* ========================== MAIN PAGE ========================== */
export default function FireAntPage() {
    return (
        <div className="w-full overflow-hidden bg-white">
            {/* ========================== HERO ========================== */}
            <section className="relative w-full bg-gradient-to-b from-white via-[#F7F4FF] to-[#EFEAFF] py-[6rem] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#C8B5FF33,transparent_70%)]" />

                <div className="max-w-[90rem] mx-auto px-6 relative z-[2]">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1
                            className="text-5xl md:text-6xl font-semibold leading-tight
              bg-gradient-to-r from-[#4628E9] to-[#7C5CFF] bg-clip-text text-transparent"
                        >
                            FireAnt - Nền tảng phân tích & dự báo chứng khoán
                            thông minh
                        </h1>

                        <p className="mt-6 text-lg md:text-xl text-gray-600">
                            Sức mạnh AI + dữ liệu realtime giúp bạn đầu tư tự
                            tin, nhanh và chính xác hơn.
                        </p>

                        <div className="mt-10 flex justify-center gap-4">
                            <button className="px-8 py-3 rounded-xl bg-[#5A46F0] text-white font-semibold shadow-lg hover:opacity-90 transition">
                                <Link href="/dashboard">Bắt đầu ngay</Link>
                            </button>
                            <button className="px-8 py-3 rounded-xl border border-gray-300 hover:border-[#5A46F0] hover:text-[#5A46F0] transition bg-white">
                                <Link href="/ma-chung-khoang/NVL">Xem Demo</Link>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========================== FEATURES ========================== */}
            <section className="w-full py-[6rem] bg-gradient-to-b from-[#FAF8FF] via-[#F6F3FF] to-[#EEE9FF]">
                <div className="max-w-[90rem] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h2
                            className="
              text-4xl md:text-5xl font-semibold 
              bg-gradient-to-r from-[#3E2BCB] via-[#5A46F0] to-[#8F7BFF]
              bg-clip-text text-transparent pb-[0.5rem]
            "
                        >
                            Bộ công cụ mạnh mẽ của FireAnt
                        </h2>

                        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                            Tối ưu mọi bước phân tích – dự báo – quản lý danh
                            mục dành cho nhà đầu tư thông minh.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                        {features.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.08,
                                    }}
                                    className="p-8 rounded-2xl bg-white 
                    shadow-[0_8px_30px_rgba(0,0,0,0.06)] 
                    border border-[#F1EEFF] 
                    hover:shadow-[0_12px_40px_rgba(80,60,255,0.12)]
                    transition-all duration-300"
                                >
                                    <Icon
                                        size={48}
                                        strokeWidth={1.5}
                                        className="text-[#5A46F0] mb-6"
                                    />
                                    <h3 className="text-xl font-semibold text-[#2B2174]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-gray-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================== WHY FIREANT ========================== */}
            <section className="py-[6rem] bg-white">
                <div className="max-w-[85rem] mx-auto px-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-semibold text-center 
              bg-gradient-to-r from-[#5A46F0] to-[#8F7BFF]
              bg-clip-text text-transparent pb-[0.5rem]"
                    >
                        Lý do nhà đầu tư tin dùng FireAnt
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
                        {reasons.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl border border-[#E8E1FF] bg-white shadow-sm 
                  hover:shadow-[0_10px_40px_rgba(80,60,255,0.1)] transition"
                            >
                                <div className="text-5xl font-bold text-[#5A46F0] opacity-70">
                                    {item.num}
                                </div>
                                <h3 className="mt-4 text-2xl font-semibold text-[#2A2174]">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================== AI SECTION ========================== */}
            <section className="py-[6rem] bg-gradient-to-br from-[#F7F4FF] to-[#EEE8FF]">
                <div className="max-w-[85rem] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="p-[0.5rem] text-4xl md:text-5xl font-semibold bg-gradient-to-r from-[#3E2BCB] to-[#8F7BFF] bg-clip-text text-transparent">
                            AI dự báo xu hướng giá
                        </h2>

                        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                            FireAnt ứng dụng mô hình XGBoost và LSTM huấn luyện
                            trên hàng triệu dữ liệu lịch sử để:
                        </p>

                        <ul className="mt-6 space-y-4 text-gray-700">
                            <li>📈 Dự báo xu hướng ngắn – trung – dài hạn</li>
                            <li>📊 Xác định điểm mua – điểm bán tối ưu</li>
                            <li>⚡ Phát hiện volume spike và breakout</li>
                            <li>🔍 Nhận diện mô hình giá & trendline</li>
                        </ul>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src="/img/ai-img.jpg"
                            alt="AI Prediction"
                            width={600}
                            height={600}
                            unoptimized
                            className="rounded-2xl shadow-[0_15px_50px_rgba(80,60,255,0.2)] border border-white"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ========================== CTA ========================== */}
            <section className="py-[6rem] bg-gradient-to-r from-[#5644FF] to-[#8F7BFF] text-center text-white">
                <h2 className="text-4xl md:text-5xl font-semibold">
                    Sẵn sàng nâng cấp trải nghiệm đầu tư?
                </h2>

                <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
                    Bắt đầu với FireAnt ngay hôm nay — nền tảng phân tích & dự
                    báo chứng khoán mạnh nhất tại Việt Nam.
                </p>

                <button className="mt-10 px-10 py-4 bg-white text-[#4C3BFF] font-semibold rounded-xl shadow-xl hover:bg-gray-100 transition">
                    <Link href="/">Dùng thử miễn phí ngay</Link>
                </button>
            </section>
        </div>
    );
}
