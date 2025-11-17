# from flask import Flask, jsonify
# from vnstock import Vnstock, Listing
# import json, os, time, threading, traceback, schedule

# app = Flask(__name__)

# EXPORT_DIR = "/fireant/data/exported"


# # ---------- Helper Functions ----------

# def save_json(filename, data):
#     """Lưu dữ liệu ra file JSON"""
#     try:
#         os.makedirs(EXPORT_DIR, exist_ok=True)
#         file_path = os.path.join(EXPORT_DIR, filename)
#         with open(file_path, "w", encoding="utf-8") as f:
#             json.dump(data, f, ensure_ascii=False, indent=2, default=str)
#         print(f"Saved {filename} ({len(data)} records) at {time.strftime('%Y-%m-%d %H:%M:%S')}")
#     except Exception as e:
#         print(f"Lỗi khi lưu {filename}:", e)


# # ---------- Fetch Functions ----------

# def fetch_vnindex():
#     """Lấy dữ liệu VNINDEX"""
#     try:
#         vnst = Vnstock()
#         df = vnst.stock(symbol="VNINDEX").quote.history(
#             start="2024-01-01", end="2025-10-31", interval="1D"
#         )
#         data = [
#             {
#                 "time": row["time"].isoformat() if hasattr(row["time"], "isoformat") else row["time"],
#                 "open": float(row["open"]),
#                 "high": float(row["high"]),
#                 "low": float(row["low"]),
#                 "close": float(row["close"]),
#             }
#             for _, row in df.iterrows()
#         ]
#         print(f"📊 Lấy được {len(data)} phiên VNINDEX")
#         return data
#     except Exception as e:
#         print("❌ Lỗi khi fetch VNINDEX:", e)
#         traceback.print_exc()
#         return []


# def fetch_listing():
#     """Lấy danh sách mã chứng khoán"""
#     try:
#         listing = Listing()
#         df = listing.listing_all()
#         data = df.to_dict(orient="records")
#         print(f"📈 Lấy được {len(data)} mã chứng khoán")
#         return data
#     except Exception as e:
#         print("❌ Lỗi khi fetch Listing:", e)
#         traceback.print_exc()
#         return []


# def fetch_industries():
#     """Lấy danh sách ngành nghề"""
#     try:
#         listing = Listing()
#         df = listing.listing_all()
#         industries = sorted(df["industry_name"].dropna().unique().tolist())
#         print(f"🏭 Lấy được {len(industries)} ngành nghề")
#         return industries
#     except Exception as e:
#         print("❌ Lỗi khi fetch Industries:", e)
#         traceback.print_exc()
#         return []


# # ---------- Flask Routes ----------

# @app.route("/api/vnindex")
# def api_vnindex():
#     data = fetch_vnindex()
#     save_json("vnindex.json", data)
#     return jsonify(data)

# @app.route("/api/listing")
# def api_listing():
#     data = fetch_listing()
#     save_json("listing.json", data)
#     return jsonify(data)

# @app.route("/api/industries")
# def api_industries():
#     data = fetch_industries()
#     save_json("industries.json", data)
#     return jsonify(data)


# # ---------- Background Scheduler ----------

# def scheduled_export():
#     """Tự động cập nhật tất cả file mỗi 1 tiếng"""
#     print("Bắt đầu cập nhật dữ liệu...")
#     datasets = {
#         "vnindex.json": fetch_vnindex(),
#         "listing.json": fetch_listing(),
#         "industries.json": fetch_industries()
#     }
#     for filename, data in datasets.items():
#         if data:
#             save_json(filename, data)
#     print("Hoàn tất cập nhật tất cả dữ liệu.")


# def schedule_loop():
#     scheduled_export()  # chạy ngay khi start
#     schedule.every(1).hours.do(scheduled_export)
#     while True:
#         schedule.run_pending()
#         time.sleep(30)


# # ---------- Entry Point ----------

# if __name__ == "__main__":
#     threading.Thread(target=schedule_loop, daemon=True).start()
#     app.run(host="0.0.0.0", port=6060, debug=True)


from flask import Flask, jsonify,json
from scheduler import start_scheduler
from routes import blueprints
import sys
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Cấu hình toàn cục để Flask JSON không escape unicode
app.config['JSON_AS_ASCII'] = False

# Đảm bảo provider JSON mới của Flask (>=2.3) cũng dùng UTF-8
json.provider.DefaultJSONProvider.ensure_ascii = False

# (Tuỳ chọn, nhưng nên có) đảm bảo output console UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Đăng ký blueprint cho các route
for bp in blueprints:
    app.register_blueprint(bp)


# Khởi động scheduler chạy nền (auto update mỗi 1 tiếng)
start_scheduler()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6060, debug=True)