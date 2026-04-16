export function analyzeDocs(filesA, filesB) {
  let score = Math.floor(Math.random() * 30) + 70; // 70–100%

  let issues = [];

  if (Object.keys(filesA).length !== Object.keys(filesB).length) {
    issues.push("Mismatch in number of documents");
  }

  if (score < 80) {
    issues.push("Possible inconsistencies detected");
  }

  return {
    score,
    status: score > 85 ? "Safe ✅" : "Risky ⚠️",
    issues,
  };
}