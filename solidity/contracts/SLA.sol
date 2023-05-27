// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/IManager.sol";
import "./FunctionsConsumer.sol";

contract SLA {
    struct Consumer {
        address consumerAddress;
        string ref; // ref to identify the consumers (copied from invite)
        uint256 contractValidity;
    }

    struct Invite {
        string inviteString;
        string ref; // ref to identify the consumers (for providers)
        uint256 validity;
    }

    string public name;
    address public owner;
    address public manager;
    Consumer[] private consumers;
    mapping(address => Consumer) private consumersMap;
    Invite[] private invites;
    mapping(string => Invite) private invitesMap;
    mapping(bytes32 => string) private requestIdRefMap;

    IManager managerContract;
    FunctionsConsumer public functionsConsumerContract;

    // events
    event InviteGenerated(string inviteString);

    constructor(
        string memory _name,
        address _functionsConsumerContractAddress
    ) {
        owner = tx.origin;
        manager = msg.sender;
        managerContract = IManager(manager);
        functionsConsumerContract = FunctionsConsumer(
            _functionsConsumerContractAddress
        );
        name = _name;
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
        return consumersMap[_consumer].contractValidity > block.timestamp;
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
        string calldata _inviteString
    ) public onlyFunctionsContract {
        string memory ref = requestIdRefMap[_requestId];
        require(bytes(ref).length > 0, "Invalid requestId");
        delete requestIdRefMap[_requestId];
        Invite memory invite = Invite(
            _inviteString,
            ref,
            block.timestamp + 1 days
        );
        invitesMap[_inviteString] = invite;
        invites.push(invite);
        emit InviteGenerated(_inviteString);
    }

    // provider can call this function to send invite to consumer
    function inviteConsumer(
        string memory _ref,
        string[] calldata args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public onlyOwner {
        bytes32 requestId = functionsConsumerContract.executeRequest(
            args,
            subscriptionId,
            gasLimit
        );
        requestIdRefMap[requestId] = _ref;
    }

    // consumer can call this function to accept invite
    function acceptInvitation(
        string memory _inviteString,
        string memory _ref,
        uint256 _validity
    ) public {
        require(msg.sender != owner, "Provider cannot consume");
        require(
            invitesMap[_inviteString].validity > block.timestamp,
            "Invalid invite"
        );
        Consumer memory consumer = Consumer(
            msg.sender,
            _ref,
            _validity
        );
        consumersMap[msg.sender] = consumer;
        consumers.push(consumer);
        delete invitesMap[_inviteString];
        managerContract.addConsumer(msg.sender, name);
    }
}
