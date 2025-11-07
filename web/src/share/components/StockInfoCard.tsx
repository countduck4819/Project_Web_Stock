"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchFinanceIndex } from "@/store/finance-index/finance-index.api";

export default function StockInfoCard({ symbol }: { symbol?: string }) {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector((state) => state.financeIndex);

    // Ưu tiên prop symbol → fallback về URL param
    const stock = (symbol || String(params.stock || "")).toUpperCase();

    useEffect(() => {
        if (!stock) return;
        dispatch(fetchFinanceIndex(stock));
    }, [stock]);

    if (loading)
        return (
            <div className="p-4 text-sm text-gray-500 bg-white border rounded-lg shadow-sm">
                Đang tải dữ liệu...
            </div>
        );

    if (!data || Object.keys(data).length === 0)
        return (
            <div className="p-4 text-sm text-gray-500 bg-white border rounded-lg shadow-sm">
                Không có dữ liệu
            </div>
        );

    const financeIndexData = data?.[0]; // alias

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

    const colored = (v: any) => {
        const num = Number(v);
        if (isNaN(num)) return "text-gray-800";
        if (num > 0) return "text-green-600 font-semibold";
        if (num < 0) return "text-red-500 font-semibold";
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
                            {formatNum(
                                financeIndexData["Chỉ tiêu định giá P/E"]
                            )}
                        </span>
                    }
                />
                <Row
                    label="Mở cửa"
                    value={
                        <span className="text-red-500">
                            {formatNum(
                                financeIndexData["Chỉ tiêu định giá P/B"]
                            )}
                        </span>
                    }
                />
                <Row
                    label="Thấp - Cao"
                    value={
                        <span>
                            <span className="text-red-500">
                                {formatNum(
                                    financeIndexData["Chỉ tiêu định giá P/S"]
                                )}
                            </span>{" "}
                            -{" "}
                            <span className="text-green-600">
                                {formatNum(
                                    financeIndexData[
                                        "Chỉ tiêu định giá P/Cash Flow"
                                    ]
                                )}
                            </span>
                        </span>
                    }
                />
                <Row
                    label="Khối lượng"
                    value={formatNum(
                        financeIndexData[
                            "Chỉ tiêu định giá Outstanding Share (Mil. Shares)"
                        ]
                    )}
                />
                <Row
                    label="Giá trị"
                    value={formatNum(
                        financeIndexData[
                            "Chỉ tiêu định giá Market Capital (Bn. VND)"
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
                <Row
                    label="Vốn hóa"
                    value={formatNum(
                        financeIndexData[
                            "Chỉ tiêu định giá Market Capital (Bn. VND)"
                        ]
                    )}
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
