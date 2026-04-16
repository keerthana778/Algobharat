import React, { useState } from "react";

function Step4Review({
  docTypes = [],
  filesA = {},
  filesB = {},
  setReviewResult,
  next,
  notify
}) {
  const [result, setResult] = useState([]);

  const analyze = async () => {
    if (!docTypes.length) {
      notify?.("No document types found to validate.", "warning");
      return;
    }

    let results = [];

    for (let doc of docTypes) {
      const fileA = filesA?.[doc];
      const fileB = filesB?.[doc];
      const file = fileA || fileB;

      let status = "❌ Missing";
      let issues = [];
      let confidence = 30;

      if (!file) {
        status = "❌ No document uploaded";
        confidence = 10;
      } else if (!(file instanceof Blob)) {
        status = "⚠ Invalid file";
        confidence = 20;
      } else {
        const name = file.name?.toLowerCase() || "";

        if (name.includes("aadhaar") || name.includes("pan")) {
          confidence += 40;
        }

        if (file.type.includes("pdf")) confidence += 20;
        if (file.type.includes("image")) confidence += 10;

        if (confidence >= 80) {
          status = "✅ Likely valid document";
        } else if (confidence >= 50) {
          status = "⚠ Weak validation";
          issues.push("Low confidence match");
        } else {
          status = "❌ Document mismatch";
          issues.push("Filename/type mismatch");
        }

        issues.push("Content not verified (OCR not enabled)");
      }

      if (confidence > 92) confidence = 92;

      results.push({ doc, status, issues, confidence });
    }

    setResult(results);
    setReviewResult(results);
    notify?.("Validation complete.", "success");
  };

  return (
    <div className="card">
      <h2 className="section-title">Step 4: 🔍 Validation</h2>

      <button className="button button-secondary" onClick={analyze}>
        Run Validation
      </button>

      <button className="button button-primary" onClick={next}>
        Continue
      </button>

      {result.map((r, i) => (
        <div key={i} className="result-card">
          <b>{r.doc}</b> → {r.status} ({r.confidence}%)
          <ul>
            {r.issues.map((iss, j) => (
              <li key={j}>⚠ {iss}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Step4Review;