"use strict";

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
			// console.log(`logged in as `, currentUser);
		}
	}
}


]);