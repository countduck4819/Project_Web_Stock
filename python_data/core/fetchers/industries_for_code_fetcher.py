from vnstock import Listing
import traceback

def fetch_industries_for_code():
    """Lấy danh sách mã chứng khoán (vnstock >=3.x)"""
    try:
        listing = Listing()
        df = listing.symbols_by_industries()
        data = df.to_dict(orient="records")
        print(f"📈 Fetched {len(data)} mã chứng khoán")
        return data
    except Exception as e:
        print("❌ Lỗi fetch Listing:", e)
        traceback.print_exc()
        return []
