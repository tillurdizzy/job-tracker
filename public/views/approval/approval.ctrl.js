'use strict';

app.controller('ApprovalCtrl',['$scope','$state','ClientSrvc',function ($scope,$state,ClientSrvc) {
	
	var ME = this;
	
	ME.C = ClientSrvc;
	
	$scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.C.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }
    });

 }]);