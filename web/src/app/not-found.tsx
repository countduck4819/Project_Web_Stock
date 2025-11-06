"use client";

import FuzzyText from "@/components/FuzzyText";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-[#F5F3FF] via-[#EDE9FE] to-[#E0E7FF] text-gray-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(147,51,234,0.12),transparent_70%)]" />

            <motion.h1
                initial={{ opacity: 0, scale: 0.5, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-[6rem] sm:text-[8rem] font-extrabold bg-gradient-to-br from-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(147,51,234,0.25)] select-none"
            >
                404
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className=" text-gray-700  text-lg sm:text-xl text-center max-w-lg px-6"
            >
                Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                Hãy quay lại bảng giá để tiếp tục theo dõi thị trường nhé 📈
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10"
            >
                <Link
                    href="/"
                    className="relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white rounded-full 
                     bg-[linear-gradient(90deg,#7C3AED,#9333EA,#C084FC,#9333EA,#7C3AED)] 
                     bg-[length:200%_200%] 
                     animate-[gradientMove_5s_ease_infinite] 
                     shadow-[0_0_15px_rgba(147,51,234,0.4)] 
                     transition-all duration-300 
                     hover:scale-[1.08] 
                     hover:shadow-[0_0_25px_rgba(147,51,234,0.6)]"
                >
                    <span className="relative z-10">Quay lại trang chủ</span>
                    <style jsx>{`
                        @keyframes gradientMove {
                            0% {
                                background-position: 0% 50%;
                            }
                            50% {
                                background-position: 100% 50%;
                            }
                            100% {
                                background-position: 0% 50%;
                            }
                        }
                    `}</style>
                </Link>
            </motion.div>

            <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                viewBox="0 0 400 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-10 w-[80%] max-w-[400px]"
            >
                <path
                    d="M0 70C50 40 100 100 150 50C200 0 250 80 300 40C350 10 400 60 400 60"
                    stroke="url(#purpleLine)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient
                        id="purpleLine"
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#C084FC" />
                        <stop offset="0.5" stopColor="#9333EA" />
                        <stop offset="1" stopColor="#7C3AED" />
                    </linearGradient>
                </defs>
            </motion.svg>
        </section>
    );
}
