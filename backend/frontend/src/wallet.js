import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

const peraWallet = new PeraWalletConnect();

let accountAddress = null;

const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

// CONNECT WALLET (SAFE VERSION)
export async function connectWallet() {
  try {
    if (accountAddress) return accountAddress;

    const accounts = await peraWallet.connect();
    accountAddress = accounts[0];

    return accountAddress;
  } catch (error) {
    console.log("Wallet already connected");
    return accountAddress;
  }
}

// SEND TRANSACTION
export async function sendTransaction(data) {
  if (!accountAddress) {
    throw new Error("Wallet not connected");
  }

  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: accountAddress,
    to: accountAddress,
    amount: 1000,
    note: new TextEncoder().encode(JSON.stringify(data)),
    suggestedParams: params,
  });

  const signedTxn = await peraWallet.signTransaction([txn]);
  const tx = await algodClient.sendRawTransaction(signedTxn).do();

  return tx.txId;
}