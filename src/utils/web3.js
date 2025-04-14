import { ethers } from "ethers";
import contractABI from "../contracts/CertificateValidation.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
console.log(contractAddress);
export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI.abi, signer);
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
};
