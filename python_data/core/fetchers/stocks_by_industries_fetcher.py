from vnstock import Listing
import traceback

def fetch_stocks_by_industries():
    """Lấy danh sách ngành hợp lệ và group cổ phiếu theo ngành đó"""
    try:
        listing = Listing()

        df_industries = listing.industries_icb()
        valid_industries = sorted(df_industries["icb_name"].dropna().unique().tolist())

        df_stocks = listing.symbols_by_industries()

        if df_stocks.empty:
            print("Không có dữ liệu cổ phiếu.")
            return {}

        df_stocks = df_stocks[["symbol", "icb_name3"]].dropna()

        df_filtered = df_stocks[df_stocks["icb_name3"].isin(valid_industries)]

        grouped = (
            df_filtered.groupby("icb_name3")["symbol"]
            .apply(list)
            .to_dict()
        )

        return grouped

    except Exception as e:
        print("Lỗi fetch stocks_by_industry:", e)
        traceback.print_exc()
        return {}
