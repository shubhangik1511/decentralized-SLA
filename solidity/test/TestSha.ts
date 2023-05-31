import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import crypto from "crypto";

function generateEncryptedString(data: string) {
  // crypto module

  const algorithm = "aes-256-cbc";

  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16);

  // secret key generate 32 bytes of random data
  const Securitykey = crypto.randomBytes(32);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(data, "utf-8", "hex");

  encryptedData += cipher.final("hex");
  console.log("Encrypted message: " + encryptedData);
  return encryptedData;
}

// Function to generate hash using nodejs crypto
// Reference: https://stackoverflow.com/a/67824801/12027569
function generateHash(data: string) {
  return crypto.createHash("sha256").update(data).digest("base64");
}

describe("Test SHA", function () {
  async function deployManagerContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, providerAccount, consumerAccount] = await ethers.getSigners();

    const ManagerContract = await ethers.getContractFactory("TestSHA");
    const manager = await ManagerContract.deploy();

    return { manager, owner, providerAccount, consumerAccount };
  }

  describe("Deploy", function () {
    it("Should deploy manager contract", async function () {
      const { manager, providerAccount, consumerAccount } = await loadFixture(
        deployManagerContract
      );
      await manager.deployed();
      const solHash = await manager.getHash(
        "52c79bef7fb7001ea7145820a5a5d3ae4d093cd6f5c2de35f5b0df91f813219966bcfdf7d49e5e97f08a1e8c28374a808bf9406ab9eb041720f7ae6346078905"
      );
      const nodeHash = generateHash(
        "52c79bef7fb7001ea7145820a5a5d3ae4d093cd6f5c2de35f5b0df91f813219966bcfdf7d49e5e97f08a1e8c28374a808bf9406ab9eb041720f7ae6346078905"
      );
      expect(solHash).to.equal(nodeHash);
    });
  });
});
