import React from "react";

function Step5AI({ docTypes = [], filesA = {}, filesB = {}, next }) {

  const getSummary = () => {
    if (!docTypes || docTypes.length === 0) {
      return {
        text: "No documents were selected.",
        confidence: 0,
        suggestions: ["Please add required documents"]
      };
    }

    let total = docTypes.length;
    let present = 0;
    let strongDocs = 0;
    let weakDocs = 0;

    let suggestions = [];

    docTypes.forEach((doc) => {
      const hasA = filesA?.[doc];
      const hasB = filesB?.[doc];

      if (hasA || hasB) {
        present++;

        const name = doc.toLowerCase();

        // 🔥 simple smart scoring
        if (name.includes("agreement") || name.includes("loan")) {
          strongDocs++;
        } else {
          weakDocs++;
          suggestions.push(`${doc} may need stronger validation or clarity`);
        }
      } else {
        suggestions.push(`${doc} is missing`);
      }
    });

    let confidence = Math.round((present / total) * 100);

    if (strongDocs > weakDocs) confidence += 10;
    if (confidence > 100) confidence = 100;

    let text = "";

    if (confidence > 80) {
      text = "Agreement looks strong and well-supported.";
    } else if (confidence > 50) {
      text = "Agreement is moderate but can be improved.";
    } else {
      text = "Agreement is weak. Missing or unclear documents.";
    }

    return { text, confidence, suggestions };
  };

  const result = getSummary();

  return (
    <div>
      <h2>Step 5: AI Summary</h2>

      <h3>🧠 Summary</h3>
      <p>{result.text}</p>

      <h3>📊 Confidence Score</h3>
      <h1>{result.confidence}%</h1>

      <h3>⚠ Suggestions</h3>
      {result.suggestions.length === 0 ? (
        <p>No issues found 🎉</p>
      ) : (
        <ul>
          {result.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}

      <button onClick={next}>Proceed to Blockchain</button>
    </div>
  );
}

export default Step5AI;