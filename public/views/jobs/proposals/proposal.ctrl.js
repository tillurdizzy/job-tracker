'use strict';

app.controller('ProposalCtrl',['$location','$state','evoDb','$scope','SharedSrvc','ShingleSrvc',function ($location,$state,evoDb,$scope,SharedSrvc,ShingleSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;
	ME.SRVC = ShingleSrvc;
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
    ME.jobInputFields = ME.SRVC.inputFields;
    ME.jobItemFeed = [];


	ME.submitEdit = function(ndx){
		var ndx = Number(ndxStr);
	};

	ME.backToList = function(){
      $state.transitionTo("jobs");
    };

    // Called from Directive
    ME.submitItemQty = function(dataObj){

    };

    var assembleFeed = function(){
    	// Place any recorded Qty from jobInput into jobInputFields for view display
    	for (var i = 0; i < ME.jobInputFields.length; i++) {
    		var itemCode = ME.jobInputFields[i].code;
    		for (var x = 0; x < ME.jobInput.length; x++) {
    			if(ME.jobInput[x].item_code == itemCode){
    				ME.jobInputFields[i].qty = ME.jobInput[x].qty;
    			}
    		};
    	};
    };

	
	var initPage = function(){
		getJobInput();
		ME.jobInputFields = ME.SRVC.inputFields;
	};

	var getJobInput = function(){
		var jobData = ME.SRVC.getJobInput(ME.selectedJobObj.PRIMARY_ID)
		.then(function(jobData){
            if(jobData != false){
               ME.jobInput = jobData;
               assembleFeed();
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