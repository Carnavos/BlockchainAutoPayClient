'use strict';

BCAP.controller('RegisterController', [
	'$http', 
	'$scope',
	'$location',
	'AuthFactory',

	function ($http, $scope, $location, authFactory) {

		// placeholder sandbox oauth
		// let sandBoxUrl = `https://sandbox.coinbase.com/oauth/authorize?client_id=d5bc0dfc40d2c5aa69ea3e667152fbb1ab1bff9756a30caa67b4a9557ef056fd&redirect_uri=https%3A%2F%2Foauth.io%2Fauth&response_type=code&scope=wallet%3Auser%3Aread&state=CSRFToken123`;
		// let localhost = `http%3A%2F%2Flocalhost%3A8080`;
		// let localapi = "http://localhost:5000/api/";


		// Should be wrapped in an isAuth boolean check against AuthFactory.
			// initial page load should return no current user -> trigger call to api to login via coinbase
			// redirects to this controller again, which will check 
		// AuthFactory attempts to pull current user from BCAP Database linked to API
		// $http({
		// 	url: "http://localhost:5000/api/Customer",
		// 	method: 'GET'
		// })
		// .then(response => {
		// 	console.log(`RegisterController GET response: `, response);
		// 	authFactory.parseUser(response);
		// 	// redirect to root
  //     // $scope.$apply();    
		// });
		console.log(`authFactory.isAuthenticated: `, authFactory.isAuthenticated());

		// runs at page start (catches redirect)
		if (!authFactory.isAuthenticated()) {
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
 
		$scope.coinbaseSignIn = function () {
			
		}

		// old OAuth function
		$scope.coinbaseOauth1 = function () {

			// Oauth public key for Coinbase app
			OAuth.initialize('ADv5VFRM35kVWRDNqVFoaf2YVww');

			OAuth.popup('coinbase').done(function(result) {
		    console.log(result)

				result.me().done(function(data) {
				    // do something with `data`, e.g. print data.name
				    console.log('DATA: ', data);

				    // POSTing resulting user info (new JSON stringified object) to database hooked to our API
				    $http({
				    	// designated Customer API endpoint
				    	url: "http://localhost:5000/api/Values",
				    	method: "POST",
				    	data: JSON.stringify({
				    		// custom Coinbase attributes
				    		// CustomerName: data.alias,
				    		// Location: data.location,
				    		// Email: null,
				    		// CreatedDate: new Date()
				    	})
				    }).then(
				    response => {
				    	let customer = response.data[0];
				    	// set client user through AuthFactory
				    	authFactory.setUser(customer);
				    	console.log("POST resolved", response);
				    	console.log("customer id", customer.CustomerId);
				    },
				    response => {
				    	console.log("POST rejected", response);

				    	// let customer = response.config.data;
				    	let customerAlias = data.alias;
				    	console.log(`customer: `, customerAlias);
				    	// customer has already been pushed to database
				    	if (response.status === 409) {
				    		$http
				    			.get(`http://localhost:5000/api/Customer?CustomerName=${customerAlias}`)
				    			.then(
				    				response => {
				    					let customer = response;
				    					console.log("Customer already exists: ", customer);
				    					authFactory.setUser(customer)
				    					$location.path("/");
				    				},
				    				response => console.log("Could not find that Customer", response)
				    			)
				    	}

				    }
				    )
				})
			// Oauth popup fail
			}).fail(function (a,b,c) {
				console.log(arguments);
			});
		};
	}
]);

