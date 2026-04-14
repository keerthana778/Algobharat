import React, { useEffect, useState } from "react";

function TransactionList() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    setTxs(stored);
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>📜 Previous Transactions</h2>

      {txs.length === 0 && <p>No transactions yet</p>}

      {txs.map((tx, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <p><b>TX ID:</b> {tx.txId}</p>
          <p><b>Time:</b> {new Date(tx.time).toLocaleString()}</p>
          <p><b>Data:</b> {JSON.stringify(tx.data)}</p>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;