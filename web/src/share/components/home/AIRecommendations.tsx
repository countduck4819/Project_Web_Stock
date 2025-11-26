"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchStockPredictionQuery } from "@/store/stock-prediction/stock-prediction.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
export default function AIRecommendations() {
    const dispatch = useAppDispatch();

    const { list, loading, meta } = useAppSelector((s) => s.stockPrediction);

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [previewImg, setPreviewImg] = useState<string | null>(null);

    const limit = 10;

    const fetchData = () => {
        dispatch(
            fetchStockPredictionQuery({
                page,
                limit,
                search,
            })
        );
    };

    useEffect(() => {
        fetchData();
    }, [page, search]);

    const totalPages = meta?.totalPages ?? 1;

    const handleSearch = () => {
        setPage(1);
        setSearch(searchInput.trim());
    };

    return (
        <div className="space-y-5">
            {/* Search */}
            <div className="flex gap-3">
                <Input
                    placeholder="Tìm theo mã (VD: VCB, FPT...)"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="bg-white"
                />
                <Button onClick={handleSearch}>Tìm</Button>
            </div>

            {/* Loading */}
            {loading && (
                <p className="text-center text-gray-500 flex justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    AI đang phân tích dữ liệu…
                </p>
            )}

            {/* Empty */}
            {!loading && list.length === 0 && (
                <p className="text-center text-gray-400">
                    Không có dự đoán nào.
                </p>
            )}

            {/* Table */}
            {list.length > 0 && (
                <div className="rounded-xl border overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-5 bg-gradient-to-r from-[#6A5AF9] to-[#4A1FB8] text-white font-semibold text-sm py-3 px-4 text-center">
                        <div>MÃ</div>
                        <div>GIÁ ĐÓNG CỬA</div>
                        <div>GIÁ DỰ ĐOÁN</div>
                        <div>BIỂU ĐỒ</div>
                        <div>THỜI GIAN</div>
                    </div>

                    {/* Body */}
                    {list.map((i: any, idx: number) => (
                        <div
                            key={idx}
                            className="grid grid-cols-5 py-4 px-4 text-sm border-t bg-white"
                        >
                            <div className="font-semibold flex justify-center items-center">
                                {i.ticker}
                            </div>

                            <div className="text-blue-600 font-semibold flex justify-center items-center">
                                {formatPrice(i.lastClosePrice)}
                            </div>

                            <div className="text-green-600 font-semibold flex justify-center items-center">
                                {formatPrice(i.predictedPrice)}
                            </div>

                            <div className="flex justify-center items-center">
                                {i.chartPath ? (
                                    <img
                                        src={i.chartPath}
                                        alt="chart"
                                        className="w-[80px] h-[50px] object-cover rounded border cursor-pointer hover:border-[#6A5AF9]"
                                        onClick={() =>
                                            setPreviewImg(i.chartPath)
                                        }
                                    />
                                ) : (
                                    "—"
                                )}
                            </div>

                            <div className="text-gray-600 flex justify-center items-center">
                                {new Date(i.predictedOn).toLocaleDateString(
                                    "vi-VN"
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {list.length > 0 && (
                <div className="flex items-center justify-center gap-6 pt-8 select-none">
                    {/* Prev */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className={`
                h-10 w-10 flex items-center justify-center rounded-full
                transition-all duration-200
                ${
                    page === 1
                        ? "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed"
                        : "bg-white text-[#6A5AF9] border border-[#6A5AF9]/40 hover:bg-[#6A5AF9]/10 hover:text-[#6A5AF9] hover:shadow-md"
                }
            `}
                    >
                        <ChevronLeft size={22} strokeWidth={2.8} />
                    </button>

                    {/* Page Chip */}
                    <div
                        className="
                px-6 py-2.5 rounded-xl font-semibold text-white text-sm
                bg-gradient-to-r from-[#6A5AF9] to-[#A66BFF] 
                shadow-md shadow-[#7e5dff40]
            "
                    >
                        Trang {page} / {totalPages}
                    </div>

                    {/* Next */}
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className={`
                h-10 w-10 flex items-center justify-center rounded-full
                transition-all duration-200
                ${
                    page >= totalPages
                        ? "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed"
                        : "bg-white text-[#6A5AF9] border border-[#6A5AF9]/40 hover:bg-[#6A5AF9]/10 hover:text-[#6A5AF9] hover:shadow-md"
                }
            `}
                    >
                        <ChevronRight size={22} strokeWidth={2.8} />
                    </button>
                </div>
            )}

            {/* IMAGE PREVIEW MODAL */}
            {previewImg && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setPreviewImg(null)}
                >
                    <div
                        className="relative bg-white p-2 rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-3 -right-3 bg-black text-white rounded-full p-1"
                            onClick={() => setPreviewImg(null)}
                        >
                            <X size={16} />
                        </button>

                        <img
                            src={previewImg}
                            className="max-w-[90vw] max-h-[80vh] object-contain rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
