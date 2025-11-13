import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/utils/axiosInstance";
const prefix = "/industries";
export const fetchIndustriesQuery = createAsyncThunk(
    `${prefix}/fetchQuery`,
    async (
        params: {
            page?: number;
            limit?: number;
            filters?: Record<string, string>;
        },
        { rejectWithValue }
    ) => {
        try {
            // 🔥 Tách filters ra rồi gộp phẳng vào
            const { filters = {}, ...rest } = params;
            const queryParams = { ...rest, ...filters };

            const res = await api.get(prefix, { params: queryParams });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Không thể tải danh sách ngành"
            );
        }
    }
);
