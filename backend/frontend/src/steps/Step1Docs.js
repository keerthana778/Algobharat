import React, { useState, useEffect } from "react";

function Step1Docs({ next, docTypes, setDocTypes, notify }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (docTypes && docTypes.length > 0) {
      setTypes(docTypes);
    } else {
      setTypes([""]);
    }
  }, [docTypes]);

  function handleChange(index, value) {
    const updated = [...types];
    updated[index] = value;
    setTypes(updated);
  }

  function addDoc() {
    setTypes([...types, ""]);
  }

  function deleteDoc(index) {
    const updated = types.filter((_, i) => i !== index);
    setTypes(updated.length ? updated : [""]); // never empty crash
  }

  function handleNext() {
    const clean = types.filter((t) => t.trim() !== "");
    if (!clean.length) {
      notify?.("Add at least one document to continue.", "warning");
      return;
    }
    setDocTypes(clean);
    notify?.("Document list saved.", "success");
    next();
  }

  return (
    <div className="card">
      <h2 className="section-title">Step 1: 🧾 Confirm / Edit Documents</h2>
      <p className="section-help">
        Add, rename, or remove required documents before uploads start.
      </p>

      {types.map((doc, index) => (
        <div key={index} className="row">
          <input
            className="input"
            value={doc}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Document ${index + 1}`}
          />

          <button className="button button-danger" onClick={() => deleteDoc(index)}>
            Remove
          </button>
        </div>
      ))}

      <div className="row wrap">
        <button className="button button-secondary" onClick={addDoc}>
          ➕ Add Document
        </button>
        <button className="button button-primary" onClick={handleNext}>
          Continue to Upload
        </button>
      </div>
    </div>
  );
}

export default Step1Docs;