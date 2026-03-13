import { useMemo, useState } from 'react';
import { type Address } from 'viem';
import { isSupportedChain } from '../lib/config/chains';
import { useSafeContext } from '../lib/safe/context';
import {
  validateAddress,
  validateAmount,
  validateUint,
} from '../lib/validation';
import MasternodeStatusCard from '../components/MasternodeStatusCard';
import MasternodeReadCard from '../components/MasternodeReadCard';
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
  const [candidateAddressInput, setCandidateAddressInput] = useState('');
  const [stakeAmountInput, setStakeAmountInput] = useState('0');
  const [unvoteCapInput, setUnvoteCapInput] = useState('0');
  const [withdrawBlockInput, setWithdrawBlockInput] = useState('');
  const [withdrawIndexInput, setWithdrawIndexInput] = useState('');
  const [selectedAction, setSelectedAction] = useState<
    'propose' | 'vote' | 'unvote' | 'resign' | 'withdraw'
  >('propose');

  const addressValidation = useMemo(
    () => validateAddress(masternodeAddressInput),
    [masternodeAddressInput],
  );
  const amountValidation = useMemo(
    () => validateAmount(stakeAmountInput),
    [stakeAmountInput],
  );
  const unvoteCapValidation = useMemo(
    () => validateAmount(unvoteCapInput),
    [unvoteCapInput],
  );
  const withdrawBlockValidation = useMemo(
    () => validateUint(withdrawBlockInput),
    [withdrawBlockInput],
  );
  const withdrawIndexValidation = useMemo(
    () => validateUint(withdrawIndexInput),
    [withdrawIndexInput],
  );

  const validationErrors = useMemo(() => {
    const errors = [];

    if (selectedAction !== 'withdraw') {
      if (addressValidation.error) {
        errors.push(addressValidation.error);
      }
    }

    if (selectedAction === 'propose' || selectedAction === 'vote') {
      if (amountValidation.error) {
        errors.push(amountValidation.error);
      }
    }

    if (selectedAction === 'unvote') {
      if (unvoteCapValidation.error) {
        errors.push(unvoteCapValidation.error);
      }
    }

    if (selectedAction === 'withdraw') {
      if (withdrawBlockValidation.error) {
        errors.push(withdrawBlockValidation.error);
      }
      if (withdrawIndexValidation.error) {
        errors.push(withdrawIndexValidation.error);
      }
    }

    return errors;
  }, [
    addressValidation.error,
    amountValidation.error,
    selectedAction,
    unvoteCapValidation.error,
    withdrawBlockValidation.error,
    withdrawIndexValidation.error,
  ]);

  const validatorAddress = addressValidation.address as Address | null;
  const stakeAmountWei = amountValidation.value;
  const unvoteCapWei = unvoteCapValidation.value;
  const withdrawBlockNumber = withdrawBlockValidation.value;
  const withdrawIndexNumber = withdrawIndexValidation.value;
  const canSubmit = validationErrors.length === 0;

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
      <MasternodeReadCard
        chainId={chainId}
        candidateAddressInput={candidateAddressInput}
        onCandidateAddressChange={setCandidateAddressInput}
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
        unvoteCapInput={unvoteCapInput}
        onUnvoteCapChange={setUnvoteCapInput}
        unvoteCapError={unvoteCapValidation.error}
        unvoteCapWei={unvoteCapWei}
        withdrawBlockInput={withdrawBlockInput}
        onWithdrawBlockChange={setWithdrawBlockInput}
        withdrawBlockError={withdrawBlockValidation.error}
        withdrawBlockNumber={withdrawBlockNumber}
        withdrawIndexInput={withdrawIndexInput}
        onWithdrawIndexChange={setWithdrawIndexInput}
        withdrawIndexError={withdrawIndexValidation.error}
        withdrawIndexNumber={withdrawIndexNumber}
        selectedAction={selectedAction}
        onActionChange={setSelectedAction}
        canSubmit={canSubmit}
      />
      <TransactionPreviewCard
        chainId={chainId}
        validatorAddress={validatorAddress}
        stakeAmountWei={stakeAmountWei}
        validationErrors={validationErrors}
        selectedAction={selectedAction}
        unvoteCapWei={unvoteCapWei}
        withdrawBlockNumber={withdrawBlockNumber}
        withdrawIndexNumber={withdrawIndexNumber}
      />
    </main>
  );
};

export default App;
