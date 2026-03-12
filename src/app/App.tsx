import { useSafeContext } from '../lib/safe/context';

const App = () => {
  const { safeAddress, chainId, isInsideSafe, loading, error } =
    useSafeContext();

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
          </div>
        ) : (
          <div>
            <p>Not running inside a Safe wallet.</p>
            {error ? <p className="muted">{error}</p> : null}
          </div>
        )}
      </section>
    </main>
  );
};

export default App;
