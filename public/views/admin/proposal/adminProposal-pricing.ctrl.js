'use strict';

app.controller('AdminPropPricing',['$state','$scope','AdminSharedSrvc',
	function ($state,$scope,AdminSharedSrvc) {

	var ME = this;
	var S = AdminSharedSrvc;
	
	ME.materialPricingDP = S.materialPricing_dp;

    // Broadcast from AdminSharedSrvc >>> setParams
    $scope.$on('onRefreshPricingData', function(event, obj) {
		ME.propertyInputParams = S.materialPricing_dp;
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
		ME.materialPricingDP = S.materialPricing_dp;
    });

    $scope.$watch('$viewContentLoaded', function() {
       console.log("AdminPropInputCtrl >>> $viewContentLoaded");
       ME.materialPricingDP = S.materialPricing_dp;
    });
	
 }]);