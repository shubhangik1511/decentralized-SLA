// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";
// import "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol"; // Once published
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import "./SLA.sol";

contract FunctionsZendeskChecker is FunctionsClient, ConfirmedOwner {
    using Functions for Functions.Request;

    bytes32 public latestRequestId;
    bytes public latestResponse;
    bytes public latestError;

    string public source;
    bytes secrets;
    mapping(bytes32 => address) public requestIdSlaMap;

    mapping(address => bool) public authorizedRequesters;

    function addAuthorizedRequester(address requester) public {
        authorizedRequesters[requester] = true;
    }

    function removeAuthorizedRequester(address requester) public {
        delete authorizedRequesters[requester];
    }

    modifier onlyAuthorizedRequester() {
        require(
            authorizedRequesters[msg.sender] == true,
            "Not an authorized requester"
        );
        _;
    }

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    /**
     * @notice Executes once when a contract is created to initialize state variables
     *
     * @param oracle - The FunctionsOracle contract
     */
    // https://github.com/protofire/solhint/issues/242
    // solhint-disable-next-line no-empty-blocks
    constructor(
        address oracle,
        string memory _source,
        bytes memory _secrets
    ) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {
        source = _source;
        secrets = _secrets;
    }

    /**
     * @notice Send a simple request
     *
     * @param args List of arguments accessible from within the source code
     * @param subscriptionId Funtions billing subscription ID
     * @param gasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
     * @return Functions request ID
     */
    function executeRequest(
        string[] calldata args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public onlyAuthorizedRequester returns (bytes32) {
        Functions.Request memory req;
        req.initializeRequest(
            Functions.Location.Inline,
            Functions.CodeLanguage.JavaScript,
            source
        );
        if (secrets.length > 0) {
            req.addRemoteSecrets(secrets);
        }
        if (args.length > 0) req.addArgs(args);

        bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
        latestRequestId = assignedReqID;
        requestIdSlaMap[assignedReqID] = msg.sender;
        return assignedReqID;
    }

    /**
     * @notice Callback that is invoked once the DON has resolved the request or hit an error
     *
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        latestResponse = response;
        latestError = err;
        SLA slaContract = SLA(requestIdSlaMap[requestId]);
        slaContract.completeCheckZendeskSLACompliance(requestId, response, err);
        emit OCRResponse(requestId, response, err);
    }

    /**
     * @notice Allows the Functions oracle address to be updated
     *
     * @param oracle New oracle address
     */
    function updateOracleAddress(address oracle) public onlyOwner {
        setOracle(oracle);
    }

    function addSimulatedRequestId(
        address oracleAddress,
        bytes32 requestId
    ) public onlyOwner {
        addExternalRequest(oracleAddress, requestId);
    }
}
