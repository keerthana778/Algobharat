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

  const readFile = (file) => {
    return new Promise((resolve) => {
      if (!file || !(file instanceof Blob)) {
        resolve("");
        return;
      }

      if (file.type.startsWith("text")) {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result || "").toLowerCase());
        reader.onerror = () => resolve("");
        reader.readAsText(file);
      } else {
        resolve(""); // no text extraction for pdf/image
      }
    });
  };

  const extractKeywords = (doc) => {
    return doc
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 3);
  };

  const analyze = async () => {
    if (!docTypes.length) {
      notify?.("No document types found to validate.", "warning");
      return;
    }

    let results = [];

    for (let doc of docTypes || []) {
      const fileA = filesA?.[doc];
      const fileB = filesB?.[doc];

      const file = fileA || fileB;

      let status = "❌ Missing";
      let issues = [];

      if (!file) {
        status = "❌ No document uploaded";
      } else if (!(file instanceof Blob)) {
        status = "⚠ Invalid file";
      } else if (file.type.startsWith("image/")) {
        status = "⚠ Image uploaded (cannot verify content)";
        issues.push("Use OCR/PDF for better verification");
      } else if (file.type === "application/pdf") {
        status = "⚠ PDF uploaded (content not verified)";
        issues.push("PDF parsing not implemented");
      } else {
        const text = await readFile(file);

        const keywords = extractKeywords(doc);

        let match = 0;
        keywords.forEach((k) => {
          if (text.includes(k)) match++;
        });

        const score = keywords.length ? match / keywords.length : 0;

        if (score > 0.6) {
          status = "✅ Matches document type";
        } else if (score > 0.3) {
          status = "⚠ Weak match";
          issues.push("Partial keyword match");
        } else {
          status = "❌ Content mismatch";
          issues.push("Text does not match document type");
        }
      }

      results.push({ doc, status, issues });
    }

    setResult(results);
    if (setReviewResult) setReviewResult(results);
    notify?.("Validation complete. Review the status cards.", "success");
  };

  const statusClassName = (status) => {
    if (status.includes("✅")) return "status-ok";
    if (status.includes("⚠")) return "status-warn";
    return "status-bad";
  };

  return (
    <div className="card">
      <h2 className="section-title">Step 4: 🔍 Validation</h2>
      <p className="section-help">
        Compare uploaded files and detect missing or weak document matches.
      </p>

      <div className="row wrap">
        <button className="button button-secondary" onClick={analyze}>
          Run Validation
        </button>
        <button className="button button-primary" onClick={next}>
          Continue to AI Summary
        </button>
      </div>

      {result.map((r, i) => (
        <div key={i} className="result-card">
          <b>📄 {r.doc}</b> {" -> "}
          <span className={statusClassName(r.status)}>{r.status}</span>

          {r.issues.length > 0 && (
            <ul>
              {r.issues.map((issue, j) => (
                <li key={j}>⚠ {issue}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default Step4Review;