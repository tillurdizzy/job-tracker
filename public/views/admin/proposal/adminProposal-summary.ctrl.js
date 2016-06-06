'use strict';

app.controller('AdminPropSummary', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'JobConfigSrvc', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, JobConfigSrvc, ngDialog) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    ME.CONFIG = JobConfigSrvc;
    var me = "AdminPropSummary: ";

    ME.summaryItems = [];
    ME.proposalSelected = false;
    ME.dataIsSaved = true;
    var MARGIN = ME.CONFIG.configMargin; // Comes from CONFIG ready to use in calculations i.e. < 1 (.35)
    ME.marginDisplay = MARGIN * 100; // Display as whole integer i.e. 35%
    ME.profitTotal = 0;
    ME.invalidMarginInput = false;


    var getTotal = function() {

        var laborTotal = ME.P.CostSummary.labor;
        var materialsTotal = ME.P.CostSummary.materialsTotal;
        var basePrice = ME.S.basePrice.Total + ME.P.CostSummary.materialsFixed + laborTotal;
        ME.profitTotal = MARGIN * basePrice;
        var clientPrice = basePrice + ME.profitTotal;

        ME.totalCost = laborTotal + materialsTotal; // Actual out-of-pocket expenditures

        ME.summaryItems = [];

        var item = { item: "Materials", amount: materialsTotal };
        ME.summaryItems.push(item);

        item = { item: "Labor", amount: laborTotal };
        ME.summaryItems.push(item);

        item = { item: "Margin", amount: basePrice };
        ME.summaryItems.push(item);

        item = { item: "Profit", amount: ME.profitTotal };
        ME.summaryItems.push(item);

        item = { item: "Client Price", amount: clientPrice };
        ME.summaryItems.push(item);

        var item = { item: "Base", amount: basePrice };
        ME.summaryItems.push(item);
        
        ME.S.trace(me + "getTotal " + ME.summaryItems);
    };

    ME.marginChange = function() {
        ME.S.trace(me + "marginChange()");
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

    ME.saveMyConfig = function() {
        var dataObj = {};
        dataObj.margin = ME.marginDisplay;
        dataObj.profitMargin = ME.profitTotal;
        ME.S.updateMarginConfig(dataObj);
    };

    var configExists = function() {
        ME.dataIsSaved = !ME.S.summarySaveNeeded;
        if (ME.S.tabsSubmitted.margin == false && ME.proposalSelected == true) {
            ME.dataIsSaved = false;
        }
        ME.S.trace(me + "configExists()" + "ME.proposalSelected=" + ME.proposalSelected + "  tabsSubmitted.summary=" + ME.S.tabsSubmitted.margin);
    };

    $scope.$on('onSaveMarginConfig', function(event, obj) {
        ME.dataIsSaved = true;
        ME.CONFIG.configMargin = MARGIN;
        ME.S.summarySaveNeeded = false;
        ngDialog.open({
            template: '<h2>Margin Config Saved.</h2>',
            className: 'ngdialog-theme-calm',
            plain: true,
            overlay: false
        });
    });

    // Broadcast from AdminSharedSrvc >>> categorizeMaterials each time a proposal is selected
    $scope.$on('onRefreshMaterialsData', function(event, obj) {
        ME.proposalSelected = ME.S.proposalSelected;
        configExists();
        getTotal();
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
        ME.dataIsSaved = true;
        ME.proposalSelected = false;
        getTotal();
    });

    $scope.$watch('$viewContentLoaded', function() {
        ME.S.trace(me + "$viewContentLoaded");
        ME.proposalSelected = ME.S.proposalSelected;
        configExists();
        getTotal();
    });

}]);
