from vnstock import Listing
import traceback

def fetch_stocks_by_industries():
    """Lấy danh sách ngành hợp lệ và group cổ phiếu theo ngành đó"""
    try:
        listing = Listing()

        # 1️⃣ Lấy toàn bộ danh sách ngành
        df_industries = listing.industries_icb()
        valid_industries = sorted(df_industries["icb_name"].dropna().unique().tolist())
        print(f"🏭 Fetched {len(valid_industries)} ngành hợp lệ")

        # 2️⃣ Lấy toàn bộ cổ phiếu + ngành
        df_stocks = listing.symbols_by_industries()

        if df_stocks.empty:
            print("⚠️ Không có dữ liệu cổ phiếu.")
            return {}

        # 3️⃣ Chỉ giữ 2 cột cần thiết
        df_stocks = df_stocks[["symbol", "icb_name3"]].dropna()

        # 4️⃣ Lọc cổ phiếu thuộc ngành hợp lệ
        df_filtered = df_stocks[df_stocks["icb_name3"].isin(valid_industries)]

        # 5️⃣ Group lại theo ngành
        grouped = (
            df_filtered.groupby("icb_name3")["symbol"]
            .apply(list)
            .to_dict()
        )

        print(f"✅ Grouped {len(grouped)} ngành có cổ phiếu.")
        return grouped

    except Exception as e:
        print("❌ Lỗi fetch stocks_by_industry:", e)
        traceback.print_exc()
        return {}
