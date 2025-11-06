# from vnstock import Quote
# from datetime import datetime
# from functools import lru_cache
# import time
# import traceback

# # Biến toàn cục lưu thời điểm gọi gần nhất
# _last_call = 0

# @lru_cache(maxsize=12)
# def fetch_stock(symbol: str, start: str, end: str):
#     """Lấy dữ liệu lịch sử 10 năm gần nhất cho 1 cổ phiếu, KHÔNG LƯU FILE"""
#     global _last_call
#     now = time.time()

#     # Nếu lần gọi trước < 2s → chờ thêm cho đủ 2s
#     if now - _last_call < 2:
#         wait_time = 2 - (now - _last_call)
#         print(f"⏸️ Chờ {wait_time:.2f}s để tránh bị chặn...")
#         time.sleep(wait_time)

#     _last_call = time.time()
#     print(symbol)

#     try:
#         quote = Quote(symbol=symbol, source="VCI")
#         df = quote.history(start=start, end=end, interval="1D")

#         data = []
#         for _, row in df.iterrows():
#             # Convert datetime → UNIX timestamp
#             if hasattr(row["time"], "timestamp"):
#                 timestamp = int(row["time"].timestamp())
#             else:
#                 timestamp = int(datetime.strptime(str(row["time"]), "%Y-%m-%d").timestamp())

#             data.append({
#                 "time": timestamp,
#                 "open": float(row["open"]),
#                 "high": float(row["high"]),
#                 "low": float(row["low"]),
#                 "close": float(row["close"]),
#                 "volume": int(row["volume"]),
#             })

#         print(f"📊 Cached {len(data)} phiên cho {symbol} ({start} → {end})")
#         return data

#     except Exception as e:
#         print(f"❌ Lỗi fetch {symbol}:", e)
#         traceback.print_exc()
#         return []
















# from vnstock import Quote
# from datetime import datetime
# from functools import lru_cache
# import time
# import traceback

# _last_call = 0

# @lru_cache(maxsize=12)
# def fetch_stock(symbol: str, start: str, end: str):
#     """Lấy dữ liệu lịch sử 10 năm gần nhất cho 1 cổ phiếu, KHÔNG LƯU FILE"""
#     global _last_call
#     now = time.time()

#     # Giới hạn tốc độ để tránh bị chặn
#     if now - _last_call < 2:
#         wait_time = 2 - (now - _last_call)
#         print(f"⏸️ Chờ {wait_time:.2f}s để tránh bị chặn...")
#         time.sleep(wait_time)

#     _last_call = time.time()
#     print(symbol)

#     try:
#         quote = Quote(symbol=symbol, source="VCI")
#         df = quote.history(start=start, end=end, interval="1D")

#         data = []
#         for _, row in df.iterrows():
#             # Convert datetime -> UNIX timestamp (UTC)
#             if hasattr(row["time"], "timestamp"):
#                 timestamp = int(row["time"].replace(tzinfo=None).timestamp())
#             else:
#                 timestamp = int(datetime.strptime(str(row["time"]), "%Y-%m-%d").timestamp())

#             data.append({
#                 "time": timestamp,  # TradingView dùng UNIX time (s)
#                 "open": float(row["open"]),
#                 "high": float(row["high"]),
#                 "low": float(row["low"]),
#                 "close": float(row["close"]),
#                 "volume": int(row["volume"]),
#             })

#         print(f"📊 Cached {len(data)} phiên cho {symbol} ({start} → {end})")
#         return data

#     except Exception as e:
#         print(f"❌ Lỗi fetch {symbol}:", e)
#         traceback.print_exc()
#         return []























from vnstock import Quote
from datetime import datetime
from functools import lru_cache
import time
import traceback
import pandas as pd

_last_call = 0

@lru_cache(maxsize=32)
def fetch_stock(symbol: str, start: str, end: str):
    """Lấy dữ liệu lịch sử 10 năm gần nhất cho 1 cổ phiếu, KHÔNG LƯU FILE"""
    global _last_call
    now = time.time()

    # Giới hạn tần suất tránh bị chặn
    if now - _last_call < 2:
        wait_time = 2 - (now - _last_call)
        print(f"⏸️ Chờ {wait_time:.2f}s để tránh bị chặn...")
        time.sleep(wait_time)

    _last_call = time.time()
    print(f"📈 Fetching: {symbol} ({start} → {end})")

    try:
        # ✅ Parse ngày thành datetime
        start_dt = pd.to_datetime(start)
        end_dt = pd.to_datetime(end)

        # ✅ Tạo instance Quote
        quote = Quote(symbol=symbol.upper(), source="VCI")

        # ✅ Truyền vào đúng format string
        df = quote.history(
            start=start_dt.strftime("%Y-%m-%d"),
            end=end_dt.strftime("%Y-%m-%d"),
            interval="1D"
        )

        if df is None or df.empty:
            print(f"⚠️ Không có dữ liệu cho mã {symbol}")
            return []

        # 🚫 Cảnh báo pandas slice — fix bằng copy()
        df = df.copy()

        data = []
        for _, row in df.iterrows():
            try:
                # if hasattr(row["time"], "timestamp"):
                #     ts = int(row["time"].to_pydatetime().timestamp())
                # else:
                #     ts = int(datetime.strptime(str(row["time"]), "%Y-%m-%d").timestamp())
                if hasattr(row["time"], "strftime"):
                    ts = row["time"].strftime("%Y-%m-%d")
                else:
                    try:
                        ts = datetime.strptime(str(row["time"]), "%Y-%m-%d").strftime("%Y-%m-%d")
                    except Exception:
                        ts = str(row["time"])[:10]

                data.append({
                    "time": ts,
                    "open": float(row["open"]),
                    "high": float(row["high"]),
                    "low": float(row["low"]),
                    "close": float(row["close"]),
                    "volume": int(row.get("volume", 0)),
                })
            except Exception as e:
                print(f"⚠️ Lỗi dòng dữ liệu: {e}")
                continue

        print(f"✅ Lấy {len(data)} phiên giao dịch cho {symbol}")
        return data

    except Exception as e:
        print(f"❌ Lỗi fetch {symbol}: {e}")
        traceback.print_exc()
        return []
