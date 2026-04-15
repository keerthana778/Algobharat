import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserShield, FaArrowRight, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Step2Details = ({ data, updateData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(data.verification || null);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/verify', {
        partyA: data.partyA,
        partyB: data.partyB
      });
      setResults(response.data);
      updateData({ verification: response.data });
    } catch (error) {
      console.error("Error verifying data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateParty = (party, field, value) => {
    const updatedParty = { ...data[party], [field]: value };
    updateData({ [party]: updatedParty });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="glass-card"
    >
      <h2 className="gradient-text" style={{ marginBottom: '0.5rem' }}>Step 2: Party Details & Validation</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Enter the PAN and details for both parties. We will validate the data using our AI scoring engine.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
        {/* Party A */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Party A (First Party)</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem' }}>PAN Number</label>
            <input 
              placeholder="ABCDE1234F"
              value={data.partyA?.pan || ''}
              onChange={(e) => updateParty('partyA', 'pan', e.target.value.toUpperCase())}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Full Name</label>
            <input 
              placeholder="John Doe"
              value={data.partyA?.name || ''}
              onChange={(e) => updateParty('partyA', 'name', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Amount (INR)</label>
            <input 
              type="number"
              placeholder="50000"
              value={data.partyA?.amount || ''}
              onChange={(e) => updateParty('partyA', 'amount', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Party B */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>Party B (Second Party)</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem' }}>PAN Number</label>
            <input 
              placeholder="WXYZP9876Q"
              value={data.partyB?.pan || ''}
              onChange={(e) => updateParty('partyB', 'pan', e.target.value.toUpperCase())}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Full Name</label>
            <input 
              placeholder="Jane Smith"
              value={data.partyB?.name || ''}
              onChange={(e) => updateParty('partyB', 'name', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Amount (INR)</label>
            <input 
              type="number"
              placeholder="50000"
              value={data.partyB?.amount || ''}
              onChange={(e) => updateParty('partyB', 'amount', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleVerify} 
        className="btn-outline" 
        style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        disabled={loading || !data.partyA?.pan || !data.partyB?.pan}
      >
        <FaUserShield /> {loading ? 'Verifying...' : 'Analyze Details'}
      </button>

      {results && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ marginBottom: '1.5rem', border: `1px solid ${results.score >= 80 ? 'var(--success)' : 'var(--error)'}` }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Verification Score: <span style={{ color: results.score >= 80 ? 'var(--success)' : 'var(--error)' }}>{results.score}/100</span></h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Name Similarity: {(results.similarity * 100).toFixed(1)}%</p>
            </div>
            {results.score >= 80 ? <FaCheckCircle style={{ color: 'var(--success)', fontSize: '2.5rem' }} /> : <FaExclamationTriangle style={{ color: 'var(--error)', fontSize: '2.5rem' }} />}
          </div>
          
          {results.issues.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Issues identified:</p>
              <ul style={{ fontSize: '0.85rem', color: 'var(--error)', listStyleType: 'square', marginLeft: '1.5rem' }}>
                {results.issues.map((issue, i) => <li key={i}>{issue}</li>)}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaArrowLeft /> Back
        </button>
        <button 
          onClick={onNext} 
          className="btn-primary" 
          disabled={!results}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Next Step <FaArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default Step2Details;
