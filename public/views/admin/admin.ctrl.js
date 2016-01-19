'use strict';

app.controller('AdminCtrl',['$location','$state','evoDb','$scope','SharedSrvc',function ($location,$state,evoDb,$scope,SharedSrvc) {
	var DB =  evoDb;
	var Me = this;
	var S = SharedSrvc;
	
	Me.managerAdd = function(){
		$state.transitionTo("admin.managerAdd");
	};

	Me.managerUpdate = function(){
		$state.transitionTo("admin.managerUpdate");
	};

	Me.inventoryAdd = function(){
		$state.transitionTo("admin.inventoryAdd");
	};

	Me.inventoryUpdate = function(){
		$state.transitionTo("admin.inventoryUpdate");
	};

	Me.jobsActive = function(){
		$state.transitionTo("admin.reportJobsActive");
	};

	

	$scope.$on('$viewContentLoaded', function() {
 		
    });

 }]);