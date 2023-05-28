import hre, { ethers } from "hardhat";
import { networks } from "../networks";

const networkName = hre.network.name as keyof typeof networks;
const network = networks[networkName];

async function main() {
  const ManagerContract = await ethers.getContractFactory("Manager");
  const manager = await ManagerContract.deploy(
    "0x5c4B624675914A46a46d2098073266D6c4738927"
  );
  await manager.deployed();
  console.log(`Manager deployed to ${manager.address}`);

  const slaContractTransaction = await (
    await manager.createSLAContract("Test", 3 * 60)
  ).wait();
  const slaContractAddress = slaContractTransaction.events?.find(
    (event) => event.event === "SLAContractCreated"
  )?.args?.[0];
  const sla = await ethers.getContractAt("SLA", slaContractAddress);
  // const sla = await ethers.getContractAt(
  //   "SLA",
  //   "0x391b1e1D115b06bD23b3acbF4bA37e549D53D3e4"
  // );
  console.log(`SLA deployed to ${sla.address}`);

  const result = await (
    await sla.inviteConsumer(
      "hello",
      [
        "bchaitanya15@gmail.com",
        `http://localhost:3000/accept-invite?sla=${sla.address}`,
        new Date().getTime().toString(),
      ],
      1114,
      300_000,
      {
        gasLimit: 1_500_000,
        gasPrice: network.gasPrice,
      }
    )
  ).wait(2);
  console.log("result status", result.status);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
