// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {

    uint public numOfFunders;
    mapping(address => bool) public funders;
    mapping(uint => address) public lutFunders;
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

    receive() external payable {

    }

    modifier mustBeBelow(uint withdrawAmount) {
        require(withdrawAmount <= 1000000000000000000, "Cannot withdraw more than 1 ether.");
        _;
    }

    function addFunds() external payable {
        address funder = msg.sender;

        if(!funders[funder]) {
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function withdrawFunds(uint withdrawAmount) external mustBeBelow(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns(address[] memory) {
        address[] memory _funders = new address[] (numOfFunders);

        for(uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint index) external view returns(address) {
        return lutFunders[index];
    }
}