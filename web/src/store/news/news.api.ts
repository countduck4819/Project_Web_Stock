import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/utils/axiosInstance";
import { StockIndex } from "@/share/enum";

const prefix = "/news";

export const fetchNewsQuery = createAsyncThunk(
    `${prefix}/fetchQuery`,
    async (
        params: { page?: number; limit?: number; symbol?: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(`${prefix}`, { params });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Không thể tải danh sách tin tức"
            );
        }
    }
);

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
            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ||
                    `Không thể tải chi tiết bài viết slug: ${slug}`
            );
        }
    }
);

export const fetchAllNewsForVNINDEX = createAsyncThunk(
    `${prefix}/fetchAllForVNINDEX`,
    async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const res = await api.get(`${prefix}`, {
                params: { ...params, symbol: StockIndex?.VNINDEX },
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ||
                    "Không thể tải tin tổng hợp cho VNINDEX"
            );
        }
    }
);

export const fetchNewsSearchQuery = createAsyncThunk(
    `${prefix}/fetchSearchQuery`,
    async (
        params: { page?: number; limit?: number; keyword?: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(`${prefix}/search`, { params });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Không thể tìm kiếm tin tức"
            );
        }
    }
);
