
export type RaffleStatus = 'active' | 'closed' | 'drawn';
export type NumberStatus = 'available' | 'reserved' | 'paid';

export interface Raffle {
  id?: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  pricePerNumber: number;
  totalNumbers: number;
  drawDate: string;
  status: RaffleStatus;
  whatsappGroupLink?: string;
  pixKey: string;
  createdAt?: any;
}

export interface Participant {
  id: string;
  raffleId: string;
  raffleTitle?: string;
  raffleImageUrl?: string;
  name: string;
  whatsapp: string;
  selectedNumbers: number[];
  totalAmount?: number;
  status: 'pending' | 'confirmed';
  createdAt: any;
}
