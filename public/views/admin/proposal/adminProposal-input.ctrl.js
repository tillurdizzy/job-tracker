'use strict';

app.controller('AdminPropInput',['$state','$scope','AdminSharedSrvc','AdminDataSrvc',
	function ($state,$scope,AdminSharedSrvc,AdminDataSrvc) {

	var ME = this;
	var S = AdminSharedSrvc;
	var DB = AdminDataSrvc;

	ME.propertyInputParams = S.proposalUnderReview.propertyInputParams;
    ME.specialConsiderations = "";

    ME.resetParams =  function(){
    	ME.propertyInputParams = {};
    	ME.propertyInputParams.AIRHWK = "-";
    	ME.propertyInputParams.CARPRT = "-";
    	ME.propertyInputParams.DECKNG = "-";
    	ME.propertyInputParams.FIELD = "-";
    	ME.propertyInputParams.EAVE = "-";
    	ME.propertyInputParams.RKEWALL = "-";
        ME.propertyInputParams.LOWSLP = "-";
    	ME.propertyInputParams.LPIPE1 = "-";
    	ME.propertyInputParams.LPIPE2 = "-";
    	ME.propertyInputParams.LPIPE3 = "-";
    	ME.propertyInputParams.LPIPE4 = "-";
        ME.propertyInputParams.VENT8 = "-";
    	ME.propertyInputParams.PRMITR = "-";
    	ME.propertyInputParams.PWRVNT = "-";
    	ME.propertyInputParams.RKERDG = "-";
    	ME.propertyInputParams.SATDSH = "-";
    	ME.propertyInputParams.SLRVNT = "-";
    	ME.propertyInputParams.TOPRDG = "-";
    	ME.propertyInputParams.TURBNS = "-";
    	ME.propertyInputParams.VALLEY = "-";
        ME.specialConsiderations = "";
    };


    // Broadcast from AdminSharedSrvc >>> setParams
    $scope.$on('onRefreshParamsData', function(event, obj) {
		ME.propertyInputParams = S.proposalUnderReview.propertyInputParams;
        ME.specialConsiderations = S.SPECIAL;
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
		ME.resetParams();
    });

    $scope.$watch('$viewContentLoaded', function() {
       //console.log("AdminPropINPUTCtrl >>> $viewContentLoaded");
       ME.propertyInputParams = S.proposalUnderReview.propertyInputParams;
       ME.specialConsiderations = S.SPECIAL;
    });
	
 }]);