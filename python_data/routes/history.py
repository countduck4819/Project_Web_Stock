from flask import Blueprint, jsonify, request
from core.fetchers import fetch_history
import time

history_bp = Blueprint("history_bp", __name__)  # ✅ tên blueprint chuẩn

@history_bp.route("/api/tradingview-feed/config")
def config():
    return jsonify({
        "supported_resolutions": ["1", "5", "15", "60", "1D"],
        "supports_group_request": False,
        "supports_marks": False,
        "supports_timescale_marks": False,
        "supports_time": True,
    })

@history_bp.route("/api/tradingview-feed/symbols")
def symbols():
    symbol = request.args.get("symbol", "").upper()
    if not symbol:
        return jsonify({"s": "error", "errmsg": "Missing symbol"}), 400

    return jsonify({
        "name": symbol,
        "ticker": symbol,
        "type": "stock",
        "session": "0900-1500",
        "timezone": "Asia/Ho_Chi_Minh",
        "exchange": "HOSE",
        "minmov": 1,
        "pricescale": 1,
        "has_intraday": False,
        "has_no_volume": False,
        "supported_resolutions": ["1D"],
    })

@history_bp.route("/api/tradingview-feed/history")
def history():
    symbol = request.args.get("symbol", "").upper().strip()
    from_ts = int(request.args.get("from", 0))
    to_ts = int(request.args.get("to", time.time()))

    if not symbol:
        return jsonify({"s": "error", "errmsg": "Thiếu symbol"}), 400

    if ":" in symbol:
        _, symbol = symbol.split(":")

    print(f"📊 Fetch mock data for {symbol} ({from_ts} → {to_ts})")
    data = fetch_history(symbol)
    return jsonify(data)

@history_bp.route("/api/tradingview-feed/time")
def time_now():
    return str(int(time.time()))
