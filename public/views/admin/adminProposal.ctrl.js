'use strict';

app.controller('AdminProposalCtrl',['$state','AdminDataSrvc','$scope','AdminSharedSrvc',function ($state,AdminDataSrvc,$scope,AdminSharedSrvc) {
	var DB =  AdminDataSrvc;
	var ME = this;
	var S = AdminSharedSrvc;

	ME.selectedProposal = {};
	ME.selectDataProvider = [];
	
	ME.selectProposal = function(){
		if(ME.selectedProposal.id > -1){
			S.selectProposal(ME.selectedProposal.id);
		}
	};

	var init = function(){
		if(S.openProposals.length === 0){
			S.getJobsWithOpenProposals();
			S.getPropertiesWithProposalJobStatus();	
		}
	};


	var parseProposals = function(){
		ME.selectDataProvider = [{label:"Select a Property",id:-1}];
		var arr = S.openProposals;
		for (var i = 0; i < arr.length; i++) {
			var a =  arr[i].name;
			var b =  arr[i].street;
			var c =  arr[i].city;
			var d =  arr[i].state;
			var label = a + ", " + b + ", " + c + " " + d;
			ME.selectDataProvider.push({label:label,id:i});
		}
		ME.selectedProposal = ME.selectDataProvider[0];
	};

	$scope.$on('onGetPropertiesWithProposalJobStatus', function() {
		parseProposals();
    });

	
	$scope.$watch('$viewContentLoaded', function() {
		init();
    });

 }]);