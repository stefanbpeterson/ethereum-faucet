// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OnlyOwner {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}