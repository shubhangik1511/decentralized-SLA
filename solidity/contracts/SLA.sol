// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Random.sol";

contract SLA {
    string public name;
    address public owner;
    address public manager;
    mapping(address => bool) consumers;
    // struct invites => validity, inviteString, ref
    // strcut consumer => address, ref, validity
    mapping(string => bool) public invites;
    Random random;

    event InviteGenerated(string inviteString);

    constructor(string memory _name) {
        owner = tx.origin;
        manager = msg.sender;
        random = new Random();
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

    function canConsume() public view returns (bool) {
        return consumers[msg.sender];
    }

    function inviteConsumer() public onlyOwner {
        string memory randomString = random.randomString(7);
        // check if randomString is already in use
        invites[randomString] = true;
        emit InviteGenerated(randomString);
    }

    function acceptInvitation(string memory _inviteString) public {
        require(msg.sender != owner, "Provider cannot consume");
        require(invites[_inviteString] == true, "Invalid invite");
        delete invites[_inviteString];
        consumers[msg.sender] = true;
        // add consumer to manager
    }
}
