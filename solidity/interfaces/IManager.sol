// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


interface IManager {
    struct SLAContract {
        address slaAddress;
        string name;
        uint256 createdAt;
    }

    function createSLAContract(string memory _name) external;

    function addConsumer(address _consumerAddress, string memory _slaName) external;

    function getProviderSLAs(address _providerAddress) external view returns (SLAContract[] memory);

    function getConsumerSLAs(address _consumerAddress) external view returns (SLAContract[] memory);

    function getAllSLAs() external view returns (SLAContract[] memory);
}
