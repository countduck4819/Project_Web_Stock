"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { fetchStockRecsQuery } from "@/store/stock-recommendations/stock-recommendations.api";
import ExpertRecommendations from "./ExpertRecommendations";
import AIRecommendations from "./AIRecommendations";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useAuth } from "@/auth/AuthProvider";
import { canAccess } from "@/lib/utils";
import { Role } from "@/share/enum";
import UpgradeToPremium from "../updatePremium/UpgradeToPremium";

export default function StockRecommendationTabs() {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const { list, loading } = useAppSelector(
        (state) => state.stockRecommendations
    );

    const [activeTab, setActiveTab] = useState("expert");

    useEffect(() => {
        dispatch(fetchStockRecsQuery({ page: 1, limit: 10 }));
    }, [dispatch]);

    const handleTabChange = (val: string) => {
        setActiveTab(val);

        dispatch(
            fetchStockRecsQuery({
                page: 1,
                limit: 10,
                ...(val === "ai" ? { filters: { source: "AI" } } : {}),
            })
        );
    };

    const canSeeContent = canAccess(user, Role.Premium);

    return (
        <div className="w-full px-4 py-6">
            <Tabs
                defaultValue="expert"
                onValueChange={handleTabChange}
                className="w-full"
            >
                <div className="relative flex justify-center w-fit border-b border-gray-200">
                    <TabsList className="flex gap-6 bg-transparent p-0 relative">
                        {["expert", "ai"].map((val) => (
                            <TabsTrigger
                                key={val}
                                value={val}
                                className={`
                                    relative px-6 py-3 text-[15px] font-medium
                                    bg-transparent hover:bg-transparent shadow-none
                                    data-[state=active]:shadow-none
                                    ${
                                        activeTab === val
                                            ? "text-[#6A5AF9]"
                                            : "text-gray-600 hover:text-black"
                                    }`}
                            >
                                {val === "expert"
                                    ? "🔍 Từ chuyên gia"
                                    : "🤖 AI gợi ý"}

                                {activeTab === val && (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6A5AF9] to-[#FF5EDF] rounded-full"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="mt-6">
                    <TabsContent value="expert">
                        <AnimatePresence mode="wait">
                            {canSeeContent ? (
                                <motion.div
                                    key="expert"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <ExpertRecommendations
                                        data={list as any}
                                        loading={loading}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="premium-expert"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <UpgradeToPremium activeTab={activeTab} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="ai">
                        <AnimatePresence mode="wait">
                            {canSeeContent ? (
                                <motion.div
                                    key="ai"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                                        <AIRecommendations
                                            data={list}
                                            loading={loading}
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="premium-ai"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <UpgradeToPremium activeTab={activeTab} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
