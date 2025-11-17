from vnstock import Company
from datetime import datetime
from functools import lru_cache
import os, time, json, traceback, pandas as pd, re, unicodedata

_last_call = 0

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.abspath(os.path.join(BASE_DIR, "../../data/news"))
os.makedirs(CACHE_DIR, exist_ok=True)

def save_json(filename, data):
    """Lưu file JSON format đẹp"""
    path = os.path.join(CACHE_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 Saved {filename} → {path}")


def load_json(filename):
    """Đọc cache nếu tồn tại"""
    path = os.path.join(CACHE_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def _safe_date(x):
    """Convert ngày về dạng chuẩn YYYY-MM-DD HH:MM:SS"""
    if pd.isna(x) or x in ["", None]:
        return None
    try:
        if isinstance(x, (int, float)):
            if x > 1e12:
                x = x / 1000
            dt = datetime.fromtimestamp(x)
            if dt.year < 2000:
                return None
            return dt.strftime("%Y-%m-%d %H:%M:%S")

        if hasattr(x, "strftime"):
            return x.strftime("%Y-%m-%d %H:%M:%S")

        s = str(x).strip()
        if s.isdigit():
            return _safe_date(float(s))
        dt = pd.to_datetime(s, errors="coerce")
        if pd.isna(dt) or dt.year < 2000:
            return None
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        return None


def slugify(text: str):
    """Tạo slug sạch từ title — bỏ dấu, ký tự đặc biệt"""
    if not text:
        return ""
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("utf-8")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text)
    return text.strip("-").lower()

def _fetch_from_api(symbol: str, limit: int = 300):
    """Gọi vnstock.Company.news()"""
    global _last_call
    now = time.time()
    if now - _last_call < 2:
        time.sleep(2 - (now - _last_call))
    _last_call = time.time()

    try:
        print(f"Fetching news for {symbol}")
        company = Company(symbol=symbol, source="VCI")
        df = company.news()

        if df is None or df.empty:
            print(f"Không có dữ liệu news cho {symbol}")
            return {}

        # Ưu tiên 'public_date', fallback 'publish_time'
        if "public_date" in df.columns:
            df["public_date"] = df["public_date"].apply(_safe_date)
            df = df.sort_values("public_date", ascending=False)
        elif "publish_time" in df.columns:
            df["public_date"] = df["publish_time"].apply(_safe_date)
            df = df.sort_values("public_date", ascending=False)
        else:
            df["public_date"] = None

        df = df.head(limit)

        # Convert từng dòng
        records = []
        for _, row in df.iterrows():
            title = str(row.get("news_title", "")).strip()
            slug = slugify(title) or f"news-{row.get('news_id', '')}"

            records.append({
                "news_id": str(row.get("news_id", "")),
                "news_title": title,
                "news_sub_title": str(row.get("news_sub_title", "")),
                "news_short_content": str(row.get("news_short_content", "")),
                "news_full_content": str(row.get("news_full_content", "")),
                "news_image_url": str(row.get("news_image_url", "")),
                "news_source_link": str(row.get("news_source_link", "")),
                "public_date": _safe_date(row.get("public_date")),
                "slug": slug,
            })

        data = {
            "symbol": symbol.upper(),
            "count": len(records),
            "data": records,
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

        print(f"Lấy {len(records)} bài cho {symbol}")
        return data

    except Exception as e:
        print(f"Lỗi fetch_news({symbol}): {e}")
        traceback.print_exc()
        return {}

@lru_cache(maxsize=32)
def fetch_news(symbol: str):
    """
    Lấy tin tức doanh nghiệp:
    Lưu local: data/news/<symbol>_news.json
    Cập nhật lại khi qua ngày mới & sau 17h
    Giữ đúng ngày + giờ public_date
    """
    symbol = symbol.upper()
    cache_file = f"{symbol}_news.json"
    today = datetime.today().strftime("%Y-%m-%d")
    current_hour = datetime.now().hour

    cached = load_json(cache_file)
    last_update = cached.get("updated_at") if cached else None

    need_update = False
    if not cached:
        print(f"Không có cache cho {symbol}")
        need_update = True
    elif today > str(last_update)[:10] and current_hour >= 17:
        print(f"Sang ngày mới ({today}) → cập nhật news {symbol}")
        need_update = True

    if need_update:
        data = _fetch_from_api(symbol)
        if data and data.get("data"):
            save_json(cache_file, data)
            return data
        print("API lỗi hoặc rỗng, fallback cache cũ")
        return cached or {}

    print(f"Dùng cache cũ cho {symbol}")
    return cached
