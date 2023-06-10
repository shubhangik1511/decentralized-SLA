import hre, { ethers } from "hardhat";
import { networks } from "../networks";

const networkName = hre.network.name as keyof typeof networks;
const network = networks[networkName];

async function main() {
  const ManagerContract = await ethers.getContractFactory("Manager");
  const manager = await ManagerContract.deploy(
    0.001 * 10 ** 18,
    "0x00F03f79C6A13AE6A8168d36da73ecC19DfbB915",
    "0x3AA6d8d2151aC8dD8A40e605D051c2E01Aadd4d9",
    "0xA9dCE61f7a99f6A9ee2F517BF179470A5B5530DD",
    1527
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
