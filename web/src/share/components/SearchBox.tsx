"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchStocks } from "@/store/stock-symbols/stock-symbols.api";

import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

export default function SearchBox() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { stocksFullList, loading } = useAppSelector(
        (state) => state.stockSymbols
    );

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [hasOpened, setHasOpened] = useState(true); // Set true để render ngay

    // 🧩 Lần đầu load
    useEffect(() => {
        if (!stocksFullList?.length) dispatch(fetchStocks());
        const saved = JSON.parse(
            localStorage.getItem("search-history") || "[]"
        );
        if (Array.isArray(saved)) setHistory(saved);
    }, [dispatch, stocksFullList?.length]);

    // 🔍 Lọc kết quả - KHÔNG dùng debounce, dùng useMemo thôi
    const filtered = useMemo(() => {
        const term = value.trim().toLowerCase();

        if (term === "") {
            // Hiển thị tối đa 5 mã gần nhất
            return history
                .slice(0, 10)
                .map((code) => stocksFullList.find((s) => s.symbol === code))
                .filter(Boolean);
        }

        // Tối ưu: check symbol trước (thường ngắn hơn), limit 30 kết quả
        const results = [];
        for (let i = 0; i < stocksFullList.length && results.length < 30; i++) {
            const item = stocksFullList[i];
            if (
                item &&
                item.symbol &&
                item.organ_name &&
                (item.symbol.toLowerCase().includes(term) ||
                    item.organ_name.toLowerCase().includes(term))
            ) {
                results.push(item);
            }
        }
        return results;
    }, [value, stocksFullList, history]);

    // 📌 Khi chọn 1 mã - dùng useCallback
    const handleSelect = useCallback(
        (code: string) => {
            const updated = [code, ...history.filter((i) => i !== code)].slice(
                0,
                10
            );
            localStorage.setItem("search-history", JSON.stringify(updated));
            setHistory(updated);
            setOpen(false);
            setValue("");
            router.push(`/ma-chung-khoan/${code}`);
        },
        [history, router]
    );

    // Tối ưu onChange
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);
            if (!open && newValue) {
                setOpen(true);
            }
        },
        [open]
    );

    const handleFocus = useCallback(() => {
        setOpen(true);
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-[300px]">
                    <Input
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        placeholder="Nhập mã hoặc tên công ty..."
                        className="pr-8"
                        autoComplete="off"
                    />
                    <Search className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
            </PopoverTrigger>

            {hasOpened && (
                <PopoverContent
                    align="start"
                    sideOffset={6}
                    className="p-0 w-[300px] rounded-lg shadow-lg overflow-hidden"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="border-b px-3 py-2 font-medium text-sm">
                        {value ? "Kết quả tìm kiếm" : "Mã gần đây"}
                    </div>

                    <div className="max-h-[300px] overflow-auto">
                        {loading ? (
                            <div className="px-3 py-3 text-sm text-gray-500">
                                Đang tải danh sách...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-gray-500">
                                {value
                                    ? "Không tìm thấy mã phù hợp"
                                    : "Chưa có lịch sử tìm kiếm"}
                            </div>
                        ) : (
                            filtered.map((item) =>
                                item ? (
                                    <button
                                        key={item.symbol}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(item.symbol);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-blue-50 active:bg-blue-100 focus:outline-none"
                                    >
                                        <div className="font-semibold text-sm">
                                            {item.symbol}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {item.organ_name}
                                        </div>
                                    </button>
                                ) : null
                            )
                        )}
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
}
