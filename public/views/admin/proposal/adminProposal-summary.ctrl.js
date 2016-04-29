'use strict';

app.controller('AdminPropSummary', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    var laborTotal = 0;
    var materialsTotal = 0;
    ME.totalCost = 0;
    ME.summaryItems = [];

    var getTotal = function() {
        laborTotal = ME.P.CostSummary.labor;
        materialsTotal = ME.P.CostSummary.materials;
        ME.totalCost = laborTotal + materialsTotal;

        ME.summaryItems = [];
        var item = { item: "Materials", amount: materialsTotal };
        ME.summaryItems.push(item);
        item = { item: "Labor", amount: laborTotal };
        ME.summaryItems.push(item);
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
        console.log("SUMMARY Ctrl >>> $viewContentLoaded");
        getTotal();
    });

}]);
