import React from "react";
import LeftPanel from "./components/LeftPanel";
import MainMarketPanel from "./components/MainMarketPanel";
import RightPanel from "./components/RightPanel";

function page() {
    return (
        <section className="grid grid-cols-[10rem_1fr_15rem] h-[90vh] bg-[#fff] text-white overflow-hidden">
            <LeftPanel />
            <MainMarketPanel />
            <RightPanel />
        </section>
    );
}

export default page;
