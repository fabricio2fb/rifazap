
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
import { CheckCircle2, Copy, Smartphone, Loader2 } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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
  const db = useFirestore();
  const { toast } = useToast();

  const total = selectedNumbers.length * raffle.pricePerNumber;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setLoading(true);
    const participantData = {
      raffleId: raffle.id,
      raffleTitle: raffle.title,
      raffleImageUrl: raffle.imageUrl,
      name: formData.name,
      whatsapp: formData.whatsapp,
      selectedNumbers: selectedNumbers,
      totalAmount: total,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const participantsRef = collection(db, 'participants');

    addDoc(participantsRef, participantData)
      .then(() => {
        setStep('payment');
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: participantsRef.path,
          operation: 'create',
          requestResourceData: participantData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Erro ao reservar",
          description: "Não foi possível processar sua reserva agora.",
        });
      })
      .finally(() => setLoading(false));
  };

  const copyPix = () => {
    navigator.clipboard.writeText(raffle.pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "Agora basta colar no seu banco.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
              />
            </div>
            <div className="p-4 bg-muted rounded-lg flex justify-between items-center">
              <span className="font-medium">Total a pagar:</span>
              <span className="text-xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
              </span>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-bold text-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Reserva"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-6 py-4 text-center">
            <div className="bg-white p-4 rounded-xl border-2 border-primary">
              <div className="w-48 h-48 bg-slate-100 flex flex-col items-center justify-center">
                <Smartphone className="w-12 h-12 text-muted-foreground opacity-20 mb-2" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Escaneie o QR Code</p>
                {/* QR Code would go here in production */}
              </div>
            </div>
            
            <div className="w-full space-y-3">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Chave Pix</div>
              <div className="flex items-center gap-2 bg-muted p-3 rounded-lg font-mono text-sm break-all">
                {raffle.pixKey}
                <Button variant="ghost" size="icon" onClick={copyPix} className="shrink-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-rifa-reserved/10 p-4 rounded-lg flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-rifa-reserved shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-rifa-reserved">Pagamento em Análise</p>
                <p className="text-muted-foreground">Seus números estão reservados. Envie o comprovante via WhatsApp para confirmar.</p>
              </div>
            </div>

            <Button onClick={onClose} className="w-full h-12">
              Entendido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
