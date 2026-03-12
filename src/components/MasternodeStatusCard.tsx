import { useEffect, useState } from 'react';
import { formatEther, type Address } from 'viem';
import { getValidatorInfo } from '../lib/xdc/masternode';

type MasternodeStatusCardProps = {
  chainId: string | null;
  validatorAddress: Address | null;
};

const MasternodeStatusCard = ({
  chainId,
  validatorAddress,
}: MasternodeStatusCardProps) => {
  const [validatorInfo, setValidatorInfo] = useState<{
    stake: string;
    signer: string;
    status: number;
  } | null>(null);
  const [validatorLoading, setValidatorLoading] = useState(false);
  const [validatorError, setValidatorError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadValidatorInfo = async () => {
      if (!validatorAddress) {
        setValidatorInfo(null);
        setValidatorError('Validator address not configured.');
        return;
      }

      if (!chainId) {
        setValidatorInfo(null);
        setValidatorError('Safe chain not detected.');
        return;
      }

      setValidatorLoading(true);
      setValidatorError(null);

      try {
        const info = await getValidatorInfo(
          validatorAddress,
          Number(chainId),
        );
        if (!active) {
          return;
        }
        setValidatorInfo({
          stake: formatEther(info.stake),
          signer: info.signer,
          status: info.status,
        });
      } catch (err) {
        if (!active) {
          return;
        }
        setValidatorInfo(null);
        setValidatorError('Unable to fetch validator info.');
      } finally {
        if (active) {
          setValidatorLoading(false);
        }
      }
    };

    void loadValidatorInfo();

    return () => {
      active = false;
    };
  }, [chainId, validatorAddress]);

  return (
    <section className="card">
      <h2>Masternode Status</h2>
      {validatorLoading ? (
        <p>Fetching validator info...</p>
      ) : validatorError ? (
        <div>
          <p className="muted">{validatorError}</p>
          <p className="muted">
            Set <code>VITE_MASTERNODE_ADDRESS</code> and{' '}
            <code>VITE_STAKING_CONTRACT_ADDRESS</code> to enable this view.
          </p>
        </div>
      ) : validatorInfo ? (
        <div className="safe-details">
          <div>
            <span className="label">Stake Amount</span>
            <span className="value">{validatorInfo.stake} XDC</span>
          </div>
          <div>
            <span className="label">Signer Address</span>
            <span className="value">{validatorInfo.signer}</span>
          </div>
          <div>
            <span className="label">Status</span>
            <span className="value">{validatorInfo.status}</span>
          </div>
        </div>
      ) : (
        <p className="muted">No validator data available.</p>
      )}
    </section>
  );
};

export default MasternodeStatusCard;
