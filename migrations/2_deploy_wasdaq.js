const Wasdaq = artifacts.require("Wasdaq")

module.exports = function(deployer) {
	deployer.deploy(Wasdaq)
}