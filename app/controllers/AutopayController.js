'use strict';

BCAP.controller('AutopayController', [
	'$http', 
	'$scope',
	'$location',
	'AuthFactory',

	function ($http, $scope, $location, authFactory) {

		// $scope.localUser = {};
		$scope.localUser = authFactory.getUser();
		console.log(`localUser: `, $scope.localUser);

		// list of all users transactions default sorted by timestamp
		// $scope.transactions = [];
		$scope.transactions = $scope.localUser.PrimaryAccount.transactions;
		// list of all user autopays based on order entered
		$scope.autopays = [];

		$scope.requestInfo = (accessTokenString) => {
			console.log(`accessTokenString: `, accessTokenString);
			$http({
				url: `https://api.coinbase.com/v2/user`,
				method: 'GET',
				headers: {
					"Authorization": `Bearer ${accessTokenString}`
				}
			})
			.then(
				response => {
					console.log(`sample user info GET response: `, response);
				},
				error => {
					console.log(`info GET error: `, error)
				}
			);
		};

		$scope.requestAccounts = (accessTokenString) => {
			$http({
				url: `https://api.coinbase.com/v2/accounts`,
				method: 'GET',
				headers: {
					"Authorization": `Bearer ${accessTokenString}`
				}
			})
			.then(
				response => {
					console.log(`accounts GET response: `, response);
				},
				error => {
					console.log(`accounts GET error: `, error)
				}
			);
		}; 

		$scope.requestScopes = (accessTokenString) => {
			$http({
				url: `https://api.coinbase.com/v2/user/auth`,
				method: 'GET',
				headers: {
					"Authorization": `Bearer ${accessTokenString}`
				}
			})
			.then(
				response => {
					console.log(`scopes GET response: `, response);
				},
				error => {
					console.log(`scopes GET error: `, error)
				}
			);
		};

		// Test transaction between TC and BH
		$scope.testTransaction = (accessTokenString) => {
			$http({
				url: `https://api.coinbase.com/v2/accounts/${$scope.localUser.PrimaryAccount.accountId}/transactions`,
				method: 'POST',
				headers: {
					"Authorization": `Bearer ${accessTokenString}`
				},
				data: JSON.stringify({
					type: "send",
					// accepts email address or bitcoin public key
					to: "brucehamptontest@gmail.com", // HARDCODED Bruce id
					amount: "0.00001", // in BTC (1 cent USD)
					currency: "BTC",
					description: "test BCAP transaction!"
					// idem: 
				})
			})
			.then(
				response => {
					console.log(`test Transaction response: `, response);
				},
				error => {
					console.log(`test Transaction error: `, error)
				}
			);
		};

	}

]);