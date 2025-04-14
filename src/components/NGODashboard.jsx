import React, { useState, useRef } from "react";
import { getContract } from "../utils/web3";
import { uploadToIPFS } from "../utils/uploadToIPFS";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { Download, CloudUpload } from "lucide-react";

const NGODashboard = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const qrCodeRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file.");
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
          case 'ipfs':
            setProgress(50);
            break;
          case 'blockchain':
            setProgress(75);
            break;
          case 'complete':
            setProgress(100);
            break;
        }
      };

      const contract = await getContract();
      updateProgress('contract');

      const hash = await uploadToIPFS(file, contract.runner.address);
      updateProgress('ipfs');
      
      if (!hash) {
        toast.error("IPFS upload failed!");
        return;
      }
  
      const tx = await contract.storeCertificate(file.name, hash)
      updateProgress('blockchain');
      await tx.wait();
      
      updateProgress('complete');
      setIpfsHash(hash);
  
      toast.success("Certificate stored on blockchain!");
    } catch (error) {
      toast.error("Upload failed!");
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setIsDragOver(false);
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

  const handleDownloadQR = () => {
    if (!qrCodeRef.current) return;

    // Convert SVG to PNG
    const svg = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert to PNG and download
      const pngDataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'certificate_qr_code.png';
      link.href = pngDataUrl;
      link.click();
    };

    // Convert SVG to base64
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-6 relative pt-30">
      {/* Main Content */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-105 duration-300 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Certificate Upload
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
            className="hidden" 
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <CloudUpload className="mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-500">
            {file 
              ? `Selected: ${file.name}` 
              : "Drag and Drop or Click to Upload"}
          </p>
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 text-white  rounded-lg hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 mb-6 disabled:opacity-50 disabled:scale-100"
        >
          Upload Certificate
        </button>

        {ipfsHash && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Certificate QR Code
            </h3>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                <QRCode 
                  ref={qrCodeRef}
                  value={`https://ipfs.io/ipfs/${ipfsHash}`} 
                />
              </div>
              <button 
                onClick={handleDownloadQR}
                className="flex items-center justify-center py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Download className="mr-2" size={20} />
                Download QR Code
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-96 shadow-2xl text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Uploading Certificate
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <p className="text-gray-600">
              {progress < 25 && "Preparing contract..."}
              {progress >= 25 && progress < 50 && "Uploading to IPFS..."}
              {progress >= 50 && progress < 75 && "Storing on blockchain..."}
              {progress >= 75 && "Finalizing..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODashboard;