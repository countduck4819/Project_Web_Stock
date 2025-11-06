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

        # 1️⃣ Lấy danh sách symbol đang niêm yết
        df_all = listing.all_symbols()
        valid_symbols = set(df_all["symbol"].dropna().unique())

        # 2️⃣ Lấy bảng symbol - exchange
        df_exchange = listing.symbols_by_exchange()
        df_exchange = df_exchange[["symbol", "exchange"]].dropna()

        # 3️⃣ Giữ lại những mã đang niêm yết
        df_filtered = df_exchange[df_exchange["symbol"].isin(valid_symbols)]

        # 4️⃣ Ghép lại theo format EXCHANGE:SYMBOL (VD: HSX:LDG)
        df_filtered["symbol_full"] = df_filtered["exchange"] + ":" + df_filtered["symbol"]

        # 5️⃣ Loại trùng (nếu có)
        all_symbols = sorted(df_filtered["symbol_full"].drop_duplicates().tolist())

        print(f"✅ Collected {len(all_symbols)} valid listed symbols with exchange")
        return all_symbols

    except Exception as e:
        print("❌ Lỗi fetch_all_symbols_with_exchange:", e)
        traceback.print_exc()
        return []
