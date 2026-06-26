import { useEffect } from 'react';
import { reaction } from 'mobx';
import { preferencesStore } from '../../../Preferences';

/**
 * Re-runs `onRefetch` whenever the user changes language or region in Settings.
 * Use alongside your normal mount useEffect — do not replace it.
 */
export const usePreferencesRefetch = (onRefetch: () => void): void => {
  useEffect(() => {
    const dispose = reaction(
      () => `${preferencesStore.language}-${preferencesStore.region}`,
      () => {
        onRefetch();
      }
    );
    return dispose;
  }, [onRefetch]);
};