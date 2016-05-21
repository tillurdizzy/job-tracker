'use strict';

app.controller('AdminProposalCtrl',['$rootScope','$state','AdminDataSrvc','$scope','AdminSharedSrvc','AdminProposalSrvc','ngDialog',function ($rootScope,$state,AdminDataSrvc,$scope,AdminSharedSrvc,AdminProposalSrvc,ngDialog) {
	var DB =  AdminDataSrvc;
	var ME = this;
	var S = AdminSharedSrvc;
	var P = AdminProposalSrvc;
	ME.selectedProposal = {};
	ME.selectedProposalRoof = {};
	ME.selectDataProvider = [];
	ME.roofSelectionsDP = null;// Second selection dropdown if multi-unit property
	ME.specialText = "";
	ME.proposalData = {salesRep:"-",clientID:"-",propertyID:"-",jobID:"-"};
	
	ME.selectProposal = function(){
		
		var objLength = Object.keys(ME.selectedProposal).length;
		if(objLength > 0){
			ME.proposalData = S.selectProposal(ME.selectedProposal.id);

			if(ME.proposalData.roofCode == 2){
				ME.roofSelectionsDP = ME.proposalData.roofSelectionList;
				ME.selectedProposalRoof = ME.roofSelectionsDP[0];
				$rootScope.$broadcast('onResetProposalData');// Clears the parameters from the Input tab
			}else{
				P.setJobId(ME.selectedProposal.id);
				ME.roofSelectionsDP = null;
				ME.selectedProposalRoof = null;
			};
		}
	};

    ME.selectRoof = function(){
    	if(ME.selectedProposalRoof != null){
    		S.selectRoof(ME.selectedProposalRoof.jobID);
    		P.setJobId(ME.selectedProposalRoof.jobID);
    	}
	};

	ME.backToHome = function(){
		$state.transitionTo('admin');
	};

	var init = function(){
		if(S.proposalsAsProperty.length === 0){
			//getJobsWithProposalStatus...Queries the job_list table for open proposals
			S.getProposalsByJob();

			//getProposalsByProperty...Queries the properties table based on proposal status
			// braodcasts "getProposalsByProperty" on completion watched for below triggering parseProposals()
			S.getProposalsByProperty();	
		}else{
			S.resetProposalData();
			parseProposals();
		}
	};


	var parseProposals = function(){
		ME.selectDataProvider = [{label:"-- Select a Property --",id:-1}];
		var arr = S.proposalsAsProperty;
		for (var i = 0; i < arr.length; i++) {
			var roofCode =  arr[i].roofCode;
			var a =  arr[i].name;
			var b =  arr[i].street;
			var c =  arr[i].city;
			var d =  arr[i].state;
			var label = a + ", " + b + ", " + c + " " + d;
			ME.selectDataProvider.push({label:label,id:i});
		}
		ME.selectedProposal = ME.selectDataProvider[0];
	};

	

	$scope.$on('getProposalsByProperty', function() {
		parseProposals();
    });

	
	$scope.$watch('$viewContentLoaded', function() {
		console.log("AdminProposalCtrl >>> $viewContentLoaded");
		init();
    });

 }]);