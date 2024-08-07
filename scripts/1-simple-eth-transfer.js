require("dotenv").config();
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY
);

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendTransaction() {
  const toAddress = "0x6104ec3DA96B72e7E4720a687D1505F53BF72454";
  const amountInEther = "0.01";

  const gasPrice = await provider.getGasPrice();
  const nonce = await provider.getTransactionCount(wallet.address);

  const tx = {
    to: toAddress,
    value: ethers.utils.parseEther(amountInEther),
    gasLimit: 21000, // 21,000 is the standard limit for a simple transfer
    gasPrice: gasPrice,
    nonce: nonce,
    data: "0x",
  };

  const signedTx = await wallet.signTransaction(tx);
  const txResponse = await provider.sendTransaction(signedTx);
  console.log("Transaction sent:", txResponse.hash);

  const receipt = await txResponse.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

sendTransaction();
