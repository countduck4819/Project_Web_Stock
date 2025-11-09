import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/finance";

/**
 * Lấy bảng chỉ số tài chính theo mã cổ phiếu
 * @param symbol Mã cổ phiếu (VD: "VCB", "ACB", "FPT")
 */
export const fetchFinanceIndex = createAsyncThunk(
    `${prefix}/fetchFinanceIndex`,
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
                    `Không thể tải dữ liệu tài chính cho ${symbol}`
            );
        }
    }
);
