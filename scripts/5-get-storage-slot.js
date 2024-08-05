require("dotenv").config();
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_API_URL
);

const deployedContract = process.env.CONTRACT_ADDRESS;

async function getStorageSlot() {
  const storage = await provider.getStorageAt(deployedContract, 0);
  console.log("Storage value at slot0:", storage);

  const addr = "0x6104ec3DA96B72e7E4720a687D1505F53BF72454";
  const slot = 1;
  const keySlot = ethers.utils.defaultAbiCoder.encode(
    ["address", "uint256"],
    [addr, slot]
  );
  console.log("- Key slot:", keySlot);

  const mappingSlot = ethers.utils.keccak256(keySlot);
  console.log("- Mapping slot:", mappingSlot);

  const storageValue = await provider.getStorageAt(
    deployedContract,
    mappingSlot
  );
  console.log("- Storage value at computed slot:", storageValue);
}

getStorageSlot();
