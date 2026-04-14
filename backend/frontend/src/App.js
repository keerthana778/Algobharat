import React, { useState } from "react";
import "./App.css";

import Step1Docs from "./steps/Step1Docs";
import Step2PartyA from "./steps/Step2PartyA";
import Step3PartyB from "./steps/Step3PartyB";
import Step4Review from "./steps/Step4Review";
import Step5AI from "./steps/Step5AI";
import Step6Blockchain from "./steps/Step6Blockchain";

import TransactionList from "./TransactionList";

function App() {
  const [step, setStep] = useState(1);

  const [docTypes, setDocTypes] = useState([]);
  const [filesA, setFilesA] = useState({});
  const [filesB, setFilesB] = useState({});

  return (
    <div className="App">
      <h1>📄 Loan Agreement System</h1>

      {/* STEP 1 */}
      {step === 1 && (
        <Step1Docs
          next={() => setStep(2)}
          setDocTypes={setDocTypes}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Step2PartyA
          docTypes={docTypes}
          next={() => setStep(3)}
          setFilesA={setFilesA}
        />
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <Step3PartyB
          docTypes={docTypes}
          next={() => setStep(4)}
          setFilesB={setFilesB}
        />
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <Step4Review
          docTypes={docTypes}
          next={() => setStep(5)}
        />
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <Step5AI
          filesA={filesA}
          filesB={filesB}
          next={() => setStep(6)}
        />
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <Step6Blockchain
          filesA={filesA}
          filesB={filesB}
        />
      )}

      {/* 🔥 TRANSACTION HISTORY (VISIBLE ALWAYS BELOW) */}
      <TransactionList />
    </div>
  );
}

export default App;