const path = require("path");
const uploadToIPFS = require("../utils/uploadToIPFS.cjs");
const hre = require("hardhat");

async function main() {
  const contractAddress = "0x10E28eee751F3FeeD8b63b1efE522dC9C9F75DeC"; // Replace with deployed contract address

  // ✅ Correct way to define the file path
  const filePath = path.resolve(__dirname, "../certificates/Screenshot.png"); // Update this

  console.log(`Uploading file: ${filePath}`); // Debugging output

  const ipfsHash = await uploadToIPFS(filePath);
  if (!ipfsHash) {
    console.log("IPFS upload failed!");
    return;
  }

  const CertificateValidation = await hre.ethers.getContractFactory("CertificateValidation");
  const contract = await CertificateValidation.attach(contractAddress);
  const [ngo] = await hre.ethers.getSigners();

  await contract.connect(ngo).storeCertificate("CERT123", ipfsHash);
  console.log(`Certificate stored on IPFS: ${ipfsHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
