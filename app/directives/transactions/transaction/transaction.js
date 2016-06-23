'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('BCAP')
	.directive('transaction',function(){
		return {
        templateUrl:'app/directives/transactions/transaction/transaction.html',
        restrict: 'E',
        replace: false,
    	}
	});


