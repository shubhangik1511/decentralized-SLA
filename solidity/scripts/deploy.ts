import hre, { ethers } from "hardhat";
import { networks } from "../networks";

const networkName = hre.network.name as keyof typeof networks;
const network = networks[networkName];

async function main() {
  const ManagerContract = await ethers.getContractFactory("Manager");
  const manager = await ManagerContract.deploy(
    "0x5f9c675c58432f40947AA66f43Bc639322F8f20d",
    "<<functions_consumer_contract>>"
  );
  await manager.deployed();
  console.log(`Manager deployed to ${manager.address}`);

  const slaContractTransaction = await (
    await manager.createSLAContract("Test")
  ).wait();
  const slaContractAddress = slaContractTransaction.events?.find(
    (event) => event.event === "SLAContractCreated"
  )?.args?.[0];
  const sla = await ethers.getContractAt("SLA", slaContractAddress);
  console.log(`SLA deployed to ${sla.address}`);

  const result = await (
    await sla.inviteConsumer(
      "hello",
      ["bchaitanya15@gmail.com", "hello"],
      1114,
      300_000,
      {
        gasLimit: 1_500_000,
        gasPrice: network.gasPrice,
      }
    )
  ).wait(2);
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
