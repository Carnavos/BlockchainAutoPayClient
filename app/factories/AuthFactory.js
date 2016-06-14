'use strict';

// Authorization factory: sets and stores user in persistent factory
BCAP.factory('AuthFactory', [

function () {
	
	let currentUser = null;

	return {
		getUser () {
			return currentUser;
		},
		setUser (user) {
			currentUser = user;
			console.log(`currentUser: `, currentUser);
		}
	}
}


]);