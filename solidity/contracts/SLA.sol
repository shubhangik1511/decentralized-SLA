// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SLA {
    address public owner;
    address public manager;
    address[] consumer;

    constructor() {
        owner = tx.origin;
        manager = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the provider");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    function addConsumer(address _consumer) public onlyManager {
        consumer.push(_consumer);
    }
}
