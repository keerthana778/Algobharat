export async function getTransaction(txId) {
  const url = `https://testnet-api.algonode.cloud/v2/transactions/${txId}`;

  for (let i = 0; i < 10; i++) {
    const res = await fetch(url);
    const data = await res.json();

    if (data.transaction && data.transaction.note) {
      const note = atob(data.transaction.note);
      return JSON.parse(note);
    }

    await new Promise((res) => setTimeout(res, 2000));
  }

  throw new Error("Transaction not confirmed after waiting");
}