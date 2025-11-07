import stockSymbolsReducer from "@/store/stock-symbols/stock-symbols.reducer";
import usersReducer from "@/store/users/user.reducer";
import financeIndexReducer from "@/store/finance-index/finance-index.reducer";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    usersReducer: usersReducer,
    stockSymbols: stockSymbolsReducer,
    financeIndex: financeIndexReducer,
});
