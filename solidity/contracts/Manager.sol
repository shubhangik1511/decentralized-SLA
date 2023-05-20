// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SLA.sol";

contract Manager {
    mapping(address => address[]) providers;
    mapping(address => address[]) consumers;
    address[] public allSLAs;
    event SLAContractCreated(address indexed newContract);

    constructor() {}

    function addSLA(address _sla) public {
        allSLAs.push(_sla);
    }

    function getMyProviders() public view returns (address[] memory) {
        return providers[msg.sender];
    }

    function getMyConsumers() public view returns (address[] memory) {
        return consumers[msg.sender];
    }

    // deploy a new SLA contract
    function createSLAContract() public returns (address) {
        address slaAddress = address(new SLA());
        addSLA(slaAddress);
        providers[msg.sender].push(slaAddress);
        emit SLAContractCreated(slaAddress);
        return slaAddress;
    }
}
