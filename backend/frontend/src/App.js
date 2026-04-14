import React, { useState } from "react";

import Step0Suggest from "./steps/Step0Suggest";
import Step1Docs from "./steps/Step1Docs";
import Step2PartyA from "./steps/Step2PartyA";
import Step3PartyB from "./steps/Step3PartyB";
import Step4Review from "./steps/Step4Review";
import Step5AI from "./steps/Step5AI";
import Step6Blockchain from "./steps/Step6Blockchain";

function App() {
  const [step, setStep] = useState(0);

  const [docTypes, setDocTypes] = useState([]);
  const [filesA, setFilesA] = useState({});
  const [filesB, setFilesB] = useState({});

  const next = () => setStep((prev) => prev + 1);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>🚀 AI + Blockchain Agreement System</h1>

      {/* STEP 0 */}
      {step === 0 && (
        <Step0Suggest
        next={next} 
        setDocTypes={setDocTypes}
        />
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <Step1Docs
          next={next}
          setDocTypes={setDocTypes}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Step2PartyA
          docTypes={docTypes || []}
          setFilesA={setFilesA}
          next={next}
        />
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <Step3PartyB
          docTypes={docTypes || []}
          setFilesB={setFilesB}
          next={next}
        />
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <Step4Review
          docTypes={docTypes || []}
          filesA={filesA || {}}
          filesB={filesB || {}}
          next={next}
        />
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <Step5AI
          docTypes={docTypes || []}
          filesA={filesA || {}}
          filesB={filesB || {}}
          next={next}
        />
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <Step6Blockchain
          filesA={filesA || {}}
          filesB={filesB || {}}
        />
      )}
    </div>
  );
}

export default App;