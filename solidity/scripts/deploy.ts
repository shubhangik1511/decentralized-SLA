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

  const slaContractTransaction = await (
    await manager.createSLAContract(
      "Sample Contract 1",
      30,
      0.001 * 10 ** 18,
      0.0001 * 10 ** 18,
      [
        "https://www.githubstatus.com/api/v2/status.json",
        "GET",
        "status.description",
        "All Systems Operational",
      ],
      ["0xBb1dB45f58135135B9f0525e4f15A5B1bbB7807d", "1", "cakesofttechhelp"],
      "https://gist.github.com/negative0/6163e95f6e6293f61930606fda437518"
    )
  ).wait();
  const slaContractAddress = slaContractTransaction.events?.find(
    (event) => event.event === "SLAContractCreated"
  )?.args?.[0];
  const sla = await ethers.getContractAt("SLA", slaContractAddress);
  // const sla = await ethers.getContractAt(
  //   "SLA",
  //   "0xF5aC6ecC797871940b104e9E1E8334c36C8C76eB"
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
