'use strict';

app.controller('AdminCtrl',['$location','$state','$scope','SharedSrvc',function ($location,$state,evoDb,$scope,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;
	
	ME.managerAdd = function(){
		$state.transitionTo("admin.managerAdd");
	};

	ME.managerUpdate = function(){
		$state.transitionTo("admin.managerUpdate");
	};

	ME.inventoryAdd = function(){
		$state.transitionTo("admin.inventoryAdd");
	};

	ME.inventoryUpdate = function(){
		$state.transitionTo("admin.inventoryUpdate");
	};

	ME.jobsActive = function(){
		$state.transitionTo("admin.reportJobsActive");
	};


	ME.prospectsReview = function(){
		$state.transitionTo("admin.prospectsReview");
	};
	ME.proposalsReview = function(){
		$state.transitionTo("admin.proposalsReview.input");
	};
	ME.contractsReview = function(){
		$state.transitionTo("admin.contractsReview");
	};
	ME.activeReview = function(){
		$state.transitionTo("admin.activeReview");
	};
	ME.completeReview = function(){
		$state.transitionTo("admin.completeReview");
	};



 }]);