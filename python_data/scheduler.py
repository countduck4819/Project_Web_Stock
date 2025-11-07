import os
import threading
import time
import schedule
from core.fetchers import (
    fetch_vnindex,
    fetch_listing,
    fetch_industries,
    fetch_industries_for_code,
    fetch_stocks_by_industries,
    fetch_stocks_symbols,
)
from core.utils import save_json

# Đường dẫn gốc tới thư mục data/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "../../data")
STOCKS_DIR = os.path.join(DATA_DIR, "stocks")

def ensure_dirs():
    """Đảm bảo tồn tại data/ và data/stocks/"""
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(STOCKS_DIR, exist_ok=True)

def scheduled_export():
    print("⏳ Bắt đầu cập nhật dữ liệu...")
    ensure_dirs()

    datasets = {
        "vnindex.json": fetch_vnindex(),
        "listing.json": fetch_listing(),
        "industries.json": fetch_industries(),
        "industries_for_code.json": fetch_industries_for_code(),
        "stocks_by_industries.json": fetch_stocks_by_industries(),
        "stocks_symbols.json": fetch_stocks_symbols()
    }

    for filename, data in datasets.items():
        if not data:
            print(f"⚠️ Không có dữ liệu cho {filename}, bỏ qua.")
            continue

        # ✅ Nếu là file dữ liệu tổng hợp → lưu thẳng trong data/
        save_json(filename, data)

    print("✅ Hoàn tất cập nhật tất cả dữ liệu.\n")

def schedule_loop():
    scheduled_export()  # chạy ngay khi start
    schedule.every(1).hours.do(scheduled_export)

    counter = 0
    while True:
        schedule.run_pending()
        counter += 1
        if counter % 10 == 0:
            print("💤 Scheduler vẫn đang chạy...")
        time.sleep(30)

def start_scheduler():
    threading.Thread(target=schedule_loop, daemon=True).start()
