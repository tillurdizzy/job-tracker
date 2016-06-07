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
        var Sel = ME.P.CostSummary.Sel;
        var Lbr = ME.P.CostSummary.Lbr;

        var Pm = Fx + Base + Lbr;
        var Mu = MARGIN * Pm;

        var clientBase = Fx + Base + Mu + Lbr;

        var clientTotal = Fx + Sel + Mu + Lbr;

        ME.dataObj.Fx = Fx;
        ME.dataObj.Base = Base;
        ME.dataObj.Sel = Sel;
        ME.dataObj.Lbr = Lbr;
        ME.dataObj.Mu = Mu;
        ME.dataObj.Pm = Pm;
        ME.dataObj.clientBase = clientBase;
        ME.dataObj.clientTotal = clientTotal;

        ME.summaryItems = [];

        var item = { item: "Materials - Fx", amount: Fx };
        ME.summaryItems.push(item);

        var item = { item: "Materials - Base", amount: Base };
        ME.summaryItems.push(item);

        var item = { item: "Materials - Sel", amount: Sel };
        ME.summaryItems.push(item);

        item = { item: "Labor", amount: Lbr };
        ME.summaryItems.push(item);

        item = { item: "Profit Margin (Pm)", amount: Pm };
        ME.summaryItems.push(item);

        item = { item: "Markup (% Markup * Pm)", amount: Mu };
        ME.summaryItems.push(item);

        item = { item: "Client Base (before upgrades)", amount: clientBase };
        ME.summaryItems.push(item);

        item = { item: "Client Total (after upgrades)", amount: clientTotal };
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
        dataObj.muPercent = ME.marginDisplay;
        ME.S.updateConfigSummary(dataObj);
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
