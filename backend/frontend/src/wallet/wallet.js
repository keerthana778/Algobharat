import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

const peraWallet = new PeraWalletConnect();
let accountAddress = null;

const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

// Restore session
peraWallet.reconnectSession().then((accounts) => {
  if (accounts.length) {
    accountAddress = accounts[0];
    console.log("Reconnected:", accountAddress);
  }
});

export async function connectWallet() {
  try {
    if (accountAddress) return accountAddress;

    const accounts = await peraWallet.connect();
    accountAddress = accounts[0];

    console.log("Connected:", accountAddress);

    return accountAddress;
  } catch (error) {
    console.error("Wallet connection failed:", error);
    throw error;
  }
}

export async function sendTransaction(data) {
  try {
    if (!accountAddress) {
      await connectWallet();
    }

    console.log("🔥 USING ACCOUNT:", accountAddress);

    const params = await algodClient.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: accountAddress,
      receiver: accountAddress,
      amount: 1000, // small amount (0.001 ALGO)
      note: new TextEncoder().encode(JSON.stringify(data)),
      suggestedParams: params,
    });

    const txnGroup = [
      {
        txn: txn,
        signers: [accountAddress],
      },
    ];

    // ✅ FIXED SIGNING
    const signedTxn = await peraWallet.signTransaction([txnGroup]);

    const rawTxn = signedTxn[0]; // 🔥 VERY IMPORTANT FIX

    const response = await algodClient.sendRawTransaction(rawTxn).do();

    const txId = response.txId || response.txid;

    console.log("✅ TX SUCCESS:", txId);

    return txId;

  } catch (error) {
    console.error("❌ Transaction failed:", error);
    alert("Transaction failed: " + error.message);
    throw error;
  }
}