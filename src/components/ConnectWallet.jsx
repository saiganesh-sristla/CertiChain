import { useState } from "react";
import connectWallet from "../utils/connectWallet";


function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnect = async () => {
    const address = await connectWallet();
    if (address) {
      setWalletAddress(address);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Certificate Validation (Web3)</h1>
      {!walletAddress ? (
        <button
          onClick={handleConnect}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Connect MetaMask
        </button>
      ) : (
        <p className="text-green-600 font-semibold">
          Connected: {walletAddress}
        </p>
      )}
    </div>
  );
}

export default ConnectWallet;
