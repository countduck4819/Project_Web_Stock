"use client";

import LeftSidebar from "@/share/components/home/LeftSidebar";
import StockRecommendationTabs from "@/share/components/home/StockRecommendationTabs";
import { useEffect, useRef, useState } from "react";

// ✅ Mapping symbol mới (VNINDEX đổi sang HOSE:VNINDEX)
const SYMBOL_MAP: Record<string, string> = {
    VNINDEX: "HOSE:VNINDEX",
    HNXINDEX: "HNX:HNXINDEX",
    UPINDEX: "HNX:301",
    VN30: "HNX:100",
    VN30F1M: "HNX:VN301!",
};

const MOCK_INDICES = [
    {
        code: "HNXINDEX",
        name: "Chỉ số HNX-Index",
        value: "234.10",
        change: "+1.12 (+0.48%)",
    },
    {
        code: "UPINDEX",
        name: "Chỉ số UPCoM",
        value: "89.05",
        change: "-0.21 (-0.23%)",
    },
    {
        code: "VN30",
        name: "Chỉ số VN30",
        value: "1,245.77",
        change: "+4.10 (+0.33%)",
    },
];

export default function Page() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [tvReady, setTvReady] = useState(false);
    const [current, setCurrent] = useState<string>("HNXINDEX"); // default hiển thị HNXINDEX

    // 🧩 Load script TradingView 1 lần
    useEffect(() => {
        if (window.TradingView) {
            setTvReady(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => setTvReady(true);
        document.body.appendChild(script);
    }, []);

    // ✅ Hàm tạo widget mỗi khi đổi symbol
    const createWidget = (symbolKey: string) => {
        if (!tvReady || !window.TradingView || !containerRef.current) return;
        const tvSymbol = SYMBOL_MAP[symbolKey] || symbolKey;

        // Xoá chart cũ trước khi tạo cái mới
        containerRef.current.innerHTML = "";

        // Gán id mới để phá cache widget
        const newId = `tv-container-${symbolKey}-${Date.now()}`;
        containerRef.current.id = newId;

        // Tạo widget mới
        new window.TradingView.widget({
            symbol: tvSymbol,
            interval: "D",
            container_id: newId,
            width: "100%",
            height: 400,
            timezone: "Asia/Ho_Chi_Minh",
            theme: "light",
            style: "1",
            locale: "vi",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: false,
            hide_side_toolbar: false,
            hide_top_toolbar: false,
            withdateranges: true,
            details: true,
            hotlist: false,
            calendar: false,
            studies: ["MASimple@tv-basicstudies", "MASimple@tv-basicstudies"],
        });
    };

    // Tạo widget lần đầu
    useEffect(() => {
        if (tvReady) createWidget(current);
    }, [tvReady]);

    // Khi đổi current → recreate chart
    useEffect(() => {
        if (tvReady) createWidget(current);
    }, [current]);

    return (
        <main className="max-w-[90vw] mx-auto px-4 py-6">
            <section className="grid md:grid-cols-[2fr_1fr] grid-cols-1 gap-[0.6rem] items-start">
                <div>
                    <LeftSidebar />

                    <StockRecommendationTabs />
                </div>

                <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                    <div>
                        <div className="px-4 py-3 border-b">
                            <h2 className="text-base font-semibold">
                                Biểu đồ {current}
                            </h2>
                        </div>
                        <div className="p-0">
                            <div
                                id="tv-container"
                                ref={containerRef}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="px-4 py-3 border-b">
                            <h3 className="text-sm font-semibold">
                                Chỉ số thị trường
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-0">
                            {MOCK_INDICES.map((item) => {
                                const isActive = item.code === current;
                                const isDown = item.change
                                    .trim()
                                    .startsWith("-");
                                return (
                                    <button
                                        key={item.code}
                                        onClick={() => setCurrent(item.code)}
                                        className={[
                                            "w-full text-left px-4 py-3 border-t md:border-t-0 md:border-l first:md:border-l-0",
                                            "hover:bg-violet-50 transition-colors",
                                            isActive
                                                ? "bg-violet-50/70"
                                                : "bg-white",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold">
                                                {item.code}
                                            </div>
                                            <div className="text-sm">
                                                {item.value}
                                            </div>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                                            <div className="truncate pr-3">
                                                {item.name}
                                            </div>
                                            <div
                                                className={
                                                    isDown
                                                        ? "text-red-600"
                                                        : "text-emerald-600"
                                                }
                                            >
                                                {item.change}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
