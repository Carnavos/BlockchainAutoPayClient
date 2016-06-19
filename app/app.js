'use strict';

let BCAP = angular.module('BCAP', [
	'ngRoute'
])
.constant('BCAPAPI', "http://localhost:5000/api/");

// Promise used grant access to main views
let isAuth = (AuthFactory, $location) => new Promise((resolve, reject) => {
	// check if local user stored
	if (AuthFactory.isAuthenticated()) {
		console.log("[App] User Authenticated");
		resolve();
	} else {
		console.log("[App] User NOT Authenticated, rerouting to registry");
		$location.path('/register');
		reject();
	}
}); 

BCAP.config(['$routeProvider', 
  function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/autopayList.html',
				controller: 'AutopayController',
				resolve: { isAuth }
			})
			.when('/register', {
				templateUrl: 'partials/login.html',
				controller: 'RegisterController'
			})
			.otherwise({
				redirectTo: '/register'
			});
  }
]);