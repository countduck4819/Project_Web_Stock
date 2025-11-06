"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchStocks,
    fetchStockSymbols,
} from "@/store/stock-symbols/stock-symbols.api";

import TradingViewWidget from "@/share/components/TradingViewWidget";
import Loading from "@/share/components/Loading";
import StockInfoCard from "@/share/components/StockInfoCard";

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();

    const { stocksSymbolList, stocksFullList, loading } = useAppSelector(
        (state) => state.stockSymbols
    );

    const [tradingSymbol, setTradingSymbol] = useState<string | null>(null);
    const stockParam = String(params.stock || "").toUpperCase();
    useEffect(() => {
        if (stocksSymbolList.length === 0 || loading) return;

        const exists = stocksSymbolList.includes(stockParam);
        if (!exists) {
            router.replace("/not-found");
            return;
        }

        setTradingSymbol(stockParam);
    }, [JSON.stringify(stocksSymbolList)]);

    useEffect(() => {
        if (!stocksSymbolList.length) {
            dispatch(fetchStocks());
        }
    }, []);

    if (loading || !tradingSymbol) return <Loading />;
    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <TradingViewWidget symbol={tradingSymbol} />
            </div>

            <div className="w-full lg:w-[22rem] flex-shrink-0">
                <StockInfoCard symbol={tradingSymbol} />
            </div>
        </div>
    );
}
