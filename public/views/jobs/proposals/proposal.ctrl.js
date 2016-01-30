'use strict';

app.controller('ProposalCtrl',['$location','$state','evoDb','$scope','SharedSrvc','ShingleSrvc',function ($location,$state,evoDb,$scope,SharedSrvc,ShingleSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;
	var SRVC = ShingleSrvc;
	ME.controllerName = "ProposalCtrl";
	ME.managerID = DB.managerID;
	ME.managerName = DB.managerName;

	// data vars
	ME.jobs = S.managerJobs;
	ME.selectedJobObj = S.selectedJobObj;
    ME.selectedClientObj = S.selectedClientObj;
    ME.selectedPropertyObj = S.selectedPropertyObj;
    ME.proposalDate = ME.selectedJobObj.dateProposal;


	ME.showDetails = function(ndxStr){
		var ndx = Number(ndxStr);
		for (var i = 0; i < ME.jobs.length; i++) {
			if(ME.jobs[i].PRIMARY_ID == ndx){
				ME.selectedJobObj = ME.jobs[i];
			}
		};
		
		// Send job selection to shared
		S.selectJob(ME.selectedJobObj);
		ME.selectedClientObj = S.selectedClientObj;
    	ME.selectedPropertyObj = S.selectedPropertyObj;
		$state.transitionTo("jobs.details");
	};

	ME.backToList = function(){
      $state.transitionTo("jobs");
    };

	
	var initPage = function(){
		if(ME.proposalDate > 0){

		}
	};

	ME.getManagerProperties = function(){
		var result = DB.getManagerProperties()
        .then(function(result){
            if(result != false){
            	// DB sent the data to the SharedSrvc
				// Don't do anything here
            }else{
              ME.dataError("JobsCtrl-getManagerProperties()-1",result); 
            }
        },function(error){
            ME.dataError("JobsCtrl-getManagerProperties()-2",result);
        });
	};

	ME.dataError = function(loc,error){
		console.log(loc + " : " + error);
	};


    $scope.$watch( function () { return S.managerJobs; }, function ( jobs ) {
	  ME.jobs = jobs;
	});

	initPage();

 }]);