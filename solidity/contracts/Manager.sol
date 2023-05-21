// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SLA.sol";

contract Manager {
    address randomContractAddress;
    mapping(address => address[]) providerSLAs;
    mapping(address => address[]) consumerSLAs;
    uint256 public slaCount;
    address[] public allSLAs;

    // events
    event SLAContractCreated(address indexed newContract);

    constructor(address _randomContractAddress) {
        randomContractAddress = _randomContractAddress;
    }

    function getProviderSLAs(address _provider) public view returns (address[] memory) {
        return providerSLAs[_provider];
    }

    function getConsumerSLAs(address _consumer) public view returns (address[] memory) {
        return consumerSLAs[_consumer];
    }

    function getAllSLAs() public view returns (address[] memory) {
        return allSLAs;
    }

    // deploy a new SLA contract
    function createSLAContract(string memory _name) public {
        address slaAddress = address(new SLA(_name, randomContractAddress));
        allSLAs.push(slaAddress);
        slaCount++;
        providerSLAs[msg.sender].push(slaAddress);
        emit SLAContractCreated(slaAddress);
    }
}
