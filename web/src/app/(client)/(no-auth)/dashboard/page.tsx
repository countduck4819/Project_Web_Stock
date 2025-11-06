import React from "react";
import LeftPanel from "./components/LeftPanel";
import MainMarketPanel from "./components/MainMarketPanel";
import RightPanel from "./components/RightPanel";

function page() {
    return (
        <section className="grid grid-cols-[22rem_1fr_24rem] h-[100vh] bg-[#0B0F1A] text-white overflow-hidden">
            <LeftPanel />
            <MainMarketPanel />
            <RightPanel />
        </section>
    );
}

export default page;
