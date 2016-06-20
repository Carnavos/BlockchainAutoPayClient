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

		$scope.autopays = [];

		$scope.requestInfo = (accessTokenString) => {
			console.log(`accessTokenString: `, accessTokenString);
			$http({
				url: `https://api.sandbox.coinbase.com/v2/user`,
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
		},
		$scope.requestAccounts = (accessTokenString) => {
			$http({
				url: `https://api.sandbox.coinbase.com/v2/accounts`,
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
		},
		$scope.requestScopes = (accessTokenString) => {
			$http({
				url: `https://api.sandbox.coinbase.com/v2/user/auth`,
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
		},
		$scope.parentTest = () => {
			console.log(`$parent.$scope.currentUser: `, $parent.$scope.currentUser);
			console.log(`$scope.localUser: `, $scope.localUser);
		}
	}

]);