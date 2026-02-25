"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, LayoutDashboard, Package, Wallet, LogOut, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Minhas Campanhas", href: "/admin/campanhas", icon: Package },
        { label: "Vendas", href: "/admin/vendas", icon: Wallet },
    ];

    const isEditorPage = pathname.includes("/editor");

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">

            {/* Sidebar Desktop */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col sticky top-0 h-screen z-30 shrink-0">
                <div className="p-6 border-b">
                    <Link href="/admin" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5 text-primary-foreground fill-current" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">TicketOn</span>
                    </Link>
                </div>

                <div className="p-4 flex flex-col gap-2">
                    <CreateRaffleDialog>
                        <button className="w-full bg-[#fdecd5] text-[#e0891d] hover:bg-[#ffdeb3] font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mb-4 border border-[#fddbb0]">
                            <PlusCircle className="w-4 h-4" /> Criar Nova Campanha
                        </button>
                    </CreateRaffleDialog>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                                    ? "bg-primary/10 text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Header Mobile */}
            <header className="md:hidden bg-white border-b h-14 flex items-center px-4 sticky top-0 z-20 justify-between shrink-0">
                <Link href="/admin" className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary fill-current" />
                    <span className="font-black text-lg tracking-tighter">TicketOn</span>
                </Link>
                <div className="flex gap-2 items-center">
                    <CreateRaffleDialog />
                    <button onClick={handleLogout} className="text-slate-400 p-2">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 h-full",
                isEditorPage ? "md:h-screen" : "min-h-[calc(100vh-56px)] md:min-h-screen"
            )}>
                <main className={cn(
                    "flex-1 w-full",
                    isEditorPage
                        ? "p-0 h-full max-h-screen overflow-hidden"
                        : "max-w-6xl mx-auto p-4 md:p-8 pb-24 md:pb-8"
                )}>
                    {children}
                </main>
            </div>

            {/* Bottom Navigation Mobile */}
            {!isEditorPage && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around px-4 z-30 pb-safe">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-colors",
                                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                                    ? "text-primary font-black"
                                    : "text-muted-foreground font-medium"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))) && "fill-current mb-0.5")} />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            )}
        </div>
    );
}
