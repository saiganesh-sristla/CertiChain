import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({
  pinataApiKey: import.meta.env.VITE_PINATA_API_KEY,
  pinataSecretApiKey: import.meta.env.VITE_PINATA_SECRET_KEY
});

export const uploadToIPFS = async (file, name) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file);
    
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        "pinata_api_key": import.meta.env.VITE_PINATA_API_KEY,
        "pinata_secret_api_key": import.meta.env.VITE_PINATA_SECRET_KEY,
      },
      body: formData, // ✅ Corrected: Using formData instead of file
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const result = await response.json();
    const hash = result.IpfsHash;
    console.log(hash)
const response2 = await fetch("http://localhost:5000/certificate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // Ensure the server knows it's receiving JSON
  },
  body: JSON.stringify({ "hash": hash, "name": name }), // Convert object to JSON string
});
const result2 = await response2.json();
if(!result2.certificate.hash){
  return null
}
    console.log("IPFS Upload Success:", result);
    return result.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return null;
  }
};
