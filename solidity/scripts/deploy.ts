import { ethers } from "hardhat";

async function main() {
  const ManagerContract = await ethers.getContractFactory("Manager");
  const manager = await ManagerContract.deploy({});
  await manager.deployed();

  console.log(`Manager deployed to ${manager.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
