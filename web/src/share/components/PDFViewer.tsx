"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function PDFViewer({ url }: { url: string }) {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative w-full my-8">
            {loading && (
                <div className="relative w-full h-[60rem] rounded-lg overflow-hidden">
                    <Skeleton height="100%" borderRadius="0.5rem" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] z-10">
                        <Loader2 className="w-6 h-6 text-[#111164] animate-spin mb-2" />
                        <span className="text-sm text-[#111164]">
                            Đang tải tài liệu...
                        </span>
                    </div>
                </div>
            )}

            <iframe
                src={`https://docs.google.com/gview?embedded=true&rm=minimal&url=${encodeURIComponent(
                    url
                )}`}
                className="w-full h-[60rem] border-none bg-white rounded-lg"
                onLoad={() => setLoading(false)}
            />

            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-start gap-2 mt-6 px-4 py-2 text-sm font-medium text-[#111164] border border-[#111164]/20 rounded-lg hover:bg-[#111164]/5 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                </svg>
                Tải tệp đính kèm
            </a>
        </div>
    );
}
