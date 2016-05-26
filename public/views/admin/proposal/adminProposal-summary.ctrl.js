'use strict';

app.controller('AdminPropSummary', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'JobConfigSrvc', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, JobConfigSrvc) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    ME.CONFIG = JobConfigSrvc;
    var laborTotal = 0;
    var materialsTotal = 0;
    var marginTotal = 0;
    ME.totalCost = 0;
    ME.summaryItems = [];
    ME.dataIsSaved = true;
    var MARGIN = ME.CONFIG.configMargin; // Comes from CONFIG ready to use in calculations i.e. < 1 (.35)
    ME.marginDisplay = MARGIN * 100; // Display as whole integer i.e. 35%

    ME.invalidMarginInput = false;

    var getTotal = function() {
        laborTotal = ME.P.CostSummary.labor;
        materialsTotal = ME.P.CostSummary.materials;
        var subtotal = laborTotal + materialsTotal;
        marginTotal = subtotal * MARGIN;
        ME.totalCost = laborTotal + materialsTotal + marginTotal;

        ME.summaryItems = [];
        var item = { item: "Materials", amount: materialsTotal };
        ME.summaryItems.push(item);
        item = { item: "Labor", amount: laborTotal };
        ME.summaryItems.push(item);
        item = { item: "Margin", amount: marginTotal };
        ME.summaryItems.push(item);
    };

    ME.marginChange = function() {
        var marginEdit = parseInt(ME.marginDisplay);
        if (isNaN(marginEdit)) {
            return;
        }
        var compareMargin = MARGIN * 100;
        if (compareMargin != marginEdit) {
            if (marginEdit > 10 && marginEdit < 100) {
                MARGIN = marginEdit / 100;
                ME.dataIsSaved = false;
                getTotal();
            }
        }
    };

    ME.saveMarginConfig = function() {
        ME.S.saveMarginConfig(ME.marginDisplay);
    };

    $scope.$on('onSaveMarginConfig', function(event, obj) {
        ME.dataIsSaved = true;
        ME.CONFIG.configMargin = MARGIN;
        ngDialog.open({
            template: '<h2>Margin Config Saved.</h2>',
            className: 'ngdialog-theme-calm',
            plain: true,
            overlay: false
        });
    });

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
        //console.log("SUMMARY Ctrl >>> $viewContentLoaded");
        getTotal();
    });

}]);
