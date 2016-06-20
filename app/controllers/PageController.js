'use strict';

BCAP.controller('PageController', [
	'$scope',
  '$location',
	'AuthFactory',

	function ($scope, $location, authFactory) {

    $scope.isUserStored = () => authFactory.isUserStored();

    $scope.currentUser = () => authFactory.getUser();

    $scope.logout = () => {
      authFactory.clearUser();
      $location.path('/register');
      // api /logout path handler in logout link href
    }

    // runs at page start (catches redirect)
    // if no user object stored in authFactory
    if (!authFactory.isUserStored()) {
      // GET request to BCAP API database for current user (covering already authenticated users in "session-like" state)
      authFactory.setUser()
        .then(
          // fill out user object with another api call
          success => {
            return authFactory.fillOutUser();
          },
          // log error
          failure => console.log(`set user failure`)
        ).then(
          // redirect to root on success
          success => {
            console.log(`fill out success`);
            $location.path("/");
            $scope.$apply();
          },
          // log error
          failure => console.log(`fill out user failure: `, failure)
        );
    }

	}
]);