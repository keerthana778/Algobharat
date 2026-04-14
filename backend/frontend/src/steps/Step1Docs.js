import React, { useState } from "react";

function Step1Docs({ next, setDocTypes }) {
  const [count, setCount] = useState(1);
  const [types, setTypes] = useState([""]);

  function handleTypeChange(index, value) {
    const updated = [...types];
    updated[index] = value;
    setTypes(updated);
  }

  function handleCountChange(e) {
    const value = parseInt(e.target.value);
    setCount(value);

    const newTypes = Array(value).fill("");
    setTypes(newTypes);
  }

  function handleNext() {
    if (!setDocTypes) {
      alert("setDocTypes not passed properly ❌");
      return;
    }

    setDocTypes(types);
    next();
  }

  return (
    <div className="card">
      <h2>Step 1: Select Documents</h2>

      <input
        type="number"
        min="1"
        value={count}
        onChange={handleCountChange}
      />

      {types.map((type, index) => (
        <input
          key={index}
          placeholder={`Document ${index + 1}`}
          value={type}
          onChange={(e) => handleTypeChange(index, e.target.value)}
        />
      ))}

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Step1Docs;