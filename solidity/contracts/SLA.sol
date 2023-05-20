// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Random.sol";

contract SLA {
    address public owner;
    address public manager;
    mapping(address => bool) consumers;
    mapping(string => bool) public invites;
    Random random;

    event InviteGenerated(string inviteString);

    constructor() {
        owner = tx.origin;
        manager = msg.sender;
        random = new Random();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the provider");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    function canConsume() public view returns (bool) {
        return consumers[msg.sender];
    }

    function inviteConsumer() public onlyOwner {
        string memory randomString = random.randomString(7);
        invites[randomString] = true;
        emit InviteGenerated(randomString);
    }

    function acceptInvitation(string memory _inviteString) public {
        require(msg.sender != owner, "Provider cannot consume");
        require(invites[_inviteString] == true, "Invalid invite");
        delete invites[_inviteString];
        consumers[msg.sender] = true;
    }
}
