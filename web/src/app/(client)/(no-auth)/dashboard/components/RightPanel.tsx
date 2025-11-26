"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { fetchAllNewsForVNINDEX } from "@/store/news/news.api";
import { useRouter } from "next/navigation";

function formatTimeAgo(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return "vừa xong";
    if (diff < 60) return `${diff} phút`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `Khoảng ${hours} tiếng`;
    return `${date?.getDate()}/${date?.getMonth() + 1}`;
}

export default function RightPanel() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { vnindexList, loading } = useAppSelector((s: RootState) => s.news);

    /** 🔹 Lấy 50 tin mới nhất */
    useEffect(() => {
        dispatch(fetchAllNewsForVNINDEX({ page: 1, limit: 200 }));
    }, [dispatch]);

    return (
        <div className="relative z-[0] h-full bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <div className="px-[0.75rem] py-[0.5rem] border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-[0.875rem] font-semibold text-gray-800">
                    Bài viết nổi bật
                </h2>
            </div>

            {/* Danh sách */}
            <div className="min-h-[calc(100vh_-_4rem)] divide-y divide-gray-100">
                {loading && (
                    <div className="text-[0.75rem] text-gray-400 p-[0.75rem]">
                        Đang tải...
                    </div>
                )}

                {!vnindexList?.length ? (
                    <div className="text-black pt-[1rem] pl-[1rem]">
                        Hiện chưa có tin tức nào
                    </div>
                ) : (
                    vnindexList.map((item) => (
                        <div
                            key={item.news_id}
                            onClick={() => router.push(`/tin-tuc/${item.slug}`)}
                            className="flex gap-[0.5rem] p-[0.5rem] cursor-pointer hover:bg-gray-50 transition"
                        >
                            <div className="relative w-[3.75rem] h-[2.5rem] rounded overflow-hidden flex-shrink-0 bg-gray-100">
                                {item.news_image_url ? (
                                    <Image
                                        src={item.news_image_url}
                                        alt={item.news_title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="text-[0.625rem] flex items-center justify-center h-full text-gray-400">
                                        No Img
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[0.8125rem] text-gray-800 leading-tight font-medium line-clamp-2 hover:text-[#111164]">
                                    {item.news_title}
                                </p>
                                <span className="block text-[0.6875rem] text-gray-500 mt-[0.125rem]">
                                    {formatTimeAgo(item.public_date)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
