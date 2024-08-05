require("dotenv").config();
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_API_URL
);

// Do not share your private key 🤫
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;

async function readTotalSupply() {
  const totalSupplySelector = ethers.utils.id("totalSupply()").slice(0, 10);
  const data = totalSupplySelector;
  const result = await provider.call({
    to: contractAddress,
    data: data,
  });
  console.log("Total Supply:", ethers.BigNumber.from(result).toString());
}

readTotalSupply();

async function readBalance(address) {
  const balanceOfSelector = ethers.utils.id("balanceOf(address)").slice(0, 10);
  const data =
    balanceOfSelector +
    ethers.utils.defaultAbiCoder.encode(["address"], [address]).slice(2);
  const result = await provider.call({
    to: contractAddress,
    data: data,
  });
  console.log(
    "Balance of",
    address,
    ":",
    ethers.BigNumber.from(result).toString()
  );
}

readBalance(wallet.address);

async function transfer(to, amount) {
  const transferSelector = ethers.utils
    .id("transfer(address,uint256)")
    .slice(0, 10);
  const data =
    transferSelector +
    ethers.utils.defaultAbiCoder
      .encode(["address", "uint256"], [to, amount])
      .slice(2);
  const nonce = await wallet.getTransactionCount();
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await provider.estimateGas({
    to: contractAddress,
    data: data,
    from: wallet.address,
  });

  const tx = {
    to: contractAddress,
    data: data,
    nonce: nonce,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
  };

  const signedTx = await wallet.signTransaction(tx);
  const txResponse = await provider.sendTransaction(signedTx);
  console.log("Transfer Transaction Hash:", txResponse.hash);

  await txResponse.wait();
  console.log("Transfer confirmed");
}

transfer(wallet.address, ethers.utils.parseUnits("10", 18));
