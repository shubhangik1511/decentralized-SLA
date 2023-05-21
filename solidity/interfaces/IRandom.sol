// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRandom {
    function random(
        uint256 number,
        uint256 counter
    ) external view  returns (uint256);

    function randomString(uint256 length) external view returns (string memory);
}
