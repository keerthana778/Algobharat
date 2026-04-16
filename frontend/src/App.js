import React, { useState } from "react";
import "./App.css";
import logo from "./assets/logo.jpeg";

import Step0Suggest from "./steps/Step0Suggest";
import Step1Docs from "./steps/Step1Docs";
import Step2PartyA from "./steps/Step2PartyA";
import Step3PartyB from "./steps/Step3PartyB";
import Step4Review from "./steps/Step4Review";
import Step5AI from "./steps/Step5AI";
import Step6Blockchain from "./steps/Step6Blockchain";
import TransactionList from "./TransactionList";

function App() {
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState("dashboard");

  const [docTypes, setDocTypes] = useState([]);
  const [filesA, setFilesA] = useState({});
  const [filesB, setFilesB] = useState({});
  const [reviewResult, setReviewResult] = useState([]);

  const totalSteps = 7;

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  };

  const next = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const openCreateFlow = () => {
    setDocTypes([]);
    setFilesA({});
    setFilesB({});
    setReviewResult([]);
    setStep(0);
    setView("create");
    showToast("Create transaction flow started from Step 0.", "info");
  };

  const steps = [
    "Suggest",
    "Docs",
    "Party A",
    "Party B",
    "Review",
    "AI",
    "Blockchain",
  ];

  return (
    <div className="app-shell">
      <div className="background-glow" />
      <div className="app-container">

        {/* ✅ CENTERED LOGO */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <img src={logo} alt="AgreeBlock Logo" style={{ height: 120 }} />
        </div>

        {/* ✅ CENTERED TITLE */}
        <h1 className="app-title" style={{ textAlign: "center" }}>
          AgreeBlock
        </h1>

        {/* ✅ CENTERED SUBTITLE */}
        <p className="app-subtitle" style={{ textAlign: "center" }}>
          Secure, tamper-proof agreement AI verification using blockchain.
        </p>

        {view === "dashboard" && (
          <div className="panel dashboard-grid">
            <button className="dashboard-card" onClick={() => setView("history")}>
              <h3>📜 Transaction History</h3>
              <p>View all blockchain transactions saved by this app.</p>
            </button>
            <button className="dashboard-card" onClick={openCreateFlow}>
              <h3>🚀 Create / Make a Transaction</h3>
              <p>Start agreement creation flow from Step 0 suggestions.</p>
            </button>
          </div>
        )}

        {view === "history" && (
          <div className="panel">
            <div className="row wrap">
              <button className="button button-secondary" onClick={() => setView("dashboard")}>
                ← Back to Dashboard
              </button>
            </div>
            <TransactionList />
          </div>
        )}

        {view === "create" && (
          <>
            <div className="row wrap top-nav-row">
              <button className="button button-secondary" onClick={() => setView("dashboard")}>
                ← Back to Dashboard
              </button>
            </div>

            <div className="stepper">
              {steps.map((label, index) => (
                <div
                  key={label}
                  className={`step-item ${index === step ? "active" : ""} ${
                    index < step ? "complete" : ""
                  }`}
                >
                  <div className="step-bullet">{index}</div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="panel">
              {step === 0 && (
                <Step0Suggest
                  next={next}
                  setDocTypes={setDocTypes}
                  notify={showToast}
                />
              )}

              {step === 1 && (
                <Step1Docs
                  next={next}
                  docTypes={docTypes}
                  setDocTypes={setDocTypes}
                  notify={showToast}
                />
              )}

              {step === 2 && (
                <Step2PartyA
                  docTypes={docTypes}
                  setFilesA={setFilesA}
                  next={next}
                  notify={showToast}
                />
              )}

              {step === 3 && (
                <Step3PartyB
                  docTypes={docTypes}
                  setFilesB={setFilesB}
                  next={next}
                  notify={showToast}
                />
              )}

              {step === 4 && (
                <Step4Review
                  docTypes={docTypes}
                  filesA={filesA}
                  filesB={filesB}
                  setReviewResult={setReviewResult}
                  next={next}
                  notify={showToast}
                />
              )}

              {step === 5 && (
                <Step5AI
                  reviewResult={reviewResult}
                  next={next}
                  notify={showToast}
                />
              )}

              {step === 6 && (
                <Step6Blockchain filesA={filesA} filesB={filesB} notify={showToast} />
              )}
            </div>
          </>
        )}
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

export default App;