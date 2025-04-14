const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateValidation", function () {
  let contract, admin, ngo, verifier;

  beforeEach(async function () {
    [admin, ngo, verifier] = await ethers.getSigners();
    const CertificateValidation = await ethers.getContractFactory("CertificateValidation");
    contract = await CertificateValidation.deploy();
  });

  it("should allow admin to add users", async function () {
    await contract.addUser(ngo.address, 0); // 0 = NGO
    const user = await contract.users(ngo.address);
    expect(user.role).to.equal(0);
  });

  it("should allow NGO to store a certificate", async function () {
    await contract.addUser(ngo.address, 0);
    await contract.connect(ngo).storeCertificate("12345", "QmHash");
    const cert = await contract.certificates("12345");
    expect(cert.isValid).to.equal(true);
  });

  it("should verify a certificate", async function () {
    await contract.addUser(ngo.address, 0);
    await contract.connect(ngo).storeCertificate("12345", "QmHash");
    const cert = await contract.verifyCertificate("12345");
    expect(cert[0]).to.equal(true);
  });
});
