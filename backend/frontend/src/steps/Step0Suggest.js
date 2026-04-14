import React, { useState } from "react";

function Step0Suggest({ next, setDocTypes }) {
  const [purpose, setPurpose] = useState("");
  const [docs, setDocs] = useState([]);

  const getSuggestions = async () => {
    const res = await fetch("http://127.0.0.1:8000/ai/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `purpose=${purpose}`,
    });

    const data = await res.json();
    console.log("API RESPONSE:", data);

    setDocs(data.documents || []);
  };

  const handleProceed = () => {
    if (!setDocTypes) {
      alert("setDocTypes not working");
      return;
    }

    setDocTypes(docs || []);
    next();
  };

  return (
    <div>
      <h2>Step 0: AI Suggest Documents</h2>

      <input
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Enter purpose"
      />

      <br /><br />

      <button onClick={getSuggestions}>Get Suggestions</button>

      <div>
        {(docs || []).map((doc, i) => (
          <p key={i}>✔ {doc}</p>
        ))}
      </div>

      <button onClick={handleProceed}>
        Proceed to Manual Selection
      </button>
    </div>
  );
}

export default Step0Suggest;