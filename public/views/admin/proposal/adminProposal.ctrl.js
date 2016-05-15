'use strict';

app.controller('AdminProposalCtrl',['$state','AdminDataSrvc','$scope','AdminSharedSrvc','ngDialog',function ($state,AdminDataSrvc,$scope,AdminSharedSrvc,ngDialog) {
	var DB =  AdminDataSrvc;
	var ME = this;
	var S = AdminSharedSrvc;

	ME.selectedProposal = {};
	ME.selectDataProvider = [];
	ME.roofSelectionsDP = [];// Second selection dropdown if multi-unit property
	ME.specialText = "";
	ME.proposalData = {salesRep:"-",clientID:"-",propertyID:"-",jobID:"-"};
	
	ME.selectProposal = function(){
		ME.proposalData = S.selectProposal(ME.selectedProposal.id);
		
		if(ME.proposalData.roofCode == 2){
			var propID = ME.selectedProposal.id;
			ME.roofSelectionsDP = S.getRoofsForProperty(propID);
			alert("Continue from here!");
		};
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