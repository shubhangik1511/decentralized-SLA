// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/IManager.sol";
import "./FunctionsConsumer.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

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
    uint256 public period;
    address public owner;
    address public manager;
    Consumer[] private consumers;
    mapping(address => Consumer) private consumersMap;
    Invite[] private invites;
    mapping(string => Invite) private invitesMap;
    mapping(bytes32 => string) public requestIdRefMap;

    IManager managerContract;
    FunctionsConsumer public functionsConsumerContract;
    string public latestError;

    // events
    event InviteGenerated(string inviteString);

    constructor(
        string memory _name,
        uint256 _period,
        address _functionsConsumerContractAddress
    ) {
        owner = tx.origin;
        manager = msg.sender;
        managerContract = IManager(manager);
        functionsConsumerContract = FunctionsConsumer(
            _functionsConsumerContractAddress
        );
        name = _name;
        period = _period;
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
        bytes calldata err,
        string calldata _inviteCode
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

    // function bytes32ToString(
    //     bytes32 value
    // ) public pure returns (string memory) {
    //     bytes memory bytesArray = new bytes(32);

    //     for (uint256 i = 0; i < 32; i++) {
    //         bytesArray[i] = value[i];
    //     }

    //     return string(bytesArray);
    // }

    function getHash(
        string memory _inviteCode
    ) public pure returns (string memory) {
        return
            Base64.encode(
                abi.encodePacked(sha256(abi.encodePacked(_inviteCode)))
            );
    }

    // consumer can call this function to accept invite
    function acceptInvitation(
        string memory _inviteCode,
        string memory _ref
    ) public {
        require(msg.sender != owner, "Provider cannot consume");

        // generate hash of _inviteCode
        string memory inviteHash = getHash(_inviteCode);
        require(
            invitesMap[inviteHash].validity > block.timestamp,
            "Invalid invite"
        );
        Consumer memory consumer = Consumer(
            msg.sender,
            invitesMap[inviteHash].ref,
            block.timestamp + period
        );
        consumersMap[msg.sender] = consumer;
        consumers.push(consumer);
        delete invitesMap[inviteHash];
        managerContract.addConsumer(msg.sender, _ref);
    }
}
