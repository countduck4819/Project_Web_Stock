"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/axiosInstance";

interface StockInfo {
    reference: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    value: number;
    pe: number;
    eps: number;
    marketCap: number;
    beta: number;
}

export default function StockInfoCard({ symbol }: { symbol: string }) {
    const [data, setData] = useState<StockInfo | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/python-api/stock-info/${symbol}`); // API Python của bạn
                setData(res.data);
            } catch (e) {
                console.error("Lỗi khi tải dữ liệu:", e);
            }
        }
        fetchData();
    }, [symbol]);

    if (!data)
        return <div className="p-4 text-sm text-gray-500">Đang tải...</div>;

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm text-sm">
            <div className="font-bold text-lg mb-3">{symbol}</div>
            <div className="space-y-1">
                <Row label="Tham chiếu" value={data.reference.toFixed(2)} />
                <Row label="Mở cửa" value={data.open.toFixed(2)} />
                <Row label="Thấp - Cao" value={`${data.low} - ${data.high}`} />
                <Row label="Khối lượng" value={data.volume.toLocaleString()} />
                <Row
                    label="Giá trị"
                    value={`${(data.value / 1e9).toFixed(2)} tỷ`}
                />
                <Row label="P/E" value={data.pe} />
                <Row label="EPS" value={data.eps} />
                <Row label="Beta" value={data.beta} />
                <Row
                    label="Vốn hóa"
                    value={`${(data.marketCap / 1e9).toFixed(1)} tỷ`}
                />
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between border-b border-gray-100 py-1">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    );
}
