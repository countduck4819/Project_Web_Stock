"use client";

import { motion } from "framer-motion";
import { Crown, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/axiosInstance";
import { useAuth } from "@/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function CheckoutPremiumPage() {
    const { user } = useAuth();
    const router = useRouter();
    const handleBuy = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        const res = await api.post("/premium-orders", {
            userId: Number(user.id),
        });

        const checkoutUrl =
            res.data?.data?.payLink?.checkoutUrl || res.data?.checkoutUrl;

        if (checkoutUrl) window.location.href = checkoutUrl;
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-[#f7f4ff] to-[#ece8ff] overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.18]"
                style={{ backgroundImage: "url('/noise.png')" }}
            />

            <div className="absolute -left-[12rem] top-[10rem] w-[28rem] h-[28rem] bg-purple-300 opacity-25 blur-[7rem] rounded-full" />

            <div className="absolute -right-[12rem] bottom-[8rem] w-[26rem] h-[26rem] bg-purple-400 opacity-20 blur-[7rem] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: "1.5rem" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-[4rem] text-center relative z-10"
            >
                <div className="inline-flex items-center gap-[0.5rem] bg-purple-100 text-purple-700 text-[0.875rem] font-medium px-[1rem] py-[0.5rem] rounded-full mb-[1.25rem]">
                    <Sparkles className="w-[1rem] h-[1rem]" />
                    <span>Phiên bản nâng cao</span>
                </div>

                <h1 className="text-[2.75rem] font-extrabold text-gray-900 leading-tight mb-[0.5rem]">
                    Mở khoá Premium hôm nay
                </h1>

                <p className="text-[1.125rem] text-gray-600 max-w-[38rem] mx-auto leading-relaxed">
                    Trải nghiệm phân tích nâng cao, dữ liệu chuyên sâu và gợi ý
                    đầu tư mạnh mẽ từ AI.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: "2rem" }}
                animate={{ opacity: 1, y: "0rem" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[42rem] bg-white rounded-[2rem] shadow-2xl border border-purple-100 px-[3rem] py-[3.5rem] mt-[3rem] mb-[3rem] relative z-10"
            >
                <div className="absolute inset-0 rounded-[2rem] shadow-[0_0_5rem_-1rem_rgba(147,51,234,0.25)] pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex justify-center mb-[2rem]"
                >
                    <div className="p-[1rem] bg-purple-100 rounded-full shadow-inner">
                        <Crown className="w-[2.5rem] h-[2.5rem] text-purple-600" />
                    </div>
                </motion.div>

                <h2 className="text-center text-[2rem] font-extrabold text-gray-900 mb-[1rem]">
                    Nâng cấp Premium
                </h2>

                <p className="text-center text-gray-600 text-[1.125rem] mb-[2.75rem] leading-relaxed">
                    Mở khoá các tính năng mạnh mẽ phục vụ đầu tư thông minh.
                </p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-[1.5rem] py-[2.75rem] px-[1.5rem] text-center shadow-xl mb-[3rem]"
                >
                    {/* Glow */}
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-[1.5rem] opacity-30" />

                    <p className="text-[0.9rem] font-semibold opacity-90 tracking-wide">
                        GÓI DUY NHẤT
                    </p>

                    <p className="text-[3.25rem] font-extrabold leading-none mt-[0.75rem] drop-shadow">
                        49.000đ
                    </p>

                    <p className="text-[0.9rem] opacity-90 mt-[0.5rem]">
                        Thanh toán một lần – dùng trọn đời
                    </p>
                </motion.div>

                <div className="space-y-[1.5rem] mb-[3rem]">
                    {[
                        "Gợi ý đầu tư từ AI độ chính xác cao",
                        "Xem dữ liệu phân tích nâng cao",
                        "Mở khóa toàn bộ tính năng Premium",
                        "Không giới hạn truy cập",
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: "-1rem" }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + i * 0.1 }}
                            className="flex items-center gap-[0.75rem]"
                        >
                            <CheckCircle2 className="w-[1.5rem] h-[1.5rem] text-purple-600" />
                            <p className="text-gray-700 text-[1rem]">{item}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: "1rem" }}
                    animate={{ opacity: 1, y: "0rem" }}
                    transition={{ delay: 0.55 }}
                >
                    <Button
                        onClick={handleBuy}
                        className="w-full h-[3.5rem] text-[1.25rem] font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all rounded-[0.9rem]"
                    >
                        Thanh toán ngay
                    </Button>
                </motion.div>

                <div className="mt-[2rem] flex items-center justify-center gap-[0.5rem] text-gray-500 text-[0.9rem]">
                    <ShieldCheck className="w-[1.25rem] h-[1.25rem] text-purple-500" />
                    <span>Thanh toán an toàn – PayOS bảo mật</span>
                </div>
            </motion.div>

            <p className="text-gray-400 text-[0.85rem] mb-[2rem] z-10">
                © 2025 – Premium Stock AI
            </p>
        </div>
    );
}
