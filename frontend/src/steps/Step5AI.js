import React from "react";

function Step5AI({ reviewResult = [], next, notify }) {

  const generateSummary = () => {
    if (!reviewResult.length) {
      return {
        summary: "No validation results available.",
        confidence: 0,
        suggestions: ["Run Step 4 first"]
      };
    }

    let total = reviewResult.length;
    let totalConfidence = 0;
    let suggestions = [];

    reviewResult.forEach((r) => {
      totalConfidence += r.confidence || 0;
      if (r.issues?.length) {
        suggestions.push(`${r.doc}: ${r.issues.join(", ")}`);
      }
    });

    let confidence = Math.round(totalConfidence / total);

    if (confidence >= 95) confidence = 92;

    let summary = "";

    if (confidence > 70) summary = "Documents are mostly consistent.";
    else if (confidence > 40) summary = "Some inconsistencies detected.";
    else summary = "Documents appear mismatched.";

    if (suggestions.length === 0) {
      suggestions.push("No major issues detected.");
    }

    return { summary, confidence, suggestions };
  };

  const result = generateSummary();

  return (
    <div className="card">
      <h2 className="section-title">Step 5: 🤖 AI Summary</h2>

      <div className="result-card">
        <h3>Summary</h3>
        <p>{result.summary}</p>
      </div>

      <div className="result-card">
        <h3>Confidence</h3>
        <p>{result.confidence}%</p>
      </div>

      <div className="result-card">
        <h3>Suggestions</h3>
        <ul>
          {result.suggestions.map((s, i) => (
            <li key={i}>👉 {s}</li>
          ))}
        </ul>
      </div>

      <button
        className="button button-primary"
        onClick={() => {
          notify?.("Moving to blockchain step", "info");
          next();
        }}
      >
        Proceed
      </button>
    </div>
  );
}

export default Step5AI;