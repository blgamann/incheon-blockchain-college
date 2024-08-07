require("dotenv").config();
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  "wss://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY
);

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC Contract
const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];
const contract = new ethers.Contract(USDC, abi, provider);

async function getTransfer() {
  contract.on("Transfer", (from, to, value, event) => {
    let transferEvent = {
      from: from,
      to: to,
      value: value,
      eventData: event,
    };

    console.log(JSON.stringify(transferEvent, null, 4));
  });
}

getTransfer();
