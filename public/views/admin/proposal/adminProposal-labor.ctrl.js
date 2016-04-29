'use strict';

app.controller('AdminPropLabor', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', function($state, $scope, AdminSharedSrvc,AdminProposalSrvc) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.LaborTotal = 0;
    ME.P = AdminProposalSrvc;
   
    // Labor
    // To convert linear feet to Bundles divide by 35 i.e. there are enough shingles in a bundle to cover 35ft if you lay them end to end...
    // To convert Bndls to Sqs for Labor ... divide by 3.33!
    var propertyInputParams;
    var totalSquares;
    var linerFt;// Rake + Top + Perimeter
    var linearToSqs;

    var LaborCosts = {};
    

    ME.laborCostItems = [];

    var getTotal = function(){
        ME.laborCostItems = [];

        LaborCosts.shingles = 55;
        propertyInputParams = ME.S.proposalUnderReview.propertyInputParams;
        linerFt = parseInt(propertyInputParams.TOPRDG) + parseInt(propertyInputParams.RKERDG) + parseInt(propertyInputParams.PRMITR);
        linearToSqs = (linerFt/35)/3.3;
        totalSquares = parseInt(propertyInputParams.FIELD) + linearToSqs;
        totalSquares = Math.ceil(totalSquares);
        var laborShingles = parseInt(totalSquares * LaborCosts.shingles);
        
        var tableRow = {};
        tableRow.labor = "Shingles";
        tableRow.qty = totalSquares + " Sqs";
        tableRow.cost = LaborCosts.shingles;
        tableRow.total = laborShingles;
        ME.laborCostItems.push(tableRow); 

        tableRow = {};
        tableRow.labor = "1x2 Trim";
        tableRow.qty = "Ft.";
        tableRow.cost = 0;
        tableRow.total = 0;
        ME.laborCostItems.push(tableRow); 

        tableRow = {};
        tableRow.labor = "Re-Decking";
        tableRow.qty = "Sqs.";
        tableRow.cost = 0;
        tableRow.total = 0;
        ME.laborCostItems.push(tableRow); 

        tableRow = {};
        tableRow.labor = "Delivery";
        tableRow.qty = "Each";
        tableRow.cost = 0;
        tableRow.total = 0;
        ME.laborCostItems.push(tableRow); 

        ME.LaborTotal = laborShingles;
        ME.P.setSummaryItem("labor",ME.LaborTotal);
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
        getTotal();
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
        getTotal();
    });

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminPropLABORCtrl >>> $viewContentLoaded");
        getTotal();
    });

}]);