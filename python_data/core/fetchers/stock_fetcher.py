# from vnstock import Quote
# from datetime import datetime
# from functools import lru_cache
# import time
# import traceback
# import pandas as pd

# _last_call = 0

# @lru_cache(maxsize=32)
# def fetch_stock(symbol: str, start: str, end: str):
#     """Lấy dữ liệu lịch sử 10 năm gần nhất cho 1 cổ phiếu, KHÔNG LƯU FILE"""
#     global _last_call
#     now = time.time()

#     # Giới hạn tần suất tránh bị chặn
#     if now - _last_call < 2:
#         wait_time = 2 - (now - _last_call)
#         print(f"⏸️ Chờ {wait_time:.2f}s để tránh bị chặn...")
#         time.sleep(wait_time)

#     _last_call = time.time()
#     print(f"📈 Fetching: {symbol} ({start} → {end})")

#     try:
#         # Parse ngày thành datetime
#         start_dt = pd.to_datetime(start)
#         end_dt = pd.to_datetime(end)

#         # tạo instance Quote
#         quote = Quote(symbol=symbol.upper(), source="VCI")

#         # Truyền vào đúng format string
#         df = quote.history(
#             start=start_dt.strftime("%Y-%m-%d"),
#             end=end_dt.strftime("%Y-%m-%d"),
#             interval="1D"
#         )

#         if df is None or df.empty:
#             print(f"⚠️ Không có dữ liệu cho mã {symbol}")
#             return []

#         df = df.copy()

#         data = []
#         for _, row in df.iterrows():
#             try:
#                 # if hasattr(row["time"], "timestamp"):
#                 #     ts = int(row["time"].to_pydatetime().timestamp())
#                 # else:
#                 #     ts = int(datetime.strptime(str(row["time"]), "%Y-%m-%d").timestamp())
#                 if hasattr(row["time"], "strftime"):
#                     ts = row["time"].strftime("%Y-%m-%d")
#                 else:
#                     try:
#                         ts = datetime.strptime(str(row["time"]), "%Y-%m-%d").strftime("%Y-%m-%d")
#                     except Exception:
#                         ts = str(row["time"])[:10]

#                 data.append({
#                     "time": ts,
#                     "open": float(row["open"]),
#                     "high": float(row["high"]),
#                     "low": float(row["low"]),
#                     "close": float(row["close"]),
#                     "volume": int(row.get("volume", 0)),
#                 })
#             except Exception as e:
#                 print(f"⚠️ Lỗi dòng dữ liệu: {e}")
#                 continue

#         print(f"Lấy {len(data)} phiên giao dịch cho {symbol}")
#         return data

#     except Exception as e:
#         print(f"❌ Lỗi fetch {symbol}: {e}")
#         traceback.print_exc()
#         return []








# from vnstock import Quote
# from datetime import datetime
# from functools import lru_cache
# import os, time, json, traceback, pandas as pd
# from core.utils import save_json  # dùng hàm chung

# _last_call = 0
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# CACHE_DIR = os.path.join(BASE_DIR, "../../data/stocks")

# def load_json(filename):
#     os.makedirs(CACHE_DIR, exist_ok=True)
#     path = os.path.join(CACHE_DIR, filename)
#     if os.path.exists(path):
#         with open(path, "r", encoding="utf-8") as f:
#             return json.load(f)
#     return None

# def _fetch_from_api(symbol: str, start: str, end: str):
#     global _last_call
#     now = time.time()
#     if now - _last_call < 2:
#         wait_time = 2 - (now - _last_call)
#         print(f"⏸️ Chờ {wait_time:.2f}s để tránh bị chặn...")
#         time.sleep(wait_time)
#     _last_call = time.time()

#     print(f"📈 Fetching từ vnstock: {symbol} ({start} → {end})")
#     start_dt = pd.to_datetime(start)
#     end_dt = pd.to_datetime(end)
#     quote = Quote(symbol=symbol, source="VCI")

#     df = quote.history(start=start_dt.strftime("%Y-%m-%d"), end=end_dt.strftime("%Y-%m-%d"), interval="1D")

#     if df is None or df.empty:
#         print(f"⚠️ API trả rỗng cho {symbol}")
#         return []

#     data = []
#     for _, row in df.iterrows():
#         try:
#             ts = row["time"].strftime("%Y-%m-%d") if hasattr(row["time"], "strftime") else str(row["time"])[:10]
#             data.append({
#                 "time": ts,
#                 "open": float(row["open"]),
#                 "high": float(row["high"]),
#                 "low": float(row["low"]),
#                 "close": float(row["close"]),
#                 "volume": int(row.get("volume", 0)),
#             })
#         except Exception as e:
#             print(f"⚠️ Lỗi dòng dữ liệu: {e}")
#     return data

# @lru_cache(maxsize=32)
# def fetch_stock(symbol: str, start: str, end: str):
#     symbol = symbol.upper()
#     cache_file = f"{symbol}.json"
#     today = datetime.today().strftime("%Y-%m-%d")
#     current_hour = datetime.now().hour

#     cached_data = load_json(cache_file)
#     last_cached_date = None
#     if cached_data:
#         try:
#             last_cached_date = cached_data[-1]["time"]
#             print(f"📦 Cache {symbol}: đến {last_cached_date}")
#         except Exception:
#             print(f"⚠️ Cache {symbol} lỗi định dạng, bỏ qua cache.")
           















# from vnstock import Quote
# from datetime import datetime
# from functools import lru_cache
# import os, time, json, traceback, pandas as pd

# _last_call = 0

# # Lấy đường dẫn tuyệt đối tới thư mục data/stocks/
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))               # core/fetchers/
# CACHE_DIR = os.path.abspath(os.path.join(BASE_DIR, "../../data/stocks"))  # data/stocks

# def save_json(filename, data):
#     """Lưu JSON có format đẹp vào data/stocks"""
#     os.makedirs(CACHE_DIR, exist_ok=True)
#     path = os.path.join(CACHE_DIR, filename)
#     with open(path, "w", encoding="utf-8") as f:
#         json.dump(data, f, ensure_ascii=False, indent=2)
#     print(f"💾 Saved {filename} → {path}")

# def load_json(filename):
#     """Đọc JSON nếu tồn tại"""
#     path = os.path.join(CACHE_DIR, filename)
#     if os.path.exists(path):
#         with open(path, "r", encoding="utf-8") as f:
#             return json.load(f)
#     return None


# def _fetch_from_api(symbol: str, start: str, end: str):
#     """Hàm gọi API vnstock thật sự"""
#     global _last_call
#     now = time.time()

#     # Giới hạn tần suất
#     if now - _last_call < 2:
#         wait_time = 2 - (now - _last_call)
#         print(f"⏸️ Chờ {wait_time:.2f}s để tránh bị chặn...")
#         time.sleep(wait_time)

#     _last_call = time.time()

#     print(f"📈 Fetching từ vnstock: {symbol} ({start} → {end})")
#     start_dt = pd.to_datetime(start)
#     end_dt = pd.to_datetime(end)
#     quote = Quote(symbol=symbol, source="VCI")
#     print(f"🔗 API URL: cài mã mới",symbol)
#     df = quote.history(
#         start=start_dt.strftime("%Y-%m-%d"),
#         end=end_dt.strftime("%Y-%m-%d"),
#         interval="1D",
#     )

#     if df is None or df.empty:
#         print(f"⚠️ API trả rỗng cho {symbol}")
#         return []

#     data = []
#     for _, row in df.iterrows():
#         try:
#             ts = (
#                 row["time"].strftime("%Y-%m-%d")
#                 if hasattr(row["time"], "strftime")
#                 else str(row["time"])[:10]
#             )
#             data.append(
#                 {
#                     "time": ts,
#                     "open": float(row["open"]),
#                     "high": float(row["high"]),
#                     "low": float(row["low"]),
#                     "close": float(row["close"]),
#                     "volume": int(row.get("volume", 0)),
#                 }
#             )
#         except Exception as e:
#             print(f"⚠️ Lỗi dòng dữ liệu: {e}")
#             continue

#     print(f"Lấy {len(data)} phiên giao dịch cho {symbol}")
#     return data


# @lru_cache(maxsize=32)
# def fetch_stock(symbol: str, start: str, end: str):
#     """
#     Lấy dữ liệu cổ phiếu (10 năm gần nhất)
#     Cache local: data/stocks/<symbol>.json
#     Chỉ gọi lại API khi:
#        - Sang ngày mới & sau 17h
#        - Cache rỗng hoặc lỗi
#        - API trả lỗi hoặc []
#     """
#     symbol = symbol.upper()
#     cache_file = f"{symbol}.json"
#     today = datetime.today().strftime("%Y-%m-%d")
#     current_hour = datetime.now().hour

#     # Thử đọc cache trước
#     cached_data = load_json(cache_file)
#     last_cached_date = None
#     if cached_data:
#         try:
#             last_cached_date = cached_data[-1]["time"]
#             print(f"📦 Cache {symbol}: đến {last_cached_date}")
#         except Exception:
#             print(f"⚠️ Cache {symbol} lỗi định dạng, bỏ qua cache.")
#             cached_data = None

#     # Quyết định có cần cập nhật không
#     need_update = False
#     if not cached_data:
#         print(f"Không có cache cho {symbol}, cần fetch mới.")
#         need_update = True
#     elif today > last_cached_date and current_hour >= 17:
#         print(f"🌇 Sang ngày mới ({today}), sau 17h → cập nhật {symbol}.")
#         need_update = True

#     # Nếu cần cập nhật → fetch API
#     if need_update:
#         data = _fetch_from_api(symbol, start, end)
#         if data:  
#             save_json(cache_file, data)
#             return data
#         else:
#             print(f"⚠️ API lỗi hoặc rỗng, fallback dùng cache cũ (nếu có).")
#             return cached_data or []

#     # Nếu không cần update → dùng cache
#     print(f"Dùng cache cũ cho {symbol}")
#     return cached_data

















from vnstock import Quote
from datetime import datetime, timedelta
import os, time, json, pandas as pd

_last_call = 0

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.abspath(os.path.join(BASE_DIR, "../../data/stocks"))

def save_json(filename, data):
    """Lưu JSON có format đẹp vào data/stocks"""
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 Saved {filename} → {path}")

def load_json(filename):
    """Đọc JSON nếu tồn tại"""
    path = os.path.join(CACHE_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def _fetch_from_api(symbol: str, start: str, end: str):
    """Hàm gọi API vnstock thật sự"""
    global _last_call
    now = time.time()

    if now - _last_call < 2:
        wait_time = 2 - (now - _last_call)
        print(f"⏸️ Chờ {wait_time:.2f}s để tránh bị chặn...")
        time.sleep(wait_time)

    _last_call = time.time()

    print(f"📈 Fetching từ vnstock: {symbol} ({start} → {end})")
    start_dt = pd.to_datetime(start)
    end_dt = pd.to_datetime(end)
    quote = Quote(symbol=symbol, source="VCI")
    print(f"🔗 API URL: cài mã mới", symbol)
    df = quote.history(
        start=start_dt.strftime("%Y-%m-%d"),
        end=end_dt.strftime("%Y-%m-%d"),
        interval="1D",
    )

    if df is None or df.empty:
        print(f"API trả rỗng cho {symbol}")
        return []

    data = []
    for _, row in df.iterrows():
        try:
            ts = (
                row["time"].strftime("%Y-%m-%d")
                if hasattr(row["time"], "strftime")
                else str(row["time"])[:10]
            )
            data.append(
                {
                    "time": ts,
                    "open": float(row["open"]),
                    "high": float(row["high"]),
                    "low": float(row["low"]),
                    "close": float(row["close"]),
                    "volume": int(row.get("volume", 0)),
                }
            )
        except Exception as e:
            print(f"⚠️ Lỗi dòng dữ liệu: {e}")
            continue

    return data


def get_last_trading_day():
    today = datetime.today()
    wd = today.weekday()

    if wd == 5:  # Saturday
        return (today - timedelta(days=1)).strftime("%Y-%m-%d")
    if wd == 6:  # Sunday
        return (today - timedelta(days=2)).strftime("%Y-%m-%d")
    return today.strftime("%Y-%m-%d")


def fetch_stock(symbol: str, start: str, end: str):
    symbol = symbol.upper()
    cache_file = f"{symbol}.json"
    today = datetime.today().strftime("%Y-%m-%d")
    current_hour = datetime.now().hour

    cached_data = load_json(cache_file)
    last_cached_date = None
    if cached_data:
        try:
            last_cached_date = cached_data[-1]["time"]
            print(f"📦 Cache {symbol}: đến {last_cached_date}")
        except Exception:
            print(f"⚠️ Cache {symbol} lỗi định dạng, bỏ qua cache.")
            cached_data = None

    need_update = False

    # Không có cache → fetch luôn
    if not cached_data:
        print(f"🆕 Không có cache cho {symbol}, cần fetch mới.")
        need_update = True

    # Tính ngày giao dịch gần nhất
    last_trading_day = get_last_trading_day()

    # Nếu cache chưa có ngày giao dịch gần nhất → cần update
    if last_cached_date and last_cached_date < last_trading_day:
        print(f"📉 Cache thiếu ngày {last_trading_day} → cần cập nhật.")
        # Chỉ update sau 17h để chắc chắn dữ liệu có sẵn
        if current_hour >= 17:
            need_update = True
        else:
            need_update = False
            print(f"⏱ Chưa đến 17h → không cập nhật, dùng cache.")

    # Thứ 7 & CN → không update nếu cache đã đủ đến thứ 6
    weekday = datetime.today().weekday()
    if weekday >= 5:
        if last_cached_date >= last_trading_day:
            print(f"📆 Cuối tuần và cache đã đủ đến {last_trading_day} → KHÔNG cập nhật.")
            need_update = False
        else:
            print(f"📆 Cuối tuần nhưng cache thiếu → cập nhật 1 lần.")
            need_update = True

    # Fetch nếu cần
    if need_update:
        data = _fetch_from_api(symbol, start, end)
        if data:
            save_json(cache_file, data)
            return data
        else:
            print(f"⚠️ API rỗng → fallback cache.")
            return cached_data or []

    print(f"📂 Dùng cache cũ cho {symbol} (đến {last_cached_date})")
    return cached_data



























