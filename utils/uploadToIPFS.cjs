const PinataClient = require("@pinata/sdk");
require("dotenv").config();

// ✅ Correct way to initialize Pinata SDK
const pinata = new PinataClient({ 
  pinataApiKey: process.env.PINATA_API_KEY, 
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY 
});

async function uploadToIPFS(filePath) {
  try {
    const result = await pinata.pinFromFS(filePath);
    return result.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return null;
  }
}

module.exports = uploadToIPFS;
