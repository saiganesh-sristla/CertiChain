import React, { useState } from "react";
import { getContract } from "../utils/web3"
import { toast } from "react-toastify";
import { UserPlus, CheckCircle } from "lucide-react";

const AdminPanel = () => {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("ngo");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addUser = async () => {
    if (!address) {
      toast.error("Please enter a wallet address!");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      // Simulate progress stages
      const updateProgress = (stage) => {
        switch(stage) {
          case 'contract':
            setProgress(25);
            break;
          case 'blockchain':
            setProgress(50);
            break;
          case 'backend':
            setProgress(75);
            break;
          case 'complete':
            setProgress(100);
            break;
        }
      };

      const contract = await getContract();
      updateProgress('contract');
      if (!contract) return;
  
      const roleValue = role === "ngo" ? 0 : 1;
  
      const tx = await contract.addUser(address, roleValue);
      updateProgress('blockchain');
      await tx.wait();

      const response = await fetch("https://certichain-e6kz.onrender.com/addAuthority", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "name": address }),
      });
      updateProgress('backend');

      const result = await response.json();
      if(result.name){
        updateProgress('complete');
        toast.success("User added successfully!");
        setAddress(""); // Clear input after successful addition
      }
      else{
        toast.error("Not able to add Authority");
      }
    } catch (error) {
      toast.error("Transaction failed!");
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-6 relative pt-30">
      {/* Main Content */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-105 duration-300 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Admin Control Panel
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">User Role</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setRole("ngo")}
              className={`py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                role === "ngo" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              NGO
            </button>
            
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Wallet Address</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Wallet Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            {address && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={24} />}
          </div>
        </div>
        
        <button 
          onClick={addUser}
          disabled={!address || loading}
          className="w-full py-3 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? (
            <span className="animate-pulse">Adding User...</span>
          ) : (
            <>
              <UserPlus className="mr-2" size={20} />
              Add User
            </>
          )}
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-96 shadow-2xl text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Adding User</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <p className="text-gray-600">
              {progress < 25 && "Preparing contract..."}
              {progress >= 25 && progress < 50 && "Interacting with blockchain..."}
              {progress >= 50 && progress < 75 && "Updating backend..."}
              {progress >= 75 && "Finalizing..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;