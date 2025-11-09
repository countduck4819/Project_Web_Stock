"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import TradingViewWidget from "@/share/components/TradingViewWidget";
import StockInfoCard from "@/share/components/StockInfoCard";
import { Clock, Star } from "lucide-react";
import NewsListJson from "@/share/components/NewsListJson";

export default function Page() {
    const { stock } = useParams();
    const { candleData, stocksFullList } = useAppSelector(
        (state) => state.stockSymbols
    );

    const symbol = String(stock || "").toUpperCase();

    const stockInfo = useMemo(
        () => stocksFullList.find((s) => s.symbol === symbol),
        [stocksFullList, stock]
    );

    const latestCandle = candleData[candleData.length - 1];
    const prevCandle = candleData[candleData.length - 2];

    const price = latestCandle?.close || 0;
    const change = price - (prevCandle?.close || price);
    const percent = ((change / (prevCandle?.close || price)) * 100).toFixed(2);
    const isUp = change > 0;
    const isDown = change < 0;

    // 🕒 Lấy giờ hiện tại (1 lần khi render)
    const now = new Date();
    const timeVN = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(now);

    return (
        <div className="max-w-[90vw] mx-auto flex flex-col gap-6 py-6">
            {stockInfo && (
                <div className="bg-white rounded-lg py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Left info */}
                        <div>
                            <h1 className="text-[1.125rem] font-semibold text-gray-900">
                                {stockInfo.organ_name}
                            </h1>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Clock
                                        size={14}
                                        strokeWidth={1.8}
                                        className="text-red-500"
                                    />
                                    {symbol}:HSX
                                </span>
                                <Star
                                    size={15}
                                    strokeWidth={1.6}
                                    className="ml-2 text-gray-400 cursor-pointer hover:text-yellow-400"
                                />
                            </div>
                        </div>

                        {/* Right info */}
                        <div className="text-right">
                            <p className="text-[1.5rem] font-semibold text-gray-900 leading-none">
                                {price.toFixed(2)}
                            </p>
                            <p
                                className={`mt-1 text-sm font-medium ${
                                    isUp
                                        ? "text-green-600"
                                        : isDown
                                        ? "text-red-600"
                                        : "text-gray-500"
                                }`}
                            >
                                {change > 0 ? "+" : ""}
                                {change.toFixed(2)} / {percent}%
                            </p>
                        </div>
                    </div>

                    <p className="text-[0.8125rem] text-gray-400 mt-2">
                        Cập nhật lúc {timeVN} | Việt Nam (GMT+7)
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg ">
                    <TradingViewWidget />

                    <div className="w-full mt-[2rem]">
                        <NewsListJson />
                    </div>
                </div>

                <div className="bg-white rounded-lg">
                    <StockInfoCard />
                </div>
            </div>
        </div>
    );
}
