'use strict';

app.controller('ProspectJobsCtrl',['$state','AdminDataSrvc','$scope','AdminSharedSrvc',function ($state,AdminDataSrvc,$scope,AdminSharedSrvc) {
	var DB =  AdminDataSrvc;
	var ME = this;
	var S = AdminSharedSrvc;

	ME.reviewList = [];
	
	ME.backToHome = function(){
		$state.transitionTo('admin');
	};
	
	$scope.$watch('$viewContentLoaded', function() {
		console.log("ProspectJobsCtrl >>> $viewContentLoaded");
    });
 }]);