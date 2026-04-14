import React from "react";

function Step3PartyB({ docTypes, setFilesB, next }) {
  function handleUpload(type, file) {
    setFilesB((prev) => ({
      ...prev,
      [type]: file,
    }));
  }

  return (
    <div className="card">
      <h2>Step 3: Party B Upload</h2>

      {docTypes.map((doc, index) => (
        <div key={index}>
          <label>{doc}</label>
          <input
            type="file"
            onChange={(e) => handleUpload(doc, e.target.files[0])}
          />
        </div>
      ))}

      <button onClick={next}>Next</button>
    </div>
  );
}

export default Step3PartyB;