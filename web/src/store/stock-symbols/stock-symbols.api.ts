import { api } from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/stocks";
const prefix1 = "/python-api";
/** Lấy danh sách tất cả symbol dạng ["VCB:HOSE", "SSI:HOSE", ...] */
export const fetchStockSymbols = createAsyncThunk(
    `${prefix}/stock-symbols`,
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`${prefix}/stock-symbols`);
            return res.data.data || res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ||
                    "Không thể tải danh sách mã chứng khoán"
            );
        }
    }
);

export const fetchStocks = createAsyncThunk(
    `${prefix}/listing-stock`,
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`${prefix}/listing-stock`);
            return res.data.data || res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ||
                    "Không thể tải danh sách mã chứng khoán"
            );
        }
    }
);

export const fetchStockCandleData = createAsyncThunk(
    "stock/fetchStockCandleData",
    async (symbol: string, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL_PYTHON}/stock/${symbol}`
            );
            const raw = await res.json();

            const data = raw.map((d: any) => ({
                time: (d.date || d.time || "").slice(0, 10),
                open: +d.open,
                high: +d.high,
                low: +d.low,
                close: +d.close,
                volume: +d.volume || 0,
            }));

            return data; // chỉ trả về mảng Candle[]
        } catch {
            return rejectWithValue("Không thể tải dữ liệu biểu đồ");
        }
    }
);
