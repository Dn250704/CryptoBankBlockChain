const CryptoBank = artifacts.require("CryptoBank");

module.exports = function (deployer) {
  deployer.deploy(CryptoBank);
};