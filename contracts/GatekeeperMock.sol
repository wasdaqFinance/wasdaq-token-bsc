pragma solidity 0.5.16;

interface IGatekeeper {
  function isTradingOpen() external view returns (bool);
}

contract GatekeeperMock is IGatekeeper {
	bool private _isTradingEnabled;

	constructor() public {
		_isTradingEnabled = false; // Disable trading by default
	}

	function enableTrading() external {
		_isTradingEnabled = true;
	}

	function disableTrading() external {
		_isTradingEnabled = false;
	}

	function isTradingOpen() external view returns (bool) {
		return _isTradingEnabled;
	}
}