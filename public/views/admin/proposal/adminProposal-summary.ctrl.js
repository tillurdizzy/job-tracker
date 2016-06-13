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
    ME.dataObj = {};
    ME.invalidMarginInput = false;


    var getTotal = function() {

        var Fx = ME.P.CostSummary.Fx;
        var Base = ME.S.basePrice.Total;
        var Upgrade = ME.P.CostSummary.Upgrade;
        var Lbr = ME.P.CostSummary.Lbr;

        var Bc = Fx + Base + Lbr;// Base Cost
        var MuB = MARGIN * Bc; // Markup Base

        var Uc = Fx + Upgrade + Lbr;// Upgrade Cost
        var MuU = MARGIN * Uc;// Markup Upgrade

        var clientBase = Fx + Base + MuB + Lbr;

        var clientTotal = Fx + Upgrade + MuU + Lbr;

        ME.dataObj.Fx = ME.S.decimalPrecisionTwo(Fx);
        ME.dataObj.Base = ME.S.decimalPrecisionTwo(Base);
        ME.dataObj.Upgrade = ME.S.decimalPrecisionTwo(Upgrade);
        ME.dataObj.Lbr = ME.S.decimalPrecisionTwo(Lbr);
        ME.dataObj.MuB = ME.S.decimalPrecisionTwo(MuB);
        ME.dataObj.MuU = ME.S.decimalPrecisionTwo(MuU);
        ME.dataObj.Bc = ME.S.decimalPrecisionTwo(Bc);
        ME.dataObj.Uc = ME.S.decimalPrecisionTwo(Uc);
        ME.dataObj.clientBase = ME.S.decimalPrecisionTwo(clientBase);
        ME.dataObj.clientTotal = ME.S.decimalPrecisionTwo(clientTotal);

        ME.summaryItems = [];

        var item = { item: "Materials Fixed - Fx", amount: Fx };
        ME.summaryItems.push(item);

        var item = { item: "Materials - Base", amount: Base };
        ME.summaryItems.push(item);

        var item = { item: "Materials - Upgrd", amount: Upgrade };
        ME.summaryItems.push(item);

        item = { item: "Labor", amount: Lbr };
        ME.summaryItems.push(item);

        item = { item: "Total Cost Base", amount: Bc };
        ME.summaryItems.push(item);

        item = { item: "Markup Base (MuB)", amount: MuB };
        ME.summaryItems.push(item);

        item = { item: "Client Base Total (before upgrades)", amount: clientBase };
        ME.summaryItems.push(item);

        item = { item: "Total Cost Upgrades", amount: Uc };
        ME.summaryItems.push(item);

        item = { item: "Markup Upgrades (MuC)", amount: MuB };
        ME.summaryItems.push(item);

        item = { item: "Client Upgraded Total (after upgrades)", amount: clientTotal };
        ME.summaryItems.push(item);

        ME.S.trace(me + "getTotal");
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
        ME.dataObj.muPercent = ME.marginDisplay;
        ME.S.updateConfigSummary(ME.dataObj);
    };

    var configExists = function() {
        ME.dataIsSaved = !ME.S.summarySaveNeeded;
        if (ME.S.tabsSubmitted.summary == false && ME.proposalSelected == true) {
            ME.dataIsSaved = false;
        }
        ME.S.trace(me + "configExists()" + "ME.proposalSelected=" + ME.proposalSelected + "  tabsSubmitted.summary=" + ME.S.tabsSubmitted.summary);
    };

    $scope.$on('onSaveSummaryConfig', function(event, obj) {
        ME.dataIsSaved = true;
        ME.CONFIG.configMargin = MARGIN;
        ME.S.summarySaveNeeded = false;
        ngDialog.open({
            template: '<h2>Summary has been saved. Thank you!</h2>',
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
