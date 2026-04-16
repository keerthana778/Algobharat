import React, { useState } from "react";

function Step0Suggest({ next, setDocTypes, notify }) {
  const [purpose, setPurpose] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    if (!purpose.trim()) {
      notify?.("Please enter the agreement purpose first.", "warning");
      return;
    }

    try {
      setLoading(true);
      
      // 1. This variable looks at Vercel settings first
      const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

      // 2. Fixed the template literal and removed the extra symbols
      const response = await fetch(`${API_BASE}/ai/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `purpose=${encodeURIComponent(purpose)}`,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // 3. Changed 'res' to 'response' to match the variable name above
      const data = await response.json();
      const suggestedDocs = data.documents || [];
      
      setDocs(suggestedDocs);
      notify?.(`Found ${suggestedDocs.length} suggested documents.`, "success");
    } catch (error) {
      console.error("Fetch error:", error);
      notify?.("Could not fetch suggestions from AI service.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!docs.length) {
      notify?.("Get suggestions before moving to Step 1.", "warning");
      return;
    }
    setDocTypes(docs || []);
    notify?.("Moving to document confirmation.", "info");
    next();
  };

  return (
    <div className="card">
      <h2 className="section-title">Step 0: 🤖 AI Suggest Documents</h2>
      <p className="section-help">
        Tell us the agreement purpose and get smart document suggestions.
      </p>
      <input
        className="input"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Example: rental contract between owner and tenant"
      />
      <div className="row wrap">
        <button className="button button-primary" onClick={getSuggestions} disabled={loading}>
          {loading ? "Thinking..." : "✨ Get Suggestions"}
        </button>
        <button className="button button-secondary" onClick={handleProceed}>
          Continue to Step 1
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        {(docs || []).map((doc, i) => (
          <span key={i} className="doc-pill">📄 {doc}</span>
        ))}
      </div>
    </div>
  );
}

export default Step0Suggest;