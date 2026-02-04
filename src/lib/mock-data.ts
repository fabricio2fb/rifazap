
import { Raffle, Participant } from './types';

export const MOCK_RAFFLES: Raffle[] = [
  {
    id: '1',
    slug: 'cafeteira-expressa',
    title: 'Rifa Cafeteira Expressa ☕',
    description: 'Participe e concorra a uma cafeteira profissional para sua casa!',
    imageUrl: 'https://picsum.photos/seed/coffee/600/400',
    pricePerNumber: 15.00,
    totalNumbers: 100,
    drawDate: '2024-12-25',
    status: 'active',
    whatsappGroupLink: 'https://chat.whatsapp.com/mock-group',
    pixKey: '000.000.000-00',
  },
  {
    id: '2',
    slug: 'iphone-15-pro',
    title: 'iPhone 15 Pro de 256GB',
    description: 'O smartphone mais desejado do momento pode ser seu por apenas R$ 25,00!',
    imageUrl: 'https://picsum.photos/seed/phone/600/400',
    pricePerNumber: 25.00,
    totalNumbers: 500,
    drawDate: '2024-11-20',
    status: 'active',
    whatsappGroupLink: 'https://chat.whatsapp.com/mock-group-2',
    pixKey: 'rifazap@pix.com',
  }
];

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'p1',
    raffleId: '1',
    name: 'João Silva',
    whatsapp: '11999999999',
    selectedNumbers: [5, 12, 45],
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    raffleId: '1',
    name: 'Maria Oliveira',
    whatsapp: '11888888888',
    selectedNumbers: [88],
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
];
