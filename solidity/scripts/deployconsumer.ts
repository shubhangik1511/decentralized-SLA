import hre, { ethers } from "hardhat";
import { networks } from "../networks";
const courierRequestConfig = require("../Functions-courier-config.js");
const {
  simulateRequest,
  buildRequest,
  getRequestConfig,
} = require("../FunctionsSandboxLibrary");
const { generateOffchainSecrets } = require("./utils/generateOffchainSecrets");
const { createGist } = require("./utils/github");

const networkName = hre.network.name as keyof typeof networks;
const network = networks[networkName];

const generateRequest = async (
  requestConfig: any,
  taskArgs?: { simulate: boolean }
) => {
  if (taskArgs?.simulate !== false) {
    console.log("Simulating Functions request locally...");

    if (
      !requestConfig.secrets ||
      Object.keys(requestConfig.secrets).length === 0
    ) {
      if (requestConfig.perNodeSecrets && requestConfig.perNodeSecrets[0]) {
        requestConfig.secrets = requestConfig.perNodeSecrets[0];
      }
    }

    const { success, resultLog } = await simulateRequest(requestConfig);
    console.log(`\n${resultLog}`);

    // If the simulated JavaScript source code contains an error, confirm the user still wants to continue
    // if (!success) {
    //   await utils.prompt(
    //     "There was an error when running the JavaScript source code for the request."
    //   );
    // }
  }

  const OracleFactory = await ethers.getContractFactory(
    "contracts/dev/functions/FunctionsOracle.sol:FunctionsOracle"
  );
  const oracle = await OracleFactory.attach(network["functionsOracleProxy"]);
  const [nodeAddresses, perNodePublicKeys] =
    await oracle.getAllNodePublicKeys();
  const DONPublicKey = await oracle.getDONPublicKey();

  if (
    (requestConfig.secrets && Object.keys(requestConfig.secrets).length > 0) ||
    (requestConfig.perNodeSecrets &&
      Object.keys(requestConfig.perNodeSecrets).length > 0)
  ) {
    if (!requestConfig.secretsURLs || requestConfig.secretsURLs.length === 0) {
      // If their are secrets (or per-node secrets) and no secretsURLs are provided, create and upload an off-chain secrets Gist
      const offchainSecrets = await generateOffchainSecrets(
        requestConfig,
        process.env["PRIVATE_KEY"],
        DONPublicKey,
        nodeAddresses,
        perNodePublicKeys
      );

      if (
        !process.env["GITHUB_API_TOKEN"] ||
        process.env["GITHUB_API_TOKEN"] === ""
      ) {
        throw Error("GITHUB_API_TOKEN environment variable not set");
      }

      const secretsURL = await createGist(
        process.env["GITHUB_API_TOKEN"],
        offchainSecrets
      );
      console.log(`Successfully created encrypted secrets Gist: ${secretsURL}`);
      requestConfig.secretsURLs = [`${secretsURL}/raw`];
    } else {
      // Else, verify the provided off-chain secrets URLs are valid
      // await verifyOffchainSecrets(requestConfig.secretsURLs, nodeAddresses);
    }
  }

  // Remove the preceding 0x from the DON public key
  requestConfig.DONPublicKey = DONPublicKey.slice(2);
  // Build the parameters to make a request from the client contract
  const request = await buildRequest(requestConfig);
  request.secretsURLs = requestConfig.secretsURLs;
  return request;
};

async function main() {
  const FunctionsConsumer = await ethers.getContractFactory(
    "FunctionsConsumer"
  );
  const request = await generateRequest(courierRequestConfig);
  console.log(request);

  const functionsConsumer = await FunctionsConsumer.deploy(
    network.functionsOracleProxy,
    request.source,
    request.secrets ?? []
  );

  await functionsConsumer.deployed();

  console.log(`FunctionsConsumer deployed to ${functionsConsumer.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
