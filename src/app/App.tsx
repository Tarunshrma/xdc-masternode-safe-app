import { useEffect, useMemo, useState } from 'react';
import { formatEther, isAddress, type Address } from 'viem';
import { XDC_CHAIN_ID, isSupportedChain } from '../lib/config/chains';
import { useSafeContext } from '../lib/safe/context';
import { getValidatorInfo } from '../lib/xdc/masternode';
import { getBlockNumber } from '../lib/xdc/provider';

const App = () => {
  const { safeAddress, chainId, isInsideSafe, loading, error } =
    useSafeContext();
  const isXdcChain = isSupportedChain(chainId);
  const [blockNumber, setBlockNumber] = useState<string | null>(null);
  const [blockLoading, setBlockLoading] = useState(true);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [validatorInfo, setValidatorInfo] = useState<{
    stake: string;
    signer: string;
    status: number;
  } | null>(null);
  const [validatorLoading, setValidatorLoading] = useState(false);
  const [validatorError, setValidatorError] = useState<string | null>(null);

  const validatorAddress = useMemo(() => {
    const configuredAddress = import.meta.env.VITE_VALIDATOR_ADDRESS;
    const candidates = [safeAddress, configuredAddress].filter(
      (value): value is string => Boolean(value),
    );
    const match = candidates.find((value) => isAddress(value));
    return match ? (match as Address) : null;
  }, [safeAddress]);

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

      <section className="card">
        <h2>Masternode Status</h2>
        {validatorLoading ? (
          <p>Fetching validator info...</p>
        ) : validatorError ? (
          <div>
            <p className="muted">{validatorError}</p>
            <p className="muted">
              Set <code>VITE_VALIDATOR_ADDRESS</code> and{' '}
              <code>VITE_MASTERNODE_MANAGER_ADDRESS</code> to enable this
              view.
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
    </main>
  );
};

export default App;
