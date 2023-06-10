## Inspiration

In today's fast-paced digital landscape, it is very difficult for businesses to keep track of all SLA metrics for all the platforms that they subscribe to. It can be an absolutely mission-critical issue if one of the many service providers fails to provide what they had promised, resulting in losses of thousands of dollars and maybe even loss of lives.

With DSLA, businesses can set up customized SLAs and define performance metrics, such as response time, or uptime. The blockchain-based system ensures immutability and tamper-proof records, preventing any disputes or discrepancies.

By leveraging the decentralized nature of blockchain, DSLA removes the need for intermediaries and enhances trust between parties. Service providers are incentivized to meet SLAs as automated fines are imposed instantly when violations occur. This mechanism eliminates the need for time-consuming negotiations or manual intervention, saving valuable time and resources for both parties involved.

## Table of contents

- [Inspiration](#inspiration)
- [Table of contents](#table-of-contents)
- [What it does](#what-it-does)
  - [Guarantees provided](#guarantees-provided)
- [How we built it](#how-we-built-it)
- [Challenges we ran into](#challenges-we-ran-into)
- [Accomplishments that we're proud of](#accomplishments-that-were-proud-of)
- [What we learned](#what-we-learned)
- [What's next for Decentralized SLA](#whats-next-for-decentralized-sla)
- [Running the project](#running-the-project)

## What it does

The steps for a typical onboarding are as follows:

1. A producer (service provider) registers with us and creates an SLA contract that is deployed on the blockchain.
1. The producer then invites any consumer (service consumer) using the consumer's email address to this SLA using `inviteConsumer` and a unique link is sent to the consumer to join the SLA agreement.
1. The consumer then clicks on this unique link to join the SLA agreement using any wallet of his choice (Metamask etc).
1. The consumer has to pay the requested subscription amount (currently in Matic) defined by the producer while accepting the invite. The subscription amount gets locked inside the SLA contract for the duration for which the subscription is valid.
1. Once a consumer is added, we automatically start checking for max first response times on ZenDesk and up-times guarantees.
1. Initially, the balance of the provider will be 100% and the consumer will be 0%.
1. If any violation is found, the pre-determined fee is charged automatically and the balance of the provider will get reduced based on the number of charges for violations.
1. After the pre-agreed contract time ends, the provider can claim his funds, and the consumer can also claim the refunds based on the violations of the contract.
1. Apart from this, a fee is automatically transferred to the Manager contract for every SLA created which can be withdrawn by the DSLA team for maintaining this system.

### Guarantees provided

1. **Uptime guarantee:**
   We leverage the power of Chainlink functions and keepers to check if an API is up or down, and then automatically charge the producer for violation of uptime as defined inside the contract.

2. **First response time guarantee:**
   We have used Chainlink functions to automatically check if a consumer has created a request on ZenDesk and if the response time is as defined in the contract, if the response time took more than defined, we charge the provider for violation of the contract.

## How we built it

- **Blockchain Infrastructure:** We selected a suitable blockchain platform, Polygon to establish the foundation of DSLA. The chosen blockchain provides the necessary security, immutability, transparency, and cost for recording SLAs and their enforcement.

- **Smart Contract Development:** Our team designed and developed smart contracts for defining the terms, conditions, and metrics of the SLAs, including uptime guarantees and response time thresholds.

- **Integration of Chainlink Functions:** We have utilized Chainlink functions to check uptimes on the provided API, query ZenDesk for ticket statuses and send emails to invite consumers.

- **Chainlink Upkeep:** To automate the monitoring of service metrics, such as uptime and response time, we used Chainlink Upkeep. Chainlink Upkeep triggers a function on the Manager contract to fetch real-time data from various sources including ZenDesk and the status end-point provided by the provider, to verify tickets and the performance of the services.

- **User Interface and Experience:** We developed a user-friendly interface that allows businesses and service providers to create and manage their SLAs efficiently. The interface provides intuitive options to define SLA metrics, and invite consumers.

## Challenges we ran into

- We faced a lot of challenges initially with setting up chainlink functions and getting it working for sending out the emails for the invitation flow.

## Accomplishments that we're proud of

- Seamless Integration: We successfully integrated multiple technologies, including smart contracts, Chainlink oracles, and Chainlink Functions to create a unified and efficient system. This accomplishment showcases our ability to integrate diverse components and create a seamless user experience.

## What we learned

- Integrating various technologies, such as smart contracts, Chainlink oracles, and DeFi protocols, posed challenges during development. We learned the importance of thorough planning and coordination to ensure seamless integration and smooth functionality.

- User-Focused Design: User experience played a crucial role in the success of DSLA. We realized the importance of creating a user-friendly interface that simplifies SLA management, provides comprehensive monitoring capabilities, and facilitates effective communication between parties and we also thought about how to make it

## What's next for Decentralized SLA

- We would like to build more number of metrics in the system so that it can cover all metrics in a typical SLA.
- Add real-time reporting, analytics, and communication features to enhance collaboration between parties.
- Integrate on-ramp and off-ramp functionality for the amount that is paid to the contract.

## Running the project

The project is divided into two folders:

1. Frontend: The next.js code for frontend.
1. Solidity: The contracts and chainlink functions code

Apart from this, we also need to clone the [functions hardhat starter kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit) for creating subscription, funding subscriptions and adding contracts to it.

Steps to run:

> Requirements: Node >= 18, hardhat >= 2.14.0

1. Create a subscription for chainlink in the starter kit:

   ```
   npx hardhat functions-sub-create --network REPLACE_NETWORK
   ```

1. Set the password for env-enc using:

   ```
   npx env-enc set-pw
   ```

1. Set the environment variables one-by-one by using

   ```
   npx env-env set
   ```

   We need the following variables:

   - POLYGON_MUMBAI_RPC_URL: Required to connect to the Polygon Mumbai blockchain network via Infura/ Quicknode.
   - PRIVATE_KEY: User's wallet private key to deploy contracts.
   - GITHUB_API_TOKEN: Needed to generate secrets and deploy to GitHub.
   - COURIER_API_KEY: Required to access the Courier notification service API and programmatically send emails to users.
   - SECRET_KEY: Used for securing the emails generated.
   - POLYGONSCAN_API_KEY: Needed to access the PolygonScan API and verify contracts on the Polygon network programmatically.
   - ZENDESK_API_KEY: Required to access the Zendesk customer support platform's API and integrate its functionality into custom applications or automate tasks.

> Note: Don't forget to copy the addresses of these contracts as we will need them for further steps

1. Deploy the consumer for sending emails using Courier:

   ```
   npx hardhat run --network REPLACE_NETWORK scripts/deploycourierconsumer.ts
   ```

2. Deploy the functions consumer for Checking uptime:

   ```
   npx hardhat run --network REPLACE_NETWORK scripts/deployuptimechecker.ts
   ```

3. Deploy the functions consumer for Checking tickets in Zendesk:

   ```
   npx hardhat run --network REPLACE_NETWORK scripts/deployzendeskchecker.ts
   ```

4. Add all of the above 3 contracts to a chainlink subscription one-by-one:
   ```
   npx hardhat --network REPLACE_NETWORK  functions-sub-add --contract <<contract_address>> --subid <<sub_id>>
   ```

Once we have the addresses for all the consumers, we can move on to deploying the Manager contract, which is the heart of this project.

1. Add these addresses, and subscription id into the `scripts/deploymanager.ts` file:

   ```language/typescript
   const manager = await ManagerContract.deploy(
      0.001 * 10 ** 18, // Manager fees in native currency of blockchain
      "<<courier_functions_contract>>",
      "<<uptime_functions_contract>>",
      "<<zendesk_functions_contract>>",
      <<chainlink_subscription_id>>
   )
   ```

1. Deploy the manager using:

   ```
   npx hardhat run --network polygonMumbai scripts/deploymanager.ts
   ```

> If you want to test SLA and invite, you can checkout the `scripts/deploysamplesla.ts` and `scripts/inviteconsumer.ts` files, and run them similar to deploymanager command

> If you want to test any one of the function consumer contract, you can checkout the `scripts/callconsumer.ts` file and use the proper contract and address
