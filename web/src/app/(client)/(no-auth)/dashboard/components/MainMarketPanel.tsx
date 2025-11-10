// "use client";
// import React, { useEffect, useState } from "react";
// import ReactECharts from "echarts-for-react";
// import { useAppDispatch } from "@/redux/hooks";
// import { fetchStockCandleData } from "@/store/stock-symbols/stock-symbols.api";
// import Loading from "@/share/components/Loading";

// const SECTORS = [
//     {
//         name: "Tài chính",
//         stocks: [
//             "SHB",
//             "VIX",
//             "SSI",
//             "MBB",
//             "VPB",
//             "VND",
//             "VCI",
//             "CTG",
//             "EVS",
//             "HCM",
//             "VDS",
//             "ORS",
//             "STB",
//             "ACB",
//             "HDB",
//         ],
//     },
//     {
//         name: "Bất động sản",
//         stocks: [
//             "CEO",
//             "NVL",
//             "VRE",
//             "LDG",
//             "VHM",
//             "DIG",
//             "PDR",
//             "DXG",
//             "KDH",
//             "SCR",
//             "NLG",
//             "VIC",
//             "TCH",
//             "DLG",
//         ],
//     },
//     {
//         name: "Công nghiệp",
//         stocks: ["GEX", "HHV", "CII", "VSC", "VCG", "GMD", "PC1", "HAH"],
//     },
//     {
//         name: "Thép và vật liệu cơ bản",
//         stocks: [
//             "HPG",
//             "NKG",
//             "HSG",
//             "DPM",
//             "DGC",
//             "AAA",
//             "GVR",
//             "DCM",
//             "BFC",
//             "PLC",
//         ],
//     },
//     {
//         name: "Công nghệ Thông tin",
//         stocks: ["FPT", "ELC", "CMG", "VTP", "ITD", "SAM"],
//     },
//     {
//         name: "Bán lẻ & tiêu dùng",
//         stocks: [
//             "MWG",
//             "PNJ",
//             "VNM",
//             "MSN",
//             "SAB",
//             "BHN",
//             "HAG",
//             "QNS",
//             "KDC",
//             "TLG",
//         ],
//     },
// ];

// export default function MarketHeatmap() {
//     const dispatch = useAppDispatch();
//     const [data, setData] = useState<any[]>([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const loadData = async () => {
//             setLoading(true);
//             const results: any[] = [];

//             for (const sector of SECTORS) {
//                 const children: any[] = [];

//                 await Promise.all(
//                     sector.stocks.map(async (symbol) => {
//                         try {
//                             const res = await dispatch(
//                                 fetchStockCandleData(symbol)
//                             ).unwrap();

//                             let change = 0;
//                             if (Array.isArray(res) && res.length >= 2) {
//                                 const last = res[res.length - 1];
//                                 const prev = res[res.length - 2];

//                                 if (prev?.close && last?.close) {
//                                     change =
//                                         ((last.close - prev.close) /
//                                             prev.close) *
//                                         100;
//                                 } else {
//                                     change = 0;
//                                 }
//                             } else {
//                                 change = (Math.random() - 0.5) * 10;
//                             }

//                             // ✅ Gán màu theo giá trị change
//                             let color = "#cccc00"; // vàng (0%)
//                             if (change > 2) color = "#46c100"; // xanh mạnh
//                             else if (change > 0) color = "#75c500"; // xanh nhẹ
//                             else if (change < -2) color = "#bb0000"; // đỏ mạnh
//                             else if (change < 0) color = "#c46700"; // đỏ nhẹ

//                             children.push({
//                                 name: `${symbol}\n${change.toFixed(2)}%`,
//                                 value: Math.abs(change) || 1,
//                                 change,
//                                 itemStyle: { color },
//                             });
//                         } catch {
//                             // ✅ Mock fallback nếu lỗi API
//                             const mock = (Math.random() - 0.5) * 10;
//                             let color = "#cccc00"; // vàng (0%)
//                             if (mock > 2) color = "#46c100"; // xanh mạnh
//                             else if (mock > 0) color = "#75c500"; // xanh nhẹ
//                             else if (mock < -2) color = "#bb0000"; // đỏ mạnh
//                             else if (mock < 0) color = "#c46700"; // đỏ nhẹ

//                             children.push({
//                                 name: `${symbol}\n${mock.toFixed(2)}%`,
//                                 value: Math.abs(mock) || 1,
//                                 change: mock,
//                                 itemStyle: { color },
//                             });
//                         }
//                     })
//                 );

//                 results.push({ name: sector.name, children });
//             }

//             setData(results);
//             setLoading(false);
//         };

//         loadData();
//     }, [dispatch]);

//     const option = {
//         tooltip: {
//             backgroundColor: "rgba(0,0,0,0.85)",
//             borderWidth: 0,
//             textStyle: { color: "#fff" },
//             formatter: (p: any) => {
//                 const c = p?.data?.change;
//                 if (typeof c !== "number" || isNaN(c))
//                     return `<b>${p.name}</b>`;
//                 const sign = c >= 0 ? "+" : "";
//                 const name = (p.name || "").split("\n")[0];
//                 return `<b>${name}</b><br/>Thay đổi: ${sign}${c.toFixed(2)}%`;
//             },
//         },
//         series: [
//             {
//                 type: "treemap",
//                 roam: false,
//                 nodeClick: false,
//                 breadcrumb: { show: false },
//                 label: {
//                     show: true,
//                     color: "#fff",
//                     fontSize: 11,
//                     formatter: "{b}",
//                 },
//                 upperLabel: {
//                     show: true,
//                     height: 22,
//                     color: "#fff",
//                     backgroundColor: "rgba(255,255,255,0.08)",
//                 },
//                 itemStyle: {
//                     borderColor: "#0b0f1a",
//                     borderWidth: 1,
//                     gapWidth: 1,
//                 },
//                 data,
//             },
//         ],
//     };

//     return (
//         <div className="relative bg-[#111827] rounded-lg overflow-hidden h-full">
//             {loading ? (
//                 <div className="absolute inset-0 flex items-center justify-center bg-[#111827] z-10">
//                     <Loading />
//                 </div>
//             ) : (
//                 <ReactECharts
//                     option={option}
//                     style={{ height: "100%", width: "100%" }}
//                 />
//             )}
//         </div>
//     );
// }

"use client";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchStockCandleData } from "@/store/stock-symbols/stock-symbols.api";
import Loading from "@/share/components/Loading";

const SECTORS = [
    {
        name: "Tài chính",
        stocks: [
            "SHB",
            "VIX",
            "SSI",
            "MBB",
            "VPB",
            "VND",
            "VCI",
            "CTG",
            "EVS",
            "HCM",
            "VDS",
            "ORS",
            "STB",
            "ACB",
            "HDB",
        ],
    },
    {
        name: "Bất động sản",
        stocks: [
            "CEO",
            "NVL",
            "VRE",
            "LDG",
            "VHM",
            "DIG",
            "PDR",
            "DXG",
            "KDH",
            "SCR",
            "NLG",
            "VIC",
            "TCH",
            "DLG",
        ],
    },
    {
        name: "Công nghiệp",
        stocks: ["GEX", "HHV", "CII", "VSC", "VCG", "GMD", "PC1", "HAH"],
    },
    {
        name: "Thép và vật liệu cơ bản",
        stocks: [
            "HPG",
            "NKG",
            "HSG",
            "DPM",
            "DGC",
            "AAA",
            "GVR",
            "DCM",
            "BFC",
            "PLC",
        ],
    },
    {
        name: "Công nghệ Thông tin",
        stocks: ["FPT", "ELC", "CMG", "VTP", "ITD", "SAM"],
    },
    {
        name: "Bán lẻ & tiêu dùng",
        stocks: [
            "MWG",
            "PNJ",
            "VNM",
            "MSN",
            "SAB",
            "BHN",
            "HAG",
            "QNS",
            "KDC",
            "TLG",
        ],
    },
];

export default function MarketHeatmap() {
    const dispatch = useAppDispatch();
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

                            // 🎨 Gán màu theo % thay đổi
                            let color = "#cccc00"; // vàng
                            if (change > 2) color = "#46c100";
                            else if (change > 0) color = "#75c500";
                            else if (change < -2) color = "#bb0000";
                            else if (change < 0) color = "#c46700";

                            children.push({
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
    }, [dispatch]);

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
                    color: "#111", // 🌟 tiêu đề ngành đen
                    backgroundColor: "#f5f5f5", // nền sáng
                },
                itemStyle: {
                    borderColor: "#ffffff",
                    borderWidth: 0.5, // 🌟 đường viền trắng rõ
                    gapWidth: 0.5,
                },
                data,
            },
        ],
    };

    return (
        <div className="relative bg-white rounded-lg overflow-hidden h-full border border-gray-200 ">
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <Loading />
                </div>
            ) : (
                <ReactECharts
                    option={option}
                    style={{ height: "100%", width: "100%" }}
                />
            )}
        </div>
    );
}
