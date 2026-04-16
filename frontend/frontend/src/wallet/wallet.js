import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

const peraWallet = new PeraWalletConnect();

// GLOBAL ACCOUNT
let accountAddress = null;

const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

// 🚫 NO AUTO RECONNECT (REMOVED)

// 🔌 CONNECT WALLET
export async function connectWallet() {
  try {
    const accounts = await peraWallet.connect();

    accountAddress = accounts[0];
    window.accountAddress = accountAddress;

    console.log("Connected account:", accountAddress);

    return accountAddress;
  } catch (error) {
    console.error("Wallet connection failed:", error);
    throw error;
  }
}

// 🔌 DISCONNECT WALLET
export async function disconnectWallet() {
  await peraWallet.disconnect();

  accountAddress = null;
  window.accountAddress = null;

  console.log("Wallet disconnected");
}

// 🚀 SEND TRANSACTION (FIXED)
export async function sendTransaction(data) {
  try {
    if (!accountAddress) {
      await connectWallet();
    }

    console.log("USING ACCOUNT:", accountAddress);

    const params = await algodClient.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: accountAddress,
      receiver: accountAddress,
      amount: 1000,
      note: new TextEncoder().encode(JSON.stringify(data)),
      suggestedParams: params,
    });

    const txnGroup = [
      {
        txn,
        signers: [accountAddress],
      },
    ];

    const signedTxn = await peraWallet.signTransaction([txnGroup]);

    const response = await algodClient.sendRawTransaction(signedTxn).do();

    console.log("FULL RESPONSE:", response);

    // ✅ FIXED TX ID EXTRACTION
    let txId =
      response?.txId ||
      response?.txid ||
      response?.txn?.txId ||
      response;

    if (!txId) {
      console.log("DEBUG RESPONSE:", response);
      throw new Error("Transaction sent but txId missing");
    }

    // ✅ WAIT FOR CONFIRMATION
    await algosdk.waitForConfirmation(algodClient, txId, 4);

    // 💾 STORE LOCAL
    const oldTx =
      JSON.parse(localStorage.getItem("transactions")) || [];

    const newTx = {
      txId,
      data,
      time: new Date().toISOString(),
    };

    localStorage.setItem(
      "transactions",
      JSON.stringify([newTx, ...oldTx])
    );

    return txId;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}