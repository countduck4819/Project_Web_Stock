import { Card } from "@/components/ui/card";

export default function AIRecommendations({
    data,
    loading,
}: {
    data: any[];
    loading: boolean;
}) {
    if (loading)
        return (
            <p className="text-center text-gray-400">AI đang phân tích...</p>
        );

    if (!data.length)
        return (
            <p className="text-center text-gray-400">
                AI chưa tìm ra mã phù hợp.
            </p>
        );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((i, idx) => (
                <Card
                    key={idx}
                    className="p-4 bg-[#1E1538]/80 border border-pink-500/20 rounded-xl"
                >
                    <p className="text-white font-semibold">{i.symbol}</p>
                    <p className="text-gray-400 text-sm mb-3">{i.company}</p>

                    <p className="text-sm text-blue-300">{i.reason}</p>
                </Card>
            ))}
        </div>
    );
}
