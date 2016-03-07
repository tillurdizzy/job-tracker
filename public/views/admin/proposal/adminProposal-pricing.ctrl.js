'use strict';

app.controller('AdminPropPricing',['$state','$scope','AdminSharedSrvc',
	function ($state,$scope,AdminSharedSrvc) {

	var ME = this;
	var S = AdminSharedSrvc;
    ME.GrandTotal = 0;
    ME.ShingleTotal = 0;
    ME.VentsTotal = 0;
    ME.EdgeTotal = 0;
    ME.CapsTotal = 0;
    ME.FlatTotal = 0;
    ME.OtherTotal = 0;
	
	ME.materialPricingDP = S.materialPricing_dp;

    ME.toggleCheckBox = function(){
        var id = 0;
        ME.getTotal();
    };

    ME.getTotal = function(){
        ME.ShingleTotal = 0;
        ME.VentsTotal = 0;
        ME.EdgeTotal = 0;
        ME.CapsTotal = 0;
        ME.FlatTotal = 0;
        ME.OtherTotal = 0;
        ME.GrandTotal = 0;
        var include = false;

        for (var i = 0; i < ME.materialPricingDP.Shingles.length; i++) {
           include = ME.materialPricingDP.Shingles[i].Default;
           if(include){
                ME.ShingleTotal+=parseInt(ME.materialPricingDP.Shingles[i].Total)
           }
        };

        for (var i = 0; i < ME.materialPricingDP.Vents.length; i++) {
           include = ME.materialPricingDP.Vents[i].Default;
           if(include){
                ME.VentsTotal+=parseInt(ME.materialPricingDP.Vents[i].Total)
           }
        };

        for (var i = 0; i < ME.materialPricingDP.Edge.length; i++) {
           include = ME.materialPricingDP.Edge[i].Default;
           if(include){
                ME.EdgeTotal+=parseInt(ME.materialPricingDP.Edge[i].Total)
           }
        };

        for (var i = 0; i < ME.materialPricingDP.Flat.length; i++) {
           include = ME.materialPricingDP.Flat[i].Default;
           if(include){
                ME.FlatTotal+=parseInt(ME.materialPricingDP.Flat[i].Total)
           }
        };

        for (var i = 0; i < ME.materialPricingDP.Caps.length; i++) {
           include = ME.materialPricingDP.Caps[i].Default;
           if(include){
                ME.CapsTotal+=parseInt(ME.materialPricingDP.Caps[i].Total)
           }
        };

        for (var i = 0; i < ME.materialPricingDP.Other.length; i++) {
           include = ME.materialPricingDP.Other[i].Default;
           if(include){
                ME.OtherTotal+=parseInt(ME.materialPricingDP.Other[i].Total)
           }
        };

        ME.GrandTotal = ME.ShingleTotal + ME.VentsTotal + ME.EdgeTotal + ME.FlatTotal + ME.CapsTotal + ME.OtherTotal;
    }

    // Broadcast from AdminSharedSrvc >>> setParams
    $scope.$on('onRefreshPricingData', function(event, obj) {
		ME.propertyInputParams = S.materialPricing_dp;
        ME.getTotal();
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
		ME.materialPricingDP = S.materialPricing_dp;
        ME.getTotal();
    });

    $scope.$watch('$viewContentLoaded', function() {
       console.log("AdminPropInputCtrl >>> $viewContentLoaded");
       ME.materialPricingDP = S.materialPricing_dp;
       ME.getTotal();
    });
	
 }]);