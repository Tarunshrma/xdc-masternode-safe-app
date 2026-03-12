import { useEffect, useState } from 'react';
import { getBlockNumber } from '../lib/xdc/provider';

const XdcRpcCard = () => {
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
  );
};

export default XdcRpcCard;
