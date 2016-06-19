'use strict';

BCAP.controller('AutopayController', [
	'$http', 
	'$scope',
	'AuthFactory',

	function ($http, $scope, authFactory) {

		// $scope.localUser = {};
		$scope.localUser = authFactory.getUser();
		console.log(`localUser: `, $scope.localUser);

		$scope.autopays = [];

	}

]);