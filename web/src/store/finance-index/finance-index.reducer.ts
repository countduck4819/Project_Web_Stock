import { createSlice } from "@reduxjs/toolkit";
import { fetchFinanceIndex } from "./finance-index.api";

export interface FinanceRecord {
    [key: string]: string | number | null;
}

interface FinanceState {
    symbol: string | null;
    data: FinanceRecord[];
    loading: boolean;
    error: string | null;
}

const initialState: FinanceState = {
    symbol: null,
    data: [],
    loading: false,
    error: null,
};

export const financeIndexSlice = createSlice({
    name: "financeIndexSlice",
    initialState,
    reducers: {
        clearFinanceIndex: (state) => {
            state.symbol = null;
            state.data = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinanceIndex.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFinanceIndex.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload?.data;
                state.data = data;
                state.symbol = action.payload.symbol || null;
            })
            .addCase(fetchFinanceIndex.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Không thể tải dữ liệu tài chính.";
            });
    },
});

export const { clearFinanceIndex } = financeIndexSlice.actions;
export default financeIndexSlice.reducer;
