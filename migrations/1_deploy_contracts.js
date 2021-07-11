var CrowdFunding = artifacts.require('CrowdFunding');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CrowdFunding);
};
