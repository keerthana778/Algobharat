import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFileUpload, FaArrowRight, FaArrowLeft, FaFileAlt, FaBrain } from 'react-icons/fa';

const Step3Analyze = ({ data, updateData, onNext, onBack }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(data.analysis || null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.txt')) {
      setFile(selectedFile);
    } else {
      alert("Please upload a .txt file. PDF/Image support is coming soon!");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:8000/analyze', formData);
      setAnalysis(response.data.analysis);
      updateData({ analysis: response.data.analysis, fileName: file.name });
    } catch (error) {
      console.error("Error analyzing file:", error);
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
      <h2 className="gradient-text" style={{ marginBottom: '0.5rem' }}>Step 3: AI Document Analysis</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Upload the main agreement document. Our AI will extract key details and assess risks.
      </p>

      <div 
        style={{ 
          border: '2px dashed var(--glass-border)', 
          borderRadius: '16px', 
          padding: '3rem', 
          textAlign: 'center', 
          marginBottom: '2rem',
          background: file ? 'rgba(0, 180, 216, 0.05)' : 'transparent',
          position: 'relative'
        }}
      >
        <input 
          type="file" 
          accept=".txt" 
          onChange={handleFileChange}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            opacity: 0, 
            cursor: 'pointer' 
          }}
        />
        {file ? (
          <div>
            <FaFileAlt style={{ fontSize: '3rem', color: 'var(--accent-secondary)', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 'bold' }}>{file.name}</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <div>
            <FaFileUpload style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }} />
            <p>Drag or click to upload agreement (.txt)</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Currently limited to plain text for AI extraction accuracy</p>
          </div>
        )}
      </div>

      <button 
        onClick={handleAnalyze} 
        className="btn-outline" 
        style={{ width: '100%', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        disabled={loading || !file}
      >
        <FaBrain /> {loading ? 'Analyzing Content...' : 'Run AI Analysis'}
      </button>

      {analysis && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FaBrain style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Insight Report</span>
          </div>
          {analysis}
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaArrowLeft /> Back
        </button>
        <button 
          onClick={onNext} 
          className="btn-primary" 
          disabled={!analysis}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Final Review <FaArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default Step3Analyze;
