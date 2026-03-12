import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { useEffect, useState } from 'react';

const safeAppsSdk = new SafeAppsSDK();

type SafeContextState = {
  safeAddress: string | null;
  chainId: string | null;
  isInsideSafe: boolean;
  loading: boolean;
  error: string | null;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Failed to detect Safe context.';
};

export const useSafeContext = (): SafeContextState => {
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isInsideSafe, setIsInsideSafe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadSafeInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const info = await safeAppsSdk.safe.getInfo();
        if (!active) {
          return;
        }
        setSafeAddress(info.safeAddress ?? null);
        setChainId(info.chainId ? String(info.chainId) : null);
        setIsInsideSafe(true);
      } catch (err) {
        if (!active) {
          return;
        }
        setSafeAddress(null);
        setChainId(null);
        setIsInsideSafe(false);
        setError(getErrorMessage(err));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadSafeInfo();

    return () => {
      active = false;
    };
  }, []);

  return {
    safeAddress,
    chainId,
    isInsideSafe,
    loading,
    error,
  };
};
