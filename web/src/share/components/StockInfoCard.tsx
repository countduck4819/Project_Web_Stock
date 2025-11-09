"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchFinanceIndex } from "@/store/finance-index/finance-index.api";

export default function StockInfoCard({ symbol }: { symbol?: string }) {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { data } = useAppSelector((state) => state.financeIndex);
    const { candleData } = useAppSelector((state) => state.stockSymbols);

    const stock = (symbol || String(params.stock || "")).toUpperCase();

    useEffect(() => {
        if (!stock) return;
        dispatch(fetchFinanceIndex(stock));
    }, [stock]);

    const financeIndexData = data?.[0] ?? {};

    // --- Lấy dữ liệu giá ---
    const last = candleData.at(-1);
    const prev = candleData.at(-2);
    const reference = prev?.close ?? 0;
    const open = last?.open ?? 0;
    const low = last?.low ?? 0;
    const high = last?.high ?? 0;
    const volume = last?.volume ?? 0;
    const value = (volume * open) / 1_000_000_000; // Tỷ đồng

    // --- Helper ---
    const formatNum = (v: any, digits = 2) => {
        if (v === null || v === undefined || v === "") return "-";
        const num = Number(v);
        if (isNaN(num)) return v;
        if (Math.abs(num) >= 1_000_000_000_000)
            return (num / 1_000_000_000_000).toFixed(digits) + " nghìn tỷ";
        if (Math.abs(num) >= 1_000_000_000)
            return (num / 1_000_000_000).toFixed(digits) + " tỷ";
        if (Math.abs(num) >= 1_000_000)
            return (num / 1_000_000).toFixed(digits) + " tr";
        return num.toLocaleString("vi-VN");
    };

    const colored = (
        v: any,
        { positive = "text-green-600", negative = "text-red-500" } = {}
    ) => {
        const num = Number(v);
        if (isNaN(num)) return "text-gray-800";
        if (num > 0) return `${positive} font-semibold`;
        if (num < 0) return `${negative} font-semibold`;
        return "text-gray-800";
    };

    return (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden text-sm">
            {/* Header */}
            <div className="flex border-b bg-[#F5F9FF] items-center justify-between px-3 py-2">
                <div className="font-semibold text-[0.95rem] text-blue-900">
                    Tổng quan
                </div>
                <div className="text-sm text-gray-600 font-medium">
                    {stock || "-"}
                </div>
            </div>

            {/* Body */}
            <div className="divide-y divide-gray-100 p-3">
                <Row
                    label="Tham chiếu"
                    value={
                        <span className="text-amber-500">
                            {reference.toFixed(2)}
                        </span>
                    }
                />
                <Row
                    label="Mở cửa"
                    value={
                        <span className="text-green-600">
                            {open.toFixed(2)}
                        </span>
                    }
                />
                <Row
                    label="Thấp - Cao"
                    value={
                        <span>
                            <span className="text-red-500">
                                {low.toFixed(2)}
                            </span>{" "}
                            -{" "}
                            <span className="text-green-600">
                                {high.toFixed(2)}
                            </span>
                        </span>
                    }
                />
                <Row
                    label="Khối lượng"
                    value={volume.toLocaleString("vi-VN")}
                />
                <Row label="Giá trị" value={`${value.toFixed(2)} tỷ`} />
                <Row
                    label="KLTB 10 ngày"
                    value={formatNum(
                        financeIndexData[
                            "Chỉ tiêu định giá Outstanding Share (Mil. Shares)"
                        ]
                    )}
                />
                <Row
                    label="Beta"
                    value={formatNum(
                        financeIndexData[
                            "Chỉ tiêu thanh khoản Financial Leverage"
                        ]
                    )}
                />
                <Row
                    label="Thị giá vốn"
                    value={`${formatNum(
                        financeIndexData[
                            "Chỉ tiêu định giá Market Capital (Bn. VND)"
                        ],
                        2
                    )}`}
                />
                <Row
                    label="Số lượng CPHL"
                    value={formatNum(
                        financeIndexData[
                            "Chỉ tiêu định giá Outstanding Share (Mil. Shares)"
                        ]
                    )}
                />
                <Row
                    label="P/E"
                    value={
                        <span
                            className={colored(
                                financeIndexData["Chỉ tiêu định giá P/E"]
                            )}
                        >
                            {formatNum(
                                financeIndexData["Chỉ tiêu định giá P/E"]
                            )}
                        </span>
                    }
                />
                <Row
                    label="EPS"
                    value={
                        <span
                            className={colored(
                                financeIndexData["Chỉ tiêu định giá EPS (VND)"]
                            )}
                        >
                            {formatNum(
                                financeIndexData["Chỉ tiêu định giá EPS (VND)"]
                            )}
                        </span>
                    }
                />
            </div>
        </div>
    );
}

function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | React.ReactNode;
}) {
    return (
        <div className="flex justify-between py-1.5">
            <span className="text-gray-600">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}
