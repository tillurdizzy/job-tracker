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

    // DOM vars
    ME.updateContract = false;
    ME.updateActive = false;
    ME.updateComplete = false;

    ME.isProposal = false;
    ME.isContract = false;
    ME.isActive = false;
    ME.isComplete = false;


    var setStatusVars = function(){
    	if(ME.selectedJobObj.dateProposal != ""){
    		 ME.isProposal = true;
    	}
    	
    	if(ME.selectedJobObj.dateContract != ""){
    		 ME.isContract = true;
    	}
    	
    	if(ME.selectedJobObj.dateActive != ""){
    		 ME.isActive = true;
    	}
    	
    	if(ME.selectedJobObj.dateComplete != ""){
    		 ME.isComplete = true;
    	}
    }


	ME.showDetails = function(ndxStr){
		var ndx = Number(ndxStr);
		for (var i = 0; i < ME.jobs.length; i++) {
			if(ME.jobs[i].PRIMARY_ID == ndx){
				ME.selectedJobObj = ME.jobs[i];
			}
		};
		setStatusVars();
		// Send job selection to shared
		ME.S.selectJob(ME.selectedJobObj);
		ME.selectedClientObj = ME.S.selectedClientObj;
    	ME.selectedPropertyObj = ME.S.selectedPropertyObj;
		$state.transitionTo("jobs.details");
	};

	 ME.backToList = function(){
      $state.transitionTo("jobs");
    };

    ME.goNewJob = function(){
      $state.transitionTo("addNewJob");
    };

	
	// Get all jobs for current manager
	// DB already has manager_id
	ME.getManagerJobs = function(){
		var result = DB.getManagerJobs()
        .then(function(result){
             if(typeof result != "boolean"){
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

	ME.updateStatus = function(id){
		var d = new Date();
		var v = d.valueOf();
		switch(id){
			case 'contract':
				ME.selectedJobObj.dateContract = v;
				ME.updateContract = false;
				break;
			case 'active':
				ME.selectedJobObj.dateActive = v;
				ME.updateActive = false;
				break;
			case 'complete':
				ME.selectedJobObj.dateComplete = v;
				ME.updateComplete = false;
				break;
		}
	}

	ME.dataError = function(loc,error){
		console.log(loc + " : " + error);
	};

    $scope.$watch( function () { return ME.S.managerJobs; }, function ( jobs ) {
	  ME.jobs = jobs;
	});

	$scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.S.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }else{
       	//initMe();
       }
    });

    

 }]);