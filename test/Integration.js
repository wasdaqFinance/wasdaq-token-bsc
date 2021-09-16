const Wasdaq = artifacts.require("Wasdaq");
const GatekeeperMock = artifacts.require("GatekeeperMock");


contract('Integration', accounts => {
	// Name
	it('Should deploy the tokens', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const wasdaqGatekeeperMock = await GatekeeperMock.deployed();


		await wasdaqInstance.setGatekeeper(wasdaqGatekeeperMock.address)
		await wasdaqInstance.enableGatekeeper()

		/* Test trading while closed */
		let expectedExceptionStringTradingClosed = 'Trading closed';
		try {
			let resultMintInvalidSupply = await wasdaqInstance.transfer(wasdaqGatekeeperMock.address, 10);
			assert.fail('Trading performed while it should be closed')
		} catch(error) {
			if (error.toString().includes(expectedExceptionStringTradingClosed)) {
				assert(true)
			} else {
				console.error(error);
				assert.fail('Invalid expection thrown');
			}
		}

		//Test while open
		await wasdaqGatekeeperMock.enableTrading()
		let resultMintInvalidSupply = await wasdaqInstance.transfer(wasdaqGatekeeperMock.address, 10);

		//Redisable trading
		await wasdaqGatekeeperMock.disableTrading()

		/* Test trading while closed */
		expectedExceptionStringTradingClosed = 'Trading closed';
		try {
			let resultMintInvalidSupply = await wasdaqInstance.transfer(wasdaqGatekeeperMock.address, 10);
			assert.fail('Trading performed while it should be closed')
		} catch(error) {
			if (error.toString().includes(expectedExceptionStringTradingClosed)) {
				assert(true)
			} else {
				console.error(error);
				assert.fail('Invalid expection thrown');
			}
		}
		assert(true);
	});

});
