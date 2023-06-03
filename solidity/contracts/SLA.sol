// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/IManager.sol";
import "./FunctionsConsumer.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract SLA {
    struct Consumer {
        address consumerAddress; // address of the consumer
        string ref; // ref to identify the consumers (copied from invite)
        uint256 providerBalance; // balance of the provider
        uint256 consumerBalance; // balance of the consumer
        uint256 violationsCount; // number of violations
        uint256 createdAt; // timestamp of the contract creation
        uint256 validity; // timestamp of the contract validity
    }

    struct Invite {
        bytes inviteString; // invite string
        string ref; // ref to identify the consumers (for providers)
        uint256 validity; // timestamp of the invite validity
    }

    string public name; // name to identify the SLA contract
    uint256 public periodInDays; // period of contract in days
    uint256 public fees; // fees to be paid to the provider
    uint256 public chargePerViolation; // charge per violation

    address public owner; // owner of the contract, that is the provider
    address payable public manager; // Manager contract address
    uint256 public managerFees; // fees to be paid to the manager

    Consumer[] private consumers; // array of all consumers
    mapping(address => Consumer) private consumersMap; // mapping of consumer address to contract
    Invite[] private invites; // array of all invites
    mapping(bytes => Invite) private invitesMap; // mapping of invite string to invite
    mapping(bytes32 => string) public requestIdRefMap; // mapping of chainlink requestId to invite ref

    FunctionsConsumer public functionsConsumerContract; // FunctionsConsumer contract address
    string public latestError; // latest error message
    uint64 private subscriptionId; // subscription id

    // events
    event InviteGenerated(bytes inviteString);

    constructor(
        string memory _name,
        uint256 _periodInDays,
        uint256 _fees,
        uint256 _chargePerViolation,
        uint256 _managerFees,
        uint64 _subscriptionId,
        address _functionsConsumerContractAddress
    ) {
        owner = tx.origin;
        manager = payable(msg.sender);
        name = _name;
        periodInDays = _periodInDays;
        fees = _fees;
        chargePerViolation = _chargePerViolation;
        managerFees = _managerFees;
        subscriptionId = _subscriptionId;
        functionsConsumerContract = FunctionsConsumer(
            _functionsConsumerContractAddress
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the provider");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    modifier onlyFunctionsContract() {
        require(
            msg.sender == address(functionsConsumerContract),
            "You are not the functions contract"
        );
        _;
    }

    function canConsume(address _consumer) public view returns (bool) {
        return consumersMap[_consumer].validity > block.timestamp;
    }

    function getConsumers() public view returns (Consumer[] memory) {
        return consumers;
    }

    function getInvites() public view returns (Invite[] memory) {
        return invites;
    }

    // chainlink functionsContract can call this function after sending invite to consumer
    function inviteSent(
        bytes32 _requestId,
        bytes calldata err,
        bytes calldata _inviteCode
    ) public {
        string memory ref = requestIdRefMap[_requestId];
        require(bytes(ref).length > 0, "Invalid requestId");
        delete requestIdRefMap[_requestId];
        if (bytes(err).length > 0) {
            latestError = string(err);
            return;
        }
        Invite memory invite = Invite(
            _inviteCode,
            ref,
            block.timestamp + 1 days
        );
        invitesMap[_inviteCode] = invite;
        invites.push(invite);
        emit InviteGenerated(_inviteCode);
    }

    // provider can call this function to send invite to consumer
    function inviteConsumer(
        string memory _ref,
        string[] calldata args,
        uint32 gasLimit
    ) public onlyOwner {
        bytes32 requestId = functionsConsumerContract.executeRequest(
            args,
            subscriptionId,
            gasLimit
        );
        requestIdRefMap[requestId] = _ref;
    }

    // calculate hash of invite code
    function getHash(
        string memory _inviteCode
    ) internal pure returns (bytes memory) {
        return
            bytes(
                Base64.encode(
                    abi.encodePacked(ripemd160(abi.encodePacked(_inviteCode)))
                )
            );
    }

    // report violation
    function reportViolation(address _contract) public {
        Consumer memory consumer = consumersMap[_contract];
        require(consumer.validity > block.timestamp, "Invalid consumer");
        require(consumer.providerBalance > 0, "No balance left");
        consumersMap[_contract].violationsCount++;
        if (consumer.providerBalance < chargePerViolation) {
            consumersMap[_contract].consumerBalance += consumer.providerBalance;
            consumersMap[_contract].providerBalance = 0;
            return;
        }
        consumersMap[_contract].consumerBalance += chargePerViolation;
        consumersMap[_contract].providerBalance -= chargePerViolation;
    }

    // get total fees to be paid by consumer
    function getTotalFees() public view returns (uint256) {
        return fees + managerFees;
    }

    // consumer can call this function to accept invite
    function acceptInvitation(
        string memory _inviteCode,
        string memory _ref
    ) public payable {
        require(msg.sender != owner, "Provider cannot consume");
        require(msg.value >= getTotalFees(), "Insufficient feesPerDay");
        // generate hash of _inviteCode
        bytes memory inviteHash = getHash(_inviteCode);
        require(
            invitesMap[inviteHash].validity > block.timestamp,
            "Invalid invite"
        );
        // any extra fees send by consumer as tip to manager
        uint256 managerNetFees = msg.value - fees;
        IManager(manager).addConsumer{value: managerNetFees}(msg.sender, _ref);
        uint256 periodInSeconds = periodInDays * 24 * 60 * 60;
        Consumer memory consumer = Consumer(
            msg.sender,
            invitesMap[inviteHash].ref,
            fees,
            0,
            0,
            block.timestamp,
            block.timestamp + periodInSeconds
        );
        consumersMap[msg.sender] = consumer;
        consumers.push(consumer);
        delete invitesMap[inviteHash];
    }

    // get claimable fees
    function getClaimableFees(
        address _contract,
        address claimee
    ) public view returns (uint256) {
        Consumer memory consumer = consumersMap[_contract];
        if (claimee == owner) {
            return consumer.providerBalance;
        } else if (claimee == consumer.consumerAddress) {
            return consumer.consumerBalance;
        }
        return 0;
    }

    // provider or consumer can call this function to claim fees
    function claimFees(address _contract) public {
        Consumer memory consumer = consumersMap[_contract];
        require(
            consumer.validity < block.timestamp,
            "Consumer still in execution"
        );
        uint256 claimableFees = getClaimableFees(_contract, msg.sender);
        require(claimableFees > 0, "No fees to claim");
        (bool sent, ) = msg.sender.call{value: claimableFees}("");
        require(sent, "Failed to send fees");
    }
}
