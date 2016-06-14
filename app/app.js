'use strict';

let BCAP = angular.module('BCAP', [
	'ngRoute'
])
.constant('BCAPAPI', "http://localhost:5000/api/");

BCAP.config(['$routeProvider', 
  function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/autopayList.html',
			controller: 'AutopayController'
		})
		.when('/register', {
			templateUrl: 'partials/login.html',
			controller: 'RegisterController'
		})
    // .when("/songs/:songId", {
    //   templateUrl: "partials/song-brief.html",
    //   controller: "SongDetailController",
    //   // resolve: { isAuth }
    // })
		.otherwise('/');
  }
]);