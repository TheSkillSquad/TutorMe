// src/components/trade-request-modal.tsx

'use client';

import React, { useState } from 'react';
import { sendTradeRequest } from '@/lib/api';
import { TradeRequestPayload } from '@/types';

export default function TradeRequestModal() {
  const [initiatorId, setInitiatorId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [offeredSkills, setOfferedSkills] = useState<string[]>([]);
  const [requestedSkills, setRequestedSkills] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState<number>(0);
  const [scheduledAt, setScheduledAt] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    const tradeData: TradeRequestPayload = {
      initiatorId,
      receiverId,
      offeredSkills,
      requestedSkills,
      message,
      credits,
      scheduledAt,
    };

    const response = await sendTradeRequest(tradeData);

    if (response.success) {
      // Reset form or show success
    } else {
      // Handle error
    }
  };

  return (
    <div>
      {/* Your modal JSX here */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}