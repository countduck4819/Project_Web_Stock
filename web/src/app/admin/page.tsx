import SidebarTag from "@/share/components/admin/SidebarTag";
import StockChart from "@/share/components/StockChart";
import React from "react";

function page() {
    return (
        <div>
            <StockChart symbol="HOSE:NVL" />
        </div>
    );
}

export default page;
