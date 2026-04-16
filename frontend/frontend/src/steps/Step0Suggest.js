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
      const res = await fetch("http://127.0.0.1:8000/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `purpose=${encodeURIComponent(purpose)}`,
      });

      const data = await res.json();
      const suggestedDocs = data.documents || [];
      setDocs(suggestedDocs);
      notify?.(`Found ${suggestedDocs.length} suggested documents.`, "success");
    } catch (error) {
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
      <div>
        {(docs || []).map((doc, i) => (
          <span key={i} className="doc-pill">📄 {doc}</span>
        ))}
      </div>
    </div>
  );
}

export default Step0Suggest;