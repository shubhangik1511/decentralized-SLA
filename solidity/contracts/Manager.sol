// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SLA.sol";

contract Manager {
    address randomContractAddress;
    mapping(address => address[]) public providerSLAs;
    mapping(address => address[]) public consumerSLAs;
    uint256 public slaCount;
    address[] public allSLAs;
    mapping(address => bool) public allSLAsMap;

    // events
    event SLAContractCreated(address indexed newContract);

    constructor(address _randomContractAddress) {
        randomContractAddress = _randomContractAddress;
    }

    // deploy a new SLA contract
    function createSLAContract(string memory _name) public {
        address slaAddress = address(new SLA(_name, randomContractAddress));
        slaCount++;
        allSLAs.push(slaAddress);
        allSLAsMap[slaAddress] = true;
        providerSLAs[msg.sender].push(slaAddress);
        emit SLAContractCreated(slaAddress);
    }

    // sla can call this function to add a consumer
    function addConsumer(address _consumerAddress) public {
        require(allSLAsMap[msg.sender] == true, "Only SLA providers can add consumers");
        consumerSLAs[_consumerAddress].push(msg.sender);
    }
}
