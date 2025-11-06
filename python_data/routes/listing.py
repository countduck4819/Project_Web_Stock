from flask import Blueprint, jsonify
from core.fetchers import fetch_listing
from core.utils import save_json

listing_bp = Blueprint("listing_bp", __name__)

@listing_bp.route("/api/listing")
def get_listing():
    data = fetch_listing()
    if not data:
        return jsonify({"error": "Không lấy được danh sách mã"}), 500
    save_json("listing.json", data)
    return jsonify(data)
