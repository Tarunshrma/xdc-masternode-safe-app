import { useEffect, useState } from 'react';
import { formatEther, type Address } from 'viem';
import {
  getCandidateCap,
  getCandidateCount,
  isCandidate,
} from '../lib/xdc/masternode';
import { validateAddress } from '../lib/validation';

type MasternodeReadCardProps = {
  chainId: string | null;
  candidateAddressInput: string;
  onCandidateAddressChange: (value: string) => void;
};

const MasternodeReadCard = ({
  chainId,
  candidateAddressInput,
  onCandidateAddressChange,
}: MasternodeReadCardProps) => {
  const [candidateCount, setCandidateCount] = useState<string | null>(null);
  const [candidateCap, setCandidateCap] = useState<string | null>(null);
  const [candidateStatus, setCandidateStatus] = useState<string | null>(null);
  const [readError, setReadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!chainId) {
        setReadError('Safe chain not detected.');
        setCandidateCount(null);
        setCandidateCap(null);
        setCandidateStatus(null);
        return;
      }

      const addressValidation = validateAddress(candidateAddressInput);

      if (!addressValidation.isValid) {
        setReadError(addressValidation.error);
        setCandidateCap(null);
        setCandidateStatus(null);
        return;
      }

      setLoading(true);
      setReadError(null);

      try {
        const resolvedChainId = Number(chainId);
        const [count, cap, status] = await Promise.all([
          getCandidateCount(resolvedChainId),
          getCandidateCap(addressValidation.address as Address, resolvedChainId),
          isCandidate(addressValidation.address as Address, resolvedChainId),
        ]);

        if (!active) {
          return;
        }

        setCandidateCount(count.toString());
        setCandidateCap(formatEther(cap));
        setCandidateStatus(status ? 'Yes' : 'No');
      } catch (err) {
        if (!active) {
          return;
        }
        setReadError('Unable to load candidate data.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [candidateAddressInput, chainId]);

  return (
    <section className="card">
      <h2>Masternode Reads</h2>
      <label className="field">
        <span className="label">Candidate Address</span>
        <input
          className="input"
          type="text"
          value={candidateAddressInput}
          onChange={(event) => onCandidateAddressChange(event.target.value)}
          placeholder="0x..."
        />
      </label>
      {loading ? (
        <p className="muted">Loading contract data...</p>
      ) : readError ? (
        <p className="error-text">{readError}</p>
      ) : (
        <div className="safe-details">
          <div>
            <span className="label">Candidate Count</span>
            <span className="value">{candidateCount ?? 'Unknown'}</span>
          </div>
          <div>
            <span className="label">Candidate Cap</span>
            <span className="value">
              {candidateCap ? `${candidateCap} XDC` : 'Unknown'}
            </span>
          </div>
          <div>
            <span className="label">Is Candidate</span>
            <span className="value">{candidateStatus ?? 'Unknown'}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default MasternodeReadCard;
