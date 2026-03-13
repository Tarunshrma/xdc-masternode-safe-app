import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { buildTransaction } from '../lib/contracts/buildTransaction';

type TransactionPreviewCardProps = {
  chainId: string | null;
  validatorAddress: Address | null;
  stakeAmountWei: bigint | null;
  validationErrors: string[];
  selectedAction: 'propose' | 'vote' | 'unvote' | 'resign' | 'withdraw';
  unvoteCapWei: bigint | null;
  withdrawBlockNumber: bigint | null;
  withdrawIndexNumber: bigint | null;
};

type TransactionPreview = {
  contract: string;
  method: string;
  params: string[];
  to: string;
  value: string;
};

const TransactionPreviewCard = ({
  chainId,
  validatorAddress,
  stakeAmountWei,
  validationErrors,
  selectedAction,
  unvoteCapWei,
  withdrawBlockNumber,
  withdrawIndexNumber,
}: TransactionPreviewCardProps) => {
  const [preview, setPreview] = useState<TransactionPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (validationErrors.length > 0) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    if (
      !chainId ||
      (selectedAction !== 'withdraw' && !validatorAddress) ||
      (selectedAction === 'propose' && stakeAmountWei === null) ||
      (selectedAction === 'vote' && stakeAmountWei === null) ||
      (selectedAction === 'unvote' && unvoteCapWei === null) ||
      (selectedAction === 'withdraw' &&
        (withdrawBlockNumber === null || withdrawIndexNumber === null))
    ) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

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
      setPreview({
        contract: 'Masternode Manager',
        method:
          selectedAction === 'withdraw'
            ? 'withdraw(uint256,uint256)'
            : selectedAction === 'unvote'
              ? 'unvote(address,uint256)'
              : `${selectedAction}(address)`,
        params:
          selectedAction === 'withdraw'
            ? [
                String(withdrawBlockNumber ?? ''),
                String(withdrawIndexNumber ?? ''),
              ]
            : selectedAction === 'unvote'
              ? [String(validatorAddress), String(unvoteCapWei ?? '')]
              : [String(validatorAddress)],
        to: payload.to,
        value: payload.value.toString(),
      });
      setPreviewError(null);
    } catch (err) {
      setPreview(null);
      setPreviewError('Unable to build transaction preview.');
    }
  }, [
    chainId,
    selectedAction,
    stakeAmountWei,
    unvoteCapWei,
    validationErrors,
    validatorAddress,
    withdrawBlockNumber,
    withdrawIndexNumber,
  ]);

  return (
    <section className="card">
      <h2>Transaction Preview</h2>
      {validationErrors.length > 0 ? (
        <div>
          <p className="muted">Fix the validation errors to preview.</p>
          {validationErrors.map((message) => (
            <p key={message} className="error-text">
              {message}
            </p>
          ))}
        </div>
      ) : previewError ? (
        <p className="muted">{previewError}</p>
      ) : preview ? (
        <div className="safe-details">
          <div>
            <span className="label">Contract</span>
            <span className="value">{preview.contract}</span>
          </div>
          <div>
            <span className="label">Contract Address</span>
            <span className="value">{preview.to}</span>
          </div>
          <div>
            <span className="label">Method</span>
            <span className="value">{preview.method}</span>
          </div>
          <div>
            <span className="label">Parameters</span>
            <span className="value">{preview.params.join(', ')}</span>
          </div>
          <div>
            <span className="label">Value (wei)</span>
            <span className="value">{preview.value}</span>
          </div>
        </div>
      ) : (
        <p className="muted">
          Provide a masternode address to preview the transaction.
        </p>
      )}
    </section>
  );
};

export default TransactionPreviewCard;
