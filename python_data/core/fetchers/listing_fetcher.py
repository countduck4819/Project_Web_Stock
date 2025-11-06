from vnstock import Listing
import traceback

def fetch_listing():
    """Lấy danh sách mã chứng khoán (vnstock >=3.x)"""
    try:
        listing = Listing()
        df = listing.all_symbols()
        data = df.to_dict(orient="records")
        print(f"📈 Fetched {len(data)} mã chứng khoán")
        return data
    except Exception as e:
        print("❌ Lỗi fetch Listing:", e)
        traceback.print_exc()
        return []
