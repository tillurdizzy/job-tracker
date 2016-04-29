'use strict';

app.controller('AdminPropSupplies', ['$state', '$scope', 'AdminSharedSrvc', 'AdminProposalSrvc', function($state, $scope, AdminSharedSrvc,AdminProposalSrvc) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    ME.P = AdminProposalSrvc;
    
    ME.supplies = [];
    ME.suppliesTotal = ME.P.CostSummary.supplies;

    ME.filterMaterials = function() {
        ME.supplies = [];
        // Find the "included" selected material for each category (which in most cases is just one item...)
        var include = false;
        for (var i = 0; i < ME.S.materialsCatergorized.Field.length; i++) {
            include = ME.S.materialsCatergorized.Field[i].Checked;
            if (include) {
               ME.supplies.push(ME.S.materialsCatergorized.Field[i]);
            }
        };

        for (var i = 0; i < ME.S.materialsCatergorized.Ridge.length; i++) {
            include = ME.S.materialsCatergorized.Ridge[i].Checked;
            if (include) {
                 ME.supplies.push(ME.S.materialsCatergorized.Ridge[i]);
            }
        };

        for (var i = 0; i < ME.S.materialsCatergorized.Vents.length; i++) {
            include = ME.S.materialsCatergorized.Vents[i].Checked;
            if (include) {
                 ME.supplies.push(ME.S.materialsCatergorized.Vents[i]);
            }
        };

        for (var i = 0; i < ME.S.materialsCatergorized.Flashing.length; i++) {
            include = ME.S.materialsCatergorized.Flashing[i].Checked;
            if (include) {
                 ME.supplies.push(ME.S.materialsCatergorized.Flashing[i]);
            }
        };

        for (var i = 0; i < ME.S.materialsCatergorized.Flat.length; i++) {
            include = ME.S.materialsCatergorized.Flat[i].Checked;
            if (include) {
                 ME.supplies.push(ME.S.materialsCatergorized.Flat[i]);
            }
        };

        for (var i = 0; i < ME.S.materialsCatergorized.Caps.length; i++) {
            include = ME.S.materialsCatergorized.Caps[i].Checked;
            if (include) {
                 ME.supplies.push(ME.S.materialsCatergorized.Caps[i]);
            }
        };

        for (var i = 0; i < ME.S.materialsCatergorized.Other.length; i++) {
            include = ME.S.materialsCatergorized.Other[i].Checked;
            if (include) {
                 ME.supplies.push(ME.S.materialsCatergorized.Other[i]);
            }
        };

    };

    // Broadcast from AdminSharedSrvc >>> setParams
    $scope.$on('onRefreshMaterialsData', function(event, obj) {
        ME.filterMaterials();
    });

    // Broadcast from AdminSharedSrvc >>> selectProposal (user selected prompt -1 from dropdown i.e. there is no proposal selected)
    $scope.$on('onResetProposalData', function(event, obj) {
        ME.filterMaterials();
    });

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminPropSUPPLIESCtrl >>> $viewContentLoaded");
        ME.filterMaterials();
    });

}]);