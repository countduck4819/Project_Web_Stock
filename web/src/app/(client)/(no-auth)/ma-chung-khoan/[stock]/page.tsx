"use client";

import TradingViewWidget from "@/share/components/TradingViewWidget";
import StockInfoCard from "@/share/components/StockInfoCard";

export default function Page() {
    return (
        <div className="max-w-[90vw] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-50 rounded-lg p-3">
                <TradingViewWidget />
            </div>

            <div className="bg-white rounded-lg shadow p-3">
                <StockInfoCard />
            </div>
        </div>
    );
}
