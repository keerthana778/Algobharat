const BASE_URL = "http://127.0.0.1:8000";

export async function suggestDocs(purpose) {
  const formData = new FormData();
  formData.append("purpose", purpose);

  const res = await fetch(`${BASE_URL}/ai/suggest`, {
    method: "POST",
    body: formData
  });

  return res.json();
}

export async function analyzeFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    body: formData
  });

  return res.json();
}