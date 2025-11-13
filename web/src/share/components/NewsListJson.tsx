// "use client";

// import Image from "next/image";
// import { useEffect, useMemo } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { useAppSelector } from "@/redux/hooks";
// import { fetchNewsFromJson } from "@/store/news/news.api";
// import { MessageSquare, Repeat2, ThumbsUp } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { api } from "@/utils/axiosInstance";

// // 🕓 format "YYYY-MM-DD HH:mm:ss" → "DD/MM HH:mm"
// function formatDate(dateStr?: string) {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) return "";
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     return `${day}/${month} ${hours}:${minutes}`;
// }

// export default function NewsListJson() {
//     const router = useRouter();
//     const dispatch = useDispatch<AppDispatch>();
//     const { jsonData, error } = useAppSelector(
//         (state: RootState) => state.news
//     );
//     const { candleData, stocksFullList } = useAppSelector(
//         (state: RootState) => state.stockSymbols
//     );

//     const params = useParams();
//     const symbol = String(params.stock || "").toUpperCase();

//     //   1️⃣ Lấy dữ liệu JSON từ Python
//     useEffect(() => {
//         if (symbol) dispatch(fetchNewsFromJson(symbol));
//     }, [symbol]);

//     //   2️⃣ Khi đã có dữ liệu JSON → gửi về NestJS để lưu DB
//     useEffect(() => {
//         const importToNest = async () => {
//             if (!symbol || !jsonData?.length) return;
//             try {
//                 await api.post(`/news/import/${symbol}`, {
//                     page: 1,
//                     limit: 10,
//                 });
//                 console.log(`✅ Đã gửi dữ liệu ${symbol} về NestJS để lưu DB`);
//             } catch (err: any) {
//                 console.error("❌ Lỗi gửi dữ liệu về NestJS:", err.message);
//             }
//         };
//         importToNest();
//     }, [symbol, jsonData]);

//     // 🧮 Tính phần trăm thay đổi giá
//     const latestCandle = candleData[candleData.length - 1];
//     const prevCandle = candleData[candleData.length - 2];
//     const price = latestCandle?.close || 0;
//     const change = price - (prevCandle?.close || price);
//     const percent = ((change / (prevCandle?.close || price)) * 100).toFixed(2);
//     const isUp = change > 0;
//     const isDown = change < 0;

//     if (error)
//         return <div className="p-4 text-red-500 text-sm">Lỗi: {error}</div>;

//     if (!jsonData?.length)
//         return <div className="p-4 text-gray-400 text-sm">Chưa có tin tức</div>;

//     return (
//         <div className="space-y-5">
//             <h2 className="text-lg font-semibold text-[#111164]">Bài viết</h2>

//             <div className="space-y-3">
//                 {jsonData.map((item: any) => (
//                     <div
//                         onClick={() => router.push(`/tin-tuc/${item?.slug}`)}
//                         key={item.news_id}
//                         className="group min-h-[9rem] flex items-start gap-4 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 p-3 transition-all duration-200 cursor-pointer hover:shadow-md"
//                     >
//                         {/* Ảnh đại diện */}
//                         <div className="relative w-[7.5rem] aspect-[4/3] flex-shrink-0 rounded overflow-hidden bg-gray-100">
//                             {item.news_image_url ? (
//                                 <Image
//                                     src={item.news_image_url}
//                                     alt={item.news_title}
//                                     fill
//                                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                                 />
//                             ) : (
//                                 <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
//                                     No Image
//                                 </div>
//                             )}
//                         </div>

//                         {/* Nội dung */}
//                         <div className="flex-1">
//                             <div className="flex items-center text-sm mb-1">
//                                 <span className="font-semibold text-[#111164] mr-2">
//                                     {item.symbol || symbol}
//                                 </span>
//                                 <span
//                                     className={`text-xs font-semibold ${
//                                         isUp
//                                             ? "text-green-500"
//                                             : isDown
//                                             ? "text-red-500"
//                                             : "text-gray-400"
//                                     }`}
//                                 >
//                                     {isUp && "+"}
//                                     {percent}%
//                                 </span>
//                             </div>

//                             <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-[#111164] transition-colors duration-200">
//                                 {item.news_title}
//                             </h3>

//                             <p className="text-sm text-gray-600 line-clamp-2 mt-1">
//                                 {item.news_short_content || (
//                                     <span
//                                         dangerouslySetInnerHTML={{
//                                             __html: item.news_full_content
//                                                 ? item.news_full_content.slice(
//                                                       0,
//                                                       150
//                                                   ) + "..."
//                                                 : "",
//                                         }}
//                                     ></span>
//                                 )}
//                             </p>

//                             <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
//                                 <span>{formatDate(item.public_date)}</span>
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex items-center gap-1">
//                                         <ThumbsUp className="w-3 h-3" /> 4
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <MessageSquare className="w-3 h-3" /> 32
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <Repeat2 className="w-3 h-3" /> 7
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import {
    fetchNewsFromJson,
    fetchAllNewsForVNINDEX,
} from "@/store/news/news.api";
import { MessageSquare, Repeat2, ThumbsUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/axiosInstance";
import { StockIndex } from "../enum";

// 🕓 format "YYYY-MM-DD HH:mm:ss" → "DD/MM HH:mm"
function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month} ${hours}:${minutes}`;
}

export default function NewsListJson() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { jsonData, vnindexList, vnindexMeta, error} =
        useAppSelector((state: RootState) => state.news);
    const { candleData } = useAppSelector(
        (state: RootState) => state.stockSymbols
    );

    const params = useParams();
    const symbol = String(params.stock || "").toUpperCase();

    /** ✅ State riêng cho VNINDEX paging */
    const [page, setPage] = useState(1);
    const limit = 10;
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    /** ✅ 1️⃣ Lấy dữ liệu khởi tạo */
    useEffect(() => {
        if (!symbol) return;

        if (symbol === StockIndex?.VNINDEX) {
            setPage(1); // reset khi đổi symbol
            dispatch(fetchAllNewsForVNINDEX({ page: 1, limit }));
        } else {
            dispatch(fetchNewsFromJson(symbol));
        }
    }, [symbol]);

    /** ✅ 2️⃣ Chỉ gửi dữ liệu về Nest khi KHÔNG phải VNINDEX */
    useEffect(() => {
        const importToNest = async () => {
            if (symbol === StockIndex?.VNINDEX || !jsonData?.length) return;
            try {
                await api.post(`/news/import/${symbol}`, {
                    page: 1,
                    limit: 10,
                });
                console.log(`✅ Đã gửi dữ liệu ${symbol} về NestJS để lưu DB`);
            } catch (err: any) {
                console.error("❌ Lỗi gửi dữ liệu về NestJS:", err.message);
            }
        };
        importToNest();
    }, [symbol, jsonData]);

    /** ✅ 3️⃣ Infinite scroll cho VNINDEX */
    useEffect(() => {
        if (symbol !== StockIndex?.VNINDEX) return;

        const handleScroll = () => {
            const scrollTop =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200;

            if (
                scrollTop &&
                !isFetchingMore &&
                vnindexMeta?.total > vnindexList.length
            ) {
                setIsFetchingMore(true);
                const nextPage = page + 1;
                dispatch(fetchAllNewsForVNINDEX({ page: nextPage, limit }))
                    .unwrap()
                    .then((res) => {
                        // nối dữ liệu mới vào list cũ
                        if (res?.data?.length) {
                            // cập nhật redux từ ngoài slice → an toàn: gộp trong reducer
                            // hoặc nếu slice không hỗ trợ gộp, có thể xử lý tại component
                        }
                        setPage(nextPage);
                    })
                    .finally(() => setIsFetchingMore(false));
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [symbol, page, vnindexList, vnindexMeta, isFetchingMore]);

    // 🧮 Tính phần trăm thay đổi giá
    const latestCandle = candleData[candleData.length - 1];
    const prevCandle = candleData[candleData.length - 2];
    const price = latestCandle?.close || 0;
    const change = price - (prevCandle?.close || price);
    const percent = ((change / (prevCandle?.close || price)) * 100).toFixed(2);
    const isUp = change > 0;
    const isDown = change < 0;

    if (error)
        return <div className="p-4 text-red-500 text-sm">Lỗi: {error}</div>;

    const displayList = symbol === StockIndex?.VNINDEX ? vnindexList : jsonData;

    if (!displayList?.length)
        return <div className="p-4 text-gray-400 text-sm">Chưa có tin tức</div>;

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[#111164]">Bài viết</h2>

            <div className="space-y-3">
                {displayList.map((item: any) => (
                    <div
                        onClick={() => router.push(`/tin-tuc/${item?.slug}`)}
                        key={item.news_id}
                        className="group min-h-[9rem] flex items-start gap-4 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 p-3 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                        {/* Ảnh đại diện */}
                        <div className="relative w-[7.5rem] aspect-[4/3] flex-shrink-0 rounded overflow-hidden bg-gray-100">
                            {item.news_image_url ? (
                                <Image
                                    src={item.news_image_url}
                                    alt={item.news_title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Nội dung */}
                        <div className="flex-1">
                            <div className="flex items-center text-sm mb-1">
                                <span className="font-semibold text-[#111164] mr-2">
                                    {symbol === StockIndex?.VNINDEX
                                        ? StockIndex?.VNINDEX
                                        : item?.symbol || symbol}
                                </span>
                                <span
                                    className={`text-xs font-semibold ${
                                        isUp
                                            ? "text-green-500"
                                            : isDown
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {isUp && "+"}
                                    {percent}%
                                </span>
                            </div>

                            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-[#111164] transition-colors duration-200">
                                {item.news_title}
                            </h3>

                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {item.news_short_content || (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: item.news_full_content
                                                ? item.news_full_content.slice(
                                                      0,
                                                      150
                                                  ) + "..."
                                                : "",
                                        }}
                                    ></span>
                                )}
                            </p>

                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                <span>{formatDate(item.public_date)}</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp className="w-3 h-3" /> 4
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> 32
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Repeat2 className="w-3 h-3" /> 7
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* ✅ Loading ở cuối khi VNINDEX đang tải thêm */}
                {symbol === StockIndex?.VNINDEX && isFetchingMore && (
                    <div className="flex justify-center py-4 text-sm text-gray-500">
                        Đang tải thêm tin tức...
                    </div>
                )}
            </div>
        </div>
    );
}
