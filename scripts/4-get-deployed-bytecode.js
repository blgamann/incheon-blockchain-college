require("dotenv").config();
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_API_URL
);

async function getDeployedBytecode() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const deployedBytecode = await provider.getCode(contractAddress);

  console.log("Deployed Bytecode:", deployedBytecode);

  if (deployedBytecode === "0x") {
    console.log(
      "Warning: No code found at this address. The contract might not be deployed or might have been self-destructed."
    );
  }
}

getDeployedBytecode();
