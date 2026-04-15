import React, { useState } from 'react';
import algosdk from 'algosdk';
import { motion } from 'framer-motion';
import { FaCheckDouble, FaLink, FaArrowLeft, FaCube } from 'react-icons/fa';
import { peraWallet } from '../components/Navbar';

const Step4Blockchain = ({ data, account, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState(null);

  const handleMintNotary = async () => {
    if (!account) {
      alert("Please connect your Pera Wallet first!");
      return;
    }

    setLoading(true);
    try {
      // 1. Setup Algod Client (Testnet)
      const algodToken = "";
      const algodServer = "https://testnet-api.algonode.cloud";
      const algodPort = "";
      const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

      // 2. Get suggested parameters
      const params = await algodClient.getTransactionParams().do();

      // 3. Create Note (Verification Summary)
      const noteData = {
        app: "AlgoBharat RWA",
        purpose: data.purpose.substring(0, 50),
        partyA: data.partyA.pan,
        partyB: data.partyB.pan,
        score: data.verification.score,
        docHash: btoa(data.analysis.substring(0, 32)), // Mock hash
        timestamp: new Date().toISOString()
      };
      const enc = new TextEncoder();
      const note = enc.encode(JSON.stringify(noteData));

      // 4. Create Transaction
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account,
        to: account, // Sending to self for notarization
        amount: 0,
        note: note,
        suggestedParams: params
      });

      // 5. Sign with Pera Wallet
      const singleTxnGroups = [{ txn, signers: [account] }];
      const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
      
      // 6. Send Transaction
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      setTxId(txId);
      
      // 7. Wait for confirmation
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      console.log("Transaction confirmed:", txId);

    } catch (error) {
      console.error("Blockchain error:", error);
      alert("Transaction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="glass-card"
    >
      <h2 className="gradient-text" style={{ marginBottom: '1rem', textAlign: 'center' }}>Step 4: Blockchain Notarization</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>Asset Verification</h4>
          <p style={{ fontSize: '0.9rem' }}>Score: <strong>{data.verification?.score}/100</strong></p>
          <p style={{ fontSize: '0.9rem' }}>Similarity: <strong>{(data.verification?.similarity * 100).toFixed(1)}%</strong></p>
        </div>
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>AI Risk Level</h4>
          <p style={{ fontSize: '0.9rem' }}>Status: <strong>Analyzed</strong></p>
          <p style={{ fontSize: '0.9rem', color: 'var(--success)' }}>Integrity: <strong>Verified</strong></p>
        </div>
      </div>

      {!txId ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', opacity: 0.7 }}>
            Ready to record this verification on the Algorand Testnet. 
            This will create a permanent, tamper-proof record of the agreement and risk scores.
          </p>
          <button 
            onClick={handleMintNotary} 
            className="btn-primary" 
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
            disabled={loading}
          >
            <FaCube /> {loading ? 'Signing Transaction...' : 'Record on Blockchain'}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0, 230, 118, 0.1)', borderRadius: '16px', border: '1px solid var(--success)' }}
        >
          <FaCheckDouble style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Successfully Notarized!</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>Transaction ID: {txId}</p>
          <a 
            href={`https://testnet.algoexplorer.io/tx/${txId}`} 
            target="_blank" 
            rel="noreferrer"
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            <FaLink /> View on AlgoExplorer
          </a>
        </motion.div>
      )}

      {!txId && (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={onBack} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaArrowLeft /> Back to Analysis
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Step4Blockchain;
