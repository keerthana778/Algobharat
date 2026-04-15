import React, { useEffect, useState } from "react";

function TransactionList() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    setTxs(stored);
  }, []);

  return (
    <div className="card">
      <h2 className="section-title">📜 Transaction History</h2>
      <p className="section-help">
        All blockchain transaction records stored by this app on your device.
      </p>

      {txs.length === 0 && <p className="status-warn">No transactions yet.</p>}

      {txs.map((tx, index) => (
        <div key={index} className="result-card">
          <p><b>TX ID:</b> <span className="history-txid">{tx.txId}</span></p>
          <p><b>Time:</b> {new Date(tx.time).toLocaleString()}</p>
          <p><b>Documents:</b> {Object.keys(tx.data?.documents || {}).length}</p>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;