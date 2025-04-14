import { BrowserProvider } from "ethers";

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected! Please install MetaMask.");
    return null;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
}

export default connectWallet;
