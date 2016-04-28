'use strict';

app.controller('AdminPropLabor', ['$state', '$scope', 'AdminSharedSrvc', function($state, $scope, AdminSharedSrvc) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.LaborTotal = 0;
   

   // Labor
    // To convert linear feet to Bundles divide by 35 i.e. there are enough shingles in a bundle to cover 35ft if you lay them end to end...
    // To convert Bndls to Sqs for Labor ... divide by 3.33!
    var propertyInputParams;
    var totalSquares;
    var linerFt;// Rake + Top + Perimeter
    var linearToSqs;

    ME.shinglesCost = 55;
    ME.laborShingles 

    var getTotal = function(){
        propertyInputParams = ME.S.proposalUnderReview.propertyInputParams;
        linerFt = propertyInputParams.TOPRDG + propertyInputParams.RKERDG + propertyInputParams.PRMITR;
        linearToSqs = (linerFt/35)/3.3;
        totalSquares = propertyInputParams.FIELD + linearToSqs;

        ME.laborShingles = totalSquares * shinglesCost
    };

    var configExists = function(){
        ME.dataIsSaved = true;
        if(ME.S.jobConfig.length == 0 && ME.proposalSelected == true){
            ME.dataIsSaved = false;
        }
    };

    // Broadcast from AdminSharedSrvc >>> categorizeMaterials
    // This happens each time a proposal is selected
    $scope.$on('onRefreshMaterialsData', function(event, obj) {
        ME.materialPricingDP = ME.S.materialsCatergorized;
        ME.proposalSelected = true;
        configExists();
        ME.getTotal();
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
        ME.materialPricingDP = [];
        ME.proposalSelected = false;
        ME.dataIsSaved = true;
        ME.getTotal();
    });

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminPropPRICINGCtrl >>> $viewContentLoaded");
        ME.materialPricingDP = ME.S.materialsCatergorized;
        ME.proposalSelected = false;
        ME.dataIsSaved = true;
        ME.getTotal();
    });

}]);