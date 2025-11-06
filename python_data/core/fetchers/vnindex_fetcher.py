from vnstock import Vnstock
import traceback

def fetch_vnindex():
    try:
        vnst = Vnstock()
        df = vnst.stock(symbol="VNINDEX").quote.history(
            start="2024-01-01", end="2025-10-31", interval="1D"
        )
        data = [
            {
                "time": row["time"].isoformat() if hasattr(row["time"], "isoformat") else row["time"],
                "open": float(row["open"]),
                "high": float(row["high"]),
                "low": float(row["low"]),
                "close": float(row["close"]),
            }
            for _, row in df.iterrows()
        ]
        print(f"📊 Fetched {len(data)} phiên VNINDEX")
        return data
    except Exception as e:
        print("❌ Lỗi fetch VNINDEX:", e)
        traceback.print_exc()
        return []
