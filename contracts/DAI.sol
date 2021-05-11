// SPDX-License-Identifier: MIT

pragma solidity 0.7.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAI is ERC20 {
    constructor() ERC20("DAI stable coin", "DAI") {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
