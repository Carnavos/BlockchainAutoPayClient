'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('BCAP')
	.directive('transactions',function(){
		return {
        templateUrl:'app/directives/transactions/transactions.html',
        restrict: 'E',
        replace: true,
    	}
	});


