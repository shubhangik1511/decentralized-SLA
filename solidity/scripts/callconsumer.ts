import hre, { ethers } from "hardhat";
import { networks } from "../networks";
const buildRequest = require("../FunctionsSandboxLibrary/buildRequest.js");
const courierRequestConfig = require("../Functions-courier-config.js");

const networkName = hre.network.name as keyof typeof networks;

async function main() {
  const network = networks[networkName];
  const FunctionsConsumer = await ethers.getContractFactory(
    "FunctionsConsumer"
  );
  const functionsConsumer = await FunctionsConsumer.attach(
    "0x928ad79dB71124dFdefB39B037fa72D4BC013a16"
  );
  const request = await buildRequest.buildRequest(courierRequestConfig);

  console.log("request", JSON.stringify(request, null, 2));

  const transactionEstimateGas =
    await functionsConsumer.estimateGas.executeRequest(
      request.source,
      request.secrets ?? [],
      request.args ?? [],
      1114,
      100_000,
      {
        gasLimit: 1_500_000,
        gasPrice: network.gasPrice,
      }
    );
  console.log("transactionEstimateGas", transactionEstimateGas.toString());
  const requestTx = await functionsConsumer.executeRequest(
    request.source,
    request.secrets ?? [],
    request.args ?? [],
    1114,
    100_000,
    {
      gasLimit: 1_500_000,
      gasPrice: network.gasPrice,
    }
  );
  const receipt = await requestTx.wait(2);
  console.log("receipt", JSON.stringify(receipt, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
