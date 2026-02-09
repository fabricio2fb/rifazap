'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Ticket, Calendar, DollarSign, LogOut } from 'lucide-react';

export default function CustomerDashboard() {
    const [customer, setCustomer] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer');
        if (!storedCustomer) {
            router.push('/customer/login');
            return;
        }
        setCustomer(JSON.parse(storedCustomer));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('customer');
        router.push('/');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
            case 'confirmed':
                return <Badge className="bg-green-500">Pago</Badge>;
            case 'paid_delayed':
                return <Badge className="bg-orange-500">Pago (Atraso)</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelado</Badge>;
            default:
                return <Badge variant="outline" className="text-yellow-600 border-yellow-500">Pendente</Badge>;
        }
    };

    if (!customer) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    // Check if purchases exists and is an array, otherwise default to empty
    const purchases = Array.isArray(customer.purchases) ? customer.purchases :
        (customer.purchases ? [customer.purchases] : []);


    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <div className="p-2 hover:bg-muted rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                        </Link>
                        <h1 className="font-bold text-lg">Meus Números</h1>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" /> Sair
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-bold text-xl">{customer.name}</h2>
                            <p className="text-muted-foreground text-sm">{customer.phone}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary" />
                        Minhas Reservas
                    </h3>

                    {purchases.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Você ainda não participou de nenhuma rifa.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {purchases.map((purchase: any) => (
                                <Card key={purchase.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="bg-slate-100 p-6 flex flex-col justify-center gap-2 min-w-[200px]">
                                            <span className="text-xs font-bold uppercase text-muted-foreground">Rifa</span>
                                            <p className="font-bold text-lg leading-tight">
                                                {/* Fallback if raffle data structure varies */}
                                                {purchase.raffle?.title || 'Rifa sem título'}
                                            </p>
                                            {purchase.raffle?.draw_date && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(purchase.raffle.draw_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                        <DollarSign className="w-4 h-4" />
                                                        Total: R$ {purchase.total_amount?.toFixed(2)}
                                                    </div>
                                                    {getStatusBadge(purchase.status)}
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold uppercase text-muted-foreground">Seus Números:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {purchase.numbers?.map((num: number) => (
                                                            <Badge key={num} variant="secondary" className="text-sm font-bold bg-slate-100 px-3 py-1">
                                                                {num.toString().padStart(2, '0')}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t flex justify-end">
                                                {purchase.status === 'pending' && (
                                                    // Redirect to raffle page for payment if needed, or show payment info?
                                                    // For simplicity, just link to the raffle page
                                                    <Link href={`/rifa/${purchase.raffle?.slug}`}>
                                                        <Button size="sm" variant="outline">Ver Rifa / Pagar</Button>
                                                    </Link>
                                                )}
                                                {purchase.status !== 'pending' && (
                                                    <Link href={`/rifa/${purchase.raffle?.slug}`}>
                                                        <Button size="sm" variant="outline">Ver Sorteio</Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
