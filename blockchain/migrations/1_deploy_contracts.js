const VotingSystem = artifacts.require("VotingSystem")

module.exports = (deployer) => {
  deployer.deploy(VotingSystem)
}
