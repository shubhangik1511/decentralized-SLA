// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/IRandom.sol";
import "../interfaces/IManager.sol";
import "./FunctionsConsumer.sol";

contract SLA {
    struct Consumer {
        address consumerAddress;
        string ref;
        uint256 contractValidity;
    }

    struct Invite {
        uint256 validity;
        string inviteString;
        string ref;
    }

    string public name;
    address public owner;
    address public manager;
    IRandom randomContract;
    IManager managerContract;
    uint256 public consumersCount;
    Consumer[] public consumers;
    mapping(address => Consumer) consumersMap;
    uint256 public invitesCount;
    Invite[] public invites;
    mapping(string => Invite) public invitesMap;

    event InviteGenerated(string inviteString);
    FunctionsConsumer public functionsConsumerContract;

    constructor(
        string memory _name,
        address randomContractAddress,
        address _functionsConsumerContractAddress
    ) {
        owner = tx.origin;
        manager = msg.sender;
        randomContract = IRandom(randomContractAddress);
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

    function canConsume(address _consumer) public view returns (bool) {
        return consumersMap[_consumer].contractValidity > block.timestamp;
    }

    function inviteConsumer(
        string memory _ref,
        string[] calldata args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public onlyOwner {
        string memory randomString = randomContract.randomString(7);
        Invite memory invite = Invite(
            block.timestamp + 1 days,
            randomString,
            _ref
        );
        invitesMap[randomString] = invite;
        invitesCount++;
        invites.push(invite);
        functionsConsumerContract.executeRequest(
            args,
            subscriptionId,
            gasLimit
        );
        emit InviteGenerated(randomString);
    }

    function acceptInvitation(
        string memory _inviteString,
        uint256 _validity
    ) public {
        require(msg.sender != owner, "Provider cannot consume");
        require(
            invitesMap[_inviteString].validity > block.timestamp,
            "Invalid invite"
        );
        Consumer memory consumer = Consumer(
            msg.sender,
            invitesMap[_inviteString].ref,
            _validity
        );
        consumersMap[msg.sender] = consumer;
        consumersCount++;
        consumers.push(consumer);
        delete invitesMap[_inviteString];
        managerContract.addConsumer(msg.sender, name);
    }
}
