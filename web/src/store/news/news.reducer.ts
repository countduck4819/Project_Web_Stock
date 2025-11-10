import { createSlice } from "@reduxjs/toolkit";
import {
    fetchNewsQuery,
    fetchNewsFromJson,
    fetchNewsDetailBySlug,
    fetchAllNewsForVNINDEX,
    fetchNewsSearchQuery, // ✅ thêm mới
} from "./news.api";

const newsSlice = createSlice({
    name: "news",
    initialState: {
        list: [] as any[],
        meta: {} as any,
        vnindexList: [] as any[],
        vnindexMeta: {} as any,
        jsonData: [] as any[],
        detail: null as any,
        searchList: [] as any[], // ✅ thêm state riêng cho search
        searchMeta: {} as any, // ✅ meta cho search
        loading: false,
        error: null as string | null,
    },
    reducers: {
        clearNews: (state) => {
            state.list = [];
            state.meta = {};
            state.vnindexList = [];
            state.vnindexMeta = {};
            state.jsonData = [];
            state.detail = null;
            state.searchList = [];
            state.searchMeta = {};
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

        /** ✅ fetchAllNewsForVNINDEX */
        builder
            .addCase(fetchAllNewsForVNINDEX.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllNewsForVNINDEX.fulfilled, (state, action) => {
                state.loading = false;

                const newData = action.payload.data || [];
                const meta = action.payload.meta || {};

                // Nếu page > 1 → nối thêm vào list cũ
                if (meta.page && meta.page > 1) {
                    state.vnindexList = [...state.vnindexList, ...newData];
                } else {
                    // Nếu page = 1 → load mới hoàn toàn
                    state.vnindexList = newData;
                }

                state.vnindexMeta = meta;
            })
            .addCase(fetchAllNewsForVNINDEX.rejected, (state, action) => {
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

        /** ✅ fetchNewsSearchQuery */
        builder
            .addCase(fetchNewsSearchQuery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewsSearchQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.searchList = action.payload.data || [];
                state.searchMeta = action.payload.meta || {};
            })
            .addCase(fetchNewsSearchQuery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearNews } = newsSlice.actions;
export default newsSlice.reducer;
