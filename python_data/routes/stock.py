from flask import Blueprint, jsonify, request
from datetime import datetime
from core.fetchers import fetch_stock

stock_bp = Blueprint("stock_bp", __name__)

@stock_bp.route("/api/stock/<symbol>")
def get_stock(symbol):
    try:
        end = datetime.today()
        start = end.replace(year=end.year - 10)

        start_str = request.args.get("start", start.strftime("%Y-%m-%d"))
        end_str = request.args.get("end", end.strftime("%Y-%m-%d"))

        data = fetch_stock(symbol.upper(), start_str, end_str)
        return jsonify(data)
    except Exception as e:
        print(f"❌ Lỗi fetch {symbol}:", e)
        return jsonify({"error": str(e)}), 500
