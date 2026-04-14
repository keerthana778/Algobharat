import React from "react";

function Step2PartyA({ docTypes = [], setFilesA, next }) {

  const handleFileChange = (doc, file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("❌ Only JPG, PNG, or PDF files are allowed");
      return;
    }

    setFilesA((prev) => ({
      ...prev,
      [doc]: file
    }));
  };

  return (
    <div>
      <h2>Step 2: Party A Upload</h2>

      {docTypes.length === 0 ? (
        <p>No documents selected</p>
      ) : (
        docTypes.map((doc, i) => (
          <div key={i}>
            <p>{doc}</p>
            <input
              type="file"
              onChange={(e) =>
                handleFileChange(doc, e.target.files[0])
              }
            />
          </div>
        ))
      )}

      <br />
      <button onClick={next}>Next</button>
    </div>
  );
}

export default Step2PartyA;