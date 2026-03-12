import { useMemo, useState } from 'react';
import { type Address } from 'viem';
import { isSupportedChain } from '../lib/config/chains';
import { useSafeContext } from '../lib/safe/context';
import { validateAddress, validateAmount } from '../lib/validation';
import MasternodeStatusCard from '../components/MasternodeStatusCard';
import SafeContextCard from '../components/SafeContextCard';
import SafeTransactionCard from '../components/SafeTransactionCard';
import TransactionPreviewCard from '../components/TransactionPreviewCard';
import XdcRpcCard from '../components/XdcRpcCard';

const App = () => {
  const { safeAddress, chainId, isInsideSafe, loading, error } =
    useSafeContext();
  const isXdcChain = isSupportedChain(chainId);
  const [masternodeAddressInput, setMasternodeAddressInput] = useState(
    () => import.meta.env.VITE_MASTERNODE_ADDRESS ?? '',
  );
  const [stakeAmountInput, setStakeAmountInput] = useState('0');

  const addressValidation = useMemo(
    () => validateAddress(masternodeAddressInput),
    [masternodeAddressInput],
  );
  const amountValidation = useMemo(
    () => validateAmount(stakeAmountInput),
    [stakeAmountInput],
  );

  const validationErrors = useMemo(() => {
    return [addressValidation.error, amountValidation.error].filter(
      (error): error is string => Boolean(error),
    );
  }, [addressValidation.error, amountValidation.error]);

  const validatorAddress = addressValidation.address as Address | null;
  const stakeAmountWei = amountValidation.value;
  const canSubmit = addressValidation.isValid && amountValidation.isValid;

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
        validatorAddressInput={masternodeAddressInput}
        onValidatorAddressChange={setMasternodeAddressInput}
        validatorAddressError={addressValidation.error}
        stakeAmountInput={stakeAmountInput}
        onStakeAmountChange={setStakeAmountInput}
        stakeAmountError={amountValidation.error}
        stakeAmountWei={stakeAmountWei}
        canSubmit={canSubmit}
      />
      <TransactionPreviewCard
        chainId={chainId}
        validatorAddress={validatorAddress}
        stakeAmountWei={stakeAmountWei}
        validationErrors={validationErrors}
      />
    </main>
  );
};

export default App;
