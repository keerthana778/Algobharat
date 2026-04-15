import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

const peraWallet = new PeraWalletConnect();

// 🔥 GLOBAL ACCOUNT (IMPORTANT)
let accountAddress = null;

const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

// 🔁 Restore session
peraWallet.reconnectSession().then((accounts) => {
  if (accounts.length) {
    accountAddress = accounts[0];
    window.accountAddress = accountAddress;
    console.log("Reconnected:", accountAddress);
  }
});

// 🔗 CONNECT WALLET
export async function connectWallet() {
  try {
    if (accountAddress) return accountAddress;

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

// 🚀 SEND TRANSACTION (FINAL FIXED)
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
      amount: 1000, // small test amount
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

    // 🔥 HANDLE ALL CASES
    let txId = null;

    if (typeof response === "string") {
      txId = response;
    } else if (response.txId) {
      txId = response.txId;
    } else if (response.txid) {
      txId = response.txid;
    }

    if (!txId) {
      throw new Error("Transaction sent but txId missing (check console)");
    }

    // 💾 STORE LOCALLY
    const oldTx = JSON.parse(localStorage.getItem("transactions")) || [];

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