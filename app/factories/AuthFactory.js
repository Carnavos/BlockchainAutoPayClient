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
	// used to add account info to currentUser (operating under assumption there is only one (primary))
	let addToUser = (apiResponseObject) => {
		if (currentUser) {
			currentUser.Balance = {};
		}
		// clean up response object
		let filteredResponse = apiResponseObject.data.data[0];

		// align local user properties to response object properties
		currentUser.Balance.btcAmount = filteredResponse.balance.amount; // balance has "amount" and "currency" properties
		currentUser.Balance.usdAmount = filteredResponse.native_balance.amount; // balance has "amount" and "currency" properties
		console.log(`postParse currentUser: `, currentUser);
	};

	return {
		getUser () {
			return currentUser;
		},
		// pull current user from BCAP database
		setUser () {
			return new Promise((resolve, reject) => {
				$http({
					url: "http://localhost:5000/api/Customer",
					method: 'GET'
				})
				.then(
					// parse user into local currentUser storage
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
		// add more user information to currentUser object
		fillOutUser () {
			return new Promise((resolve, reject) => {
				$http({
					url: `https://api.sandbox.coinbase.com/v2/accounts`,
					method: 'GET',
					headers: {
					"Authorization": `Bearer ${currentUser.AccessToken}`
				}

				})
				.then(
					response => {
						console.log(`fillOutUser GET response: `, response);
						addToUser(response);
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
			console.log(`clearUser run`);
			currentUser = null;
		},

		isUserStored () {
			// attempting with CustomerId instead of entire object null
		// method to check if any user info has been pulled down from API/db
			return currentUser !== null;
		}
	};
});