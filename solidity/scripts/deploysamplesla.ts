import { ethers } from "hardhat";

async function main() {
  const manager = await ethers.getContractAt(
    "Manager",
    "0x0747Baa44d9Cca3BE9B8E42048F66B0715533BaF"
  );

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
      ["", "1", "cakesofttechhelp"],
      "https://gist.github.com/negative0/6163e95f6e6293f61930606fda437518"
    )
  ).wait();
  const slaContractAddress = slaContractTransaction.events?.find(
    (event) => event.event === "SLAContractCreated"
  )?.args?.[0];
  const sla = await ethers.getContractAt("SLA", slaContractAddress);

  console.log(`SLA deployed to ${sla.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
