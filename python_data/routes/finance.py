from flask import Blueprint, jsonify
from core.fetchers import fetch_finance

finance_bp = Blueprint("finance_bp", __name__)

@finance_bp.route("/api/finance/<symbol>")
def get_finance_summary(symbol):
    data = fetch_finance(symbol)
    if not data:
        return jsonify({"error": f"Không lấy được dữ liệu cho {symbol}"}), 500
    return jsonify(data)
