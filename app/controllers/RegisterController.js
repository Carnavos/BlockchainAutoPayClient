'use strict';

BCAP.controller('RegisterController', [
	'$http', 
	'$scope',
	'$location',
	'AuthFactory',

	function ($http, $scope, $location, authFactory) {

		// main OAuth function
		$scope.coinbaseOauth = function () {

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
				    	url: "http://localhost:5000/api/Customer",
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

