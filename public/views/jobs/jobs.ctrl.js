'use strict';

app.controller('JobsCtrl',['$location','$state','evoDb','$scope','SharedSrvc',function ($location,$state,evoDb,$scope,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	ME.S = SharedSrvc;
	ME.controllerName = "JobsCtrl";
	ME.managerID = DB.managerID;
	ME.managerName = DB.managerName;

	// data vars
	ME.jobs = ME.S.managerJobs;
	ME.selectedJobObj = ME.S.selectedJobObj;
    ME.selectedClientObj = ME.S.selectedClientObj;
    ME.selectedPropertyObj = ME.S.selectedPropertyObj;
    ME.jobStatus = [];

	//form vars
	ME.newJobForm = false;
	ME.invalid = false;

	ME.showDetails = function(ndx){
		ME.selectedJobObj = ME.jobs[ndx];
		// Send job selection to shared
		ME.S.selectJob(ME.selectedJobObj);
		ME.selectedClientObj = ME.S.selectedClientObj;
    	ME.selectedPropertyObj = ME.S.selectedPropertyObj;
		$state.transitionTo("jobs.details");
	};

	 ME.backToList = function(){
      $state.transitionTo("jobs");
    };

	
	// Get all jobs for current manager
	// DB already has manager_id
	ME.getManagerJobs = function(){
		var result = DB.getManagerJobs()
        .then(function(result){
            if(result != false){
            	// DB sent the data to the SharedSrvc
				
            }else{
              ME.dataError("JobsCtrl-getManagerJobs()-1",result); 
            }
        },function(error){
            ME.dataError("JobsCtrl-getManagerJobs()-2",result);
        });
	};

	ME.getManagerClients = function(){
		var result = DB.getManagerClients()
        .then(function(result){
            if(result != false){
            	// DB sent the data to the SharedSrvc
				// Don't do anything here
            }else{
              ME.dataError("JobsCtrl-getManagerClients()-1",result); 
            }
        },function(error){
            ME.dataError("JobsCtrl-getManagerClients()-2",result);
        });
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

	/*$scope.$watch('$viewContentLoaded', function() {
 		ME.getManagerJobs();
    });*/

    $scope.$watch( function () { return ME.S.managerJobs; }, function ( jobs ) {
	  ME.jobs = jobs;
	});

 }]);