import React from "react";

function Step3PartyB({ docTypes = [], setFilesB, next, notify }) {

  const handleFileChange = (doc, file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "text/plain"
    ];

    if (!allowedTypes.includes(file.type)) {
      notify?.("Use TXT (recommended), JPG, PNG or PDF.", "warning");
      return;
    }

    if (file.type === "application/pdf") {
      notify?.("PDF uploaded. TXT format is recommended.", "info");
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

      {docTypes.map((doc, i) => (
        <div key={i} className="upload-card">
          <p><strong>📄 {doc}</strong></p>
          <input
            className="file-input"
            type="file"
            onChange={(e) => handleFileChange(doc, e.target.files[0])}
          />
        </div>
      ))}

      <button className="button button-primary" onClick={next}>
        Continue to Validation
      </button>
    </div>
  );
}

export default Step3PartyB;