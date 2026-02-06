
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image as ImageIcon, Link as LinkIcon, Upload, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateRaffleDialogProps {
  onCreate?: (raffle: any) => void;
}

export function CreateRaffleDialog({ onCreate }: CreateRaffleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const slug = title.toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const data = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      slug: slug,
      description: formData.get('description') as string,
      imageUrl: (formData.get('imageUrl') as string) || '',
      whatsappContact: formData.get('whatsappContact') as string,
      whatsappGroupLink: formData.get('whatsappGroupLink') as string || '',
      pricePerNumber: Number(formData.get('price')),
      totalNumbers: Number(formData.get('total')),
      drawDate: formData.get('date') as string,
      status: 'active',
      pixKey: formData.get('pix') as string,
      createdAt: new Date().toISOString(),
    };

    // Simulação de criação
    setTimeout(() => {
      if (onCreate) onCreate(data);
      setOpen(false);
      setLoading(false);
      setSelectedFile(null);
    }, 500);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 gap-2 shadow-lg">
          <Plus className="w-5 h-5" /> Criar Nova Rifa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">Configurar Campanha</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                <Upload className="w-4 h-4" /> Upload de Foto
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
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/20"
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
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="w-8 h-8 opacity-20" />
                      <span className="text-xs font-medium">Clique para selecionar foto</span>
                    </div>
                  )}
                </Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl" className="flex items-center gap-2 font-semibold text-muted-foreground">
                <LinkIcon className="w-4 h-4" /> Ou Link da Imagem
              </Label>
              <Input id="imageUrl" name="imageUrl" placeholder="https://link-da-foto.com/imagem.jpg" className="h-12" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price" className="font-semibold">Valor da Cota</Label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-sm font-bold text-muted-foreground">R$</span>
                <Input id="price" name="price" type="number" step="0.01" placeholder="10,00" required className="pl-10 h-12 text-base" />
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
            <Label htmlFor="pix" className="font-semibold text-green-700">Chave PIX (Recebimento)</Label>
            <Input id="pix" name="pix" placeholder="E-mail, CPF ou Celular" required className="h-12 border-green-200 focus:ring-green-500 text-base" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappGroupLink" className="flex items-center gap-2 font-semibold text-green-700">
              <LinkIcon className="w-4 h-4" /> Link do Grupo (WhatsApp)
            </Label>
            <Input id="whatsappGroupLink" name="whatsappGroupLink" placeholder="https://chat.whatsapp.com/..." className="h-12 border-green-100" />
          </div>

          <div className="pt-4 sticky bottom-0 bg-white pb-2">
            <Button type="submit" className="w-full h-14 font-bold text-lg shadow-xl" disabled={loading}>
              {loading ? "Processando..." : "Publicar Rifa Agora"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
