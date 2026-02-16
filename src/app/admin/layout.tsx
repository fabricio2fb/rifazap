
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, Package, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Minhas Rifas", href: "/admin/rifas", icon: Package },
        { label: "Vendas", href: "/admin/vendas", icon: Wallet },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
            {/* Navbar Desktop */}
            <header className="bg-white border-b sticky top-0 z-20 h-16 hidden md:flex items-center">
                <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                                <Zap className="w-5 h-5 text-primary-foreground fill-current" />
                            </div>
                            <span className="font-black text-xl tracking-tighter">RifaZap</span>
                        </Link>
                        <nav className="flex items-center ml-8 gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                        pathname === item.href ? "bg-primary/10 text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <CreateRaffleDialog />
                </div>
            </header>

            {/* Header Mobile */}
            <header className="md:hidden bg-white border-b h-14 flex items-center px-4 sticky top-0 z-20 justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary fill-current" />
                    <span className="font-bold text-lg">Painel Admin</span>
                </div>
                <CreateRaffleDialog />
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 pb-24 md:pb-8">
                {children}
            </main>

            {/* Bottom Navigation Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around px-4 z-30 pb-safe">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 transition-colors",
                            pathname === item.href ? "text-primary font-black" : "text-muted-foreground font-medium"
                        )}
                    >
                        <item.icon className={cn("w-6 h-6", pathname === item.href && "fill-current mb-0.5")} />
                        <span className="text-[10px]">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
