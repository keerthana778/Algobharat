import React, { useState } from "react";

function Step4Review({ docTypes = [], filesA = {}, filesB = {}, next }) {
  const [result, setResult] = useState([]);

  const analyze = async () => {
    let results = [];

    for (let doc of docTypes || []) {
      const fileA = filesA?.[doc];
      const fileB = filesB?.[doc];

      let status = "❌ Missing";

      const file = fileA || fileB;

      if (!file) {
        status = "❌ No document uploaded";
      } else if (!(file instanceof Blob)) {
        status = "⚠ Invalid file";
      } else if (file.type.startsWith("image/")) {
        status = "📸 Image uploaded (basic check)";
      } else if (file.type === "application/pdf") {
        status = "📄 PDF uploaded";
      } else {
        status = "⚠ Unsupported format";
      }

      results.push({ doc, status });
    }

    setResult(results);
  };

  return (
    <div>
      <h2>Step 4: Review</h2>

      <button onClick={analyze}>Analyze</button>

      <div>
        {result.map((r, i) => (
          <p key={i}>
            {r.doc} → {r.status}
          </p>
        ))}
      </div>

      <br />
      <button onClick={next}>Next</button>
    </div>
  );
}

export default Step4Review;