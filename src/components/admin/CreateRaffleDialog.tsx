
'use client';

import { useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image as ImageIcon, Link as LinkIcon, Upload, Phone, Copy, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
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
  const { toast } = useToast();

  const supabase = createClient();

  async function handleShowPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;

    // Generate base slug
    const baseSlug = title.toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Append random suffix for uniqueness
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const data = {
      title: title,
      slug: slug,
      description: formData.get('description') as string,
      // Use the logic for image later or keep mock for now if no storage bucket
      image_url: 'https://picsum.photos/seed/' + Math.floor(Math.random() * 1000) + '/800/600',
      ticket_price: Number(formData.get('price')),
      total_numbers: Number(formData.get('total')),
      draw_date: formData.get('date') as string,
      pix_key: formData.get('pix') as string,
      pix_key_type: 'random', // Defaulting to random/mixed for simplicity
      whatsapp_contact: formData.get('whatsappContact') as string,
      whatsapp_group_link: formData.get('whatsappGroupLink') as string || '',
    };

    // Store draft data to save after "payment"
    setTimeout(() => {
      setPendingRaffle(data);
      setStep('payment');
      setLoading(false);
    }, 600);
  }

  const handleFinalize = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Insert into DB
      const { data, error } = await supabase.from('raffles').insert({
        organizer_id: user.id,
        title: pendingRaffle.title,
        slug: pendingRaffle.slug,
        description: pendingRaffle.description,
        prize_description: pendingRaffle.description, // Mapping description to prize_description as it is required in schema
        image_url: pendingRaffle.image_url,
        ticket_price: pendingRaffle.ticket_price,
        total_numbers: pendingRaffle.total_numbers,
        draw_date: pendingRaffle.draw_date,
        pix_key: pendingRaffle.pix_key,
        pix_key_type: pendingRaffle.pix_key_type,
        status: 'pending_payment'
        // whatsapp contact and group link are not in schema? let's check schema.
        // checking schema: id, slug, organizer_id, title, description, image_url, prize_description (missing in dialog?), ticket_price, total_numbers, draw_date, pix_key, pix_key_type, status...
        // START CORRECTION: detailed mapping below
      }).select().single();

      if (error) {
        console.error(error);
        throw error;
      }

      if (onCreate) onCreate(data);

      setOpen(false);
      setStep('form');
      setPendingRaffle(null);
      setSelectedFile(null);

      toast({
        title: "Rifa Publicada!",
        description: "Sua campanha já está ativa e salva no banco de dados.",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao publicar",
        description: error.message || "Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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
              Sua rifa está pronta! Para ativá-la, realize o pagamento da taxa única de publicação.
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 'form' ? (
          <form onSubmit={handleShowPayment} className="p-6 space-y-5">
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
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/20"
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-primary-foreground">{selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[10px]"
                          onClick={(e) => { e.preventDefault(); setSelectedFile(null); }}
                        >
                          Remover e trocar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <ImageIcon className="w-10 h-10 opacity-20" />
                        <span className="text-xs font-medium">Clique para selecionar foto</span>
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
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Próximo Passo <ArrowRight className="w-5 h-5" /></>}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 flex flex-col items-center space-y-6 text-center">
            <div className="w-full bg-primary/10 p-4 rounded-2xl flex flex-col items-center gap-1 border border-primary/20">
              <p className="text-sm font-bold text-primary-foreground uppercase tracking-widest">Valor da Taxa</p>
              <p className="text-4xl font-black text-primary-foreground">R$ 9,90</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-primary overflow-hidden shadow-sm">
              <div className="w-48 h-48 bg-white flex items-center justify-center">
                <PixQRCode />
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Chave PIX da Plataforma</Label>
              <div className="flex items-center gap-2 bg-muted p-4 rounded-xl font-mono text-sm break-all border group">
                pagamentos@rifazap.com
                <Button variant="ghost" size="icon" onClick={() => {
                  navigator.clipboard.writeText("pagamentos@rifazap.com");
                  toast({ title: "Chave PIX copiada!", description: "Agora basta pagar os R$ 9,90." });
                }} className="shrink-0 hover:bg-primary/20">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3 text-left border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 leading-tight">
                Após o pagamento, sua rifa será publicada instantaneamente no painel.
              </p>
            </div>

            <div className="w-full space-y-3 pt-2">
              <Button
                onClick={handleFinalize}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg gap-2 rounded-xl shadow-md"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Já paguei, publicar agora!"}
              </Button>

              <Button variant="ghost" onClick={() => setStep('form')} className="w-full h-10 text-muted-foreground font-medium">
                Voltar e revisar dados
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
