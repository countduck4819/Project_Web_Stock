import Image from "next/image";
import { Column } from "@/share/components/admin/TableCustom";

export interface StockPrediction {
    id: number;
    ticker: string;
    lastClosePrice: number;
    predictedPrice: number;
    chartPath?: string | null;
    predictedOn: string;
}

export const stockPredictionColumns: Column<StockPrediction>[] = [
    { key: "id", header: "ID" },
    { key: "ticker", header: "Mã" },
    { key: "lastClosePrice", header: "Giá đóng gần nhất" },
    { key: "predictedPrice", header: "Giá dự đoán" },
    {
        key: "chartPath",
        header: "Biểu đồ",
        render: (item, actions) =>
            item.chartPath ? (
                <div
                    className="w-16 h-12 relative border rounded overflow-hidden bg-white cursor-pointer"
                    onClick={() => actions?.onPreview?.(item.chartPath!)}
                >
                    <Image
                        src={item.chartPath}
                        alt={`chart-${item.ticker}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                </div>
            ) : (
                "—"
            ),
    },
    {
        key: "predictedOn",
        header: "Ngày dự đoán",
        render: (item) => new Date(item.predictedOn).toLocaleString("vi-VN"),
    },
];
