'use strict';

app.controller('AdminPropPricing', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    ME.GrandTotal = 0;
    ME.ShinglesFieldTotal = 0;
    ME.ShinglesRidgeTotal = 0;
    ME.VentsTotal = 0;
    ME.FlashingTotal = 0;
    ME.CapsTotal = 0;
    ME.FlatTotal = 0;
    ME.OtherTotal = 0;
    ME.dataIsSaved = true;
    ME.proposalSelected = false;

    ME.materialPricingDP = ME.S.materialsCatergorized;

    ME.toggleCheckBox = function() {
        ME.dataIsSaved = false;
        ME.getTotal();
    };

    ME.saveJobConfig = function() {
        ME.dataIsSaved = ME.S.saveJobConfig();
    };

    // ME.getTotal() called every time a checkbox is changed on pricing tab view
    ME.getTotal = function() {
        ME.ShinglesFieldTotal = 0;
        ME.ShinglesRidgeTotal = 0;
        ME.VentsTotal = 0;
        ME.FlashingTotal = 0;
        ME.CapsTotal = 0;
        ME.FlatTotal = 0;
        ME.OtherTotal = 0;
        ME.GrandTotal = 0;

        var include = false;

        // Find the "included" selected material for each category (which in most cases is just one item...)
        //
        for (var i = 0; i < ME.materialPricingDP.Field.length; i++) {
            include = ME.materialPricingDP.Field[i].Checked;
            if (include) {
                ME.ShinglesFieldTotal += parseInt(ME.materialPricingDP.Field[i].Total);
            }
        };

        for (var i = 0; i < ME.materialPricingDP.Ridge.length; i++) {
            include = ME.materialPricingDP.Ridge[i].Checked;
            if (include) {
                ME.ShinglesRidgeTotal += parseInt(ME.materialPricingDP.Ridge[i].Total);
            }
        };

        for (var i = 0; i < ME.materialPricingDP.Vents.length; i++) {
            include = ME.materialPricingDP.Vents[i].Checked;
            if (include) {
                ME.VentsTotal += parseInt(ME.materialPricingDP.Vents[i].Total);
            }
        };

        for (var i = 0; i < ME.materialPricingDP.Flashing.length; i++) {
            include = ME.materialPricingDP.Flashing[i].Checked;
            if (include) {
                ME.FlashingTotal += parseInt(ME.materialPricingDP.Flashing[i].Total);
            }
        };

        for (var i = 0; i < ME.materialPricingDP.Flat.length; i++) {
            include = ME.materialPricingDP.Flat[i].Checked;
            if (include) {
                ME.FlatTotal += parseInt(ME.materialPricingDP.Flat[i].Total);
            }
        };

        for (var i = 0; i < ME.materialPricingDP.Caps.length; i++) {
            include = ME.materialPricingDP.Caps[i].Checked;
            if (include) {
                ME.CapsTotal += parseInt(ME.materialPricingDP.Caps[i].Total);
            }
        };

        for (var i = 0; i < ME.materialPricingDP.Other.length; i++) {
            include = ME.materialPricingDP.Other[i].Checked;
            if (include) {
                ME.OtherTotal += parseInt(ME.materialPricingDP.Other[i].Total);
            }
        };

        ME.GrandTotal = ME.ShinglesFieldTotal + ME.ShinglesRidgeTotal + ME.VentsTotal + ME.FlashingTotal + ME.FlatTotal + ME.CapsTotal + ME.OtherTotal;

        ME.P.setSummaryItem("materials", ME.GrandTotal);

    };

    var configExists = function() {
        ME.dataIsSaved = true;
        if (ME.S.jobConfig.length == 0 && ME.proposalSelected == true) {
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
