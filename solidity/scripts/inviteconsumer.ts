import hre, { ethers } from "hardhat";
import { networks } from "../networks";

const networkName = hre.network.name as keyof typeof networks;
const network = networks[networkName];

async function main() {
  const sla = await ethers.getContractAt("SLA", "<<sla_address>>");

  const result = await (
    await sla.inviteConsumer(
      "hello",
      [
        "<<email>>",
        `http://localhost:3000/decentralized-SLA/accept-invite?sla=${sla.address}`,
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
