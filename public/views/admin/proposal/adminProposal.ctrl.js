'use strict';

app.controller('AdminProposalCtrl',['$state','AdminDataSrvc','$scope','AdminSharedSrvc',function ($state,AdminDataSrvc,$scope,AdminSharedSrvc) {
	var DB =  AdminDataSrvc;
	var ME = this;
	var S = AdminSharedSrvc;

	ME.selectedProposal = {};
	ME.selectDataProvider = [];
	ME.salesRep = "";
	
	ME.selectProposal = function(){
		ME.salesRep = S.selectProposal(ME.selectedProposal.id);
	};

	ME.backToHome = function(){
		$state.transitionTo('admin');
	}

	var init = function(){
		if(S.proposalsAsProperty.length === 0){
			S.getProposalsByJob();
			S.getProposalsByProperty();	
		}else{
			S.resetProposalData();
			parseProposals();
		}
	};


	var parseProposals = function(){
		ME.selectDataProvider = [{label:"Select a Property",id:-1}];
		var arr = S.proposalsAsProperty;
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

	$scope.$on('getProposalsByProperty', function() {
		parseProposals();
    });

	
	$scope.$watch('$viewContentLoaded', function() {
		console.log("AdminProposalCtrl >>> $viewContentLoaded");
		init();
    });

 }]);