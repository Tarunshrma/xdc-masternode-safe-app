import { useState } from 'react';
import type { Address } from 'viem';
import { buildTransaction } from '../lib/contracts/buildTransaction';
import { sendSafeTransaction } from '../lib/safe/transactions';

type SafeTransactionCardProps = {
  chainId: string | null;
  isInsideSafe: boolean;
  validatorAddress: Address | null;
  validatorAddressInput: string;
  onValidatorAddressChange: (value: string) => void;
  validatorAddressError: string | null;
  stakeAmountInput: string;
  onStakeAmountChange: (value: string) => void;
  stakeAmountError: string | null;
  stakeAmountWei: bigint | null;
  canSubmit: boolean;
};

const SafeTransactionCard = ({
  chainId,
  isInsideSafe,
  validatorAddress,
  validatorAddressInput,
  onValidatorAddressChange,
  validatorAddressError,
  stakeAmountInput,
  onStakeAmountChange,
  stakeAmountError,
  stakeAmountWei,
  canSubmit,
}: SafeTransactionCardProps) => {
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txSubmitting, setTxSubmitting] = useState(false);

  const handlePropose = async () => {
    if (!isInsideSafe) {
      setTxStatus('Open this app inside a Safe to submit transactions.');
      return;
    }
    if (!chainId) {
      setTxStatus('Safe chain not detected.');
      return;
    }
    if (!validatorAddress || stakeAmountWei === null) {
      setTxStatus('Fix validation errors before submitting.');
      return;
    }

    setTxSubmitting(true);
    setTxStatus(null);

    try {
      const payload = buildTransaction({
        chainId: Number(chainId),
        contractKey: 'masternodeManager',
        functionName: 'propose',
        args: [validatorAddress],
        value: stakeAmountWei,
      });
      await sendSafeTransaction(payload);
      setTxStatus('Transaction submitted to Safe.');
    } catch (err) {
      setTxStatus('Unable to submit transaction.');
    } finally {
      setTxSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Safe Transaction</h2>
      <p className="muted">
        Propose the validator address via the Safe transaction flow.
      </p>
      <div className="form-grid">
        <label className="field">
          <span className="label">Masternode Address</span>
          <input
            className="input"
            type="text"
            value={validatorAddressInput}
            onChange={(event) => onValidatorAddressChange(event.target.value)}
            placeholder="0x..."
          />
          {validatorAddressError ? (
            <span className="error-text">{validatorAddressError}</span>
          ) : null}
        </label>
        <label className="field">
          <span className="label">Stake Amount (XDC)</span>
          <input
            className="input"
            type="text"
            value={stakeAmountInput}
            onChange={(event) => onStakeAmountChange(event.target.value)}
            placeholder="0.0"
            inputMode="decimal"
          />
          {stakeAmountError ? (
            <span className="error-text">{stakeAmountError}</span>
          ) : null}
        </label>
      </div>
      <button
        className="button"
        type="button"
        onClick={handlePropose}
        disabled={txSubmitting || !canSubmit}
      >
        {txSubmitting ? 'Submitting...' : 'Propose Validator'}
      </button>
      {txStatus ? <p className="muted">{txStatus}</p> : null}
    </section>
  );
};

export default SafeTransactionCard;
