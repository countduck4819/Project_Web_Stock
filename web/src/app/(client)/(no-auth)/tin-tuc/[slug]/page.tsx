"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchNewsDetailBySlug } from "@/store/news/news.api";
import Loading from "@/share/components/Loading";
import { toast } from "react-toastify";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import PDFViewer from "@/share/components/PDFViewer";
import { renderWithEmbed } from "@/lib/utils";

export default function NewsDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { detail, loading, error } = useAppSelector((state) => state.news);

    useEffect(() => {
        if (slug) dispatch(fetchNewsDetailBySlug(String(slug)));
    }, [slug]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    if (loading) return <Loading />;

    if (!detail)
        return (
            <div className="p-10 text-center text-gray-500">
                Không tìm thấy bài viết
            </div>
        );

    const changePercent = detail.change_percent || 0;
    const isUp = changePercent > 0;
    const isDown = changePercent < 0;

    return (
        <article className="max-w-4xl mx-auto px-4 py-10">
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-gray-500 hover:text-[#111164] transition mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
            </button>

            {/* Tiêu đề */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-snug">
                {detail.news_title}
            </h1>

            {/* Thông tin phụ */}
            <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2 mb-4">
                <span>Tổng hợp từ HSX</span>
                <span>•</span>
                <span>
                    {new Date(detail.public_date).toLocaleDateString("vi-VN")}{" "}
                    {new Date(detail.public_date).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>

            {/* Mã cổ phiếu */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 mb-6">
                <span className="mr-2 text-[#111164]">{detail.symbol}</span>
                {isUp && (
                    <span className="text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +{changePercent}%
                    </span>
                )}
                {isDown && (
                    <span className="text-red-600 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> {changePercent}%
                    </span>
                )}
                {!isUp && !isDown && <span className="text-gray-500">0%</span>}
            </div>

            {/* Ảnh đại diện */}
            {detail.news_image_url && (
                <div className="w-full rounded-xl overflow-hidden mb-8 shadow-sm">
                    <Image
                        src={detail.news_image_url}
                        alt={detail.news_title}
                        width={800}
                        height={500}
                        className="w-full h-auto object-cover"
                    />
                </div>
            )}

            {/* Nội dung */}
            <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                    __html: renderWithEmbed(detail.news_full_content),
                }}
            />

            {/* Nếu có file PDF thì hiển thị viewer */}
            {detail.news_full_content
                .match(/https?:\/\/[^\s"']+\.pdf/gi)
                ?.map((url: any) => (
                    <PDFViewer key={url} url={url} />
                ))}
        </article>
    );
}
