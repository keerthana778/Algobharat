import React from "react";

function Step3PartyB({ docTypes = [], setFilesB, next, notify }) {

  const handleFileChange = (doc, file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf"
    ];

    if (!allowedTypes.includes(file.type)) {
      notify?.("Only JPG, PNG, or PDF files are allowed.", "warning");
      return;
    }

    setFilesB((prev) => ({
      ...prev,
      [doc]: file
    }));
    notify?.(`Uploaded for Party B: ${doc}`, "success");
  };

  return (
    <div className="card">
      <h2 className="section-title">Step 3: 👥 Party B Upload</h2>
      <p className="section-help">Upload matching files from the second party.</p>

      {docTypes.length === 0 ? (
        <p className="status-bad">No documents selected.</p>
      ) : (
        docTypes.map((doc, i) => (
          <div key={i} className="upload-card">
            <p><strong>📄 {doc}</strong></p>
            <input
              className="file-input"
              type="file"
              onChange={(e) =>
                handleFileChange(doc, e.target.files[0])
              }
            />
          </div>
        ))
      )}

      <button className="button button-primary" onClick={next}>
        Continue to Validation
      </button>
    </div>
  );
}

export default Step3PartyB;