import stockSymbolsReducer from "@/store/stock-symbols/stock-symbols.reducer";
import usersReducer from "@/store/users/user.reducer";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    usersReducer: usersReducer,
    stockSymbols: stockSymbolsReducer,
});
