'use strict';

app.controller('AdminPropContract', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'underscore', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, underscore, ngDialog) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    ME.proposalSelected = false;
    var me = "AdminPropContract: ";

    ME.dataIsSaved = true;

    ME.ScopeOfWork = {
        remove_old: true,
        felt_underlayment: true,
        deck_replace: false,
        drip_edge_extender: false,
        drip_edge: true,
        valley_flashing: true,
        valley_flashing_w: false,
        starter_shingles: true,
        field_shingles: true,
        field_shingles_upgrade: false,
        attic_ridge_vents: true,
        ridge_shingles: true,
        ridge_shingles_upgrade: false,
        pipes_vents: true,
        commdeck: false
    };

    var scopeCompareCopy = ME.P.clone(ME.ScopeOfWork);

    ME.materialsList = [
        { item: "Field Shingles", description: "" },
        { item: "Ridge Shingles", description: "" },
        { item: "Starter Shingles", description: "" },
        { item: "Drip Edge", description: "" },
        { item: "Valleys", description: "" },
        { item: "Ventilation System", description: "" }
    ];

    ME.ownerUpgrades = { field: "", ridge: "" }

    ME.saveMyConfig = function() {
        ME.S.saveContractConfig();
    };

    ME.contractChange = function(itemChanged) {
        ME.dataIsSaved = underscore.isEqual(ME.ScopeOfWork, scopeCompareCopy);

        switch(itemChanged){
            case "valley_flashing":ME.ScopeOfWork.valley_flashing_w = !ME.ScopeOfWork.valley_flashing;break;
            case "valley_flashing_w":ME.ScopeOfWork.valley_flashing = !ME.ScopeOfWork.valley_flashing_w;break;
            case "field_shingles":ME.ScopeOfWork.field_shingles_upgrade = !ME.ScopeOfWork.field_shingles;break;
            case "field_shingles_upgrade":ME.ScopeOfWork.field_shingles = !ME.ScopeOfWork.field_shingles_upgrade;break;
            case "ridge_shingles_upgrade":ME.ScopeOfWork.ridge_shingles = !ME.ScopeOfWork.ridge_shingles_upgrade;break;
            case "ridge_shingles":ME.ScopeOfWork.field_shingles_upgrade = !ME.ScopeOfWork.field_shingles;break;
        }
    };


    // Called from below
    var configExists = function() {
        ME.dataIsSaved = true;
        if (ME.S.tabsSubmitted.contract == false && ME.proposalSelected == true) {
            ME.dataIsSaved = false;
        }else if(ME.S.tabsSubmitted.contract == true && ME.proposalSelected == true){
            ME.ScopeOfWork = ME.P.CONFIG.configContract;
        }
        ME.S.trace(me + "configExists()" + "ME.proposalSelected=" + ME.proposalSelected + "  tabsSubmitted.contract=" + ME.S.tabsSubmitted.contract);
    };

    ME.updateConfigContract = function() {
        var clone = ME.P.clone(ME.ScopeOfWork);
        var pairs = underscore.pairs(clone);

        var dataObj = {};
        var dataStr = "";

        for (var i = 0; i < pairs.length; i++) {
            var str1 = pairs[i][0];
            var str2 = pairs[i][1];
            dataStr += str1 + ";" + str2 + "!"
        };

        dataObj.contract = dataStr;
        dataObj.jobID = ME.S.proposalUnderReview.jobID;
        ME.P.updateConfigContract(dataObj);
    };

    $scope.$on('updateConfigContract', function(event, obj) {
        ME.dataIsSaved = true;
        scopeCompareCopy = ME.P.clone(ME.ScopeOfWork);
        ngDialog.open({
            template: '<h2>Contract  have been saved.</h2>',
            className: 'ngdialog-theme-calm',
            plain: true,
            overlay: false
        });
    });


    $scope.$watch('$viewContentLoaded', function() {

        ME.proposalSelected = ME.S.proposalSelected;
        configExists();
    });

}]);
