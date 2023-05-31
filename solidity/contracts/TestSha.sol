// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Base64.sol";

contract TestSHA {
    function getHash(
        string memory _inviteCode
    ) public pure returns (string memory) {
        return
            Base64.encode(
                abi.encodePacked(sha256(abi.encodePacked(_inviteCode)))
            );
    }
}
