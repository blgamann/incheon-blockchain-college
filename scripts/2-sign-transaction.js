require("dotenv").config();
const ethers = require("ethers");

const privateKey = process.env.PRIVATE_KEY;

const transaction = {
  to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  value: ethers.utils.parseEther("0.1"), // 0.1 ETH
  gasLimit: 21000,
  gasPrice: ethers.utils.parseUnits("20", "gwei"),
  nonce: 0,
};

async function signTransaction() {
  const wallet = new ethers.Wallet(privateKey);

  try {
    const signedTx = await wallet.signTransaction(transaction);
    console.log("Signed transaction:", signedTx);

    const parsedTx = ethers.utils.parseTransaction(signedTx);
    console.log("Parsed transaction:", parsedTx);

    console.log("v:", parsedTx.v);
    console.log("r:", parsedTx.r);
    console.log("s:", parsedTx.s);
  } catch (error) {
    console.error("error: ", error);
  }
}

signTransaction();
