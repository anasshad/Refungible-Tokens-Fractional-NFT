const DAI = artifacts.require("DAI");
const NFT = artifacts.require("NFT");
const RFT = artifacts.require("RFT");

module.exports = async function (deployer) {
  await deployer.deploy(DAI);
  const dai = await DAI.deployed();

  await deployer.deploy(NFT, "Simple NFT", "SNFT");
  const nft = await NFT.deployed();

  await deployer.deploy(
    RFT,
    "My RFT",
    "MRFT",
    nft.address,
    1,
    1,
    web3.utils.toWei("100000"),
    dai.address
  );
};
