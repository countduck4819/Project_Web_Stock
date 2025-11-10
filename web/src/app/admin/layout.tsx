import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarTag from "@/share/components/admin/SidebarTag";
import "./index.css";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarTag />
            <div className="w-[83.5rem] min-h-screen flex flex-col bg-gradient-to-r from-[#120C1F] to-[#1A1034]">
                <SidebarTrigger />
                {children}
            </div>
        </SidebarProvider>
    );
}
