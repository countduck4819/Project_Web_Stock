from vnstock import Listing
import traceback
import pandas as pd

def fetch_stocks_symbols():
    """
    Lấy toàn bộ mã cổ phiếu đang niêm yết kèm sàn (format EXCHANGE:SYMBOL)
    Dữ liệu này dùng để feed cho TradingView widget.
    """
    try:
        listing = Listing()

        df_all = listing.all_symbols()
        valid_symbols = set(df_all["symbol"].dropna().unique())

        df_exchange = listing.symbols_by_exchange()
        df_exchange = df_exchange[["symbol", "exchange"]].dropna()

        df_filtered = df_exchange[df_exchange["symbol"].isin(valid_symbols)]

        df_filtered["symbol_full"] = df_filtered["exchange"] + ":" + df_filtered["symbol"]

        all_symbols = sorted(df_filtered["symbol_full"].drop_duplicates().tolist())

        return all_symbols

    except Exception as e:
        print("Lỗi fetch_all_symbols_with_exchange:", e)
        traceback.print_exc()
        return []
