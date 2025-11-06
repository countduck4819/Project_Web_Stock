// "use client";

// import { useEffect, useRef, useState, useMemo } from "react";
// import {
//     createChart,
//     ColorType,
//     CrosshairMode,
//     CandlestickSeries,
//     HistogramSeries,
//     LineSeries,
//     createTextWatermark,
//     type CandlestickData,
//     type IChartApi,
// } from "lightweight-charts";
// import { useAppSelector } from "@/redux/hooks";

// interface Candle {
//     time: string;
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume: number;
// }

// export default function TradingViewWidgetPro({ symbol }: { symbol: string }) {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const chartRef = useRef<IChartApi | null>(null);
//     const tooltipRef = useRef<HTMLDivElement | null>(null);

//     const [theme, setTheme] = useState<"light" | "dark">("dark");

//     // ✅ Lấy thông tin công ty từ Redux
//     const { stocksFullList } = useAppSelector((state) => state.stockSymbols);
//     const company = useMemo(() => {
//         const found = stocksFullList.find((s) => s.symbol === symbol);
//         return found?.organ_name || symbol;
//     }, [stocksFullList, symbol]);

//     useEffect(() => {
//         if (!symbol || !containerRef.current) return;

//         // 🎨 Màu sắc
//         const isDark = theme === "dark";
//         const bg = isDark ? "#0e1117" : "#ffffff";
//         const text = isDark ? "#e5e7eb" : "#1a1a1a";
//         const grid = isDark ? "#1c212b" : "#f0f3fa";
//         const up = "#26a69a";
//         const down = "#ef5350";

//         // 🧱 Chart setup
//         const chart = createChart(containerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: bg },
//                 textColor: text,
//             },
//             grid: { vertLines: { color: grid }, horzLines: { color: grid } },
//             width: containerRef.current.clientWidth,
//             height: 580,
//             crosshair: { mode: CrosshairMode.Normal },
//             rightPriceScale: { borderColor: grid },
//             timeScale: { borderColor: grid, timeVisible: true },
//         });
//         chartRef.current = chart;

//         // ✅ Candlestick
//         const candleSeries = chart.addSeries(CandlestickSeries, {
//             upColor: up,
//             downColor: down,
//             borderUpColor: up,
//             borderDownColor: down,
//             wickUpColor: up,
//             wickDownColor: down,
//         });

//         // ✅ Volume
//         const volumeSeries = chart.addSeries(HistogramSeries, {
//             priceScaleId: "",
//             color: up,
//         });
//         chart.priceScale("").applyOptions({
//             scaleMargins: { top: 0.82, bottom: 0 },
//         });

//         // ✅ Tooltip
//         const tooltip = document.createElement("div");
//         tooltip.className =
//             "absolute bg-gray-900/90 text-white text-xs px-2 py-1 rounded shadow pointer-events-none";
//         tooltip.style.display = "none";
//         tooltipRef.current = tooltip;
//         containerRef.current.appendChild(tooltip);

//         // 📈 Fetch dữ liệu từ API Python
//         const fetchData = async () => {
//             try {
//                 const res = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_BASE_URL_PYTHON}/stock/${symbol}`
//                 );
//                 const raw = await res.json();
//                 const data: Candle[] = raw.map((d: any) => ({
//                     time: d.time || d.date,
//                     open: +d.open,
//                     high: +d.high,
//                     low: +d.low,
//                     close: +d.close,
//                     volume: +d.volume || 0,
//                 }));
//                 candleSeries.setData(data);
//                 volumeSeries.setData(
//                     data.map((d) => ({
//                         time: d.time,
//                         value: d.volume,
//                         color: d.close >= d.open ? up : down,
//                     }))
//                 );

//                 // 📊 MA20
//                 const ma20Series = chart.addSeries(LineSeries, {
//                     color: "#fbbf24",
//                     lineWidth: 2,
//                 });
//                 ma20Series.setData(calcMA(data, 20));
//             } catch (err) {
//                 console.error("❌ Fetch error:", err);
//             }
//         };
//         fetchData();

//         // 🧭 Tooltip hover
//         chart.subscribeCrosshairMove((param) => {
//             if (!param.point || !param.time || !param.seriesData.size) {
//                 tooltip.style.display = "none";
//                 return;
//             }
//             const data = param.seriesData.get(candleSeries) as CandlestickData;
//             if (!data) return;
//             tooltip.style.display = "block";
//             tooltip.style.left = param.point.x + 20 + "px";
//             tooltip.style.top = param.point.y + "px";
//             tooltip.innerHTML = `
//         <div class="font-semibold">${symbol}</div>
//         <div>O: ${data.open.toFixed(2)} H: ${data.high.toFixed(2)}</div>
//         <div>L: ${data.low.toFixed(2)} C: ${data.close.toFixed(2)}</div>
//       `;
//         });

//         // 💧 Watermark
//         const pane = chart.panes()[0];
//         createTextWatermark(pane, {
//             horzAlign: "center",
//             vertAlign: "center",
//             lines: [
//                 {
//                     text: symbol,
//                     color: isDark
//                         ? "rgba(255,255,255,0.03)"
//                         : "rgba(0,0,0,0.05)",
//                     fontSize: 140,
//                     fontStyle: "bold",
//                 },
//             ],
//         });

//         // 🔄 Resize
//         const handleResize = () =>
//             chart.applyOptions({ width: containerRef.current!.clientWidth });
//         window.addEventListener("resize", handleResize);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//             chart.remove();
//         };
//     }, [symbol, theme]);

//     return (
//         <div
//             className={`relative w-full rounded-2xl border ${
//                 theme === "dark"
//                     ? "border-gray-700 bg-[#0e1117]"
//                     : "border-gray-200 bg-white"
//             } shadow-lg overflow-hidden transition-all`}
//         >
//             {/* Header giống TradingView */}
//             <div className="absolute top-3 left-5 z-10 flex items-center justify-between w-[calc(100%-2.5rem)]">
//                 <div>
//                     <div
//                         className={`font-semibold text-lg ${
//                             theme === "dark" ? "text-white" : "text-gray-900"
//                         }`}
//                     >
//                         {company}
//                     </div>
//                     <div
//                         className={`text-xs ${
//                             theme === "dark" ? "text-gray-400" : "text-gray-500"
//                         }`}
//                     >
//                         {symbol} • 1D
//                     </div>
//                 </div>
//                 <button
//                     onClick={() =>
//                         setTheme((p) => (p === "light" ? "dark" : "light"))
//                     }
//                     className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-80"
//                 >
//                     {theme === "light" ? "🌙 Dark" : "☀️ Light"}
//                 </button>
//             </div>

//             <div ref={containerRef} className="h-[580px] w-full relative" />
//         </div>
//     );
// }

// /** 📐 Hàm tính MA */
// function calcMA(data: Candle[], length: number) {
//     return data.map((_, i) => {
//         if (i < length) return { time: data[i].time, value: null };
//         const slice = data.slice(i - length, i);
//         const avg =
//             slice.reduce((a, b) => a + (b.close || 0), 0) / slice.length;
//         return { time: data[i].time, value: avg };
//     });
// }

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
    createChart,
    ColorType,
    CrosshairMode,
    CandlestickSeries,
    HistogramSeries,
    LineSeries,
    createTextWatermark,
    type CandlestickData,
    type IChartApi,
} from "lightweight-charts";
import { useAppSelector } from "@/redux/hooks";

interface Candle {
    time: string; // ISO hoặc YYYY-MM-DD
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

/** 🔧 Utility: sort ASC + unique theo time */
const normalizeData = <T extends { time: string }>(arr: T[]): T[] => {
    const sorted = [...arr].sort((a, b) =>
        a.time > b.time ? 1 : a.time < b.time ? -1 : 0
    );
    return sorted.filter((v, i, a) => i === 0 || a[i - 1].time !== v.time);
};

/** 📈 Hàm tính MA (chỉ trả value = number, không null) */
function calcMA(data: Candle[], length: number) {
    const result: { time: string; value: number }[] = [];
    for (let i = length - 1; i < data.length; i++) {
        const slice = data.slice(i - length + 1, i + 1);
        const avg =
            slice.reduce((a, b) => a + (b.close || 0), 0) / slice.length;
        result.push({ time: data[i].time, value: avg });
    }
    return result;
}

export default function TradingViewWidgetPro({ symbol }: { symbol: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    // ✅ Lấy thông tin công ty từ Redux
    const { stocksFullList } = useAppSelector((state) => state.stockSymbols);
    const company = useMemo(() => {
        const found = stocksFullList.find((s) => s.symbol === symbol);
        return found?.organ_name || symbol;
    }, [stocksFullList, symbol]);

    useEffect(() => {
        if (!symbol || !containerRef.current) return;

        const isDark = theme === "dark";
        const bg = isDark ? "#0e1117" : "#ffffff";
        const text = isDark ? "#e5e7eb" : "#1a1a1a";
        const grid = isDark ? "#1c212b" : "#f0f3fa";
        const up = "#26a69a";
        const down = "#ef5350";

        // 🧱 Chart setup
        const chart = createChart(containerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: bg },
                textColor: text,
            },
            grid: { vertLines: { color: grid }, horzLines: { color: grid } },
            width: containerRef.current.clientWidth,
            height: 580,
            crosshair: { mode: CrosshairMode.Normal },
            rightPriceScale: { borderColor: grid },
            timeScale: { borderColor: grid, timeVisible: true },
        });
        chartRef.current = chart;

        // ✅ Candlestick
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: up,
            downColor: down,
            borderUpColor: up,
            borderDownColor: down,
            wickUpColor: up,
            wickDownColor: down,
        });

        // ✅ Volume
        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceScaleId: "",
            priceLineVisible: false,
        });
        chart.priceScale("").applyOptions({
            scaleMargins: { top: 0.82, bottom: 0 },
        });
        volumeSeries.applyOptions({
            priceFormat: {
                type: "custom",
                formatter: (v: number) => {
                    if (v >= 1_000_000_000) {
                        return (v / 1_000_000_000).toFixed(2) + "B"; // ≥ 1 tỷ → hiển thị B
                    } else if (v >= 1_000_000) {
                        return (v / 1_000_000).toFixed(2) + "M"; // ≥ 1 triệu
                    } else if (v >= 1_000) {
                        return (v / 1_000).toFixed(1) + "K"; // ≥ 1 nghìn
                    } else {
                        return v.toFixed(0);
                    }
                },
            },
        });

        // ✅ Tooltip
        const tooltip = document.createElement("div");
        tooltip.className =
            "absolute bg-gray-900/90 text-white text-xs px-2 py-1 rounded shadow pointer-events-none";
        tooltip.style.display = "none";
        tooltipRef.current = tooltip;
        containerRef.current.appendChild(tooltip);

        // 📈 Fetch dữ liệu từ API Python
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL_PYTHON}/stock/${symbol}`
                );
                const raw = await res.json();

                let data: Candle[] = raw.map((d: any) => ({
                    time: (d.date || d.time || "").slice(0, 10),
                    open: +d.open,
                    high: +d.high,
                    low: +d.low,
                    close: +d.close,
                    volume: +d.volume || 0,
                }));

                data = normalizeData(data);

                candleSeries.setData(data);
                volumeSeries.setData(
                    data.map((d) => ({
                        time: d.time,
                        value: d.volume,
                        color: d.close >= d.open ? up : down,
                    }))
                );

                // 📊 MA20
                const ma10 = calcMA(data, 10);
                const ma10Series = chart.addSeries(LineSeries, {
                    color: "#453a8fff",
                    lineWidth: 2,
                    lastValueVisible: false,
                    priceLineVisible: false,
                });
                ma10Series.setData(ma10);

                // 📊 MA20
                const ma50 = calcMA(data, 50);
                const ma50Series = chart.addSeries(LineSeries, {
                    color: "#38BDF8",
                    lineWidth: 2,
                    lastValueVisible: false,
                    priceLineVisible: false,
                });
                ma50Series.setData(ma50);

                // 📊 MA20
                const ma200 = calcMA(data, 200);
                const ma200Series = chart.addSeries(LineSeries, {
                    color: "#f01e17ff",
                    lineWidth: 2,
                    lastValueVisible: false,
                    priceLineVisible: false,
                });
                ma200Series.setData(ma200);
            } catch (err) {
                console.error("❌ Fetch error:", err);
            }
        };
        fetchData();

        // 🧭 Tooltip hover
        chart.subscribeCrosshairMove((param) => {
            if (!param.point || !param.time || !param.seriesData.size) {
                tooltip.style.display = "none";
                return;
            }
            const data = param.seriesData.get(candleSeries) as CandlestickData;
            if (!data) return;
            tooltip.style.display = "block";
            tooltip.style.left = param.point.x + 20 + "px";
            tooltip.style.top = param.point.y + "px";
            tooltip.innerHTML = `
                <div class="font-semibold">${symbol}</div>
                <div>O: ${data.open.toFixed(2)} H: ${data.high.toFixed(2)}</div>
                <div>L: ${data.low.toFixed(2)} C: ${data.close.toFixed(2)}</div>
            `;
        });

        // 💧 Watermark
        const pane = chart.panes()[0];
        createTextWatermark(pane, {
            horzAlign: "center",
            vertAlign: "center",
            lines: [
                {
                    text: symbol,
                    color: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.05)",
                    fontSize: 140,
                    fontStyle: "bold",
                },
            ],
        });

        // 🔄 Resize
        const handleResize = () =>
            chart.applyOptions({ width: containerRef.current!.clientWidth });
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [symbol, theme]);

    return (
        <div
            className={`relative w-full rounded-2xl border ${
                theme === "dark"
                    ? "border-gray-700 bg-[#0e1117]"
                    : "border-gray-200 bg-white"
            } shadow-lg overflow-hidden transition-all`}
        >
            {/* Header giống TradingView */}
            <div className="absolute top-3 left-5 z-10 flex items-center justify-between w-[calc(100%-2.5rem)]">
                <div>
                    <div
                        className={`font-semibold text-lg ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                    >
                        {company}
                    </div>
                    <div
                        className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        {symbol} • 1D
                    </div>
                </div>
                <button
                    onClick={() =>
                        setTheme((p) => (p === "light" ? "dark" : "light"))
                    }
                    className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-80"
                >
                    {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
            </div>

            {/* Chart */}
            <div ref={containerRef} className="h-[580px] w-full relative" />
        </div>
    );
}
