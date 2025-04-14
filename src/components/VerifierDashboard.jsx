import { useState, useRef } from "react";
import QrScanner from "qr-scanner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloudUpload, FileText } from "lucide-react";

const VerifierDashboard = () => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      const imageUrl = URL.createObjectURL(selectedFile);
      const result = await QrScanner.scanImage(imageUrl, { returnDetailedScanResult: true });
      
      if (!result || !result.data.includes("ipfs")) {
        toast.error("Invalid QR Code. No IPFS link found.(Fake)");
        setLoading(false);
        return;
      }

      const ipfsLink = result.data;
      const ipfsHash = ipfsLink.split("/").pop();
      
      if (!ipfsHash) {
        toast.error("Invalid IPFS link.");
        setLoading(false);
        return;
      }

      const response = await fetch(`https://certichain-e6kz.onrender.com/${ipfsHash}`);
      const data = await response.json();

      if (response.ok) {
        setCertificate(data);
        toast.success("Certificate is valid!");
      } else {
        setCertificate(null);
        toast.error("Invalid certificate! Not found in records.");
      }
    } catch (error) {
      toast.error("Error scanning QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setIsDragOver(false);
    handleFileUpload(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-6 pt-20">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Certificate Verification
        </h2>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center transition-all duration-300 ${
            isDragOver 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-blue-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            className="hidden" 
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <CloudUpload className="mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-500">
            {file 
              ? `Selected: ${file.name}` 
              : "Drag and Drop or Click to Upload QR Code"}
          </p>
        </div>
        
        {loading && (
          <div className="text-center mb-6">
            <p className="text-blue-500 animate-pulse">Scanning and verifying...</p>
          </div>
        )}

        {certificate && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg shadow-md mt-4 animate-fade-in">
            <div className="flex items-center mb-3">
              <FileText className="mr-3 text-green-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-700">Certificate Verified</h3>
            </div>
            <a 
              href={`https://ipfs.io/ipfs/${certificate.hash}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300 underline"
            >
              View Certificate on IPFS
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifierDashboard;