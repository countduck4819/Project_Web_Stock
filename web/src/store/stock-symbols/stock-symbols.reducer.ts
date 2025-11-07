import { createSlice } from "@reduxjs/toolkit";
import {
    fetchStockCandleData,
    fetchStockSymbols,
    fetchStocks,
} from "./stock-symbols.api";

export interface Candle {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface StockItem {
    symbol: string;
    organ_name: string;
}

interface StockSymbolsState {
    symbolsList: string[];
    stocksFullList: StockItem[];
    stocksSymbolList: string[];
    candleData: Candle[]; // chỉ là 1 mảng dữ liệu nến
    loading: boolean;
    error: string | null;
}

const initialState: StockSymbolsState = {
    symbolsList: [],
    stocksFullList: [],
    stocksSymbolList: [],
    candleData: [],
    loading: false,
    error: null,
};

export const stockSymbolsSlice = createSlice({
    name: "stockSymbolsSlice",
    initialState,
    reducers: {
        clearStockSymbols: (state) => {
            state.symbolsList = [];
            state.stocksFullList = [];
            state.stocksSymbolList = [];
            state.candleData = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ===== SYMBOL LIST =====
        builder
            .addCase(fetchStockSymbols.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockSymbols.fulfilled, (state, action) => {
                state.loading = false;
                state.symbolsList = action.payload.map((item: any) =>
                    typeof item === "string" ? item : item.symbol
                );
            })
            .addCase(fetchStockSymbols.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ===== STOCKS FULL LIST =====
        builder
            .addCase(fetchStocks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStocks.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload || [];
                state.stocksFullList = data;
                state.stocksSymbolList = data.map((item: any) => item.symbol);
            })
            .addCase(fetchStocks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ===== CANDLE DATA =====
        builder
            .addCase(fetchStockCandleData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockCandleData.fulfilled, (state, action) => {
                state.loading = false;
                state.candleData = action.payload; // gán trực tiếp mảng Candle[]
            })
            .addCase(fetchStockCandleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearStockSymbols } = stockSymbolsSlice.actions;
export default stockSymbolsSlice.reducer;
