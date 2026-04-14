import React from "react";

function Step2PartyA({ docTypes, setFilesA, next }) {
  function handleUpload(type, file) {
    setFilesA((prev) => ({
      ...prev,
      [type]: file,
    }));
  }

  return (
    <div className="card">
      <h2>Step 2: Party A Upload</h2>

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

export default Step2PartyA;