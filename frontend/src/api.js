const BASE_URL = process.env.https://algobharat-1-2m3x.onrender.com;
REACT_APP_API_URL=https://algobharat-1-2m3x.onrender.com

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