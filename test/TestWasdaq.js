const Wasdaq = artifacts.require("Wasdaq");

contract('Wasdaq', accounts => {
	// Name
	const totalSupply = "500000000000000000"
	const genesisAddress = '0x0000000000000000000000000000000000000000';

	it('Should return the correct name of the token', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const name = await wasdaqInstance.name.call()

		assert.equal("Wasdaq", name);
	});
	// Symbol
	it('Should return the correct symbol of the token', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const symbol = await wasdaqInstance.symbol.call()

		assert.equal("WSDQ", symbol);
	});
	// Decimals
	it('Should return the correct decimals of the token', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const decimals = await wasdaqInstance.decimals.call()

		assert.equal(9, decimals);
	});
	// TotalSupply
	it('Should return the correct total supply of the token', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const totalSupplyCreated = await wasdaqInstance.totalSupply.call()

		assert.equal(totalSupply, totalSupplyCreated);
	});
	// Owner
	it('Should return the owner of the token', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const owner = await wasdaqInstance.owner.call()

		assert.equal(accounts[0], owner);
	});
	// Owners balance
	it('Should return the balance of the owner', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const ownerBalance = await wasdaqInstance.balanceOf(accounts[0])

		assert.equal(totalSupply, ownerBalance);
	});
	// isGatekeeperEnabled value
	it('Should return false for isGatekeeperEnabled', async () => {
		const wasdaqInstance = await Wasdaq.deployed();
		const isGatekeeperEnabled = await wasdaqInstance._isGatekeeperEnabled.call()

		assert.equal(false, isGatekeeperEnabled);
	});
	// Gatekeeper enable
	it('Gatekeeper should not be enabled if its address is the genesis', async() => {
		const updatedAddress = '0x000000000000000000000000000000000000dEaD';
		let expectedExceptionString = 'Gatekeeper\'s address is 0'

		const wasdaqInstance = await Wasdaq.deployed();
		try {
			await wasdaqInstance.enableGatekeeper();
			assert.fail('Gatekeeper enabled with genesis address')
		} catch (error) {
			if (error.toString().includes(expectedExceptionString)) {
				assert(true);
			}else {
				console.error(error)
				assert.fail('Invalid expection thrown')
			}
		}
	});
	// Gatekeeper's address update
	it('Should successfully update the Gatekeeper\'s address', async() => {
		const updatedAddress = '0x000000000000000000000000000000000000dEaD';

		let defaultGatekeeperAddress;
		let newGatekeeperAddress;

		return Wasdaq.deployed()
		.then(instance => {
			meta = instance;
			return meta.gatekeeper.call();
		})
		.then(address => {
			defaultGatekeeperAddress = address;
			meta.setGatekeeper(updatedAddress, { from: accounts[0]});
			return meta.gatekeeper.call()
		})
		.then(newGatekeeperAddress => {
			assert.equal(
				genesisAddress,
				defaultGatekeeperAddress,
				'Default address of the Gatekeeper must be 0x0'
			);

			assert.equal(
				updatedAddress,
				newGatekeeperAddress,
				'New Gatekeeper\'s address must be: ' + updatedAddress
			);
		});
	});
	//Gatekeeper's address update by no owner
	it('Normal address should not be  allowed to update the Gatekeeper\'s address', async() => {
		const updatedAddress = '0x000000000000000000000000000000000000dEaD';
		let newGatekeeperAddress;
		let expectedExceptionString = 'caller is not the owner'

		const wasdaqInstance = await Wasdaq.deployed();
		try {
			await wasdaqInstance.setGatekeeper(updatedAddress, { from: accounts[1] });
			assert.fail('Set gatekeeper updated by normal address')
		} catch (error) {
			if (error.toString().includes(expectedExceptionString)) {
				assert(true);
			}else {
				console.error(error)
				assert.fail('Invalid expection thrown')
			}
		}
	});
	it('Gatekeeper can be enabled if its address is not the genesis', async() => {
		const wasdaqInstance = await Wasdaq.deployed();
		try {
			await wasdaqInstance.enableGatekeeper();
			assert(true,'Gatekeeper enabled with genesis address')
		} catch (error) {
			console.error(error)
			assert.fail('Invalid expection thrown')
		}
	});
	// Burn
	it('Users can burn tokens', async() => {
		const wasdaqInstance = await Wasdaq.deployed();

		let startingBalance = await wasdaqInstance.balanceOf(accounts[0])
		let resultBurn = wasdaqInstance.burn(startingBalance)
		let afterBurnBalance = await wasdaqInstance.balanceOf(accounts[0])

		assert.equal(
			0,
			afterBurnBalance.toNumber(),
			"Burn functionnality failed")
	});
	// Mint
	it('Mint should not exceed MAX_SUPPLY', async() => {
		const wasdaqInstance = await Wasdaq.deployed();

		// Burn everything and mint more than MAX_SUPPLY
		let startingBalance = await wasdaqInstance.balanceOf(accounts[0]);
		let maxSupply = await wasdaqInstance.MAX_SUPPLY.call();
		let resultBurn = await wasdaqInstance.burn(startingBalance);
		let invalidSupply =  maxSupply.add(web3.utils.toBN('1'));

		let expectedExceptionString = 'Exceeds MAX_SUPPLY';
		try {
			let resultMintInvalidSupply = await wasdaqInstance.mint(invalidSupply);
			assert.fail('Mint above MAX_SUPPLY')
		} catch(error) {
			if (error.toString().includes(expectedExceptionString)) {
				assert(true)
			} else {
				console.error(error);
				assert.fail('Invalid expection thrown');
			}
		}
	});



});
