'use strict';

app.controller('ReviewCtrl', ['$scope', '$state', 'ClientSharedSrvc', 'ngDialog', '$controller', 'JobConfigSrvc', function($scope, $state, ClientSharedSrvc, ngDialog, $controller, JobConfigSrvc) {

    var ME = this;
    
    var me = "ClientCtrl: ";
    // Selections and pricing specific to a job
    ME.jobConfig = [];
    var jobParams = {};

    ME.CONFIG = JobConfigSrvc;
    ME.C = ClientSharedSrvc;
    ME.UpgradeRidgeCaps = {};
    ME.UpgradeDripEdge = {};
    ME.baseLineTotal = ME.C.baseLineTotal;
    ME.grandTotal = ME.baseLineTotal;
    ME.imagePath = "client/img/";
    ME.selectedPhoto = { path: "", cap: "" };
    ME.shingleManufacturer = "GAF";

    // These are to control the ng-show DOM elements
    ME.UpgradeFieldNdx = "";
    ME.UpgradeRidgeNdx = "";
    ME.UpgradeValleyNdx = "";
    ME.UpgradeTrimNdx = "";

    ME.showUpgrades = { field: true, ridge: false, valley: false, trim: false };

    ME.calculateTotal = function() {
        ME.C.trace(me + "calculateTotal()");
        var fieldCost = 0;
        var ridgeCost = 0;
        var valleyCost = 0;
        var trimCost = 0;

        for (var i = 0; i < ME.shingleUpgrades.length; i++) {
            if (ME.shingleUpgrades[i].Code === ME.UpgradeFieldNdx) {
                fieldCost = Number(ME.shingleUpgrades[i].upgradePrice);
                break;
            }
        };

        for (var i = 0; i < ME.ridgeUpgrades.length; i++) {
            if (ME.ridgeUpgrades[i].Code === ME.UpgradeRidgeNdx) {
                ridgeCost = Number(ME.ridgeUpgrades[i].upgradePrice);
                break;
            }
        };

        for (var i = 0; i < ME.valleyUpgrades.length; i++) {
            if (ME.valleyUpgrades[i].Code === ME.UpgradeValleyNdx) {
                valleyCost = Number(ME.valleyUpgrades[i].upgradePrice);
                break;
            }
        };

        for (var i = 0; i < ME.trimUpgrades.length; i++) {
            if (ME.trimUpgrades[i].Code === ME.UpgradeTrimNdx) {
                trimCost = Number(ME.trimUpgrades[i].upgradePrice);
                break;
            }
        };

        var base = Number(ME.baseLineTotal);
        ME.grandTotal = base + fieldCost + ridgeCost + valleyCost + trimCost;

        // DOM vars to show Ridge Selections that match Field manufacturer
        var firstChar = ME.UpgradeFieldNdx[0];
        if (firstChar === "G") {
            ME.shingleManufacturer = "GAF";
        } else {
            ME.shingleManufacturer = "OC";
        }
    };

    ME.saveJobConfig = function() {
        var dataObj = [
            { Category: 'Field', Code: ME.UpgradeFieldNdx },
            { Category: 'Ridge', Code: ME.UpgradeRidgeNdx },
            { Category: 'Valley', Code: ME.UpgradeValleyNdx },
            { Category: 'Edge', Code: ME.UpgradeTrimNdx }
        ];

        ME.C.saveClientUpgrades(dataObj);
    };


    ME.thumbClick = function(ndx) {
        ME.selectedPhoto.path = ME.C.photoGallery[ndx].full;
        ME.selectedPhoto.cap = ME.C.photoGallery[ndx].cap;
        var myTemplate = "client/js/full.tpl.html";
        ngDialog.open({
            template: myTemplate,
            scope: $scope,
            controller: $controller('DialogCtrl', { $scope: $scope, dataObj: ME.selectedPhoto })
        });
    };

    var getUpgradeOptions = function() {
        ME.C.trace(me + "getUpgradeOptions()");
        ME.shingleUpgrades = ME.C.getUpgrades("Field");
        ME.ridgeUpgrades = ME.C.getUpgrades("Ridge");
        ME.valleyUpgrades = ME.C.getUpgrades("Valley");
        ME.trimUpgrades = ME.C.getUpgrades("Edge");
    };

    var setSelections = function() {
        ME.C.trace(me + "setSelections()");
        for (var i = 0; i < ME.shingleUpgrades.length; i++) {
            if (ME.shingleUpgrades[i].Checked === true) {
                ME.UpgradeFieldNdx = ME.shingleUpgrades[i].Code;
                break;
            }
        };

        for (i = 0; i < ME.ridgeUpgrades.length; i++) {
            if (ME.ridgeUpgrades[i].Checked === true) {
                ME.UpgradeRidgeNdx = ME.ridgeUpgrades[i].Code;
                break;
            }
        };

        for (i = 0; i < ME.valleyUpgrades.length; i++) {
            if (ME.valleyUpgrades[i].Checked === true) {
                ME.UpgradeValleyNdx = ME.valleyUpgrades[i].Code;
                break;
            }
        };

        for (i = 0; i < ME.trimUpgrades.length; i++) {
            if (ME.trimUpgrades[i].Checked === true) {
                ME.UpgradeTrimNdx = ME.trimUpgrades[i].Code;
                break;
            }
        };
    };

    $scope.$watch('$viewContentLoaded', function() {
        ME.C.trace(me + "$viewContentLoaded()");
        var loggedIn = ME.C.loggedIn;
        if (!loggedIn) {
            $state.transitionTo('login');
        };
    });


    $scope.$on('client-upgrades-saved', function() {
        ngDialog.open({
            template: '<h2>Your upgrades have been saved!</h2>',
            className: 'ngdialog-theme-default',
            plain: true,
            overlay: true
        });
    });

    getUpgradeOptions();
    setSelections();
    ME.calculateTotal();


}]);
