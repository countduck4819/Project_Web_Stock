from .vnindex import vnindex_bp
from .listing import listing_bp
from .industries import industries_bp
from .industries_for_code import industries_for_code_bp
from .stocks_by_industries import stocks_by_industries_bp
from .stock import stock_bp
from .stocks_symbols import stocks_symbols_bp
from .history import tv_bp

blueprints = [tv_bp,stocks_symbols_bp,vnindex_bp, listing_bp, industries_bp, industries_for_code_bp, stocks_by_industries_bp, stock_bp]

__all__ = ["blueprints"]
