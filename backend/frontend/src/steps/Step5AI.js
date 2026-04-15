import React from "react";

function Step5AI({ reviewResult = [], next, notify }) {

  const generateSummary = () => {
    if (!reviewResult || reviewResult.length === 0) {
      return {
        summary: "No validation results available.",
        suggestions: ["Run Step 4 validation first"]
      };
    }

    let valid = 0;
    let wrong = 0;

    let suggestions = [];

    reviewResult.forEach((r) => {
      if (r.status.includes("✅")) valid++;
      else wrong++;

      if (r.issues?.length) {
        suggestions.push(`${r.doc}: ${r.issues.join(", ")}`);
      }
    });

    let summary = "";

    if (valid === reviewResult.length) {
      summary = "All documents appear consistent.";
    } else if (wrong > 0) {
      summary = "Some documents are incorrect or mismatched.";
    } else {
      summary = "Documents are partially valid but need improvement.";
    }

    if (suggestions.length === 0) {
      suggestions.push("No major issues detected.");
    }

    return { summary, suggestions };
  };

  const result = generateSummary();

  return (
    <div className="card">
      <h2 className="section-title">Step 5: 🧠 AI Summary</h2>
      <p className="section-help">
        View a quick decision summary and recommended fixes before finalization.
      </p>

      <div className="result-card">
        <h3>Summary</h3>
        <p>{result.summary}</p>
      </div>

      <div className="result-card">
        <h3>Suggestions</h3>
        <ul>
          {result.suggestions.map((s, i) => (
            <li key={i}>💡 {s}</li>
          ))}
        </ul>
      </div>

      <button
        className="button button-primary"
        onClick={() => {
          notify?.("Moving to blockchain finalization.", "info");
          next();
        }}
      >
        Proceed to Blockchain
      </button>
    </div>
  );
}

export default Step5AI;