'use strict';

BCAP.controller('PageController', [
	'$scope',
  '$location',
	'AuthFactory',

	function ($scope, $location, authFactory) {

    $scope.isUserStored = () => authFactory.isUserStored();

    // $scope.isAuthenticated = () => authFactory.isAuthenticated();

    // $scope.logout = () => {
    //   authFactory.unauthenticate();
    //   // empty current user upon logout
    //   $scope.currentUser = {};
    // };

    $scope.logout = () => {
      authFactory.clearUser();
      $location.path('/register');
      // need line to get to api/logout path and delete current user
      // $scope.$apply();
    }

    // init pageCtrl command to pull user if authentication has persisted through reload (pullUser otherwise only running on login)
      // if (authFactory.isAuthenticated()) {
      //   console.log(`PageCtrl Test Run`);
      //   authFactory.pullUser(authFactory.getUserID())
      //   .then(
      //     userData => {
      //       console.log(`userData`, userData);
      //       $scope.currentUser = userData;
      //     },
      //     error => console.log("Page Ctrl Pull User Error: ", error)
      //   );
      // } else {
      //   console.log(`Not Authenticated Yet`);
      // }

    // runs at page start (catches redirect)
    if (!authFactory.isUserStored()) {
      authFactory.setUser()
        .then(
          // fill out user object with another api call
          success => {
            return authFactory.fillOutUser();
          },
          // log error
          failure => console.log(`set user failure: `, failure)
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