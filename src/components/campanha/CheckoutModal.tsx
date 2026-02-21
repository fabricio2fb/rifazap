
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Raffle } from "@/lib/types";
import { CheckCircle2, Copy, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { generatePixBRCode } from "@/lib/utils/pix";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNumbers: number[];
  raffle: Raffle;
}

export function CheckoutModal({ isOpen, onClose, selectedNumbers, raffle }: CheckoutModalProps) {
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', whatsapp: '' });
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const total = selectedNumbers.length * raffle.pricePerNumber;

  // Gera o código PIX Copia e Cola real
  const pixCode = generatePixBRCode(
    raffle.pixKey || '',
    (raffle.title || 'Campanha').substring(0, 25),
    'SAO PAULO',
    total
  );

  // URL para a API de QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`/api/campanha_api/${raffle.slug}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.whatsapp.replace(/\D/g, ''),
          numbers: selectedNumbers
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao processar reserva');

      // Success!
      setStep('payment');

    } catch (error: any) {
      toast({
        title: "Erro na reserva",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(raffle.pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "Agora basta colar no seu banco.",
    });
  };

  const sendProofToOrganizer = () => {
    const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    const text = `Olá! Acabei de reservar os tickets: *${selectedNumbers.join(', ')}* na campanha *${raffle.title}*. 
    
Segue o comprovante do PIX no valor de *${price}*.
Nome: ${formData.name}`;

    const encodedText = encodeURIComponent(text);
    // Use fallback if whatsappContact is missing/empty
    const contact = raffle.whatsappContact || '';
    const whatsappNumber = contact.replace(/\D/g, '');

    if (!whatsappNumber) {
      toast({ title: "Erro", description: "Número do organizador não disponível.", variant: "destructive" });
      return;
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  const shareOnWhatsAppAfterPurchase = () => {
    const url = window.location.href;
    const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.pricePerNumber);

    const text = `🎉 *Já estou participando dessa campanha!*

*Prêmio:* ${raffle.title}
*Cada ticket:* ${price}

👉 *Garanta o seu também:* ${url}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleModalClose = () => {
    if (step === 'payment') {
      // Refresh page or Notify parent to refresh numbers?
      // Reloading page ensures fresh data
      window.location.reload();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === 'info' ? 'Finalizar Reserva' : 'Pagar Agora'}
          </DialogTitle>
          <DialogDescription>
            {step === 'info'
              ? `Você selecionou ${selectedNumbers.length} tickets: ${selectedNumbers.join(', ')}`
              : 'Faça o Pix para garantir seus tickets'}
          </DialogDescription>
        </DialogHeader>

        {step === 'info' ? (
          <form onSubmit={handleConfirm} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                required
                placeholder="Ex: João da Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                required
                placeholder="Ex: 11999999999"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="p-4 bg-muted rounded-xl flex justify-between items-center">
              <span className="font-medium">Total a pagar:</span>
              <span className="text-xl font-bold" suppressHydrationWarning>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
              </span>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 font-bold text-lg rounded-xl">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Reserva"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-6 py-4 text-center">
            <div className="bg-white p-4 rounded-2xl border-2 border-primary overflow-hidden shadow-sm">
              <div className="w-48 h-48 bg-white flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="PIX QR Code" className="w-full h-full" />
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">PIX Copia e Cola (Com Valor)</div>
              <div className="flex items-center gap-2 bg-muted p-4 rounded-xl font-mono text-[10px] break-all border group relative">
                <div className="flex-1 text-left">
                  {pixCode}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(pixCode);
                    toast({ title: "Código Copiado!", description: "Valor e chave inclusos." });
                  }}
                  className="shrink-0 hover:bg-primary/20 bg-white shadow-sm h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(raffle.pixKey);
                  toast({ title: "Chave Copiada!", description: "Somente a chave PIX." });
                }}
                className="text-xs text-muted-foreground hover:text-primary p-0 h-auto"
              >
                Copiar apenas a chave PIX
              </Button>
            </div>

            <div className="bg-campanha-reserved/10 p-4 rounded-xl flex items-start gap-3 text-left border border-campanha-reserved/20">
              <CheckCircle2 className="w-5 h-5 text-campanha-reserved shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-campanha-reserved">Pagamento em Análise</p>
                <p className="text-muted-foreground leading-snug">Seus tickets estão reservados por 15 minutos. Clique abaixo para enviar o comprovante agora.</p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <Button
                onClick={sendProofToOrganizer}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg gap-2 rounded-xl shadow-md"
              >
                <MessageCircle className="w-6 h-6 fill-current" /> Enviar Comprovante
              </Button>

              <Button
                variant="outline"
                onClick={shareOnWhatsAppAfterPurchase}
                className="w-full h-12 border-green-200 text-green-600 hover:bg-green-50 font-bold gap-2 rounded-xl"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> Divulgar no WhatsApp
              </Button>

              <Button variant="ghost" onClick={handleModalClose} className="w-full h-10">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
