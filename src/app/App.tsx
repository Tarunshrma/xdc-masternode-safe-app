import { useEffect, useState } from 'react';
import { XDC_CHAIN_ID, isSupportedChain } from '../lib/config/chains';
import { useSafeContext } from '../lib/safe/context';
import { getBlockNumber } from '../lib/xdc/provider';

const App = () => {
  const { safeAddress, chainId, isInsideSafe, loading, error } =
    useSafeContext();
  const isXdcChain = isSupportedChain(chainId);
  const [blockNumber, setBlockNumber] = useState<string | null>(null);
  const [blockLoading, setBlockLoading] = useState(true);
  const [blockError, setBlockError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadBlockNumber = async () => {
      setBlockLoading(true);
      setBlockError(null);

      try {
        const latestBlock = await getBlockNumber();
        if (!active) {
          return;
        }
        setBlockNumber(latestBlock.toString());
      } catch (err) {
        if (!active) {
          return;
        }
        setBlockNumber(null);
        setBlockError('Unable to fetch the latest block.');
      } finally {
        if (active) {
          setBlockLoading(false);
        }
      }
    };

    void loadBlockNumber();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="app">
      <h1>XDC Masternode Safe App</h1>
      <p>Base Safe App setup with React + TypeScript.</p>

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

      <section className="card">
        <h2>XDC RPC</h2>
        {blockLoading ? (
          <p>Fetching latest block...</p>
        ) : blockError ? (
          <p className="muted">{blockError}</p>
        ) : (
          <div>
            <span className="label">Latest Block</span>
            <span className="value">{blockNumber ?? 'Unknown'}</span>
          </div>
        )}
      </section>
    </main>
  );
};

export default App;
