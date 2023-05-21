import { ethers } from "hardhat";

async function main() {
  const ManagerContract = await ethers.getContractFactory("Manager");
  const manager = await ManagerContract.deploy(
    "0x5f9c675c58432f40947AA66f43Bc639322F8f20d"
  );
  await manager.deployed();

  console.log(`Manager deployed to ${manager.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
