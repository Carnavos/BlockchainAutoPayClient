'use strict';

// Authorization factory: sets and stores user in persistent factory
// Tailored to create user objects from unique coinbase user data format
BCAP.factory('AuthFactory', ($http) => {

	let currentUser = null;

	let parseUser = (apiResponseObject) => {
		currentUser = {}; // recast as object
		// clean up response object
		let filteredResponse = apiResponseObject.data[0];

		// align local user properties to response object properties
		currentUser.Name = filteredResponse.FullName;
		currentUser.CustomerId = filteredResponse.CustomerId;
		currentUser.AccessToken = filteredResponse.AccessToken;
		console.log(`postParse currentUser: `, currentUser);
	};

	return {
		getUser () {
			return currentUser;
		},
		setUser () {
			return new Promise((resolve, reject) => {
				$http({
					url: "http://localhost:5000/api/Customer",
					method: 'GET'
				})
				.then(
					response => {
						console.log(`RegisterController GET response: `, response);
						parseUser(response);
						resolve();
						// redirect to root
			      // $location.path("/");
			      // $scope.$apply();
					},
					error => {
						console.log(`setUser error: `, error)
						reject();
					}
				);
			});
		},
		clearUser () {
			currentUser = null;
		},

		isAuthenticated () {
		// method to check if any user info has been pulled down from API/db
			return currentUser !== null;
		}
	};
});