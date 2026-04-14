import React, { useState, useEffect } from "react";

function Step1Docs({ next, docTypes, setDocTypes }) {
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
    setDocTypes(clean);
    next();
  }

  return (
    <div className="card">
      <h2>Step 1: Confirm / Edit Documents</h2>

      {types.map((doc, index) => (
        <div key={index}>
          <input
            value={doc}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Document ${index + 1}`}
          />

          <button onClick={() => deleteDoc(index)}>❌</button>
        </div>
      ))}

      <br />

      <button onClick={addDoc}>➕ Add Document</button>

      <br /><br />

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Step1Docs;