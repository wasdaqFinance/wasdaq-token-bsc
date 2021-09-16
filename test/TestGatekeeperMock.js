const GatekeeperMock = artifacts.require("GatekeeperMock");

contract('GatekeeperMock', accounts => {
	it('Should return the initial trading state ', async () => {
		const gatekeeperMockInstance = await GatekeeperMock.deployed();

		// Request initial status
		let isTradingOpen = await gatekeeperMockInstance.isTradingOpen()
		assert.equal(false, isTradingOpen, "Trading should be disabled");

		// Enable trading
		let result = await gatekeeperMockInstance.enableTrading()
		isTradingOpen = await gatekeeperMockInstance.isTradingOpen()
		assert.equal(true, isTradingOpen, "Trading should be enabled");

		// Enable trading
		result = await gatekeeperMockInstance.disableTrading()
		isTradingOpen = await gatekeeperMockInstance.isTradingOpen()
		assert.equal(false, isTradingOpen,  "Trading should re disabled");
	});
});
