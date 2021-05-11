const { time } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { assert } = require("console");

const RFT = artifacts.require("RFT");
const NFT = artifacts.require("NFT");
const DAI = artifacts.require("DAI");

const DAI_AMOUNT = web3.utils.toWei("25000");
const SHARE_AMOUNT = web3.utils.toWei("25000");
const ICO_TIME = 7 * 86400; //7 Days

contract("RFT", async function (addresses) {
  const [admin, buyer1, buyer2, buyer3, buyer4, _] = addresses;

  it("ICO should work", async function () {
    const dai = await DAI.new();
    const nft = await NFT.new("Simple NFT", "SNFT");
    await nft.mint(admin, 1);
    await Promise.all([
      dai.mint(buyer1, DAI_AMOUNT),
      dai.mint(buyer2, DAI_AMOUNT),
      dai.mint(buyer3, DAI_AMOUNT),
      dai.mint(buyer4, DAI_AMOUNT),
    ]);
    const rft = await RFT.new(
      "My RFT",
      "MRFT",
      nft.address,
      1,
      1,
      web3.utils.toWei("100000"),
      dai.address
    );

    await nft.approve(rft.address, 1);
    await rft.startIco(ICO_TIME);

    await dai.approve(rft.address, DAI_AMOUNT, { from: buyer1 });
    await rft.buyShare(SHARE_AMOUNT, { from: buyer1 });

    await dai.approve(rft.address, DAI_AMOUNT, { from: buyer2 });
    await rft.buyShare(SHARE_AMOUNT, { from: buyer2 });

    await dai.approve(rft.address, DAI_AMOUNT, { from: buyer3 });
    await rft.buyShare(SHARE_AMOUNT, { from: buyer3 });

    await dai.approve(rft.address, DAI_AMOUNT, { from: buyer4 });
    await rft.buyShare(SHARE_AMOUNT, { from: buyer4 });

    await time.increase(ICO_TIME + 1);

    await rft.withdrawProfit();

    const sharesBuyer2 = rft.balanceOf(buyer2);
    const sharesBuyer1 = rft.balanceOf(buyer1);
    const sharesBuyer3 = rft.balanceOf(buyer3);
    const sharesBuyer4 = rft.balanceOf(buyer4);

    assert(sharesBuyer1.toString() === SHARE_AMOUNT);
    assert(sharesBuyer2.toString() === SHARE_AMOUNT);
    assert(sharesBuyer3.toString() === SHARE_AMOUNT);
    assert(sharesBuyer4.toString() === SHARE_AMOUNT);

    const daiBalanceAdmin = dai.balanceOf(admin);
    assert(daiBalanceAdmin.toString() === web3.utils.toWei("100000"));
  });
});
