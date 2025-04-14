const hre = require("hardhat");

async function main() {
  const CertificateValidation = await hre.ethers.getContractFactory("CertificateValidation");
  const contract = await CertificateValidation.deploy();
  await contract.waitForDeployment();
  console.log(`Contract deployed at: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
