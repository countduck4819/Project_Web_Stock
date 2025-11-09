// "use client";

// import {
//     createChart,
//     ColorType,
//     CrosshairMode,
//     LineSeries,
//     HistogramSeries,
//     CandlestickSeries,
// } from "lightweight-charts";
// import { useEffect, useRef, useState } from "react";

// interface Candle {
//     time: number; // UNIX timestamp (giây)
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume?: number;
// }

// export default function StockChart({ symbol }: { symbol: string }) {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [period, setPeriod] = useState("3m");
//     const [hoverInfo, setHoverInfo] = useState<any>(null);

//     useEffect(() => {
//         if (!containerRef.current) return;

//         //   Tạo chart
//         const chart = createChart(containerRef.current, {
//             width: containerRef.current.clientWidth,
//             height: 500,
//             layout: {
//                 background: { type: ColorType.Solid, color: "#ffffff" },
//                 textColor: "#1e293b",
//             },
//             grid: {
//                 vertLines: { color: "#e5e7eb" },
//                 horzLines: { color: "#e5e7eb" },
//             },
//             crosshair: { mode: CrosshairMode.Normal },
//             timeScale: { borderColor: "#cbd5e1", timeVisible: true },
//             rightPriceScale: { borderColor: "#cbd5e1" },
//         });

//         //   Các series
//         const candleSeries = chart.addSeries(CandlestickSeries, {
//             upColor: "#00b894",
//             borderUpColor: "#00b894",
//             wickUpColor: "#00b894",
//             downColor: "#e17055",
//             borderDownColor: "#e17055",
//             wickDownColor: "#e17055",
//         });

//         const volumeSeries = chart.addSeries(HistogramSeries, {
//             priceFormat: { type: "volume" },
//             priceScaleId: "",
//         });
//         volumeSeries.priceScale().applyOptions({
//             scaleMargins: { top: 0.8, bottom: 0 },
//         });

//         const ma10Series = chart.addSeries(LineSeries, {
//             color: "#8e44ad",
//             lineWidth: 2,
//         });

//         const ma50Series = chart.addSeries(LineSeries, {
//             color: "#3498db",
//             lineWidth: 2,
//         });

//         // 🧩 Convert UNIX timestamp → ISO UTC string (TradingView format)
//         const toUTC = (t: number) => new Date(t * 1000).toISOString();

//         async function fetchData() {
//             const res = await fetch(
//                 `http://fireant_python:6060/api/stock/${symbol}`
//             );
//             const data: Candle[] = await res.json();

//             if (!data?.length) {
//                 console.warn("⚠️ Không có dữ liệu!");
//                 return;
//             }

//             data.sort((a, b) => a.time - b.time);

//             // 🔹 Set candlestick data
//             candleSeries.setData(
//                 data.map((d) => ({
//                     time: toUTC(d.time),
//                     open: d.open,
//                     high: d.high,
//                     low: d.low,
//                     close: d.close,
//                 }))
//             );

//             // 🔹 Set volume bars
//             volumeSeries.setData(
//                 data.map((d) => ({
//                     time: toUTC(d.time),
//                     value: d.volume || 0,
//                     color: d.close >= d.open ? "#00b894" : "#e17055",
//                 }))
//             );

//             // 🔹 Tính MA10 / MA50
//             const calcMA = (arr: Candle[], len: number) =>
//                 arr.map((_, i) => {
//                     const time = toUTC(arr[i].time);
//                     if (i < len) return { time, value: NaN };
//                     const slice = arr.slice(i - len, i);
//                     const avg = slice.reduce((s, d) => s + d.close, 0) / len;
//                     return { time, value: avg };
//                 });

//             ma10Series.setData(calcMA(data, 10));
//             ma50Series.setData(calcMA(data, 50));

//             // ✅ Fit khung hình sau khi set xong data
//             chart.timeScale().fitContent();

//             // 🟡 Tooltip crosshair
//             chart.subscribeCrosshairMove((param) => {
//                 if (!param?.time || !param.seriesData.size) {
//                     setHoverInfo(null);
//                     return;
//                 }

//                 const candle = param.seriesData.get(candleSeries) as any;
//                 const ma10Point = param.seriesData.get(ma10Series);
//                 const ma50Point = param.seriesData.get(ma50Series);

//                 if (!candle) return;

//                 const ma10 =
//                     ma10Point && "value" in ma10Point
//                         ? (ma10Point.value as number)
//                         : undefined;
//                 const ma50 =
//                     ma50Point && "value" in ma50Point
//                         ? (ma50Point.value as number)
//                         : undefined;

//                 setHoverInfo({
//                     open: candle.open,
//                     high: candle.high,
//                     low: candle.low,
//                     close: candle.close,
//                     volume: candle.volume,
//                     ma10: ma10?.toFixed?.(2),
//                     ma50: ma50?.toFixed?.(2),
//                 });
//             });
//         }

//         fetchData();

//         const resize = () => {
//             chart.applyOptions({ width: containerRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", resize);

//         return () => {
//             window.removeEventListener("resize", resize);
//             chart.remove();
//         };
//     }, [symbol, period]);

//     // 🧱 JSX render
//     return (
//         <div className="w-full flex flex-col gap-2">
//             <div className="relative">
//                 <div ref={containerRef} className="w-full h-[500px]" />

//                 {/* Tooltip */}
//                 {hoverInfo && (
//                     <div className="absolute top-2 left-3 text-[13px] bg-white/95 text-gray-700 px-3 py-1 rounded-md shadow border border-gray-200 flex flex-wrap gap-3">
//                         <div>
//                             <span className="font-semibold text-gray-800">
//                                 O
//                             </span>{" "}
//                             {hoverInfo.open?.toFixed?.(2)}{" "}
//                             <span className="font-semibold text-gray-800">
//                                 H
//                             </span>{" "}
//                             {hoverInfo.high?.toFixed?.(2)}{" "}
//                             <span className="font-semibold text-gray-800">
//                                 L
//                             </span>{" "}
//                             {hoverInfo.low?.toFixed?.(2)}{" "}
//                             <span className="font-semibold text-gray-800">
//                                 C
//                             </span>{" "}
//                             {hoverInfo.close?.toFixed?.(2)}
//                         </div>
//                         <div className="text-red-500">
//                             Vol{" "}
//                             {hoverInfo.volume
//                                 ? (hoverInfo.volume / 1_000_000).toFixed(2) +
//                                   "M"
//                                 : "-"}
//                         </div>
//                         <div className="text-purple-600">
//                             MA10 {hoverInfo.ma10}
//                         </div>
//                         <div className="text-blue-500">
//                             MA50 {hoverInfo.ma50}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Thanh chọn thời gian */}
//             <div className="flex justify-center gap-2 text-sm text-gray-700 mt-2">
//                 {["1d", "1m", "3m", "6m", "1y", "3y", "5y"].map((p) => (
//                     <button
//                         key={p}
//                         onClick={() => setPeriod(p)}
//                         className={`px-3 py-1 rounded-md border ${
//                             period === p
//                                 ? "bg-blue-600 border-blue-500 text-white"
//                                 : "border-gray-300 hover:bg-gray-100"
//                         }`}
//                     >
//                         {p.toUpperCase()}
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// }
"use client";
import { useEffect } from "react";

declare global {
    interface Window {
        TradingView: any;
    }
}

export default function StockChart({ symbol = "VCB" }) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => {
            new window.TradingView.widget({
                container_id: "tradingview_advanced",
                autosize: true,
                symbol,
                interval: "D",
                timezone: "Asia/Ho_Chi_Minh",
                theme: "light",
                style: "1",
                locale: "vi_VN",
                enable_publishing: false,
                allow_symbol_change: true,
                hide_side_toolbar: false,
            });
        };
        document.body.appendChild(script);
    }, [symbol]);

    return (
        <div
            id="tradingview_advanced"
            className="w-full h-[600px] border rounded-md shadow"
        />
    );
}
