import { useState } from "react";
import { verifyData } from "./api";
import { connectWallet, sendTransaction } from "./wallet";

function App() {
  const [partyA, setPartyA] = useState({ name: "", pan: "", amount: "" });
  const [partyB, setPartyB] = useState({ name: "", pan: "", amount: "" });
  const [result, setResult] = useState(null);
  const [txId, setTxId] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI Verification
  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyData({
        partyA,
        partyB
      });
      setResult(res);
      setTxId(null); // reset blockchain state on new verify
    } catch (err) {
      console.error(err);
      alert("Error verifying data");
    }
    setLoading(false);
  };

  // Blockchain Transaction
  const handleBlockchain = async () => {
    try {
      setLoading(true);

      await connectWallet();

      const tx = await sendTransaction({
        status: "verified",
        score: result.score,
        timestamp: new Date().toISOString()
      });

      setTxId(tx);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Agreement Verification</h2>

      {/* Party A */}
      <h3>Party A</h3>
      <input
        placeholder="Name"
        value={partyA.name}
        onChange={(e) =>
          setPartyA({ ...partyA, name: e.target.value })
        }
      />
      <br />
      <input
        placeholder="PAN (ABCDE1234F)"
        value={partyA.pan}
        onChange={(e) =>
          setPartyA({ ...partyA, pan: e.target.value })
        }
      />
      <br />
      <input
        placeholder="Amount"
        type="number"
        value={partyA.amount}
        onChange={(e) =>
          setPartyA({ ...partyA, amount: Number(e.target.value) })
        }
      />

      {/* Party B */}
      <h3>Party B</h3>
      <input
        placeholder="Name"
        value={partyB.name}
        onChange={(e) =>
          setPartyB({ ...partyB, name: e.target.value })
        }
      />
      <br />
      <input
        placeholder="PAN (ABCDE1234F)"
        value={partyB.pan}
        onChange={(e) =>
          setPartyB({ ...partyB, pan: e.target.value })
        }
      />
      <br />
      <input
        placeholder="Amount"
        type="number"
        value={partyB.amount}
        onChange={(e) =>
          setPartyB({ ...partyB, amount: Number(e.target.value) })
        }
      />

      <br /><br />

      {/* Verify Button */}
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>
          <p><b>Score:</b> {result.score}</p>
          <p><b>Risk:</b> {result.risk}</p>

          {result.issues.length > 0 && (
            <div>
              <b>Issues:</b>
              {result.issues.map((i, idx) => (
                <p key={idx}>⚠ {i}</p>
              ))}
            </div>
          )}

          {/* Blockchain Button (SAFE) */}
          <button
            onClick={handleBlockchain}
            disabled={loading || txId}
          >
            {txId
              ? "Already Recorded on Blockchain ✅"
              : loading
              ? "Processing..."
              : "Confirm & Record on Blockchain"}
          </button>
        </div>
      )}

      {/* Transaction Result */}
      {txId && (
        <div style={{ marginTop: 20 }}>
          <h3>✅ Stored on Algorand</h3>
          <p>Transaction ID:</p>
          <code>{txId}</code>
        </div>
      )}
    </div>
  );
}

export default App;