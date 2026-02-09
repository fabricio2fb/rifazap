"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface NotificationSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NotificationSettingsDialog({ open, onOpenChange }: NotificationSettingsDialogProps) {
    const [settings, setSettings] = useState({
        new_reservation: true,
        reservation_expiring: true,
        payment_confirmed: true,
        paid_delayed: true,
        browser_notifications: true
    });
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            fetchSettings();
        }
    }, [open]);

    const fetchSettings = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('notification_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (data) {
            setSettings({
                new_reservation: data.new_reservation,
                reservation_expiring: data.reservation_expiring,
                payment_confirmed: data.payment_confirmed,
                paid_delayed: data.paid_delayed,
                browser_notifications: data.browser_notifications
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('notification_settings')
            .upsert({ user_id: user.id, ...settings });

        setLoading(false);
        if (error) {
            toast({ variant: "destructive", title: "Erro", description: "Falha ao salvar configurações." });
        } else {
            toast({ title: "Salvo!", description: "Preferências de notificação atualizadas." });
            onOpenChange(false);

            if (settings.browser_notifications && "Notification" in window && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configurar Notificações</DialogTitle>
                    <DialogDescription>Escolha quais alertas deseja receber.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Eventos de Vendas</h4>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="new_reservation">Nova Reserva (Pendente)</Label>
                            <Switch
                                id="new_reservation"
                                checked={settings.new_reservation}
                                onCheckedChange={(c) => setSettings({ ...settings, new_reservation: c })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="payment_confirmed">Pagamento Confirmado</Label>
                            <Switch
                                id="payment_confirmed"
                                checked={settings.payment_confirmed}
                                onCheckedChange={(c) => setSettings({ ...settings, payment_confirmed: c })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="paid_delayed">Pagamento com Atraso</Label>
                            <Switch
                                id="paid_delayed"
                                checked={settings.paid_delayed}
                                onCheckedChange={(c) => setSettings({ ...settings, paid_delayed: c })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Canais</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="browser_notifications">Notificações no Navegador</Label>
                            <Switch
                                id="browser_notifications"
                                checked={settings.browser_notifications}
                                onCheckedChange={(c) => setSettings({ ...settings, browser_notifications: c })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar Preferências"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
