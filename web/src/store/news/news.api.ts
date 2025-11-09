import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/utils/axiosInstance";

const prefix = "/news";

//   Lấy danh sách tin tức (phân trang + lọc theo symbol)
export const fetchNewsQuery = createAsyncThunk(
    `${prefix}/fetchQuery`,
    async (
        params: { page?: number; limit?: number; symbol?: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(`${prefix}`, { params });
            return res.data; // có { data, meta, message, ... }
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Không thể tải danh sách tin tức"
            );
        }
    }
);

//   Lấy tin tức thô từ file JSON (Python export)
export const fetchNewsFromJson = createAsyncThunk(
    `${prefix}/fetchFromJson`,
    async (symbol: string, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL_PYTHON}${prefix}/${symbol}`
            );
            const data = await res.json();
            return data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ||
                    `Không thể đọc file JSON tin tức cho ${symbol}`
            );
        }
    }
);

export const fetchNewsDetailBySlug = createAsyncThunk(
    `${prefix}/fetchDetailBySlug`,
    async (slug: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`${prefix}/${slug}`);
            return res.data; // có { status, code, data, message }
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ||
                    `Không thể tải chi tiết bài viết slug: ${slug}`
            );
        }
    }
);
