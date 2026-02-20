
import { Raffle, Participant } from './types';

export const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'demo-pc-gamer',
    slug: 'rifa-exemplo-pc-gamer',
    title: 'PC Gamer Ultimate RTX 4090 🚀',
    description: 'Participe do sorteio deste setup incrível! Processador Intel i9-14900K, Placa de Vídeo RTX 4090 24GB, 64GB de RAM DDR5, SSD 4TB NVMe e Gabinete Lian Li com iluminação customizada. Sorteio garantido pela RifaZap!',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080',
    pricePerNumber: 1.00,
    totalNumbers: 100,
    drawDate: '2025-05-20',
    status: 'active',
    whatsappGroupLink: 'https://chat.whatsapp.com/exemplo-pc-gamer',
    whatsappContact: '5511999999999',
    pixKey: 'pagamentos@rifazap.com',
  },
  {
    id: '1',
    slug: 'iphone-15-pro-max-titanium',
    title: 'iPhone 15 Pro Max - Titanium 📱',
    description: 'Concorra ao smartphone mais potente da Apple. Edição Titanium de 256GB. Sorteio garantido pela RifaZap!',
    imageUrl: 'https://images.unsplash.com/photo-1522125670776-3c7abb882bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzbWFydHBob25lfGVufDB8fHx8MTc3MDE0MzE3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerNumber: 1.00,
    totalNumbers: 100,
    drawDate: '2025-04-30',
    status: 'active',
    whatsappGroupLink: 'https://chat.whatsapp.com/exemplo-rifa',
    whatsappContact: '5511999999999',
    pixKey: 'pix@rifazap.com',
  },
  {
    id: '2',
    slug: 'cafeteira-espresso-premium',
    title: 'Cafeteira Espresso Premium ☕',
    description: 'Comece seus dias com o melhor café profissional na sua casa.',
    imageUrl: 'https://images.unsplash.com/photo-1552833755-fdb50eeb8cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBtYWNoaW5lfGVufDB8fHx8MTc3MDE3MjA0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerNumber: 5.00,
    totalNumbers: 50,
    drawDate: '2025-03-20',
    status: 'active',
    whatsappGroupLink: 'https://chat.whatsapp.com/exemplo-cafe',
    whatsappContact: '5511999999999',
    pixKey: 'contato@rifazap.com',
  }
];

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'p1',
    raffleId: 'demo-pc-gamer',
    name: 'Carlos Santos',
    whatsapp: '11988887777',
    selectedNumbers: [7, 21, 55],
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    raffleId: 'demo-pc-gamer',
    name: 'Ana Pereira',
    whatsapp: '11977776666',
    selectedNumbers: [42, 9],
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
];
