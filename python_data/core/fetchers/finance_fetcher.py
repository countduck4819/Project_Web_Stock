from vnstock import Finance
from datetime import datetime
import os, json, time, traceback
import pandas as pd
from functools import lru_cache

# === Đường dẫn thư mục cache ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.abspath(os.path.join(BASE_DIR, "../../data/finance"))
_last_call = 0


def save_json(filename, data):
    """Lưu file JSON vào data/finance"""
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, filename)
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"💾 Saved {filename} → {path}")
    except Exception as e:
        print(f"⚠️ Không thể lưu {filename}: {e}")


def load_json(filename):
    """Đọc cache nếu có"""
    path = os.path.join(CACHE_DIR, filename)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            print(f"⚠️ Lỗi đọc cache {filename}, bỏ qua.")
    return None


def _fetch_from_api(symbol: str, period: str = "quarter"):
    """Gọi vnstock.finance.ratio thật sự"""
    global _last_call
    now = time.time()
    if now - _last_call < 2:
        time.sleep(2 - (now - _last_call))
    _last_call = time.time()

    try:
        print(f"📈 Fetching finance.ratio({symbol}, period='{period}')")
        finance = Finance(symbol=symbol, source="VCI")
        df = finance.ratio(period=period, lang="en", dropna=True)

        # 🛑 Không có dữ liệu
        if df is None or df.empty:
            print(f"⚠️ Không có dữ liệu ratio cho {symbol}")
            return {}

        # ✅ Nếu là MultiIndex, gộp các tầng lại thành chuỗi
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [
                " ".join([str(c) for c in col if c and c != "nan"]).strip()
                for col in df.columns.values
            ]

        # ✅ Lấy 10 dòng gần nhất (quý mới nhất)
        df = df.head(10)

        # ✅ Chuyển toàn bộ giá trị sang JSON-safe (float hoặc str)
        def safe_value(x):
            if pd.isna(x):
                return None
            if isinstance(x, (int, float)):
                return float(x)
            return str(x)

        df = df.map(safe_value)

        data = {
            "symbol": symbol.upper(),
            "period": period,
            "count": len(df),
            "data": df.to_dict(orient="records"),
            "updated_year": datetime.now().year,
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

        return data

    except Exception as e:
        print(f"❌ Lỗi fetch_finance({symbol}): {e}")
        traceback.print_exc()
        return {}


@lru_cache(maxsize=64)
def fetch_finance(symbol: str, period: str = "quarter"):
    """
    Lấy bảng chỉ số tài chính (finance.ratio)
    ✅ Cache 1 năm 1 lần
    ✅ Lưu trong data/finance/<symbol>_ratio.json
    ✅ Chỉ giữ 10 bản ghi gần nhất
    """
    symbol = symbol.upper()
    cache_file = f"{symbol}_ratio_{period}.json"
    current_year = datetime.now().year

    cached = load_json(cache_file)
    last_year = cached.get("updated_year") if cached else None

    # Chỉ fetch lại khi sang năm mới hoặc chưa có cache
    if not cached or (last_year and current_year > last_year):
        print(f"📅 Cập nhật mới ratio cho {symbol} ({current_year})")
        data = _fetch_from_api(symbol, period)
        if data:
            save_json(cache_file, data)
            return data
        print("⚠️ API lỗi hoặc rỗng, fallback dùng cache cũ (nếu có)")
        return cached or {}

    print(f"✅ Dùng cache ratio cũ cho {symbol}")
    return cached
