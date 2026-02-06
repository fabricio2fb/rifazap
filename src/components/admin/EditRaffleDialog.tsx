
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Image as ImageIcon, Link as LinkIcon, Lock, Phone } from 'lucide-react';

interface EditRaffleDialogProps {
  raffle: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedRaffle: any) => void;
}

export function EditRaffleDialog({ raffle, isOpen, onClose, onUpdate }: EditRaffleDialogProps) {
  const [loading, setLoading] = useState(false);
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
      setFormData({
        title: raffle.title || '',
        description: raffle.description || '',
        imageUrl: raffle.imageUrl || '',
        whatsappContact: raffle.whatsappContact || '',
        whatsappGroupLink: raffle.whatsappGroupLink || '',
        drawDate: raffle.drawDate || '',
      });
    }
  }, [raffle]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      ...raffle,
      ...formData,
      slug: formData.title.toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    };

    setTimeout(() => {
      onUpdate(updatedData);
      setLoading(false);
      onClose();
    }, 500);
  }

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
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva os detalhes do prêmio..." 
              required 
              className="min-h-[80px] text-base" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-imageUrl" className="flex items-center gap-2 font-semibold">
              <ImageIcon className="w-4 h-4" /> Link da Imagem
            </Label>
            <Input 
              id="edit-imageUrl" 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              placeholder="https://link-da-foto.com/imagem.jpg" 
              className="h-12" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 opacity-60">
              <Label className="font-semibold flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Valor da Cota
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-sm font-bold text-muted-foreground">R$</span>
                <Input disabled value={raffle.pricePerNumber?.toFixed(2)} className="pl-10 h-12 text-base bg-muted" />
              </div>
            </div>
            <div className="grid gap-2 opacity-60">
              <Label className="font-semibold flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Qtd. Números
              </Label>
              <Input disabled value={raffle.totalNumbers} className="h-12 text-base bg-muted" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-date" className="font-semibold">Nova Data do Sorteio</Label>
            <Input 
              id="edit-date" 
              type="date" 
              value={formData.drawDate} 
              onChange={(e) => setFormData({...formData, drawDate: e.target.value})}
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
              onChange={(e) => setFormData({...formData, whatsappContact: e.target.value})}
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
              onChange={(e) => setFormData({...formData, whatsappGroupLink: e.target.value})}
              placeholder="https://chat.whatsapp.com/..." 
              className="h-12 border-green-100" 
            />
          </div>

          <div className="pt-4 sticky bottom-0 bg-white pb-2">
            <Button type="submit" className="w-full h-14 font-bold text-lg shadow-xl" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
