const GatekeeperMock = artifacts.require("GatekeeperMock")

module.exports = function(deployer) {
	deployer.deploy(GatekeeperMock)
}