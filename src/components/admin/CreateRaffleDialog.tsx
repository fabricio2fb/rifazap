
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function CreateRaffleDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get('title') as string;
    const slug = title.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const imageUrl = (formData.get('imageUrl') as string) || `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/400`;

    const data = {
      title: title,
      slug: slug,
      description: formData.get('description') as string,
      imageUrl: imageUrl,
      whatsappGroupLink: formData.get('whatsappGroupLink') as string || '',
      pricePerNumber: Number(formData.get('price')),
      totalNumbers: Number(formData.get('total')),
      drawDate: formData.get('date') as string,
      status: 'active',
      pixKey: formData.get('pix') as string,
      createdAt: serverTimestamp(),
    };

    const rafflesRef = collection(db, 'raffles');
    
    addDoc(rafflesRef, data)
      .then(() => {
        toast({
          title: "Sucesso!",
          description: "Sua rifa foi criada com sucesso.",
        });
        setOpen(false);
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: rafflesRef.path,
          operation: 'create',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 gap-2">
          <Plus className="w-5 h-5" /> Criar Nova Rifa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Configurar Nova Rifa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título do Prêmio</Label>
            <Input id="title" name="title" placeholder="Ex: iPhone 15 Pro Max" required className="h-11" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" name="description" placeholder="Descreva os detalhes do prêmio e as regras..." required className="min-h-[100px]" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Link da Imagem (Opcional)
            </Label>
            <Input id="imageUrl" name="imageUrl" placeholder="https://exemplo.com/foto.jpg" className="h-11" />
            <p className="text-[10px] text-muted-foreground">Se deixar vazio, usaremos uma foto automática.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Preço por Número</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-sm text-muted-foreground">R$</span>
                <Input id="price" name="price" type="number" step="0.01" placeholder="10,00" required className="pl-9 h-11" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total">Total Números</Label>
              <Input id="total" name="total" type="number" placeholder="100" required className="h-11" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data Prevista do Sorteio</Label>
            <Input id="date" name="date" type="date" required className="h-11" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pix">Chave PIX para Recebimento</Label>
            <Input id="pix" name="pix" placeholder="E-mail, CPF ou Celular" required className="h-11" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="whatsappGroupLink" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Link do Grupo WhatsApp (Opcional)
            </Label>
            <Input id="whatsappGroupLink" name="whatsappGroupLink" placeholder="https://chat.whatsapp.com/..." className="h-11" />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full h-14 font-bold text-lg shadow-lg" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Rifa Agora"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
