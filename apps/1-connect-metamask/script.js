const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");

const statusElement = document.getElementById("status");
const networkInfoElement = document.getElementById("networkInfo");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      updateConnection(accounts[0]);
    } catch (error) {
      statusElement.textContent = "Failed to connect to MetaMask.";
    }
  } else {
    statusElement.textContent = "MetaMask is not installed.";
  }
}

async function updateConnection(account) {
  statusElement.textContent = account
    ? `Connected: ${account}`
    : "Disconnected";
  connectButton.style.display = account ? "none" : "inline-block";
  disconnectButton.style.display = account ? "inline-block" : "none";

  if (account) {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    networkInfoElement.textContent = `Network: ${
      chainId === "0x1"
        ? "Ethereum Mainnet"
        : chainId === "0xaa36a7"
        ? "Sepolia Testnet"
        : "Unknown"
    } (Chain ID: ${parseInt(chainId, 16)})`;
  } else {
    networkInfoElement.textContent = "";
  }
}

connectButton.addEventListener("click", connect);
disconnectButton.addEventListener("click", () => updateConnection(null));

if (typeof window.ethereum !== "undefined") {
  window.ethereum
    .request({ method: "eth_accounts" })
    .then((accounts) => updateConnection(accounts[0]))
    .catch(console.error);

  window.ethereum.on("accountsChanged", (accounts) =>
    updateConnection(accounts[0])
  );
  window.ethereum.on("chainChanged", () => window.location.reload());
}
