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
    ME.jobMaterials = [];

	ME.submitEdit = function(ndx){
		var ndx = Number(ndxStr);
		
	};

	ME.backToList = function(){
      $state.transitionTo("jobs");
    };

	
	var initPage = function(){
		getJobMaterials();
	};

	var getJobMaterials = function(){
		var result = DB.getJobMaterials()
        .then(function(result){
            if(result != false){
            	// DB sent the data to the SharedSrvc
				// Don't do anything here
            }else{
              ME.dataError("ProposalCtrl-getJobMaterials()-1",result); 
            }
        },function(error){
            ME.dataError("ProposalCtrl-getJobMaterials()-2",result);
        });
	};

	ME.dataError = function(loc,error){
		console.log(loc + " : " + error);
	};


   

	initPage();

 }]);