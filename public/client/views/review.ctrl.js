'use strict';

app.controller('ReviewCtrl',['$scope','$state','ClientSharedSrvc',function ($scope,$state,ClientSharedSrvc) {
	
	var ME = this;
	
	ME.C = ClientSharedSrvc;

	

	
	
	$scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.C.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }
    });

 }]);