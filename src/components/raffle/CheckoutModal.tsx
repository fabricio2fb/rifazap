
"use client";

import { useState } from "react";
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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNumbers: number[];
  raffle: Raffle;
}

const PixQRCode = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-2" shapeRendering="crispEdges">
    <rect width="100" height="100" fill="white" />
    <path d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="black" />
    <path d="M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="black" />
    <path d="M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="black" />
    <rect x="40" y="10" width="10" height="10" fill="black" />
    <rect x="10" y="40" width="10" height="10" fill="black" />
    <rect x="40" y="40" width="20" height="20" fill="black" />
    <rect x="70" y="40" width="10" height="10" fill="black" />
    <rect x="40" y="70" width="10" height="10" fill="black" />
    <rect x="70" y="70" width="10" height="10" fill="black" />
    <rect x="80" y="80" width="10" height="10" fill="black" />
    <rect x="55" y="15" width="5" height="5" fill="black" />
    <rect x="15" y="55" width="5" height="5" fill="black" />
    <rect x="80" y="55" width="5" height="5" fill="black" />
    <rect x="55" y="80" width="5" height="5" fill="black" />
  </svg>
);

export function CheckoutModal({ isOpen, onClose, selectedNumbers, raffle }: CheckoutModalProps) {
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', whatsapp: '' });
  const { toast } = useToast();

  const total = selectedNumbers.length * raffle.pricePerNumber;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de delay para feedback visual
    setTimeout(() => {
      setStep('payment');
      setLoading(false);
    }, 800);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(raffle.pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "Agora basta colar no seu banco.",
    });
  };

  const shareOnWhatsAppAfterPurchase = () => {
    const url = window.location.href;
    const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.pricePerNumber);
    
    const text = `🎉 *Já estou participando dessa rifa!*

*Prêmio:* ${raffle.title}
*Cada número:* ${price}

👉 *Garanta o seu também:* ${url}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleModalClose = () => {
    if (step === 'payment') {
      setStep('info');
      setFormData({ name: '', whatsapp: '' });
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
              ? `Você selecionou ${selectedNumbers.length} números: ${selectedNumbers.join(', ')}`
              : 'Faça o Pix para garantir seus números'}
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="h-12"
              />
            </div>
            <div className="p-4 bg-muted rounded-xl flex justify-between items-center">
              <span className="font-medium">Total a pagar:</span>
              <span className="text-xl font-bold">
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
                <PixQRCode />
              </div>
            </div>
            
            <div className="w-full space-y-3">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Chave Pix Copia e Cola</div>
              <div className="flex items-center gap-2 bg-muted p-4 rounded-xl font-mono text-sm break-all border group">
                {raffle.pixKey}
                <Button variant="ghost" size="icon" onClick={copyPix} className="shrink-0 hover:bg-primary/20">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-rifa-reserved/10 p-4 rounded-xl flex items-start gap-3 text-left border border-rifa-reserved/20">
              <CheckCircle2 className="w-5 h-5 text-rifa-reserved shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-rifa-reserved">Pagamento em Análise</p>
                <p className="text-muted-foreground leading-snug">Seus números estão reservados. Envie o comprovante via WhatsApp para confirmar.</p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <Button 
                onClick={shareOnWhatsAppAfterPurchase} 
                className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg gap-2 rounded-xl shadow-md"
              >
                <MessageCircle className="w-6 h-6 fill-current" /> Compartilhar no WhatsApp
              </Button>
              
              <Button variant="outline" onClick={handleModalClose} className="w-full h-12 rounded-xl">
                Fechar e voltar à rifa
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
