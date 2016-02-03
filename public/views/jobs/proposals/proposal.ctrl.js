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

    //pricing
    ME.materialsCost = "0.00";
    ME.laborCost = "0.00";
    ME.totalCost = "0.00";


	ME.submitEdit = function(ndx){
		var ndx = Number(ndxStr);
	};

	ME.backToList = function(){
      $state.transitionTo("jobs");
    };

    // Called from Directive
    ME.submitItemQty = function(dObj){
    	
    	var itemCode = dObj.itemCode;
    	// Decide whether to create new entry or update
    	var itemExists = false;
    	for (var x = 0; x < ME.jobInput.length; x++) {
    		if(ME.jobInput[x].item_code == itemCode){
    			itemExists = true;
    			continue;
    		}
    	}
    	var dataObj = {};
    	dataObj.job_id = ME.selectedJobObj.PRIMARY_ID;
    	dataObj.item_code = dObj.itemCode;
    	dataObj.qty = dObj.qty;
    	if(itemExists == true){
    		ME.SRVC.updateJobItem(dataObj);
    	}else{
    		ME.SRVC.insertJobItem(dataObj);
    	}
    };

    var assembleFeed = function(){
    	// Place any recorded Qty from jobInput into jobInputFields for view display
    	for (var i = 0; i < ME.jobInputFields.length; i++) {
    		var itemCode = ME.jobInputFields[i].code;
    		ME.jobInputFields[i].qty = "0";
    		for (var x = 0; x < ME.jobInput.length; x++) {
    			if(ME.jobInput[x].item_code == itemCode){
    				ME.jobInputFields[i].qty = ME.jobInput[x].qty;
    			}
    		};
    	};
    };

	
	var initPage = function(){
		ME.jobInputFields = ME.SRVC.inputFields.slice(0);
		getJobInput();
	};

	var getJobInput = function(){
		var jobData = ME.SRVC.getJobInput(ME.selectedJobObj.PRIMARY_ID)
		.then(function(jobData){
            if(jobData != false){// false just meaqns there were no records found
               ME.jobInput = jobData;
               assembleFeed();
            }else{
               assembleFeed();
            }
        },function(error){
           
        });
	};
		
	ME.dataError = function(loc,error){
		console.log(loc + " : " + error);
	};

	initPage();

 }]);