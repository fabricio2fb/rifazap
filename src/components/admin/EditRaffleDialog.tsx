'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Image as ImageIcon, Link as LinkIcon, Lock, Phone, Upload, Loader2, Eye } from 'lucide-react';
import { cn } from "@/lib/utils";

interface EditRaffleDialogProps {
  raffle: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedRaffle: any) => void;
}

export function EditRaffleDialog({ raffle, isOpen, onClose, onUpdate }: EditRaffleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<'mint' | 'gold' | 'pink' | 'solar' | 'nebula' | 'scrapbook' | 'calor' | 'juliana' | 'creme'>('juliana');
  const { toast } = useToast();
  const supabase = createClient();

  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    imageUrl: '',
    whatsappContact: '',
    whatsappGroupLink: '',
    drawDate: '',
  });

  useEffect(() => {
    if (raffle) {
      // Format date to YYYY-MM-DD for input[type="date"]
      let formattedDate = '';
      if (raffle.drawDate) {
        const dateObj = new Date(raffle.drawDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }

      setFormData({
        title: raffle.title || '',
        description: raffle.description || '',
        imageUrl: raffle.imageUrl || '',
        whatsappContact: raffle.whatsappContact || '',
        whatsappGroupLink: raffle.whatsappGroupLink || '',
        drawDate: formattedDate,
      });
      setSelectedTheme(raffle.settings?.image_theme || 'juliana');
    }
  }, [raffle]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      let currentImageUrl = formData.imageUrl;
      let editCountIncrement = 0;

      // 1. Handle image upload if a new file is selected
      if (selectedFile) {
        // Enforce 5-edit limit
        if ((raffle.imageEditCount || 0) >= 5) {
          throw new Error("Limite de 5 edições de imagem atingido.");
        }

        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro no upload para Cloudinary');

        currentImageUrl = data.secure_url;
        editCountIncrement = 1;
      }

      // 2. Prepare update data (snake_case for DB)
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        image_url: currentImageUrl,
        draw_date: formData.drawDate,
        whatsapp_contact: formData.whatsappContact,
        whatsapp_group_link: formData.whatsappGroupLink,
      };

      if (editCountIncrement > 0) {
        updateData.image_edit_count = (raffle.imageEditCount || 0) + 1;
      }

      updateData.settings = { ...(raffle.settings || {}), image_theme: selectedTheme };

      // 3. Update in Database via Secure API
      const res = await fetch(`/api/admin/raffles/${raffle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar campanha');

      // 4. Map back to camelCase for the parent UI state
      const updatedRaffle = {
        ...raffle,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        drawDate: data.draw_date,
        whatsappContact: data.whatsapp_contact,
        whatsappGroupLink: data.whatsapp_group_link,
        imageEditCount: data.image_edit_count,
        settings: data.settings,
      };

      onUpdate(updatedRaffle);
      toast({
        title: "Alterações salvas!",
        description: "As informações da campanha foram atualizadas com sucesso.",
      });
      onClose();
    } catch (error: any) {
      console.error('Error updating raffle:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível atualizar as informações."
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (!raffle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary-foreground" />
            Editar Informações
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="edit-title" className="font-semibold">Título do Prêmio</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: iPhone 15 Pro Max"
              required
              className="h-12 text-base"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description" className="font-semibold">Descrição e Regras</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva os detalhes do prêmio..."
              required
              className="min-h-[80px] text-base"
            />
          </div>

          <div className="grid gap-2">
            <Label className="font-semibold flex items-center gap-2">
              <Upload className="w-4 h-4" /> Atualizar Foto do Prêmio
            </Label>
            <div className="relative">
              <Input
                id="edit-photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="edit-photo-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/20 overflow-hidden relative ${raffle.imageEditCount >= 5 ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={(e) => {
                  if (raffle.imageEditCount >= 5) {
                    e.preventDefault();
                    toast({
                      variant: "destructive",
                      title: "Limite atingido",
                      description: "Você já editou a imagem desta campanha 5 vezes."
                    });
                  }
                }}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-primary-foreground">Nova imagem selecionada</span>
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
                ) : uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-[10px] font-medium">Enviando para Cloudinary...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground text-center p-2">
                    <ImageIcon className="w-8 h-8 opacity-20" />
                    <span className="text-xs font-medium">Trocar imagem atual</span>
                    <span className="text-[10px] opacity-70">Limite: {raffle.imageEditCount || 0}/5 edições</span>
                    {raffle.imageEditCount >= 5 && (
                      <span className="text-[10px] text-destructive font-bold uppercase mt-1">Bloqueado</span>
                    )}
                  </div>
                )}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 opacity-60">
              <Label className="font-semibold flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Valor do Ticket
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-sm font-bold text-muted-foreground">R$</span>
                <Input disabled value={raffle.pricePerNumber?.toFixed(2)} className="pl-10 h-12 text-base bg-muted" />
              </div>
            </div>
            <div className="grid gap-2 opacity-60">
              <Label className="font-semibold flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Qtd. Tickets
              </Label>
              <Input disabled value={raffle.totalNumbers} className="h-12 text-base bg-muted" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-date" className="font-semibold">Nova Data do Resultado</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.drawDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, drawDate: e.target.value })}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-whatsappContact" className="flex items-center gap-2 font-semibold text-green-700">
              <Phone className="w-4 h-4" /> WhatsApp para Comprovantes
            </Label>
            <Input
              id="edit-whatsappContact"
              value={formData.whatsappContact}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, whatsappContact: e.target.value })}
              placeholder="5511999999999"
              required
              className="h-12 border-green-100"
            />
          </div>

          <div className="grid gap-2 opacity-60">
            <Label className="font-semibold flex items-center gap-1.5 text-green-700">
              <Lock className="w-3 h-3" /> Chave PIX (Bloqueada)
            </Label>
            <Input disabled value={raffle.pixKey} className="h-12 border-green-100 bg-muted text-base" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-whatsappGroupLink" className="flex items-center gap-2 font-semibold text-green-700">
              <LinkIcon className="w-4 h-4" /> Link do Grupo (WhatsApp)
            </Label>
            <Input
              id="edit-whatsappGroupLink"
              value={formData.whatsappGroupLink}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, whatsappGroupLink: e.target.value })}
              placeholder="https://chat.whatsapp.com/..."
              className="h-12 border-green-100"
            />
          </div>

          <div className="grid gap-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold dark:text-zinc-300">
                  Template da Imagem (Compartilhamento)
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Design da imagem gerada automaticamente via WhatsApp.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => { e.preventDefault(); window.open(`/api/campanha/demo/imagem?theme=${selectedTheme}`, '_blank'); }}
                className="gap-2 h-8 text-[10px] uppercase font-bold tracking-wider rounded-xl shrink-0"
              >
                <Eye className="w-3.5 h-3.5" /> Expandir
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
                      ? `border-primary shadow-md ring-2 ring-primary/20 bg-primary/5`
                      : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50 dark:bg-zinc-900"
                  )}
                >
                  <div className="w-full aspect-[9/16] relative rounded-lg overflow-hidden mb-1.5 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/campanha/demo/imagem?theme=${t.id}`} alt={t.name} className="object-cover w-full h-full" loading="lazy" />
                  </div>
                  <span className="text-[10px] font-bold text-center mb-0.5">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 sticky bottom-0 bg-white pb-2">
            <Button type="submit" className="w-full h-14 font-bold text-lg shadow-xl" disabled={loading}>
              {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
