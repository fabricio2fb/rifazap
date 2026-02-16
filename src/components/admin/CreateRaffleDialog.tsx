
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image as ImageIcon, Link as LinkIcon, Upload, Phone, Copy, CheckCircle2, Loader2, ArrowRight, Zap, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateRaffleDialogProps {
  onCreate?: (raffle: any) => void;
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

export function CreateRaffleDialog({ onCreate }: CreateRaffleDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [loading, setLoading] = useState(false);
  const [pendingRaffle, setPendingRaffle] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const { toast } = useToast();

  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Instantly upload to Cloudinary for preview and capture the URL
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro no upload');

        setImageUrl(data.secure_url);
        toast({
          title: "Imagem pronta!",
          description: "Sua foto foi carregada com sucesso.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: error.message,
        });
        setSelectedFile(null);
      } finally {
        setUploading(false);
      }
    }
  };

  async function handleCreateAndShowPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const formData = new FormData(form);
      const title = formData.get('title') as string;

      // Generate base slug
      const baseSlug = title.toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const slug = `${baseSlug}-${uniqueSuffix}`;

      if (!imageUrl) {
        throw new Error("Por favor, selecione e carregue uma imagem para o prêmio.");
      }

      const raffleData = {
        organizer_id: user.id,
        title: title,
        slug: slug,
        description: formData.get('description') as string,
        prize_description: formData.get('description') as string,
        image_url: imageUrl,
        ticket_price: Number(formData.get('price')),
        total_numbers: Number(formData.get('total')),
        draw_date: formData.get('date') as string,
        pix_key: formData.get('pix') as string,
        pix_key_type: 'random',
        whatsapp_contact: formData.get('whatsappContact') as string,
        whatsapp_group_link: formData.get('whatsappGroupLink') as string,
        status: 'pending_payment'
      };

      // Insert into DB via Secure API
      const res = await fetch('/api/admin/raffles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(raffleData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar rifa');

      setPendingRaffle(data);
      setStep('payment');

      if (onCreate) onCreate(data);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar",
        description: error.message || "Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setStep('form');
        setPendingRaffle(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 gap-2 shadow-lg">
          <Plus className="w-5 h-5" /> Criar Nova Rifa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">
            {step === 'form' ? 'Configurar Campanha' : 'Taxa de Ativação'}
          </DialogTitle>
          {step === 'payment' && (
            <DialogDescription className="text-base font-medium text-foreground/80 mt-2">
              Sua rifa foi salva como rascunho! Para ativá-la e torná-la pública, realize o pagamento da taxa de publicação.
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 'form' ? (
          <form onSubmit={handleCreateAndShowPayment} className="p-6 space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="title" className="font-semibold">Título do Prêmio</Label>
              <Input id="title" name="title" placeholder="Ex: iPhone 15 Pro Max" required className="h-12 text-base" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-semibold">Descrição e Regras</Label>
              <Textarea id="description" name="description" placeholder="Descreva os detalhes do prêmio..." required className="min-h-[80px] text-base" />
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="font-semibold flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload de Foto do Prêmio
                </Label>
                <div className="relative">
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/20 overflow-hidden relative"
                  >
                    {imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">Trocar Imagem</span>
                        </div>
                      </div>
                    ) : uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Enviando para Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <ImageIcon className="w-10 h-10 opacity-20" />
                        <span className="text-xs font-medium">Clique para selecionar foto</span>
                        <span className="text-[10px] opacity-50">JPG, PNG ou WEBP (Max 5MB)</span>
                      </div>
                    )}
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="font-semibold">Valor da Cota</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-sm font-bold text-muted-foreground">R$</span>
                  <input name="price" type="number" step="0.01" placeholder="10,00" required className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total" className="font-semibold">Qtd. Números</Label>
                <Input id="total" name="total" type="number" placeholder="100" required className="h-12 text-base" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date" className="font-semibold">Data Prevista do Sorteio</Label>
              <Input id="date" name="date" type="date" required className="h-12 text-base" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="whatsappContact" className="flex items-center gap-2 font-semibold text-green-700">
                <Phone className="w-4 h-4" /> WhatsApp para Comprovantes
              </Label>
              <Input id="whatsappContact" name="whatsappContact" placeholder="5511999999999" required className="h-12 border-green-100" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pix" className="font-semibold text-green-700">Sua Chave PIX (Recebimento)</Label>
              <Input id="pix" name="pix" placeholder="E-mail, CPF ou Celular" required className="h-12 border-green-200 focus:ring-green-500 text-base" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="whatsappGroupLink" className="flex items-center gap-2 font-semibold text-green-700">
                <LinkIcon className="w-4 h-4" /> Link do Grupo (WhatsApp)
              </Label>
              <Input id="whatsappGroupLink" name="whatsappGroupLink" placeholder="https://chat.whatsapp.com/..." className="h-12 border-green-100" />
            </div>

            <div className="pt-4 sticky bottom-0 bg-white pb-2">
              <Button type="submit" className="w-full h-14 font-bold text-lg shadow-xl gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Publicar e Ir para Pagamento <ArrowRight className="w-5 h-5" /></>}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 flex flex-col items-center space-y-6 text-center">
            <div className="w-full bg-primary/10 p-4 rounded-2xl flex flex-col items-center gap-1 border border-primary/20">
              <p className="text-sm font-bold text-primary-foreground uppercase tracking-widest">Valor da Taxa</p>
              <p className="text-4xl font-black text-primary-foreground">R$ 9,90</p>
            </div>

            <div className="w-full py-4 space-y-4">
              <div className="text-sm text-muted-foreground font-medium">
                Clique no botão abaixo para pagar a taxa de ativação via GGCheckout.
                A ativação será automática após a confirmação.
              </div>

              <Button
                className="w-full h-16 bg-[#0052FF] hover:bg-[#0041CC] text-white font-black text-xl gap-3 rounded-2xl shadow-xl transition-all active:scale-95"
                onClick={() => {
                  const paymentUrl = `https://www.ggcheckout.com/checkout/v2/fhcawWP8XX2R59jn4gcW?external_id=${pendingRaffle?.id}`;
                  window.open(paymentUrl, '_blank');
                }}
              >
                <Zap className="w-7 h-7 fill-current" /> PAGAR COM GGCHECKOUT
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-left border border-blue-100">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-tight">
                O pagamento é processado com segurança pelo GGCheckout. Após concluir, sua rifa aparecerá como Ativa no painel em instantes.
              </p>
            </div>

            <div className="w-full pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full h-12 text-muted-foreground font-bold border-2"
              >
                Concluir e pagar depois
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
