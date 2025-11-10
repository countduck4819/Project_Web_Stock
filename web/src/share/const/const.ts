import { StockIndex } from "../enum";

export const publicRouters: string[] = [
    "/login",
    "/register",
    "/privacy-policy",
    "/not-found",
    "/dashboard",
    "/ma-chung-khoan",
    "/tin-tuc",
];

export const STOCK_INDEX_MAP: Record<StockIndex, string> = {
    [StockIndex.VNINDEX]: "Chỉ số VNINDEX",
    [StockIndex.HNXINDEX]: "Chỉ số HNXINDEX",
    [StockIndex.UPCOMINDEX]: "Chỉ số UPCOMINDEX",
};
