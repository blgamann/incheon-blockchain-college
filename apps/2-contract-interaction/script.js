let provider, signer, contract;
const contractABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
];

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      document.getElementById(
        "accountInfo"
      ).textContent = `Connected: ${address}`;
    } catch (error) {
      console.error("Connection error:", error);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

function setContract() {
  const address = document.getElementById("contractAddress").value;
  contract = new ethers.Contract(address, contractABI, signer);
  alert("Contract set");
}

async function getBalance() {
  if (!contract) return alert("Please set contract first");
  const address = document.getElementById("addressInput").value;
  try {
    const balance = await contract.balanceOf(address);
    document.getElementById(
      "result"
    ).textContent = `Balance: ${balance.toString()}`;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("result").textContent = "Error getting balance";
  }
}

async function transfer() {
  if (!contract) return alert("Please set contract first");
  const recipient = document.getElementById("recipientInput").value;
  const amount = document.getElementById("amountInput").value;
  try {
    const tx = await contract.transfer(recipient, amount);
    document.getElementById(
      "result"
    ).textContent = `Transaction sent: ${tx.hash}`;

    // Listen for the transaction to be mined
    provider.once(tx.hash, (transactionReceipt) => {
      if (transactionReceipt.status === 1) {
        document.getElementById(
          "result"
        ).textContent = `Transaction mined! Block number: ${transactionReceipt.blockNumber}`;
      } else {
        document.getElementById("result").textContent = `Transaction failed!`;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("result").textContent = "Error transferring tokens";
  }
}

document
  .getElementById("connectButton")
  .addEventListener("click", connectWallet);
document
  .getElementById("setContractButton")
  .addEventListener("click", setContract);
document
  .getElementById("getBalanceButton")
  .addEventListener("click", getBalance);
document.getElementById("transferButton").addEventListener("click", transfer);
