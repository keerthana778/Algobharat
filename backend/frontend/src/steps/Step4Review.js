import React from "react";

function Step4Review({ docTypes, next }) {
  return (
    <div className="card">
      <h2>Step 4: Review</h2>

      <p>Documents:</p>
      {docTypes.map((doc, index) => (
        <p key={index}>✔ {doc}</p>
      ))}

      <button onClick={next}>Proceed to AI</button>
    </div>
  );
}

export default Step4Review;