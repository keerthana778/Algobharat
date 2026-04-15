import React from 'react';
import { PeraWalletConnect } from "@perawallet/connect";
import { FaWallet, FaShieldAlt } from 'react-icons/fa';

const peraWallet = new PeraWalletConnect();

const Navbar = ({ account, setAccount }) => {
  const handleConnect = () => {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector.on("disconnect", handleDisconnect);
        setAccount(newAccounts[0]);
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  };

  const handleDisconnect = () => {
    peraWallet.disconnect();
    setAccount(null);
  };

  React.useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector.on("disconnect", handleDisconnect);
        if (accounts.length) {
          setAccount(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <nav style={{ padding: '1.5rem 0', marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaShieldAlt style={{ fontSize: '2rem', color: 'var(--accent-primary)' }} />
          <h1 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>AlgoBharat</h1>
        </div>
        
        <div>
          {account ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '0.5rem 1rem', borderRadius: '30px', fontSize: '0.8rem' }}>
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </div>
              <button onClick={handleDisconnect} className="btn-outline">Disconnect</button>
            </div>
          ) : (
            <button onClick={handleConnect} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaWallet /> Connect Pera Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
export { peraWallet };
