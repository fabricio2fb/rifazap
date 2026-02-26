
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image as ImageIcon, Link as LinkIcon, Upload, Phone, Copy, CheckCircle2, Loader2, ArrowRight, Zap, Info, Sparkles, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CreateRaffleDialogProps {
  onCreate?: (raffle: any) => void;
  children?: React.ReactNode;
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

export function CreateRaffleDialog({ onCreate, children }: CreateRaffleDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'form' | 'payment'>('type');
  const [creationType, setCreationType] = useState<'basic' | 'pro' | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<'mint' | 'gold' | 'pink' | 'solar' | 'nebula' | 'scrapbook' | 'calor' | 'juliana' | 'creme'>('juliana');
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingRaffle, setPendingRaffle] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');

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
        status: 'pending_payment',
        settings: {
          image_theme: selectedTheme
        }
      };

      // Insert into DB via Secure API
      const res = await fetch('/api/admin/raffles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(raffleData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar campanha');

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
        setStep('type');
        setCreationType(null);
        setPendingRaffle(null);
      }
    }}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 gap-2 shadow-lg">
            <Plus className="w-5 h-5" /> Criar Nova Campanha
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto no-scrollbar p-0 gap-0 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">
            {step === 'type' ? 'Escolha o Formato da Campanha' : step === 'form' ? 'Configurar Campanha' : 'Taxa de Ativação'}
          </DialogTitle>
          {step === 'payment' && (
            <DialogDescription className="text-base font-medium text-foreground/80 mt-2">
              Sua campanha foi salva como rascunho! Para ativá-la e torná-la pública, realize o pagamento da taxa de publicação.
            </DialogDescription>
          )}
          {step === 'type' && (
            <DialogDescription className="text-base font-medium text-foreground/80 mt-1">
              Como você deseja apresentar o prêmio aos seus compradores na tela inicial?
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 'type' ? (
          <div className="p-6 pt-2 grid md:grid-cols-2 gap-6">

            {/* Card BÁSICO (Sem Edição) */}
            <div
              onClick={() => { setCreationType('basic'); setStep('form'); }}
              className="flex flex-col border-2 border-slate-200 dark:border-zinc-800 rounded-3xl p-6 cursor-pointer hover:border-slate-400 dark:hover:border-zinc-600 hover:shadow-xl hover:-translate-y-1 transition-all group bg-white dark:bg-zinc-900 relative overflow-hidden"
            >
              <div className="mb-4">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">Sem Edição</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-snug h-10">Padrão do sistema. Layout estático baseado na foto do prêmio que você enviar.</p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-400">R$</span>
                <span className="text-4xl font-black text-slate-800 tracking-tighter">14,90</span>
                <span className="text-sm font-bold text-slate-400">/campanha</span>
              </div>

              <div className="bg-[#e4eff1] rounded-2xl w-full h-[240px] p-0 flex flex-col relative overflow-hidden group-hover:bg-[#d5e4e6] transition-colors shadow-inner"
                style={{ backgroundImage: 'linear-gradient(to bottom, #eff6ff 0%, #f1f5f9 100%)' }}>
                <div className="w-full h-full bg-white/0 flex flex-col inset-0 pt-3 px-3 pb-2">
                  <div className="text-center mb-2">
                    <h4 className="text-[14px] font-black text-slate-900 leading-tight tracking-tight">RIFA DE R$ 5.000,00 VIA PIX</h4>
                  </div>

                  <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm border-[3px] border-[#e2e8f0] relative z-10 mb-2 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <span className="text-3xl">💵</span>
                  </div>

                  <div className="flex gap-2 w-full mb-3">
                    <div className="bg-[#e0f2fe] flex-1 rounded-lg text-center border-b-2 border-[#bae6fd] shadow-sm p-1.5 flex flex-col justify-center">
                      <span className="text-[5px] font-black text-sky-800/60 uppercase">VALOR DA COTA</span>
                      <span className="text-[12px] font-black text-sky-950 leading-none mt-0.5">R$ 50,00</span>
                    </div>
                    <div className="bg-[#ffedd5] flex-1 rounded-lg text-center border-b-2 border-[#fdba74] shadow-sm p-1.5 flex flex-col justify-center">
                      <span className="text-[5px] font-black text-orange-800/60 uppercase">SORTEIO DIA</span>
                      <span className="text-[12px] font-black text-orange-950 leading-none mt-0.5">20/12/2024</span>
                    </div>
                  </div>

                  <div className="px-1 w-full mt-auto mb-2">
                    <div className="bg-white rounded-md border border-slate-200 p-1 flex items-center shadow-sm">
                      <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: '#e2e8f0' }}></div>
                      <div className="h-4 w-4 rounded-sm ml-1" style={{ backgroundColor: '#cbd5e1' }}></div>
                      <div className="flex-1"></div>
                      <div className="flex flex-col items-end">
                        <span className="text-[4px] font-bold text-slate-400 uppercase">PROGRESSO</span>
                        <span className="text-[7px] font-black text-slate-700">50%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[6px] p-1 grid grid-cols-10 gap-0.5 shadow-sm max-h-[36px] overflow-hidden">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className={`h-2 rounded-[1px] ${[3, 5, 12, 18].includes(i) ? 'bg-green-500' : 'bg-slate-100'} border-[0.5px] border-slate-200`}></div>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6 h-12 text-base gap-2 text-slate-600 font-bold border-2 rounded-xl group-hover:bg-slate-50">Selecionar Sem Edição <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>

            {/* Card TICKETON PRO */}
            <div
              onClick={() => { setCreationType('pro'); setStep('form'); }}
              className="flex flex-col border-[3px] border-[#f97316] rounded-3xl p-6 cursor-pointer bg-orange-50/30 dark:bg-zinc-900 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1 transition-all relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

              <div className="absolute top-0 right-8 bg-[#f97316] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-lg shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Mais Vendido
              </div>

              <div className="mb-4 relative z-10">
                <h3 className="text-xl font-black text-[#ea580c] dark:text-orange-400 mb-1 flex items-center gap-2">TicketOn PRO</h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium leading-snug mb-2"><strong>Editor da Rifa</strong> completo para você vender muito mais com:</p>
                <div className="flex flex-wrap gap-1.5 text-[9px] font-black uppercase tracking-wider text-[#ea580c] dark:text-orange-400">
                  <span className="bg-orange-100/80 px-2 py-1 rounded border border-orange-200">🔔 Notificações</span>
                  <span className="bg-orange-100/80 px-2 py-1 rounded border border-orange-200">⏳ Contador</span>
                  <span className="bg-orange-100/80 px-2 py-1 rounded border border-orange-200">🏷️ Cupons</span>
                  <span className="bg-orange-100/80 px-2 py-1 rounded border border-orange-200">✅ Badge</span>
                  <span className="bg-orange-100/80 px-2 py-1 rounded border border-orange-200">+ mais</span>
                </div>
              </div>

              <div className="mb-6 flex items-baseline gap-1 relative z-10">
                <span className="text-sm font-bold text-orange-600/60">R$</span>
                <span className="text-4xl font-black text-[#ea580c] tracking-tighter">25,90</span>
                <span className="text-sm font-bold text-orange-600/60">/campanha</span>
              </div>

              <div className="bg-[#f2f4f6] border-2 border-slate-200 rounded-2xl w-full h-[240px] flex flex-col items-center justify-start py-2 px-1 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-inner"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\\'120\\\' height=\\\'120\\\' viewBox=\\\'0 0 60 60\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cpath d=\\\'M30 0l-15 35h12l-6 25 20-30H29l8-30z\\\' fill=\\\'%23f59e0b\\\' fill-opacity=\\\'0.06\\\' fill-rule=\\\'evenodd\\\'/%3E%3C/svg%3E")' }}>

                {/* Notification Popup UI */}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white rounded-full px-2 py-1 flex items-center gap-1 shadow-lg z-20 animate-pulse border border-white/10" style={{ transform: 'scale(0.8)', transformOrigin: 'top right' }}>
                  <span className="text-[10px]">🟢</span>
                  <span className="text-[8px] font-medium tracking-wide">João acabou de comprar!</span>
                </div>

                <div className="w-full h-full flex flex-col inset-0 pt-4 pb-1 relative z-10 px-2 lg:px-4 bg-zinc-950 rounded-lg shadow-2xl border border-zinc-800 overflow-hidden text-white">

                  {/* Banner Editor Topo */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-orange-600 to-red-600 opacity-20"></div>

                  <div className="text-center mb-2 mt-2 relative z-10">
                    <h4 className="text-[17px] text-zinc-100 leading-tight font-black uppercase tracking-tight">PC GAMER RTX 4090</h4>
                  </div>

                  <div className="flex gap-2 w-full px-1 mb-2 relative z-10">
                    <div className="bg-zinc-900 flex-1 rounded-md text-left border border-zinc-800 shadow-md p-1.5 flex flex-col justify-center">
                      <span className="text-[5px] font-bold text-zinc-500 uppercase">VALOR DA COTA</span>
                      <span className="text-[12px] font-black text-orange-500 leading-none mt-0.5">R$ 1,00</span>
                    </div>
                    <div className="bg-zinc-900 flex-1 rounded-md text-left border border-zinc-800 shadow-md p-1.5 flex flex-col justify-center">
                      <span className="text-[5px] font-bold text-zinc-500 uppercase">AÇÃO E AVISOS</span>
                      <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/50 rounded flex items-center justify-center font-bold mt-1 py-0.5 px-1 uppercase w-fit leading-none">Últimas 50!</span>
                    </div>
                  </div>

                  <div className="px-1 w-full mb-1.5 mt-1 relative z-10">
                    <div className="flex justify-between items-end mb-0.5">
                      <span className="text-[5px] font-medium text-zinc-500 uppercase tracking-widest">PROGRESSO PREMIUM</span>
                      <span className="text-[6px] font-black text-orange-500">98% VENDIDO</span>
                    </div>
                    <div className="bg-zinc-800 rounded-full h-[6px] w-full flex overflow-hidden shadow-inner border border-zinc-700">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-[98%] h-full rounded-full"></div>
                    </div>
                  </div>

                  <div className="mx-1 mt-auto bg-zinc-900 border-[1px] border-zinc-700 rounded-[10px] p-[3px] grid grid-cols-5 gap-[2px] shadow-sm relative z-10">
                    {Array.from({ length: 10 }).map((_, i) => {
                      let bgClass = "bg-zinc-800 text-zinc-400 border border-zinc-700/50";
                      if (i === 3 || i === 5) bgClass = "bg-zinc-600 text-zinc-300 border-transparent"; // Pago
                      if (i === 4 || i === 8) bgClass = "bg-[#f97316] text-white border-transparent"; // Reservado
                      return (
                        <div key={i} className={`h-5 w-full rounded flex items-center justify-center text-[7px] font-bold shadow-sm ${bgClass}`}>
                          {i + 1}
                        </div>
                      )
                    })}
                  </div>

                  <div className="w-full text-center mt-2.5 pb-0 relative z-10">
                    <div className="text-[9px] w-fit mx-auto bg-white text-black px-2 py-0.5 rounded-full font-black tracking-wide uppercase leading-tight shadow-lg shadow-white/10">🏆 BÔNUS ATIVO</div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 h-12 flex-shrink-0 text-base gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] font-black text-white shadow-lg shadow-orange-500/30 rounded-xl relative z-10 transition-transform active:scale-95">
                Escolher TicketOn PRO <Sparkles className="w-5 h-5 ml-1" />
              </Button>
            </div>

          </div>
        ) : step === 'form' ? (
          <form onSubmit={handleCreateAndShowPayment} className="p-6 space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="title" className="font-semibold dark:text-zinc-300">Título do Prêmio</Label>
              <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: iPhone 15 Pro Max" required className="h-12 text-base dark:bg-zinc-900 dark:border-zinc-800" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-semibold dark:text-zinc-300">Descrição e Regras</Label>
              <Textarea id="description" name="description" placeholder="Descreva os detalhes do prêmio..." required className="min-h-[80px] text-base dark:bg-zinc-900 dark:border-zinc-800" />
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="font-semibold flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {creationType === 'pro' ? 'Foto do Prêmio (Para o Editor da Rifa)' : 'Upload de Foto do Prêmio'}
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
                <Label htmlFor="price" className="font-semibold dark:text-zinc-300">Valor do Ticket</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-sm font-bold text-muted-foreground">R$</span>
                  <input name="price" type="number" step="0.01" placeholder="10,00" required className="flex h-12 w-full rounded-md border border-input dark:border-zinc-800 bg-background dark:bg-zinc-900 px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total" className="font-semibold dark:text-zinc-300">Qtd. Tickets</Label>
                <Input id="total" name="total" type="number" placeholder="100" required className="h-12 text-base dark:bg-zinc-900 dark:border-zinc-800" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date" className="font-semibold dark:text-zinc-300">Data Prevista do Resultado</Label>
              <Input id="date" name="date" type="date" required className="h-12 text-base dark:bg-zinc-900 dark:border-zinc-800" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="whatsappContact" className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-500">
                <Phone className="w-4 h-4" /> WhatsApp para Comprovantes
              </Label>
              <Input id="whatsappContact" name="whatsappContact" placeholder="5511999999999" required className="h-12 border-green-100 dark:border-green-900/50 dark:bg-zinc-900" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pix" className="font-semibold text-green-700 dark:text-green-500">Sua Chave PIX (Recebimento)</Label>
              <Input id="pix" name="pix" placeholder="E-mail, CPF ou Celular" required className="h-12 border-green-200 dark:border-green-900/50 dark:bg-zinc-900 focus:ring-green-500 text-base" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="whatsappGroupLink" className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-500">
                <LinkIcon className="w-4 h-4" /> Link do Grupo (WhatsApp)
              </Label>
              <Input id="whatsappGroupLink" name="whatsappGroupLink" placeholder="https://chat.whatsapp.com/..." className="h-12 border-green-100 dark:border-green-900/50 dark:bg-zinc-900" />
            </div>

            <div className="grid gap-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold dark:text-zinc-300">
                    Template da Imagem de Compartilhamento
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Escolha o design da imagem gerada automaticamente para compartilhar.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.preventDefault(); setPreviewTheme(selectedTheme); }}
                  className="gap-2 h-8 text-[10px] uppercase font-bold tracking-wider rounded-xl ml-2 shrink-0 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-700 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-orange-400"
                >
                  <Eye className="w-3.5 h-3.5" /> Expandir Preview
                </Button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-2">
                {[
                  { id: 'mint', name: 'Mint' },
                  { id: 'gold', name: 'Gold' },
                  { id: 'pink', name: 'Pink' },
                  { id: 'solar', name: 'Solar' },
                  { id: 'nebula', name: 'Nebula' },
                  { id: 'scrapbook', name: 'Scrapbook' },
                  { id: 'calor', name: 'Calor' },
                  { id: 'juliana', name: 'Juliana' },
                  { id: 'creme', name: 'Creme' },
                ].map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id as any)}
                    className={cn(
                      "flex flex-col items-center justify-center p-1 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 overflow-hidden",
                      selectedTheme === t.id
                        ? `border-orange-500 shadow-md ring-2 ring-orange-500/20 bg-orange-50 dark:bg-orange-500/10`
                        : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50 dark:bg-zinc-900"
                    )}
                  >
                    <div className="w-full aspect-[9/16] relative rounded-lg overflow-hidden mb-1.5 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center p-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/campanha/demo/imagem?theme=${t.id}${imageUrl ? `&img=${encodeURIComponent(imageUrl)}` : ''}${title ? `&title=${encodeURIComponent(title)}` : ''}`} alt={t.name} className="object-contain w-full h-full" loading="lazy" />
                    </div>
                    <span className="text-[10px] font-bold text-center mb-0.5">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 bg-muted/30 dark:bg-zinc-900 p-4 rounded-xl border border-border dark:border-zinc-800">
              <div className="flex items-start space-x-3">
                <Checkbox id="terms" name="terms" required className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-zinc-200"
                  >
                    Eu aceito os Termos de Uso
                  </label>
                  <p className="text-[11px] text-muted-foreground dark:text-zinc-500">
                    Declaro que sou o único responsável legal por essa campanha e concordo com os{' '}
                    <Link href="/termos" target="_blank" className="font-bold underline text-primary-foreground dark:text-zinc-300">Termos de Uso</Link>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 sticky bottom-0 bg-white dark:bg-zinc-950 pb-2">
              <Button type="submit" className="w-full h-14 font-bold text-lg shadow-xl gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Publicar e Ir para Pagamento <ArrowRight className="w-5 h-5" /></>}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 flex flex-col items-center space-y-6 text-center">
            <div className="w-full bg-primary/10 p-4 rounded-2xl flex flex-col items-center gap-1 border border-primary/20">
              <p className="text-sm font-bold text-primary-foreground uppercase tracking-widest">Valor da Taxa</p>
              <p className="text-4xl font-black text-primary-foreground">R$ 0,20</p>
            </div>

            <div className="w-full py-4 space-y-4">
              <div className="w-full py-4 space-y-4">
                <div className="text-sm text-muted-foreground font-medium">
                  Uma taxa única de R$ 14,90 será cobrada para ativar a campanha após a criação. Suas vendas caem direto no seu PIX.ativação.
                  A ativação será automática após a confirmação.
                </div>

                <Button
                  className="w-full h-16 bg-[#009EE3] hover:bg-[#007EB5] text-white font-black text-xl gap-3 rounded-2xl shadow-xl transition-all active:scale-95"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const res = await fetch('/api/payments/ggcheckout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ raffleId: pendingRaffle?.id })
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        const msg = data.details ? `${data.error}: ${data.details}` : data.error;
                        throw new Error(msg || 'Erro ao gerar pagamento');
                      }

                      // Redirect to GGCheckout URL
                      if (data.checkout_url) {
                        window.location.href = data.checkout_url;
                      }
                    } catch (err: any) {
                      toast({
                        variant: "destructive",
                        title: "Erro no Pagamento",
                        description: err.message
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                  IR PARA PAGAMENTO
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-left border border-blue-100">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 leading-tight">
                  O pagamento é processado com segurança pelo GGCheckout. Após concluir, sua campanha aparecerá como Ativa no painel em instantes.
                </p>
              </div>

              <div className="w-full pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    if (creationType === 'pro' && pendingRaffle?.id) {
                      router.push(`/admin/campanhas/${pendingRaffle.id}/editor`);
                    }
                  }}
                  className="w-full h-12 text-muted-foreground font-bold border-2"
                >
                  {creationType === 'pro' ? 'Pular Ativação e Ir para Editor' : 'Concluir e pagar depois'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Modal de Preview em Tamanho Real */}
      {previewTheme && (
        <Dialog open={!!previewTheme} onOpenChange={(val) => !val && setPreviewTheme(null)}>
          <DialogContent className="max-w-[450px] w-[95vw] h-[85vh] overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 p-0 flex flex-col rounded-3xl">
            <DialogHeader className="p-4 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0 flex flex-row items-center justify-between">
              <DialogTitle className="text-slate-900 dark:text-white text-sm uppercase tracking-widest font-black flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Preview: {previewTheme}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto w-full flex justify-center bg-slate-100 dark:bg-black/50 p-4 sm:p-6 no-scrollbar relative">
              <div className="w-full max-w-[380px] h-fit bg-red-50 relative rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/campanha/demo/imagem?theme=${previewTheme}${imageUrl ? `&img=${encodeURIComponent(imageUrl)}` : ''}${title ? `&title=${encodeURIComponent(title)}` : ''}`} alt={`Preview ${previewTheme}`} className="w-full h-auto block" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
