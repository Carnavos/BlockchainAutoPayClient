'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
BCAP.directive('headerNotification',function(){
		return {
        templateUrl:'app/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
    	}
	});


