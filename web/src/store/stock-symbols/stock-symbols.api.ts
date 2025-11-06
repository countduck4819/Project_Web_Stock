import { api } from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/stocks";

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
