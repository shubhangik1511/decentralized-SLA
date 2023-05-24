import hre, { ethers } from "hardhat";
import { networks } from "../networks";
const {
  getRequestConfig,
} = require("../FunctionsSandboxLibrary/getRequestConfig.js");
const buildRequestA = require("../FunctionsSandboxLibrary/buildRequest.js");
const courierRequestConfig = require("../Functions-courier-config.js");
// console.log("courierRequestConfig", courierRequestConfig);

const networkName = hre.network.name as keyof typeof networks;

// const courierJsCode = fs
//   .readFileSync(`${__dirname}/../Functions-courier.js`)
//   .toString();

async function main() {
  // const ManagerContract = await ethers.getContractFactory("Manager");
  // const manager = await ManagerContract.attach(
  //   "0x128A4a3D16D1ebC55CC7649c54Ac492742a1ea3B"
  // );
  // const slaContractTransaction = await (
  //   await manager.createSLAContract("Test")
  // ).wait();
  // const slaContractAddress = slaContractTransaction.events?.find(
  //   (event) => event.event === "SLAContractCreated"
  // )?.args?.[0];
  // console.log("slaContractAddress", slaContractAddress);
  // const SLAContract = await ethers.getContractFactory("SLA");

  // console.log("Request Config", requestConfig);

  // const sla = await SLAContract.attach(
  //   "0x8bF2d50374D4f6389783cA4e031442C5b4E624E8"
  // );
  // // const sla = await SLAContract.deploy(
  // //   "Hello",
  // //   "0x5f9c675c58432f40947AA66f43Bc639322F8f20d",
  // //   network.functionsOracleProxy
  // // );
  // // await sla.deployed();
  // console.log(`SLA deployed to ${sla.address}`);

  // // await manager.setChainLinkStuff(
  // //   requestConfig.source,
  // //   `0x${Buffer.from(requestConfig.secretsURLs).toString("hex")}`
  // // );
  // // console.log(
  // //   await sla.provider.getCode("0x56692E1d041De13a7C9542e890519eaC0cc94d18")
  // // );
  // const requestId = await (
  //   await sla.sendEmail(
  //     requestConfig.source,
  //     `0x${Buffer.from(requestConfig.secretsURLs).toString("hex")}`,
  //     requestConfig.args ?? [],
  //     1114,
  //     300_0000
  //   )
  // ).wait(2);
  // console.log("requestId", JSON.stringify(requestId, null, 2));

  const network = networks[networkName];
  // const requestConfig = getRequestConfig(courierRequestConfig);

  const FunctionsConsumer = await ethers.getContractFactory(
    "FunctionsConsumer"
  );
  const functionsConsumer = await FunctionsConsumer.deploy(
    network.functionsOracleProxy
  );
  courierRequestConfig.DONPublicKey = network.functionsPublicKey;

  const request = await buildRequestA.buildRequest(courierRequestConfig);
  // request.secretsURLs = requestConfig.secretsURLs;

  // console.log("request", JSON.stringify(request, null, 2));

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
