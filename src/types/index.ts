// src/types/index.ts

export interface Trade {
  id: string;
  userId: string;
  skillId: string;
  status: 'pending' | 'matched' | 'completed';
  createdAt: string;
  initiator: string;
  receiver: string;
}

export interface TradeRequestPayload {
  initiatorId: string;
  receiverId: string;
  offeredSkills: string[];
  requestedSkills: string[];
  message: string;
  credits: number;
  scheduledAt?: string;
}
