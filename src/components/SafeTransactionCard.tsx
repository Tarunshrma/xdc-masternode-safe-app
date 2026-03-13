import { useState } from 'react';
import type { Address } from 'viem';
import { buildTransaction } from '../lib/contracts/buildTransaction';
import { sendSafeTransaction } from '../lib/safe/transactions';

type TransactionAction = 'propose' | 'vote' | 'unvote' | 'resign' | 'withdraw';

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
  unvoteCapInput: string;
  onUnvoteCapChange: (value: string) => void;
  unvoteCapError: string | null;
  unvoteCapWei: bigint | null;
  withdrawBlockInput: string;
  onWithdrawBlockChange: (value: string) => void;
  withdrawBlockError: string | null;
  withdrawBlockNumber: bigint | null;
  withdrawIndexInput: string;
  onWithdrawIndexChange: (value: string) => void;
  withdrawIndexError: string | null;
  withdrawIndexNumber: bigint | null;
  selectedAction: TransactionAction;
  onActionChange: (value: TransactionAction) => void;
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
  unvoteCapInput,
  onUnvoteCapChange,
  unvoteCapError,
  unvoteCapWei,
  withdrawBlockInput,
  onWithdrawBlockChange,
  withdrawBlockError,
  withdrawBlockNumber,
  withdrawIndexInput,
  onWithdrawIndexChange,
  withdrawIndexError,
  withdrawIndexNumber,
  selectedAction,
  onActionChange,
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
    if (
      (selectedAction !== 'withdraw' && !validatorAddress) ||
      (selectedAction === 'propose' && stakeAmountWei === null) ||
      (selectedAction === 'vote' && stakeAmountWei === null) ||
      (selectedAction === 'unvote' && unvoteCapWei === null) ||
      (selectedAction === 'withdraw' &&
        (withdrawBlockNumber === null || withdrawIndexNumber === null))
    ) {
      setTxStatus('Fix validation errors before submitting.');
      return;
    }

    setTxSubmitting(true);
    setTxStatus(null);

    try {
      const payload =
        selectedAction === 'withdraw'
          ? buildTransaction({
              chainId: Number(chainId),
              contractKey: 'masternodeManager',
              functionName: 'withdraw',
              args: [withdrawBlockNumber, withdrawIndexNumber],
            })
          : selectedAction === 'unvote'
            ? buildTransaction({
                chainId: Number(chainId),
                contractKey: 'masternodeManager',
                functionName: 'unvote',
                args: [validatorAddress, unvoteCapWei],
              })
            : buildTransaction({
                chainId: Number(chainId),
                contractKey: 'masternodeManager',
                functionName: selectedAction,
                args: [validatorAddress],
                value:
                  selectedAction === 'propose' || selectedAction === 'vote'
                    ? stakeAmountWei ?? 0n
                    : 0n,
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
        Submit a critical masternode operation via Safe.
      </p>
      <label className="field">
        <span className="label">Action</span>
        <select
          className="input"
          value={selectedAction}
          onChange={(event) =>
            onActionChange(event.target.value as TransactionAction)
          }
        >
          <option value="propose">Propose</option>
          <option value="vote">Vote</option>
          <option value="unvote">Unvote</option>
          <option value="resign">Resign</option>
          <option value="withdraw">Withdraw</option>
        </select>
      </label>
      <div className="form-grid">
        {selectedAction !== 'withdraw' ? (
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
        ) : null}
        {selectedAction === 'propose' || selectedAction === 'vote' ? (
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
        ) : null}
        {selectedAction === 'unvote' ? (
          <label className="field">
            <span className="label">Unvote Cap (XDC)</span>
            <input
              className="input"
              type="text"
              value={unvoteCapInput}
              onChange={(event) => onUnvoteCapChange(event.target.value)}
              placeholder="0.0"
              inputMode="decimal"
            />
            {unvoteCapError ? (
              <span className="error-text">{unvoteCapError}</span>
            ) : null}
          </label>
        ) : null}
        {selectedAction === 'withdraw' ? (
          <>
            <label className="field">
              <span className="label">Withdraw Block</span>
              <input
                className="input"
                type="text"
                value={withdrawBlockInput}
                onChange={(event) => onWithdrawBlockChange(event.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
              {withdrawBlockError ? (
                <span className="error-text">{withdrawBlockError}</span>
              ) : null}
            </label>
            <label className="field">
              <span className="label">Withdraw Index</span>
              <input
                className="input"
                type="text"
                value={withdrawIndexInput}
                onChange={(event) => onWithdrawIndexChange(event.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
              {withdrawIndexError ? (
                <span className="error-text">{withdrawIndexError}</span>
              ) : null}
            </label>
          </>
        ) : null}
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
