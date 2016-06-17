'use strict';

app.controller('AdminPropContract', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', 'underscore', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminProposalSrvc, underscore, ngDialog) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    ME.proposalSelected = false;
    var me = "AdminPropContract: ";

    ME.dataIsSaved = true;

    ME.ScopeOfWork = {
        remove_old:true,
        felt_underlayment:true,
        deck_replace:false,
        drip_edge_extender:false,
        drip_edge:true,
        valley_flashing:true,
        valley_flashing_w:false,
        starter_shingles:true,
        field_shingles:true,
        field_shingles_upgrade:false,
        attic_ridge_vents:true,
        ridge_shingles:true,
        ridge_shingles_upgrade:false,
        pipes_vents:true
    };

    ME.materialsList = [
        {item:"Field Shingles",description:"",
        {item:"Ridge Shingles",description:"",
        {item:"Starter Shingles",description:"",
        {item:"Drip Edge",description:"",
        {item:"Valleys",description:"",
        {item:"Ventilation System",description:"",
    ];

    ME.ownerUpgrades = {field:"",ridge:""}

    // If there is no labor config saved, it gets created by CONFIG through mergeLaborConfig 
    // When proposal is selected
    ME.saveMyConfig = function() {
        ME.S.saveContractConfig();
    };

   
    // Called from below
    var configExists = function() {
        ME.dataIsSaved = true;
        if (ME.S.tabsSubmitted.contract == false && ME.proposalSelected == true) {
            ME.dataIsSaved = false;
        }
        ME.S.trace(me + "configExists()" + "ME.proposalSelected="+ME.proposalSelected + "  tabsSubmitted.contract=" + ME.S.tabsSubmitted.contract);
    };

    $scope.$on('onSaveContractConfig', function(event, obj) {
        ME.dataIsSaved = true;
        ME.S.summarySaveNeeded = true;
        getTotal();
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
