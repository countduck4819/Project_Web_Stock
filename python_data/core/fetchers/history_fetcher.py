from datetime import datetime, timedelta
import random

def fetch_tradingview_history_mock(symbol: str):
    """
    Sinh dữ liệu mẫu (mock) cho TradingView chart.
    Dùng để test biểu đồ mà không cần gọi vnstock.
    """

    print(f"📊 [Mock] Tạo dữ liệu TradingView cho mã {symbol}")

    # Tạo 30 ngày gần nhất
    now = datetime.now()
    timestamps = [
        int((now - timedelta(days=i)).timestamp())
        for i in range(30, 0, -1)
    ]

    # Sinh giá ngẫu nhiên để có nến đẹp
    base_price = random.randint(15000, 35000)
    ohlcv = []
    price = base_price

    for _ in timestamps:
        open_ = price + random.randint(-300, 300)
        close = open_ + random.randint(-150, 150)
        high = max(open_, close) + random.randint(50, 200)
        low = min(open_, close) - random.randint(50, 200)
        volume = random.randint(10000, 80000)
        ohlcv.append((open_, high, low, close, volume))
        price = close

    # Trả về format TradingView yêu cầu
    return {
        "s": "ok",
        "t": timestamps,
        "o": [o for o, _, _, _, _ in ohlcv],
        "h": [h for _, h, _, _, _ in ohlcv],
        "l": [l for _, _, l, _, _ in ohlcv],
        "c": [c for _, _, _, c, _ in ohlcv],
        "v": [v for _, _, _, _, v in ohlcv],
    }
