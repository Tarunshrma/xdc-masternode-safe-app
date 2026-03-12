import { useState } from 'react';
import type { Address } from 'viem';
import { buildTransaction } from '../lib/contracts/buildTransaction';
import { sendSafeTransaction } from '../lib/safe/transactions';

type SafeTransactionCardProps = {
  chainId: string | null;
  isInsideSafe: boolean;
  validatorAddress: Address | null;
};

const SafeTransactionCard = ({
  chainId,
  isInsideSafe,
  validatorAddress,
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
    if (!validatorAddress) {
      setTxStatus('Validator address not configured.');
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
      <button
        className="button"
        type="button"
        onClick={handlePropose}
        disabled={txSubmitting}
      >
        {txSubmitting ? 'Submitting...' : 'Propose Validator'}
      </button>
      {txStatus ? <p className="muted">{txStatus}</p> : null}
    </section>
  );
};

export default SafeTransactionCard;
