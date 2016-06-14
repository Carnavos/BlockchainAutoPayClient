"use strict";

BCAP.controller('RegisterController', [
	'$http', 
	'$scope',
	'$location',
	'AuthFactory',

	function ($http, $scope, $location, authFactory) {

		// main OAuth function
		$scope.coinbaseOauth = function () {
			
			OAuth.initialize('ADv5VFRM35kVWRDNqVFoaf2YVww');

			OAuth.popup('coinbase').done(function(result) {
			    console.log(result)

				result.me().done(function(data) {
				    // do something with `data`, e.g. print data.name
				    console.log('DATA: ', data);

				    // POSTing resulting user info (new JSON stringified object) to database hooked to our API
				    $http({
				    	// designated API endpoint
				    	url: "http://localhost:5000/api/Customer",
				    	method: "POST",
				    	data: JSON.stringify({
				    		// do not attempt to pass id to API
				    		CustomerName: data.alias,
				    		Location: data.location,
				    		// no email via twitter
				    		Email: null,
				    		CreatedDate: new Date()
				    	})
				    }).then(
				    response => {
				    	let customer = response.data[0];
				    	authFactory.setUser(customer);
				    	console.log("resolve fired", customer);
				    	console.log("customer id", customer.CustomerId);
				    },
				    response => {
				    	console.log("reject fired", response);

				    	// let customer = response.config.data;
				    	let customerAlias = data.alias;
				    	console.log(`customer: `, customerAlias);
				    	// Geek has already been created
				    	if (response.status === 409) {
				    		$http
				    			.get(`http://localhost:5000/api/Customer?CustomerName=${customerAlias}`)
				    			// .get(`http://localhost:5000/api/Customer?CustomerName=${customerAlias.toString()}`)
				    			// .get(`http://localhost:5000/api/Customer?CustomerName=${}`)
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
			}).fail(function (a,b,c) {
				console.log(arguments);
			});
		};
	}
]);

