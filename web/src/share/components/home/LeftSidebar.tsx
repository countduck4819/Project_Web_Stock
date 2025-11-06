"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SoftwareTab from "./SoftwareTab";
import InvestmentTab from "./InvestmentTab";
import CKShinhanTab from "./CKShinhanTab";

const TAB_CONFIG = [
    {
        key: "software",
        label: "Phần mềm",
        component: SoftwareTab,
    },
    {
        key: "investment",
        label: "Đầu tư",
        component: InvestmentTab,
    },
    {
        key: "ckshinhan",
        label: "CK Shinhan",
        component: CKShinhanTab,
    },
];

export default function LeftSidebar({
    onPickSymbol,
}: {
    onPickSymbol?: (symbol: string) => void;
}) {
    return (
        <Tabs defaultValue="software" className="w-full">
            {/* --- Header Tabs --- */}
            <div className="bg-[#F8FAFC] px-2 py-1 rounded-lg w-fit border border-transparent hover:border-slate-200 transition-colors">
                <TabsList className="flex gap-1 bg-transparent h-auto p-0">
                    {TAB_CONFIG.map((tab) => (
                        <TabsTrigger
                            key={tab.key}
                            value={tab.key}
                            className={[
                                "px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 select-none",
                                "text-slate-500 hover:text-slate-800 hover:bg-white/60",
                                "data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:font-semibold data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-200",
                            ].join(" ")}
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* --- Tab Content --- */}
            {TAB_CONFIG.map((tab) => {
                const Component = tab.component;
                return (
                    <TabsContent
                        key={tab.key}
                        value={tab.key}
                        className="mt-4 animate-in fade-in-0 slide-in-from-top-2 duration-200"
                    >
                        <Component
                            {...((tab.key === "software"
                                ? { onSelect: onPickSymbol }
                                : {}) as any)}
                        />
                    </TabsContent>
                );
            })}
        </Tabs>
    );
}
