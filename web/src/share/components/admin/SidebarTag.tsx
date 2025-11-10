"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { sidebarMenu } from "./const";

export default function SidebarTag() {
    const pathname = usePathname();
    const { state } = useSidebar();

    const isActive = (path: string) => pathname === path;

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-gray-200 bg-white/80 backdrop-blur-md shadow-sm w-[16rem]"
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="transition-none! duration-0! px-0! opacity-100! !mt-0 text-gray-700 font-semibold text-sm uppercase tracking-wide mb-2">
                        {state === "expanded" ? (
                            <Link href="/" className="font-bold text-lg">
                                <Image
                                    src="/fireant.webp"
                                    width={120}
                                    height={20}
                                    alt="fireant"
                                />
                            </Link>
                        ) : (
                            <Link href="/" className="font-bold text-lg">
                                <Image
                                    src="/icons/logo.webp"
                                    width={120}
                                    height={20}
                                    alt="fireant"
                                />
                            </Link>
                        )}
                    </SidebarGroupLabel>

                    <SidebarGroupContent className="mt-[2rem]">
                        <SidebarMenu>
                            {sidebarMenu.map((item) => {
                                const Icon = item.icon;
                                if (item?.children) {
                                    return (
                                        <Collapsible
                                            key={item.title}
                                            defaultOpen
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton>
                                                        <Icon className="w-4 h-4" />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.children.map(
                                                            (child) => (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        child.title
                                                                    }
                                                                >
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                        className={`px-3 py-2 rounded-md text-sm ${
                                                                            isActive(
                                                                                child.href
                                                                            )
                                                                                ? "bg-indigo-100 text-indigo-700 font-medium"
                                                                                : "text-gray-600 hover:bg-gray-100"
                                                                        }`}
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                child.href
                                                                            }
                                                                        >
                                                                            {
                                                                                child.title
                                                                            }
                                                                        </Link>
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                                isActive(item?.href || "")
                                                    ? "bg-indigo-100 text-indigo-700 font-medium"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            <Link href={item?.href || ""}>
                                                <Icon className="w-4 h-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
