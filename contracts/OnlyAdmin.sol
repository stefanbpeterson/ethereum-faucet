// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OnlyAdmin {
    address[] public admins = [0x8c0E055CA0E597DF9755a65e3dED35B20EC49Fe7, 0x2c5547eC5841Ec00477b3b18D3DBCf6090BC255b];

    modifier onlyAdmin{
        bool isAdmin = false;

        if(msg.sender == admins[0]) {
            isAdmin = true;
        } else if(msg.sender == admins[1]) {
            isAdmin = true;
        }

        require(isAdmin == true);
        _;
    }
}