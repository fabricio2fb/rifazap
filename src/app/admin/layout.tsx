"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, LayoutDashboard, Package, Wallet, LogOut, PlusCircle, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (root.classList.contains('dark')) {
            setIsDarkMode(true);
        } else {
            const initialTheme = localStorage.getItem("theme");
            if (initialTheme === "dark" || (!initialTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                root.classList.add("dark");
                setIsDarkMode(true);
            } else {
                root.classList.remove("dark");
                setIsDarkMode(false);
            }
        }
    }, []);

    const toggleTheme = () => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

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
        <div className="h-[100dvh] flex flex-col md:flex-row bg-[#F8F9FA] dark:bg-zinc-950 overflow-hidden w-full">
            {/* Sidebar Desktop */}
            <aside className="w-72 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 hidden md:flex flex-col h-full shrink-0 z-30">
                <div className="p-6 border-b dark:border-zinc-800">
                    <Link href="/admin" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5 text-primary-foreground fill-current" />
                        </div>
                        <span className="font-black text-xl tracking-tighter dark:text-white">TicketOn</span>
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

                <div className="p-4 border-t mt-auto space-y-2 border-slate-200 dark:border-zinc-800">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:text-slate-100 transition-colors"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {isDarkMode ? "Modo Claro" : "Modo Escuro"}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Right Side Content Container */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">

                {/* Header Mobile */}
                {!isEditorPage && (
                    <header className="md:hidden flex-none bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 h-14 flex items-center px-4 z-20 justify-between">
                        <Link href="/admin" className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary fill-current" />
                            <span className="font-black text-lg tracking-tighter dark:text-white">TicketOn</span>
                        </Link>
                        <div className="flex gap-2 items-center">
                            <button onClick={toggleTheme} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-2">
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <CreateRaffleDialog />
                            <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 p-2">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </header>
                )}

                {/* Main Content Area */}
                <main className={cn(
                    "flex-1 w-full overflow-y-auto no-scrollbar",
                    isEditorPage ? "p-0" : "p-4 md:p-8"
                )}>
                    {children}
                </main>

                {/* Bottom Navigation Mobile */}
                {!isEditorPage && (
                    <nav className="md:hidden flex-none bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 h-16 flex items-center justify-around px-4 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pt-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 transition-colors",
                                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                                        ? "text-primary font-black scale-105"
                                        : "text-muted-foreground font-medium hover:text-slate-700 dark:hover:text-zinc-300"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6", (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))) && "fill-current mb-0.5")} />
                                <span className="text-[10px]">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    );
}
