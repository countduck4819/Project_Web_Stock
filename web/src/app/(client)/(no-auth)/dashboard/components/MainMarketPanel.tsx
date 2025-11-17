"use client";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchStockCandleData } from "@/store/stock-symbols/stock-symbols.api";
import Loading from "@/share/components/Loading";
import { SECTORS } from "@/const/const";
import RightPanel from "./RightPanel";
import { useRouter } from "next/navigation";

export default function MarketHeatmap() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const results: any[] = [];

            for (const sector of SECTORS) {
                const children: any[] = [];

                await Promise.all(
                    sector.stocks.map(async (symbol) => {
                        try {
                            const res = await dispatch(
                                fetchStockCandleData(symbol)
                            ).unwrap();
                            let change = 0;
                            if (Array.isArray(res) && res.length >= 2) {
                                const last = res[res.length - 1];
                                const prev = res[res.length - 2];
                                if (prev?.close && last?.close)
                                    change =
                                        ((last.close - prev.close) /
                                            prev.close) *
                                        100;
                            } else {
                                change = (Math.random() - 0.5) * 10;
                            }

                            let color = "#cccc00";
                            if (change > 2) color = "#46c100";
                            else if (change > 0) color = "#75c500";
                            else if (change < -2) color = "#bb0000";
                            else if (change < 0) color = "#c46700";

                            children.push({
                                symbol,
                                name: `${symbol}\n${change.toFixed(2)}%`,
                                value: Math.abs(change) || 1,
                                change,
                                itemStyle: { color },
                            });
                        } catch {
                            const mock = (Math.random() - 0.5) * 10;
                            let color = "#cccc00";
                            if (mock > 2) color = "#46c100";
                            else if (mock > 0) color = "#75c500";
                            else if (mock < -2) color = "#bb0000";
                            else if (mock < 0) color = "#c46700";
                            children.push({
                                symbol,
                                name: `${symbol}\n${mock.toFixed(2)}%`,
                                value: Math.abs(mock) || 1,
                                change: mock,
                                itemStyle: { color },
                            });
                        }
                    })
                );

                results.push({ name: sector.name, children });
            }

            setData(results);
            setLoading(false);
        };
        loadData();
    }, []);

    const option = {
        backgroundColor: "#ffffff",
        tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            borderWidth: 0,
            textStyle: { color: "#fff" },
            formatter: (p: any) => {
                const c = p?.data?.change;
                if (typeof c !== "number" || isNaN(c))
                    return `<b>${p.name}</b>`;
                const sign = c >= 0 ? "+" : "";
                const name = (p.name || "").split("\n")[0];
                return `<b>${name}</b><br/>Thay đổi: ${sign}${c.toFixed(2)}%`;
            },
        },
        series: [
            {
                type: "treemap",
                roam: false,
                nodeClick: false,
                breadcrumb: { show: false },

                label: {
                    show: true,
                    color: "#fff",
                    fontSize: 11,
                    formatter: "{b}",
                },
                upperLabel: {
                    show: true,
                    height: 22,
                    color: "#111",
                    backgroundColor: "#f5f5f5",
                },
                itemStyle: {
                    borderColor: "#ffffff",
                    borderWidth: 0.5,
                    gapWidth: 0.5,
                },
                data,
            },
        ],
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <section className="relative grid grid-cols-[1fr_20rem] space-x-[1.5rem] bg-[#fff] text-white">
                    <div className="sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)]">
                        <div className="relative bg-white rounded-lg overflow-hidden h-full border border-gray-200 ">
                            <ReactECharts
                                option={option}
                                style={{ height: "100%", width: "100%" }}
                                onEvents={{
                                    click: (params: any) => {
                                        console.log(params);
                                        if (params?.data?.symbol) {
                                            router.push(
                                                `/ma-chung-khoan/${params.data.symbol}`
                                            );
                                        }
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <RightPanel />
                </section>
            )}
        </>
    );
}
