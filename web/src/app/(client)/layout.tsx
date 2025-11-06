import Header from "@/share/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="pt-14">{children}</main>
            {/* <Footer /> */}
        </>
    );
}
