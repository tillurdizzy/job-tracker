'use strict';

app.controller('AdminCtrl',['$location','$state','$scope','SharedSrvc',function ($location,$state,evoDb,$scope,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;
	var me = "AdminCtrl >>> ";
	var LOG = true;

	var trace = function(message) {
        if (LOG) {
            console.log(message);
        }
    };
	
	ME.managerAdd = function(){
		trace(me + "GO >>> admin.managerAdd");
		$state.transitionTo("admin.managerAdd");
	};
	ME.managerUpdate = function(){
		trace(me + "GO >>> admin.managerUpdate");
		$state.transitionTo("admin.managerUpdate");
	};
	ME.inventoryAdd = function(){
		trace(me + "GO >>> admin.inventoryAdd");
		$state.transitionTo("admin.inventoryAdd");
	};
	ME.pitchedInventory = function(){
		trace(me + "GO >>> admin.pitchedInventory");
		$state.transitionTo("admin.pitchedInventory");
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
		trace(me + "GO >>> admin.proposalsReview.input");
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

	ME.clientManagement = function(){
		$state.transitionTo("admin.clientManagement");
	};
	ME.propertyManagement = function(){
		$state.transitionTo("admin.propertyManagement.add");
	};
	ME.jobManagement = function(){
		$state.transitionTo("admin.jobManagement");
	};

	// Reports
	ME.reportTables = function(){
		$state.transitionTo("admin.reportTables");
	};



 }]);