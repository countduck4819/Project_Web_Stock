"use client";

import { useEffect, useRef } from "react";

export default function LeftPanel() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Nếu script đã load rồi thì chỉ cần re-render lại widget
        if (window.TradingView && window.TradingView.MediumWidget) {
            new window.TradingView.MediumWidget({
                container_id: "tradingview-overview",
                symbols: [
                    ["VNINDEX", "HOSE:VNINDEX|1D"],
                    ["HNXINDEX", "HNX:HNXINDEX|1D"],
                    ["UPINDEX", "UPCOM:UPINDEX|1D"],
                    ["VN30", "HOSE:VN30|1D"],
                    ["VN30F1M", "HNX:VN30F1M|1D"],
                ],
                width: "100%",
                height: 700,
                locale: "vi",
                colorTheme: "light",
                showChart: true,
                scalePosition: "right",
                scaleMode: "Normal",
                isTransparent: false,
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                noTimeScale: false,
                chartType: "area",
            });
            return;
        }

        // Nếu chưa load script thì tạo script
        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            colorTheme: "light",
            dateRange: "3M",
            showChart: true,
            locale: "vi",
            width: "100%",
            height: 700,
            largeChartUrl: "",
            isTransparent: false,
            showSymbolLogo: true,
            showFloatingTooltip: false,
            plotLineColorGrowing: "rgba(41, 98, 255, 1)",
            plotLineColorFalling: "rgba(255, 0, 0, 1)",
            gridLineColor: "rgba(240, 243, 250, 1)",
            scaleFontColor: "rgba(120, 123, 134, 1)",
            belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
            belowLineFillColorFalling: "rgba(255, 0, 0, 0.12)",
            tabs: [
                {
                    title: "Việt Nam",
                    symbols: [
                        { s: "HOSE:VNINDEX", d: "VNINDEX" },
                        { s: "HNX:HNXINDEX", d: "HNXINDEX" },
                        { s: "UPCOM:UPINDEX", d: "UPINDEX" },
                        { s: "HOSE:VN30", d: "VN30" },
                        { s: "HNX:VN30F1M", d: "VN30F1M" },
                    ],
                    originalTitle: "Việt Nam",
                },
                {
                    title: "Châu Mỹ",
                    symbols: [
                        { s: "NASDAQ:NDX", d: "Nasdaq 100" },
                        { s: "SP:SPX", d: "S&P 500" },
                        { s: "DJI:DJI", d: "Dow Jones" },
                    ],
                    originalTitle: "Châu Mỹ",
                },
                {
                    title: "Châu Âu",
                    symbols: [
                        { s: "INDEX:CAC40", d: "CAC 40" },
                        { s: "INDEX:DAX", d: "DAX" },
                        { s: "INDEX:FTSE", d: "FTSE 100" },
                    ],
                    originalTitle: "Châu Âu",
                },
                {
                    title: "Châu Á",
                    symbols: [
                        { s: "INDEX:NKY", d: "Nikkei 225" },
                        { s: "INDEX:HSI", d: "Hang Seng" },
                        { s: "INDEX:STI", d: "STI" },
                    ],
                    originalTitle: "Châu Á",
                },
            ],
        });

        containerRef.current?.appendChild(script);
    }, []);

    return (
        <div
            ref={containerRef}
            className="rounded-lg overflow-hidden bg-white border border-gray-200"
        >
            <div id="tradingview-overview" className="h-[43.75rem]" />
        </div>
    );
}
