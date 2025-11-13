"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchStockCandleData } from "@/store/stock-symbols/stock-symbols.api";
import { Eye } from "lucide-react";
import RecommendationDetailDialog from "./RecommendationDetailDialog";

interface StockRecommendation {
    id: string;
    stock: { code: string; name: string };
    buyPrice: number;
    targetPrice: number;
    stopLossPrice: number;
    note?: string;
}

export default function ExpertRecommendations({
    data,
    loading,
}: {
    data: StockRecommendation[];
    loading: boolean;
}) {
    const dispatch = useAppDispatch();
    const [prices, setPrices] = useState<Record<string, number>>({});

    const [open, setOpen] = useState(false);
    const [detailItem, setDetailItem] = useState<StockRecommendation | null>(
        null
    );

    // Lấy giá từng mã
    useEffect(() => {
        if (!Array.isArray(data) || data.length === 0) return;

        data.forEach((item) => {
            const symbol = item.stock.code;

            dispatch(fetchStockCandleData(symbol)).then((res: any) => {
                if (res?.payload?.length > 0) {
                    const last = res.payload[res.payload.length - 1].close;

                    setPrices((prev) => ({
                        ...prev,
                        [symbol]: last,
                    }));
                }
            });
        });
    }, [data]);

    if (loading)
        return <p className="text-center py-6 text-gray-500">Đang tải...</p>;
    if (!data?.length)
        return (
            <p className="text-center py-6 text-gray-500">Không có dữ liệu.</p>
        );

    return (
        <>
            <div className="rounded-xl border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-8 bg-gradient-to-r from-[#6A5AF9] to-[#4A1FB8] text-white font-semibold text-sm py-3 px-4 text-center">
                    <div>MÃ</div>
                    <div>GIÁ MUA</div>
                    <div>GIÁ CHỐT LỜI</div>
                    <div>GIÁ CẮT LỖ</div>

                    {/* cột mô tả vẫn để trái */}
                    <div className="col-span-2 text-left">MÔ TẢ</div>

                    <div>GIÁ HIỆN TẠI</div>
                    <div>CHI TIẾT</div>
                </div>

                {/* Body */}
                {data.map((i) => (
                    <div
                        key={i.id}
                        className="grid grid-cols-8 py-4 px-4 text-sm bg-white border-t"
                    >
                        {/* Mã */}
                        <div className="font-semibold flex items-center justify-center">
                            {i.stock.code}
                        </div>

                        {/* Giá mua */}
                        <div className="text-yellow-600 font-semibold flex items-center justify-center">
                            {i.buyPrice}
                        </div>

                        {/* Giá chốt lời */}
                        <div className="text-green-600 font-semibold flex items-center justify-center">
                            {i.targetPrice}
                        </div>

                        {/* Cắt lỗ */}
                        <div className="text-red-600 font-semibold flex items-center justify-center">
                            {i.stopLossPrice}
                        </div>

                        {/* Mô tả */}
                        <div className="col-span-2 line-clamp-2 text-ellipsis overflow-hidden text-left">
                            {i.note || "—"}
                        </div>

                        {/* Giá hiện tại */}
                        <div className="text-blue-600 font-semibold flex items-center justify-center">
                            {prices?.[i.stock.code] ?? "Đang lấy..."}
                        </div>

                        {/* Chi tiết */}
                        <div className="flex justify-center items-center">
                            <button
                                onClick={() => {
                                    setDetailItem(i);
                                    setOpen(true);
                                }}
                                className="text-[#6A5AF9] hover:text-[#4A1FB8] flex items-center gap-1"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popup */}
            <RecommendationDetailDialog
                open={open}
                onOpenChange={setOpen}
                item={detailItem}
                price={detailItem ? prices[detailItem.stock.code] : undefined}
            />
        </>
    );
}
