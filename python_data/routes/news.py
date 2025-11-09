from flask import Blueprint, jsonify
from core.fetchers import fetch_news

news_bp = Blueprint("news_bp", __name__)

@news_bp.route("/api/news/<symbol>")
def get_news(symbol):
    data = fetch_news(symbol)
    if not data:
        return jsonify({"error": f"Không lấy được tin tức cho {symbol}"}), 500
    return jsonify(data)
