// SPDX-License-Identifier: MIT

pragma solidity 0.7.2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RFT is ERC20 {
    uint256 public icoSharePrice;
    uint256 public icoShareAmount;
    uint256 public icoEnd;

    uint256 public nftId;
    IERC721 public nft;
    IERC20 public dai;

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin can call this function");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _nftAddress,
        uint256 _nftId,
        uint256 _icoSharePrice,
        uint256 _icoShareAmount,
        address _daiAddress
    ) ERC20(_name, _symbol) {
        icoSharePrice = _icoSharePrice;
        icoShareAmount = _icoShareAmount;
        nftId = _nftId;
        nft = IERC721(_nftAddress);
        dai = IERC20(_daiAddress);
        admin = msg.sender;
    }

    function startIco(uint256 _icoEnd) external onlyAdmin {
        icoEnd = _icoEnd;
        nft.transferFrom(msg.sender, address(this), nftId);
    }

    function buyShare(uint256 shareAmount) external {
        require(icoEnd > 0, "ICO should have started");
        require(block.timestamp < icoEnd, "ICO should not have ended");
        require(shareAmount > 0, "shareAmount should be greater than 0");
        require(
            totalSupply() + shareAmount <= icoShareAmount,
            "Not enough shares"
        );

        uint256 daiAmount = shareAmount * icoSharePrice;
        dai.transferFrom(msg.sender, address(this), daiAmount);
        _mint(msg.sender, shareAmount);
    }

    function withdrawProfit() external onlyAdmin {
        require(block.timestamp > icoEnd, "ICO should end");

        uint256 daiBalance = dai.balanceOf(address(this));
        if (daiBalance > 0) {
            dai.transfer(admin, daiBalance);
        }
        uint256 unsoldShares = icoShareAmount - totalSupply();
        if (unsoldShares > 0) {
            _mint(admin, unsoldShares);
        }
    }
}
