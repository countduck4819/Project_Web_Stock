"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Clock, Star, X } from "lucide-react";
import TradingViewWidgetPro from "../TradingViewWidget";
import { useAppSelector } from "@/redux/hooks";

export default function RecommendationDetailDialog({
    open,
    onOpenChange,
    item,
    price, // giá hiện tại
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    item: any;
    price: number | undefined;
}) {
    if (!item) return null;

    // LẤY CANDLE ĐỂ TÍNH CHANGE & %
    const candleData = useAppSelector((s) => s.stockSymbols.candleData);
    const latest = candleData[candleData.length - 1];
    const prev = candleData[candleData.length - 2];

    const currentClose = latest?.close ?? price ?? 0;
    const prevClose = prev?.close ?? currentClose;

    // TÍNH CHANGE VÀ PERCENT — LOGIC ĐÚNG
    const change = currentClose - prevClose;
    const percent = prevClose
        ? ((change / prevClose) * 100).toFixed(2)
        : "0.00";

    const timeVN = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(new Date());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[80rem] max-h-[90vh] p-0 overflow-y-auto">
                <DialogHeader className="px-[2rem] py-[1rem] border-b bg-white sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            Chi tiết khuyến nghị — {item.stock.code}
                        </DialogTitle>

                        <DialogClose className="rounded-md p-2 hover:bg-gray-100 transition">
                            <X className="h-5 w-5 text-gray-600" />
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-[2fr_1fr] gap-[1rem] p-[1rem]">
                    {/* Chart */}
                    <div className="w-full overflow-hidden">
                        <TradingViewWidgetPro symbol={item.stock.code} />
                    </div>

                    {/* Info */}
                    <div className="space-y-4 text-[15px]">
                        {/* Stock Info Block */}
                        <div className="border-b pb-3 bg-white">
                            <div className="flex items-start justify-between">
                                {/* LEFT */}
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        {item.stock.name}
                                    </h1>

                                    <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                                        <Clock
                                            size={14}
                                            className="text-red-500"
                                        />
                                        {item.stock.code}:HSX
                                        <Star
                                            size={16}
                                            className="text-gray-400 hover:text-yellow-400 cursor-pointer"
                                        />
                                    </div>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Cập nhật lúc {timeVN} | Việt Nam (GMT+7)
                                    </p>
                                </div>

                                {/* RIGHT */}
                                <div className="text-right">
                                    <p className="text-[1.6rem] font-semibold text-gray-900 leading-none">
                                        {currentClose.toFixed(2)}
                                    </p>

                                    <p
                                        className={`mt-1 text-sm font-medium ${
                                            change > 0
                                                ? "text-green-600"
                                                : change < 0
                                                ? "text-red-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {change > 0 ? "+" : ""}
                                        {change.toFixed(2)} / {percent}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Info
                            label="Giá mua"
                            value={item.buyPrice}
                            color="text-yellow-600"
                        />
                        <Info
                            label="Chốt lời"
                            value={item.targetPrice}
                            color="text-green-600"
                        />
                        <Info
                            label="Cắt lỗ"
                            value={item.stopLossPrice}
                            color="text-red-600"
                        />
                        <Info
                            label="Giá hiện tại"
                            value={currentClose}
                            color="text-blue-600"
                        />

                        <div>
                            <p className="font-semibold">Mô tả:</p>
                            <p className="text-gray-700 whitespace-pre-line break-words">
                                {item.note || "—"}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Info({ label, value, color }: any) {
    return (
        <div className="flex items-center justify-between border-b pb-2">
            <p className="font-semibold">{label}:</p>
            <p className={`${color} font-semibold`}>{value ?? "--"}</p>
        </div>
    );
}
