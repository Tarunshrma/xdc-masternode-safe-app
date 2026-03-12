import { XDC_CHAIN_ID } from '../lib/config/chains';

type SafeContextCardProps = {
  safeAddress: string | null;
  chainId: string | null;
  isInsideSafe: boolean;
  loading: boolean;
  error: string | null;
  isXdcChain: boolean;
};

const SafeContextCard = ({
  safeAddress,
  chainId,
  isInsideSafe,
  loading,
  error,
  isXdcChain,
}: SafeContextCardProps) => {
  return (
    <section className="card">
      <h2>Safe Context</h2>
      {loading ? (
        <p>Detecting Safe context...</p>
      ) : isInsideSafe ? (
        <div className="safe-details">
          <div>
            <span className="label">Safe Address</span>
            <span className="value">{safeAddress ?? 'Unknown'}</span>
          </div>
          <div>
            <span className="label">Chain ID</span>
            <span className="value">{chainId ?? 'Unknown'}</span>
          </div>
          {!isXdcChain ? (
            <p className="warning">
              Unsupported network. Please switch to XDC (chainId{' '}
              {XDC_CHAIN_ID}).
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          <p>Not running inside a Safe wallet.</p>
          {error ? <p className="muted">{error}</p> : null}
        </div>
      )}
    </section>
  );
};

export default SafeContextCard;
