'use strict';

app.controller('AdminPropLabor', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'underscore', 'ngDialog',
    function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, underscore, ngDialog) {

        var ME = this;
        ME.S = AdminSharedSrvc;
        ME.LaborTotal = 0;
        ME.P = AdminProposalSrvc;

        ME.laborTableDP = [];

        ME.dataIsSaved = true;

        ME.saveLaborConfig = function() {
            ME.S.saveLaborConfig();
        };

        var getTotal = function() {
            ME.LaborTotal = 0;
            for (var i = 0; i < ME.laborTableDP.length; i++) {
                var x = ME.laborTableDP[i].Total;
                ME.LaborTotal += x;
            }
            ME.P.setSummaryItem("labor", ME.LaborTotal);
        };

        ME.editRowItem = function(laborItem) {
            ME.itemBeingEdited = laborItem;
            $scope.dialogLabel = laborItem.Labor;

            var passedObj = {Item:laborItem.Labor, Price: laborItem.Cost, Qty: laborItem.Qty };

            var dialog = ngDialog.openConfirm({
                template: "views/admin/proposal/ngdialog-editItem-template.html",
                scope: $scope,
                data: passedObj
            }).then(function(value) {
                ME.S.editLaborConfig(value);
            }, function(reason) {

            });
        };

        $scope.$on('onSaveLaborConfig', function(event, obj) {
            ME.dataIsSaved = true;
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
            ME.laborTableDP = ME.S.laborConfig;
            getTotal();
        });

        // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
        $scope.$on('onResetProposalData', function(event, obj) {
            ME.laborTableDP = ME.S.laborConfig;
            getTotal();
        });

        $scope.$watch('$viewContentLoaded', function() {
            console.log("AdminPropLABORCtrl >>> $viewContentLoaded");
            ME.laborTableDP = ME.S.laborConfig;
            getTotal();
        });

    }
]);
