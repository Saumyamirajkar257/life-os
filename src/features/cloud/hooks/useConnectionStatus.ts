/**
 * Custom Hook: Network Connection Monitoring
 */

import { useEffect } from 'react';
import { useConnectionStore } from '../stores/useConnectionStore';

export function useConnectionStatus() {
  const { state, initListener } = useConnectionStore();

  useEffect(() => {
    initListener();
  }, [initListener]);

  return {
    isOnline: state.isOnline,
    lastChecked: state.lastChecked,
    rttMs: state.roundTripTimeMs,
  };
}
