// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SLA.sol";

contract Manager {
    struct SLAContract {
        address slaAddress;
        string name;
        uint256 createdAt;
    }
    address randomContractAddress;
    mapping(address => SLAContract[]) public providerSLAs;
    mapping(address => SLAContract[]) public consumerSLAs;
    uint256 public slaCount;
    SLAContract[] public allSLAs;
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
        SLAContract memory sla = SLAContract(slaAddress, _name, block.timestamp);
        allSLAs.push(sla);
        allSLAsMap[slaAddress] = true;
        providerSLAs[msg.sender].push(sla);
        emit SLAContractCreated(slaAddress);
    }

    // sla can call this function to add a consumer
    function addConsumer(address _consumerAddress, string memory _slaName) public {
        require(allSLAsMap[msg.sender] == true, "Only SLA providers can add consumers");
        SLAContract memory sla = SLAContract(msg.sender, _slaName, block.timestamp);
        consumerSLAs[_consumerAddress].push(sla);
    }

    function getProviderSLAs(address _providerAddress) public view returns (SLAContract[] memory) {
        return providerSLAs[_providerAddress];
    }

    function getConsumerSLAs(address _consumerAddress) public view returns (SLAContract[] memory) {
        return consumerSLAs[_consumerAddress];
    }

    function getAllSLAs() public view returns (SLAContract[] memory) {
        return allSLAs;
    }
}
