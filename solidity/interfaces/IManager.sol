// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IManager {
    struct SLAContract {
        address slaAddress; // address of the SLA contract
        string name; // name to identify the SLA contract
        uint256 createdAt; // timestamp of the SLA contract creation
    }

    // deploy a new SLA contract
    function createSLAContract(
        string memory _name,
        uint256 _periodInDays,
        uint256 _fees,
        uint256 _chargePerViolation,
        string[] memory _uptimeArgs,
        string[] memory _zendeskArgs,
        string memory _zendeskSecrets
    ) external;

    // sla can call this function to add a consumer
    function addConsumer(
        address _consumerAddress,
        string memory _slaName
    ) external payable;

    // get all SLAs of a provider
    function getProviderSLAs(
        address _providerAddress
    ) external view returns (SLAContract[] memory);

    // get all SLAs of a consumer
    function getConsumerSLAs(
        address _consumerAddress
    ) external view returns (SLAContract[] memory);

    // get all SLAs
    function getAllSLAs() external view returns (SLAContract[] memory);

    // add an authorized withdrawer
    function addAuthorizedWithdrawer(address _withdrawer) external;

    // remove an authorized withdrawer
    function removeAuthorizedWithdrawer(address _withdrawer) external;

    // withdraw funds from the manager contract
    function withdraw(uint256 _amount) external;
}
