'use strict';

app.controller('AdminPropLabor', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'underscore', 'ngDialog',
    function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, underscore, ngDialog) {

        var ME = this;
        ME.S = AdminSharedSrvc;
        ME.LaborTotal = 0;
        ME.P = AdminProposalSrvc;

        // Labor
        // To convert linear feet to Bundles divide by 35 i.e. there are enough shingles in a bundle to cover 35ft if you lay them end to end...
        // To convert Bndls to Sqs for Labor ... divide by 3.33!
        var propertyInputParams;
        var totalSquares;
        var linerFt; // Rake + Top + Perimeter
        var linearToSqs;

        var LaborCosts = {};

        ME.laborCostItems = [];

        ME.dataIsSaved = true;

        ME.saveJobConfig = function() {
            //var dataStr =
            ME.dataIsSaved = ME.S.saveLaborConfig();
        };

        // 
        var getTotal = function() {
            ME.laborCostItems = [];

            LaborCosts.shingles = 55;
            propertyInputParams = ME.S.proposalUnderReview.propertyInputParams;
            //laborCurrent = "";

            if (propertyInputParams != undefined) {

                validateParams();

                linerFt = parseInt(propertyInputParams.TOPRDG) + parseInt(propertyInputParams.RKERDG) + parseInt(propertyInputParams.PRMITR);
                linearToSqs = (linerFt / 35) / 3.3;
                totalSquares = parseInt(propertyInputParams.FIELD) + linearToSqs;
                totalSquares = Math.ceil(totalSquares);
                var laborShingles = parseInt(totalSquares * LaborCosts.square);

                var deckSquaresQty = 0;
                var flatSquaresQty = 0;

                var laborDeck = 0;
                var laborFlat = 0;

                var tableRow = {};
                tableRow.labor = "Shingles";
                tableRow.qty = totalSquares;
                tableRow.units = "Sqs";
                tableRow.cost = LaborCosts.square;
                tableRow.total = laborShingles;
                ME.laborCostItems.push(tableRow);

                tableRow = {};
                tableRow.labor = "Flat / Low Slope";
                tableRow.qty = flatSquaresQty;
                tableRow.units = "Sqs";
                tableRow.cost = LaborCosts.flat;
                tableRow.total = laborFlat;
                ME.laborCostItems.push(tableRow);

                tableRow = {};
                tableRow.labor = "Re-Decking";
                tableRow.qty = deckSquaresQty;
                tableRow.units = "Sqs";
                tableRow.cost = LaborCosts.deck;
                tableRow.total = laborDeck;
                ME.laborCostItems.push(tableRow);

                tableRow = {};
                tableRow.labor = "Other";
                tableRow.qty = "0";
                tableRow.units = "Each";
                tableRow.cost = LaborCosts.other;
                tableRow.total = 0;
                ME.laborCostItems.push(tableRow);

                ME.LaborTotal = laborShingles + laborDeck + laborFlat;

                ME.P.setSummaryItem("labor", ME.LaborTotal);
            }
        };

        ME.editRowItem = function(laborItem) {
            ME.itemBeingEdited = laborItem;
            $scope.dialogLabel = laborItem.labor;

            var passedObj = { Price: laborItem.cost, Qty: laborItem.qty };

            var dialog = ngDialog.openConfirm({
                template: "views/admin/proposal/ngdialog-editItem-template.html",
                scope: $scope,
                data: passedObj
            }).then(function(value) {
                ME.S.editMaterial(value);
            }, function(reason) {

            });
        };

        // Remove the dashes and blanks to ensure everything is a Number
        var validateParams = function() {
            for (var prop in propertyInputParams) {
                if (!propertyInputParams.hasOwnProperty(prop)) {
                    //The current property is not a direct property of p
                    continue;
                }
                var x = propertyInputParams[prop];
                var xInt = parseInt(x);
                if (isNaN(x)) {
                    propertyInputParams[prop] = 0;
                } else {
                    propertyInputParams[prop] = xInt;
                }
            }
        };

        var configExists = function() {
            ME.dataIsSaved = true;
            if (ME.S.jobConfig.length == 0 && ME.proposalSelected == true) {
                ME.dataIsSaved = false;
            }
        };

        var loadLabor = function() {
            LaborCosts = ME.S.LABOR;
            if (LaborCosts.hasOwnProperty("square")) {
                LaborCosts.square = parseInt(LaborCosts.square);
                LaborCosts.deck = parseInt(LaborCosts.deck);
                LaborCosts.flat = parseInt(LaborCosts.flat);
                LaborCosts.other = 25;
            }
        };

        $scope.$on('onSaveLaborConfig', function(event, obj) {
            ngDialog.open({
                template: '<h2>Labor Config saved.</h2>',
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
            console.log("AdminPropLABORCtrl >>> $viewContentLoaded");
            loadLabor();

            getTotal();
        });

    }
]);
