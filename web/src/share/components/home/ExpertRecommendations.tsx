"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchStockRecsQuery } from "@/store/stock-recommendations/stock-recommendations.api";
import { fetchStockCandleData } from "@/store/stock-symbols/stock-symbols.api";
import RecommendationDetailDialog from "./RecommendationDetailDialog";
import { BadgeStatus } from "./BadgeStatus";
import { StockRecommendationStatus } from "@/share/enum";

export default function ExpertRecommendations() {
    const dispatch = useAppDispatch();

    // 🔥 Lấy dữ liệu expert từ redux
    const { list: data, loading }: { list: any; loading: any } = useAppSelector(
        (state) => state.stockRecommendations
    );

    const [prices, setPrices] = useState<Record<string, number>>({});
    const [open, setOpen] = useState(false);
    const [detailItem, setDetailItem] = useState<any>(null);

    // 🔥 Fetch EXPERT data khi component mount
    useEffect(() => {
        dispatch(fetchStockRecsQuery({ page: 1, limit: 10 }));
    }, [dispatch]);

    // 🔥 Lấy giá từng mã
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
    }, [data, dispatch]);

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
                    <div className="col-span-2 text-left">MÔ TẢ</div>
                    <div>GIÁ HIỆN TẠI</div>
                    <div>CHI TIẾT</div>
                </div>

                {/* Body */}
                {data.map((i: any, index: number) => (
                    <div
                        key={`${i.id}-${index}`}
                        className="grid grid-cols-8 py-4 px-4 text-sm bg-white border-t"
                    >
                        <div className="font-semibold flex items-center justify-center">
                            {i.stock.code}
                        </div>

                        <div className="text-yellow-600 font-semibold flex items-center justify-center">
                            {i.buyPrice}
                        </div>

                        <div className="text-green-600 font-semibold flex items-center justify-center">
                            {i.targetPrice}
                        </div>

                        <div className="text-red-600 font-semibold flex items-center justify-center">
                            {i.stopLossPrice}
                        </div>

                        <div className="col-span-2 line-clamp-2 text-ellipsis overflow-hidden text-left">
                            {i.note || "—"}
                        </div>

                        <div className="font-semibold flex items-center justify-center">
                            {i.status === StockRecommendationStatus.STOP_LOSS ||
                            i.status ===
                                StockRecommendationStatus.TARGET_HIT ? (
                                <BadgeStatus status={i.status as any} />
                            ) : (
                                <div className="text-blue-600 font-semibold">
                                    {prices?.[i.stock.code] ?? "Đang lấy..."}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center items-center">
                            <div
                                onClick={() => {
                                    setDetailItem(i);
                                    setOpen(true);
                                }}
                                className="text-[#6A5AF9] hover:text-[#4A1FB8] flex items-center gap-1 cursor-pointer"
                            >
                                Xem chi tiết
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {open && (
                <RecommendationDetailDialog
                    open={open}
                    onOpenChange={setOpen}
                    item={detailItem}
                    price={
                        detailItem ? prices[detailItem.stock.code] : undefined
                    }
                />
            )}
        </>
    );
}
