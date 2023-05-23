// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


interface IManager {
    function createSLAContract(string memory _name) external;
    function addConsumer(address _consumerAddress) external;
}
