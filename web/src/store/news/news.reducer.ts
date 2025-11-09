import { createSlice } from "@reduxjs/toolkit";
import {
    fetchNewsQuery,
    fetchNewsFromJson,
    fetchNewsDetailBySlug,
} from "./news.api";

const newsSlice = createSlice({
    name: "news",
    initialState: {
        list: [] as any[], // dữ liệu từ DB
        meta: {} as any, // phân trang
        jsonData: [] as any[], // dữ liệu từ file JSON Python
        detail: null as any, // chi tiết bài viết (theo slug)
        loading: false,
        error: null as string | null,
    },
    reducers: {
        clearNews: (state) => {
            state.list = [];
            state.meta = {};
            state.jsonData = [];
            state.detail = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /** fetchNewsQuery */
        builder
            .addCase(fetchNewsQuery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewsQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchNewsQuery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /** fetchNewsFromJson */
        builder
            .addCase(fetchNewsFromJson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewsFromJson.fulfilled, (state, action) => {
                state.loading = false;
                state.jsonData = action.payload?.data || [];
            })
            .addCase(fetchNewsFromJson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /** fetchNewsDetailBySlug */
        builder
            .addCase(fetchNewsDetailBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewsDetailBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.detail = action.payload?.data || null;
            })
            .addCase(fetchNewsDetailBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearNews } = newsSlice.actions;
export default newsSlice.reducer;
