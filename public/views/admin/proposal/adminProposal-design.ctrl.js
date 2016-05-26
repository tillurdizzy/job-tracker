'use strict';

app.controller('AdminPropDesign', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, ngDialog) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    ME.GrandTotal = 0;
    ME.ShinglesFieldTotal = 0;
    ME.ShinglesRidgeTotal = 0;
    ME.ShinglesStarterTotal = 0;
    ME.VentsTotal = 0;
    ME.FlashingTotal = 0;
    ME.EdgeTotal = 0;
    ME.ValleyTotal = 0;
    ME.CapsTotal = 0;
    ME.FlatTotal = 0;
    ME.OtherTotal = 0;
    ME.dataIsSaved = true;
    ME.proposalSelected = false;
    ME.itemBeingEdited = {};

    ME.materialPricingDP = ME.S.materialsCatergorized;

    ME.toggleCheckBox = function() {
        ME.dataIsSaved = false;
        ME.getTotal();
    };

    ME.saveJobConfig = function() {
        ME.dataIsSaved = ME.S.saveJobConfig();
    };

    ME.editRowItem = function(materialObj, cat) {
        ME.itemBeingEdited = materialObj;
        $scope.dialogLabel = materialObj.Item;

        var passedObj = { Price: materialObj.PkgPrice, Qty: materialObj.Qty, Category: materialObj.Category, ID: materialObj.PRIMARY_ID };

        var dialog = ngDialog.openConfirm({
            template: "views/admin/proposal/ngdialog-editItem-template.html",
            scope: $scope,
            data: passedObj
        }).then(function(value) {
            ME.S.editDesignMaterial(value);
        }, function(reason) {

        });
    };

    // ME.getTotal() called every time a checkbox is changed on pricing tab view
    ME.getTotal = function() {
        ME.ShinglesFieldTotal = 0;
        ME.ShinglesStarterTotal = 0;
        ME.ShinglesRidgeTotal = 0;
        ME.VentsTotal = 0;
        ME.FlashingTotal = 0;
        ME.ValleyTotal = 0;
        ME.EdgeTotal = 0;
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
                ME.ShinglesFieldTotal += Number(ME.materialPricingDP.Field[i].Total);
            }
        };
        ME.GrandTotal +=  ME.ShinglesFieldTotal;

        for (var i = 0; i < ME.materialPricingDP.Starter.length; i++) {
            include = ME.materialPricingDP.Starter[i].Checked;
            if (include) {
                ME.ShinglesStarterTotal += Number(ME.materialPricingDP.Starter[i].Total);
            }
        };
        ME.GrandTotal +=  ME.ShinglesStarterTotal;

        for (var i = 0; i < ME.materialPricingDP.Ridge.length; i++) {
            include = ME.materialPricingDP.Ridge[i].Checked;
            if (include) {
                ME.ShinglesRidgeTotal += Number(ME.materialPricingDP.Ridge[i].Total);
            }
        };
        ME.GrandTotal +=  ME.ShinglesRidgeTotal;

        for (var i = 0; i < ME.materialPricingDP.Vents.length; i++) {
            include = ME.materialPricingDP.Vents[i].Checked;
            if (include) {
                ME.VentsTotal += Number(ME.materialPricingDP.Vents[i].Total);
            }
        };
        ME.GrandTotal +=  ME.VentsTotal;

        for (var i = 0; i < ME.materialPricingDP.Flashing.length; i++) {
            include = ME.materialPricingDP.Flashing[i].Checked;
            if (include) {
                ME.FlashingTotal += Number(ME.materialPricingDP.Flashing[i].Total);
            }
        };
        ME.GrandTotal +=  ME.FlashingTotal;

        for (var i = 0; i < ME.materialPricingDP.Valley.length; i++) {
            include = ME.materialPricingDP.Valley[i].Checked;
            if (include) {
                ME.ValleyTotal += Number(ME.materialPricingDP.Valley[i].Total);
            }
        };
        ME.GrandTotal +=  ME.ValleyTotal;

        for (var i = 0; i < ME.materialPricingDP.Edge.length; i++) {
            include = ME.materialPricingDP.Edge[i].Checked;
            if (include) {
                ME.EdgeTotal += Number(ME.materialPricingDP.Edge[i].Total);
            }
        };
        ME.GrandTotal +=  ME.EdgeTotal;

        for (var i = 0; i < ME.materialPricingDP.Flat.length; i++) {
            include = ME.materialPricingDP.Flat[i].Checked;
            if (include) {
                ME.FlatTotal += Number(ME.materialPricingDP.Flat[i].Total);
            }
        };
        ME.GrandTotal +=  ME.FlatTotal;

        for (var i = 0; i < ME.materialPricingDP.Caps.length; i++) {
            include = ME.materialPricingDP.Caps[i].Checked;
            if (include) {
                ME.CapsTotal += Number(ME.materialPricingDP.Caps[i].Total);
            }
        };
        ME.GrandTotal +=  ME.CapsTotal;

        for (var i = 0; i < ME.materialPricingDP.Other.length; i++) {
            include = ME.materialPricingDP.Other[i].Checked;
            if (include) {
                ME.OtherTotal += Number(ME.materialPricingDP.Other[i].Total);
            }
        };
        ME.GrandTotal +=  ME.OtherTotal;

        //ME.baseTotal = "";
        
        ME.P.setSummaryItem("materials", ME.GrandTotal);
        //ME.S.basePrice.Total = ME.GrandTotal;
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
    });

    $scope.$on('onSaveJobConfig', function() {
        ME.dataIsSaved = true;
        ME.getTotal();
        ngDialog.open({
            template: '<h2>Job Config saved.</h2>',
            className: 'ngdialog-theme-default',
            plain: true,
            overlay: false
        });
    });

    // Broadcast from Shared after materialsCatergorized has been updated with change in Qty or Price from ME.editRowItem()
    //
    $scope.$on('onEditDesignMaterial', function() {
        ME.dataIsSaved = false;
        ME.getTotal();
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
        ME.materialPricingDP = ME.S.materialsCatergorized;
        ME.proposalSelected = false;
        ME.dataIsSaved = true;
        ME.getTotal();
    });

    $scope.$watch('$viewContentLoaded', function() {
        ME.materialPricingDP = ME.S.materialsCatergorized;
        ME.proposalSelected = false;
        ME.dataIsSaved = true;
        ME.getTotal();
    });

}]);
