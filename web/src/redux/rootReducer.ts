import stockSymbolsReducer from "@/store/stock-symbols/stock-symbols.reducer";
import usersReducer from "@/store/users/user.reducer";
import financeIndexReducer from "@/store/finance-index/finance-index.reducer";
import industriesReducer from "@/store/industries/industries.reducer";
import stocksReducer from "@/store/stocks/stocks.reducer";
import newsReducer from "@/store/news/news.reducer";
import stockRecommendationsReducer from "@/store/stock-recommendations/stock-recommendations.reducer";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    usersReducer: usersReducer,
    stockSymbols: stockSymbolsReducer,
    financeIndex: financeIndexReducer,
    industries: industriesReducer,
    stocks: stocksReducer,
    news: newsReducer,
    stockRecommendations: stockRecommendationsReducer
});
