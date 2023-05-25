import hre, { ethers } from "hardhat";
import { networks } from "../networks";
const courierRequestConfig = require("../Functions-courier-config.js");

const networkName = hre.network.name as keyof typeof networks;

async function main() {
  const network = networks[networkName];
  const FunctionsConsumer = await ethers.getContractFactory(
    "FunctionsConsumer"
  );
  const functionsConsumer = await FunctionsConsumer.deploy(
    network.functionsOracleProxy
  );
  courierRequestConfig.DONPublicKey = network.functionsPublicKey;

  await functionsConsumer.deployed();

  console.log(`FunctionsConsumer deployed to ${functionsConsumer.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
