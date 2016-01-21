'use strict';

app.controller('ClientsCtrl',['$location','$state','evoDb','$scope','SharedSrvc',function ($location,$state,evoDb,$scope,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;

	ME.managerID = DB.managerID;
	ME.managerName = DB.managerName;

	// data vars
	ME.clients = [];

	//form vars
	ME.newJobForm = false;
	ME.invalid = false;

	ME.editJob = function(list,ndx){
		var arraylist = [];
		switch(list){
			case 0:arraylist = ME.jobs.status_0.slice(0); break;
			case 1:arraylist = ME.jobs.status_1.slice(0); break;
			case 2:arraylist = ME.jobs.status_2.slice(0); break;
			case 3:arraylist = ME.jobs.status_3.slice(0); break;
			case 4:arraylist = ME.jobs.status_4.slice(0); break;
		}
		var jobObj = arraylist[ndx];
		// Send job selection to shared
		S.selectJob(jobObj);
		$state.transitionTo("edit");
	};

	
	// Get all jobs for current manager
	// DB already has manager_id
	ME.getManagerJobs = function(){
		var result = DB.getManagerJobsList()
        .then(function(result){
            if(result != false){
            	// DB sent the data to the SharedSrvc
				ME.jobs.status_0 = S.status_0;
				ME.jobs.status_1 = S.status_1;
				ME.jobs.status_2 = S.status_2;
				ME.jobs.status_3 = S.status_3;
				ME.jobs.status_4 = S.status_4;
            }else{
              ME.dataError("JobsCtrl-getManagerJobs()-1",result); 
            }
        },function(error){
            ME.dataError("JobsCtrl-getManagerJobs()-2",result);
        });
	}

	ME.dataError = function(loc,error){
		console.log(loc + " : " + error);
	}

	$scope.$watch('$viewContentLoaded', function() {
 		ME.getManagerJobs();
    });

 }]);