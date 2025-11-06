"use client";

import { useState } from "react";
import TradingViewMarketOverview from "./tradingview/TradingViewMarketOverview";
import MarketHeatmap from "./tradingview/MarketHeatmap";

export default function MainMarketPanel() {
    const [tab, setTab] = useState("Thị trường");
    const [subTab, setSubTab] = useState("Biến động");

    return (
        <main className="flex flex-col px-3 py-2 overflow-hidden">
            {/* Top Tabs */}
            <div className="flex gap-3 border-b border-white/10 pb-2 mb-3 text-sm">
                {[
                    "Thị trường",
                    "Ngành nghề",
                    "Cổ phiếu",
                    "Chứng khoán phái sinh",
                    "Hàng hóa phái sinh",
                ].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`transition-colors ${
                            tab === t
                                ? "text-blue-400 font-medium"
                                : "text-gray-300 hover:text-blue-300"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Sub Tabs */}
            <div className="flex gap-2 mb-4 text-xs">
                {["Biến động", "Nước ngoài", "Tự doanh", "Thanh khoản"].map(
                    (t) => (
                        <button
                            key={t}
                            onClick={() => setSubTab(t)}
                            className={`px-3 py-1.5 rounded transition-colors ${
                                subTab === t
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }`}
                        >
                            {t}
                        </button>
                    )
                )}
            </div>

            {/* --- Nội dung chính --- */}
            <div className="flex-1 grid grid-rows-[22rem_1fr] gap-3">
                {/* TradingView Market Overview */}
                <TradingViewMarketOverview />

                {/* Heatmap TreeMap */}
                <MarketHeatmap />
            </div>
        </main>
    );
}
