import { useMemo } from 'react';
import { isAddress, type Address } from 'viem';
import { isSupportedChain } from '../lib/config/chains';
import { useSafeContext } from '../lib/safe/context';
import MasternodeStatusCard from '../components/MasternodeStatusCard';
import SafeContextCard from '../components/SafeContextCard';
import SafeTransactionCard from '../components/SafeTransactionCard';
import TransactionPreviewCard from '../components/TransactionPreviewCard';
import XdcRpcCard from '../components/XdcRpcCard';

const App = () => {
  const { safeAddress, chainId, isInsideSafe, loading, error } =
    useSafeContext();
  const isXdcChain = isSupportedChain(chainId);
  const validatorAddress = useMemo(() => {
    const configuredAddress = import.meta.env.VITE_MASTERNODE_ADDRESS;
    const candidates = [safeAddress, configuredAddress].filter(
      (value): value is string => Boolean(value),
    );
    const match = candidates.find((value) => isAddress(value));
    return match ? (match as Address) : null;
  }, [safeAddress]);

  return (
    <main className="app">
      <h1>XDC Masternode Safe App</h1>
      <p>Base Safe App setup with React + TypeScript.</p>

      <SafeContextCard
        safeAddress={safeAddress}
        chainId={chainId}
        isInsideSafe={isInsideSafe}
        loading={loading}
        error={error}
        isXdcChain={isXdcChain}
      />
      <XdcRpcCard />
      <MasternodeStatusCard
        chainId={chainId}
        validatorAddress={validatorAddress}
      />
      <SafeTransactionCard
        chainId={chainId}
        isInsideSafe={isInsideSafe}
        validatorAddress={validatorAddress}
      />
      <TransactionPreviewCard
        chainId={chainId}
        validatorAddress={validatorAddress}
      />
    </main>
  );
};

export default App;
