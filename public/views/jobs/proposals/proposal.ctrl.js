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
    ME.jobInput = [];

	ME.submitEdit = function(ndx){
		var ndx = Number(ndxStr);
		
	};

	ME.backToList = function(){
      $state.transitionTo("jobs");
    };

	
	var initPage = function(){
		getJobInput();
	};

	var getJobInput = function(){
		var jobData = SRVC.getJobInput()
		.then(function(jobData){
            if(jobData != false){
               ME.jobInput = jobData;
            }else{
               
            }
        },function(error){
           
        });
	};
		
	ME.dataError = function(loc,error){
		console.log(loc + " : " + error);
	};

	initPage();

 }]);