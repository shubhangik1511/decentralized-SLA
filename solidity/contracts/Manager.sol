// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SLA.sol";
import "./FunctionsConsumer.sol";
import "../interfaces/IManager.sol";

contract Manager is IManager {
    SLAContract[] public allSLAs; // array of all SLA contracts
    mapping(address => bool) private allSLAsMap; // mapping of SLA contract address to boolean
    mapping(address => SLAContract[]) private providerSLAs; // mapping of provider address to SLA contracts
    mapping(address => SLAContract[]) private consumerSLAs; // mapping of consumer address to SLA contracts
    FunctionsConsumer public functionsConsumerContract; // FunctionsConsumer contract address
    uint256 public managerFees; // fees to be paid to the manager
    uint256 public managerBalance; // balance of the manager
    mapping(address => bool) public authorizedWithdrawers; // mapping of authorized withdrawers
    uint64 private subscriptionId; // subscription id

    // events
    event SLAContractCreated(address indexed newContract);

    constructor(
        uint256 _managerFees,
        address _functionsConsumerContractAddress,
        uint64 _subscriptionId
    ) {
        managerFees = _managerFees;
        functionsConsumerContract = FunctionsConsumer(
            _functionsConsumerContractAddress
        );
        authorizedWithdrawers[msg.sender] = true;
        subscriptionId = _subscriptionId;
    }

    // modifiers
    modifier onlyAuthorizedWithdrawer() {
        require(
            authorizedWithdrawers[msg.sender] == true,
            "You are not a authorized withdrawer"
        );
        _;
    }

    // Function to receive Ether. msg.data must be empty
    // receive() external payable {}

    // Fallback function is called when msg.data is not empty
    // fallback() external payable {}

    // deploy a new SLA contract
    function createSLAContract(
        string memory _name,
        uint256 _periodInDays,
        uint256 _fees,
        uint256 _chargePerViolation
    ) public {
        address slaAddress = address(
            new SLA(
                _name,
                _periodInDays,
                _fees,
                _chargePerViolation,
                managerFees,
                subscriptionId,
                address(functionsConsumerContract)
            )
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
    ) public payable {
        require(
            allSLAsMap[msg.sender] == true,
            "Only SLA contracts can add consumers"
        );
        SLAContract memory sla = SLAContract(
            msg.sender,
            _slaName,
            block.timestamp
        );
        consumerSLAs[_consumerAddress].push(sla);
    }

    // get all SLAs of a provider
    function getProviderSLAs(
        address _providerAddress
    ) public view returns (SLAContract[] memory) {
        return providerSLAs[_providerAddress];
    }

    // get all SLAs of a consumer
    function getConsumerSLAs(
        address _consumerAddress
    ) public view returns (SLAContract[] memory) {
        return consumerSLAs[_consumerAddress];
    }

    // get all SLAs
    function getAllSLAs() public view returns (SLAContract[] memory) {
        return allSLAs;
    }

    // add an authorized withdrawer
    function addAuthorizedWithdrawer(
        address _withdrawer
    ) public onlyAuthorizedWithdrawer {
        authorizedWithdrawers[_withdrawer] = true;
    }

    // remove an authorized withdrawer
    function removeAuthorizedWithdrawer(
        address _withdrawer
    ) public onlyAuthorizedWithdrawer {
        authorizedWithdrawers[_withdrawer] = false;
    }

    // withdraw funds from the manager contract
    function withdraw(uint256 _amount) public onlyAuthorizedWithdrawer {
        require(
            managerBalance >= _amount,
            "Insufficient balance in manager contract"
        );
        managerBalance -= _amount;
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to withdraw");
    }
}
