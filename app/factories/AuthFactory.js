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
	let getPrimaryAccountInfo = (apiResponseObject) => {
		if (currentUser) {
			currentUser.PrimaryAccount = {};
		}
		// clean up response object
		let primaryAccount = apiResponseObject.data.data[0];

		// align local user properties to response object "account" properties
		currentUser.PrimaryAccount.accountId = primaryAccount.id; // balance has "amount" and "currency" properties
		currentUser.PrimaryAccount.btcAmount = primaryAccount.balance.amount; // balance has "amount" and "currency" properties
		currentUser.PrimaryAccount.usdAmount = primaryAccount.native_balance.amount; // native_balance can be shown, but transactions should use balance.amount
		console.log(`postParse currentUser: `, currentUser);
	};

	// GET request to find transactions associated with current user's primary account id
	let getTransactions = () => {
		return new Promise((resolve, reject) => {
			console.log(`currentUser testlog before Transactions: `, currentUser);
				$http({
					url: `https://api.sandbox.coinbase.com/v2/accounts/${currentUser.PrimaryAccount.accountId}/transactions`,
					method: 'GET',
					headers: {
						"Authorization": `Bearer ${currentUser.AccessToken}`
					}
				})
				.then(
					response => {
						console.log(`get Transactions response: `, response);
						addTransactions(response);
						resolve();
					},
					error => {
						console.log(`get Transactions error: `, error)
						reject();
					}
				);
		});
	};

	// add to user object after xhr
	let addTransactions = (apiResponseObject) => {
		if (currentUser) {
			let transactions = apiResponseObject.data; // should be an array
			currentUser.PrimaryAccount.transactions = transactions;
		}
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
						if (response.data.length > 0) {
							console.log(`RegisterController GET response: `, response);
							parseUser(response);
							resolve();
							// redirect to root
				      // $location.path("/");
				      // $scope.$apply();
				    } else {
				    	console.log('No API Sign In');
				    	reject();
				    }
					},
					error => {
						console.log(`setUser error: `, error)
						reject();
					}
				);
			});
		},

		// add more user information to currentUser object (now with call to get transactions from primary account id)
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
						getPrimaryAccountInfo(response);
						// get transactions after account info
						return getTransactions();
					},
					error => {
						console.log(`fillOutUser GET error: `, error)
						reject();
					}
				)
				.then(
					transactionsResponse => {
						console.log(`transactions resolve`);
						// resolve outer promise in page controller
						resolve();	
					},
					error => {
						console.log(`Transactions GET error: `, error);
						reject();
					}
					// get transactions resolve
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