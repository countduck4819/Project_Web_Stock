from vnstock import Listing
import traceback

def fetch_industries():
    """Lấy danh sách ngành nghề (vnstock >=3.x)"""
    try:
        listing = Listing()
        df = listing.industries_icb()
        industries = sorted(df["icb_name"].dropna().unique().tolist())
        print(f"🏭 Fetched {len(industries)} ngành nghề")
        return industries
    except Exception as e:
        print("❌ Lỗi fetch Industries:", e)
        traceback.print_exc()
        return []
