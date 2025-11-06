import os, json, time

EXPORT_DIR = "/fireant/python/data"

def save_json(filename, data):
    try:
        os.makedirs(EXPORT_DIR, exist_ok=True)
        file_path = os.path.join(EXPORT_DIR, filename)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2, default=str)
        print(f"✅ Saved {filename} ({len(data)} records) at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    except Exception as e:
        print(f"❌ Lỗi khi lưu {filename}:", e)
