import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLightbulb, FaArrowRight } from 'react-icons/fa';

const Step1Purpose = ({ data, updateData, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(data.suggestedDocs || []);

  const handleGetSuggestions = async () => {
    if (!data.purpose) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('purpose', data.purpose);
      const response = await axios.post('http://localhost:8000/ai/suggest', formData);
      setSuggestions(response.data.documents);
      updateData({ suggestedDocs: response.data.documents });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="glass-card"
    >
      <h2 className="gradient-text" style={{ marginBottom: '0.5rem' }}>Step 1: Agreement Purpose</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Tell us about the agreement. Our AI will suggest the necessary documents to verify.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Purpose of Agreement</label>
        <textarea 
          placeholder="e.g. Renting a commercial property in Mumbai for a 2-year term..."
          rows="4"
          value={data.purpose || ''}
          onChange={(e) => updateData({ purpose: e.target.value })}
        />
      </div>

      <button 
        onClick={handleGetSuggestions} 
        className="btn-outline" 
        style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        disabled={loading || !data.purpose}
      >
        <FaLightbulb /> {loading ? 'Thinking...' : 'Get AI Suggestions'}
      </button>

      {suggestions.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Suggested Documents:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {suggestions.map((doc, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card" 
                style={{ padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', borderStyle: 'dashed' }}
              >
                {doc}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={onNext} 
          className="btn-primary" 
          disabled={!data.purpose}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Next Step <FaArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default Step1Purpose;
