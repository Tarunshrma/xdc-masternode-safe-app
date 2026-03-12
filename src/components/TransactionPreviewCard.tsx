import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { buildTransaction } from '../lib/contracts/buildTransaction';

type TransactionPreviewCardProps = {
  chainId: string | null;
  validatorAddress: Address | null;
  stakeAmountWei: bigint | null;
  validationErrors: string[];
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
}: TransactionPreviewCardProps) => {
  const [preview, setPreview] = useState<TransactionPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (validationErrors.length > 0) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    if (!chainId || !validatorAddress) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    try {
      const payload = buildTransaction({
        chainId: Number(chainId),
        contractKey: 'masternodeManager',
        functionName: 'propose',
        args: [validatorAddress],
        value: stakeAmountWei ?? 0n,
      });
      setPreview({
        contract: 'Masternode Manager',
        method: 'propose(address)',
        params: [validatorAddress],
        to: payload.to,
        value: payload.value.toString(),
      });
      setPreviewError(null);
    } catch (err) {
      setPreview(null);
      setPreviewError('Unable to build transaction preview.');
    }
  }, [chainId, stakeAmountWei, validationErrors, validatorAddress]);

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
