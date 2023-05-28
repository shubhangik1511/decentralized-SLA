// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SLA.sol";
import "./FunctionsConsumer.sol";

contract Manager {
    struct SLAContract {
        address slaAddress;
        string name; // name to identify the SLA for providers and the contract for consumers
        uint256 createdAt;
    }
    mapping(address => SLAContract[]) private providerSLAs;
    mapping(address => SLAContract[]) private consumerSLAs;
    SLAContract[] public allSLAs;
    mapping(address => bool) private allSLAsMap;
    FunctionsConsumer public functionsConsumerContract;

    // events
    event SLAContractCreated(address indexed newContract);

    constructor(address _functionsConsumerContractAddress) {
        functionsConsumerContract = FunctionsConsumer(
            _functionsConsumerContractAddress
        );
    }

    // deploy a new SLA contract
    function createSLAContract(string memory _name, uint256 _period) public {
        address slaAddress = address(
            new SLA(_name, _period, address(functionsConsumerContract))
        );
        SLAContract memory sla = SLAContract(
            slaAddress,
            _name,
            block.timestamp
        );
        allSLAs.push(sla);
        allSLAsMap[slaAddress] = true;
        providerSLAs[msg.sender].push(sla);
        functionsConsumerContract.addAuthorizedRequester(slaAddress);
        emit SLAContractCreated(slaAddress);
    }

    // sla can call this function to add a consumer
    function addConsumer(
        address _consumerAddress,
        string memory _slaName
    ) public {
        require(
            allSLAsMap[msg.sender] == true,
            "Only SLA providers can add consumers"
        );
        SLAContract memory sla = SLAContract(
            msg.sender,
            _slaName,
            block.timestamp
        );
        consumerSLAs[_consumerAddress].push(sla);
    }

    function getProviderSLAs(
        address _providerAddress
    ) public view returns (SLAContract[] memory) {
        return providerSLAs[_providerAddress];
    }

    function getConsumerSLAs(
        address _consumerAddress
    ) public view returns (SLAContract[] memory) {
        return consumerSLAs[_consumerAddress];
    }

    function getAllSLAs() public view returns (SLAContract[] memory) {
        return allSLAs;
    }
}
