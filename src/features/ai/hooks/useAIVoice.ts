/**
 * @file useAIVoice.ts
 * @description Hook managing Voice STT / TTS state placeholders.
 * @module AuraAI/Hooks
 */

import { useState } from 'react';

export function useAIVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);
  const speakText = (text: string) => {
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), Math.min(text.length * 50, 4000));
  };

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speakText,
  };
}
