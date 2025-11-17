"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Bell,
    MessageSquare,
    LogOut,
    User,
    Settings,
    Crown,
} from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import SearchBox from "../components/SearchBox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Role } from "../enum";
import { AccountType } from "@/store/users/user.reducer";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header
            className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-md bg-white/70 border-b border-white/20
      "
        >
            <div className="max-w-[90vw] mx-auto h-[3.5rem] flex items-center justify-between px-4">
                {/* LEFT */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-lg">
                        <Image
                            src="/fireant.webp"
                            width={120}
                            height={20}
                            alt="fireant"
                            className="w-[8rem] h-[8rem]"
                        />
                    </Link>

                    <nav className="flex items-center gap-5 text-sm">
                        <Link href="/" className="hover:text-primary">
                            Trang chủ
                        </Link>
                        <Link href="/" className="hover:text-primary">
                            Cộng đồng
                        </Link>
                        <Link href="/" className="hover:text-primary">
                            Thị trường
                        </Link>
                        <Link href="/" className="hover:text-primary">
                            Về FireAnt
                        </Link>
                    </nav>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    <SearchBox />

                    <button className="relative hover:text-primary">
                        <MessageSquare size={20} />
                    </button>

                    <button className="relative hover:text-primary">
                        <Bell size={20} />
                    </button>

                    {user ? (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border border-gray-300 hover:ring-2 hover:ring-primary/40 transition">
                                    <Image
                                        src={
                                            user?.avatar ||
                                            "/images/default-avatar.png"
                                        }
                                        alt={user?.username || "User Avatar"}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content
                                className="mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-3 text-sm z-[999]"
                                align="end"
                            >
                                <div className="flex flex-col items-center pb-2 border-b border-gray-200">
                                    <Image
                                        src={
                                            user?.avatar ||
                                            "/images/default-avatar.png"
                                        }
                                        alt={user?.username || ""}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover w-[3rem] h-[3rem]"
                                    />
                                    <p className="mt-2 font-semibold">
                                        {user?.username || "User"}
                                    </p>
                                    <p
                                        className={`text-xs font-semibold ${
                                            user?.accountType ===
                                                AccountType.PREMIUM ||
                                            user?.role === Role.Admin
                                                ? "bg-gradient-to-r from-[#6A5AF9] to-[#FF5EDF] bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,94,223,0.6)]"
                                                : "bg-[linear-gradient(90deg,#757F9A_0%,#D7DDE8_100%)] bg-clip-text text-transparent"
                                        }`}
                                    >
                                        {user?.accountType ===
                                            AccountType.PREMIUM ||
                                        user?.role === Role.Admin
                                            ? "Hội viên Cao cấp"
                                            : "Hội viên Miễn phí"}
                                    </p>
                                </div>

                                <div className="mt-2 flex flex-col space-y-1">
                                    <DropdownMenu.Item asChild>
                                        <Link
                                            href="/upgrade"
                                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50"
                                        >
                                            <Crown size={16} /> Nâng cấp / Gia
                                            hạn
                                        </Link>
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item asChild>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50"
                                        >
                                            <User size={16} /> Hồ sơ cá nhân
                                        </Link>
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item asChild>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50"
                                        >
                                            <Settings size={16} /> Thiết lập tài
                                            khoản
                                        </Link>
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item
                                        onSelect={logout}
                                        asChild
                                    >
                                        <button
                                            type="button"
                                            className="cursor-pointer flex items-center gap-2 px-2 py-2 rounded-md text-red-500 hover:bg-red-50"
                                        >
                                            <LogOut size={16} /> Đăng xuất
                                        </button>
                                    </DropdownMenu.Item>
                                </div>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    ) : (
                        <Link
                            href="/login"
                            className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#6A5AF9] to-[#FF5EDF] rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
