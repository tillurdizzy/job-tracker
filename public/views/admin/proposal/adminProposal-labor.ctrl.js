'use strict';

app.controller('AdminPropLabor', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'underscore', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, underscore, ngDialog) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.LaborTotal = 0;
    ME.P = AdminProposalSrvc;
    ME.proposalSelected = false;
    ME.laborTableDP = [];
    var me = "AdminPropLabor: ";

    ME.dataIsSaved = true;

    // If there is no labor config saved, it gets created by CONFIG through mergeLaborConfig 
    // When proposal is selected
    ME.saveMyConfig = function() {
        ME.S.saveLaborConfig(null);
    };

    var getTotal = function() {
        ME.LaborTotal = ME.S.laborTotal;
        ME.P.setSummaryItem("Lbr", ME.LaborTotal);
    };

    ME.editRowItem = function(laborItem) {
        ME.itemBeingEdited = laborItem;
        $scope.dialogLabel = laborItem.Labor;

        var passedObj = { Labor: laborItem.Labor, Cost: laborItem.Cost, Qty: laborItem.Qty };

        var dialog = ngDialog.openConfirm({
            template: "views/admin/proposal/ngdialog-editLabor-template.html",
            scope: $scope,
            data: passedObj
        }).then(function(value) {
            ME.S.saveLaborConfig(value);
        }, function(reason) {

        });
    };

    // Called from $viewContentLoaded
    // Labor, Summary and Contract tabs are different because they can be edited and saved
    var configExists = function() {
        ME.dataIsSaved = true;
        if (ME.S.tabsSubmitted.labor == false && ME.proposalSelected == true) {
            ME.dataIsSaved = false;
        }
        ME.S.trace(me + "configExists(): " + "ME.proposalSelected="+ME.proposalSelected + "  tabsSubmitted.labor=" + ME.S.tabsSubmitted.labor);
    };


    $scope.$on('onSaveLaborConfig', function(event, obj) {
        ME.dataIsSaved = true;
        ME.S.summarySaveNeeded = true;
        getTotal();
        ngDialog.open({
            template: '<h2>Labor costs have been saved.</h2>',
            className: 'ngdialog-theme-calm',
            plain: true,
            overlay: false
        });
    });

    // Broadcast from AdminSharedSrvc >>> categorizeMaterials each time a proposal is selected
    $scope.$on('onRefreshMaterialsData', function(event, obj) {
        ME.laborTableDP = ME.S.laborConfig;
        ME.proposalSelected = ME.S.proposalSelected;
        configExists();
        getTotal();
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
        ME.laborTableDP = ME.S.laborConfig;
        ME.dataIsSaved = true;
        ME.proposalSelected = false;
        getTotal();
    });

    $scope.$watch('$viewContentLoaded', function() {
        //console.log("AdminPropLABORCtrl >>> $viewContentLoaded");
        ME.laborTableDP = ME.S.laborConfig;
        ME.proposalSelected = ME.S.proposalSelected;
        configExists();
        getTotal();
    });

}]);
