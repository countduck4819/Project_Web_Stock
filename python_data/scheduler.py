import threading, time, schedule
from core.fetchers import fetch_vnindex, fetch_listing, fetch_industries,fetch_industries_for_code,fetch_stocks_by_industries,fetch_stocks_symbols
from core.utils import save_json

def scheduled_export():
    print("⏳ Bắt đầu cập nhật dữ liệu...")
    datasets = {
        "vnindex.json": fetch_vnindex(),
        "listing.json": fetch_listing(),
        "industries.json": fetch_industries(),
        "industries_for_code.json": fetch_industries_for_code(),
        "stocks_by_industries.json": fetch_stocks_by_industries(),
        "stocks_symbols.json": fetch_stocks_symbols()
    }
    for filename, data in datasets.items():
        if data:
            save_json(filename, data)
    print("✅ Hoàn tất cập nhật tất cả dữ liệu.")

def schedule_loop():
    scheduled_export()  # chạy ngay khi start
    schedule.every(1).hours.do(scheduled_export)
    # schedule.every(15).minutes.do(scheduled_export)
    counter = 0
    while True:
        schedule.run_pending()
        counter += 1
        if counter % 10 == 0:  # cứ 10 lần sleep (~5 phút) log 1 lần
            print("💤 Scheduler vẫn đang chạy...")
        time.sleep(30)

def start_scheduler():
    threading.Thread(target=schedule_loop, daemon=True).start()
