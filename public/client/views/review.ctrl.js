'use strict';

app.controller('ReviewCtrl', ['$scope', '$window','$state', 'ClientSharedSrvc', 'ngDialog', '$controller', 'JobConfigSrvc','ListSrvc', function($scope,$window, $state, ClientSharedSrvc, ngDialog, $controller, JobConfigSrvc,ListSrvc) {

    var ME = this;

    var me = "ClientCtrl: ";
    // Selections and pricing specific to a job
    ME.jobConfig = [];
    var jobParams = {};
    ME.dataObj = {};

    ME.CONFIG = JobConfigSrvc;
    ME.C = ClientSharedSrvc;
    ME.L = ListSrvc;
    ME.UpgradeRidgeCaps = {};
    ME.UpgradeDripEdge = {};
    ME.costSummary = ME.CONFIG.costSummary;
    ME.baseLineTotal = ME.CONFIG.costSummary.clientBase;
    ME.grandTotal = ME.CONFIG.costSummary.clientTotal;
    ME.imagePath = "client/img/";
    ME.selectedPhoto = { path: "", cap: "" };
    ME.shingleManufacturer = null;
    ME.dataIsSaved = true;

    ME.shingleColors = []; // DP to choose from

    ME.shingleUpgrades = [];
    ME.ridgeUpgrades =  [];
    ME.valleyUpgrades =  [];
    ME.trimUpgrades =  [];

    // Holds user selection and controls the ng-show DOM elements
    ME.UpgradeFieldNdx = {Code:"",Item:""};
    ME.UpgradeRidgeNdx = {Code:"",Item:""};
    ME.UpgradeValleyNdx = {Code:"",Item:""};
    ME.UpgradeTrimNdx = {Code:"",Item:""};

    // Shingle Color
    ME.ColorID = "0";
    ME.todayDate = new Date();
    ME.inspectionDate = new Date();

    ME.showUpgrades = { color: false, field: true, ridge: false, valley: false, trim: false };
    ME.showSections = { assembly: true, photos: false, scope: false, options: false, next: false };

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


    // Triggered on every 'ng-change' under Select Options
    ME.calculateTotal = function() {
        ME.C.trace(me + "calculateTotal()");
        ME.dataIsSaved = false;
        ME.dataObj = {};
        var fieldCost = 0;
        var ridgeCost = 0;
        var valleyCost = 0;
        var trimCost = 0;

        var fieldUpgrade = 0;
        var ridgeUpgrade = 0;
        var valleyUpgrade = 0;
        var trimUpgrade = 0;


        for (var i = 0; i < ME.shingleUpgrades.length; i++) {
            if (ME.shingleUpgrades[i].Code === ME.UpgradeFieldNdx.Code) {
                fieldUpgrade = ME.C.decimalPrecisionTwo(Number(ME.shingleUpgrades[i].upgradePrice));
                fieldCost = ME.C.decimalPrecisionTwo(Number(ME.shingleUpgrades[i].Total));
                ME.UpgradeFieldNdx.Item = ME.shingleUpgrades[i].Item;
                break;
            }
        };

        for (var i = 0; i < ME.ridgeUpgrades.length; i++) {
            if (ME.ridgeUpgrades[i].Code === ME.UpgradeRidgeNdx.Code) {
                ridgeUpgrade = ME.C.decimalPrecisionTwo(Number(ME.ridgeUpgrades[i].upgradePrice));
                ridgeCost = ME.C.decimalPrecisionTwo(Number(ME.ridgeUpgrades[i].Total));
                ME.UpgradeRidgeNdx.Item = ME.ridgeUpgrades[i].Item;
                break;
            }
        };

        for (var i = 0; i < ME.valleyUpgrades.length; i++) {
            if (ME.valleyUpgrades[i].Code === ME.UpgradeValleyNdx.Code) {
                valleyUpgrade = ME.C.decimalPrecisionTwo(Number(ME.valleyUpgrades[i].upgradePrice));
                valleyCost = ME.C.decimalPrecisionTwo(Number(ME.valleyUpgrades[i].Total));
                ME.UpgradeValleyNdx.Item = ME.valleyUpgrades[i].Item;
                break;
            }
        };

        for (var i = 0; i < ME.trimUpgrades.length; i++) {
            if (ME.trimUpgrades[i].Code === ME.UpgradeTrimNdx.Code) {
                trimUpgrade = ME.C.decimalPrecisionTwo(Number(ME.trimUpgrades[i].upgradePrice));
                trimCost = ME.C.decimalPrecisionTwo(Number(ME.trimUpgrades[i].Total));
                ME.UpgradeTrimNdx.Item = ME.trimUpgrades[i].Item;
                break;
            }
        };

        var base = ME.CONFIG.costSummary.clientBase;

        // View Display Total with upgrades
        ME.grandTotal = ME.C.decimalPrecisionTwo(base + fieldUpgrade + ridgeUpgrade + valleyUpgrade + trimUpgrade);

        // Below this point is configuring dataObj for a Save
        ME.dataObj.Upgrade = ME.C.decimalPrecisionTwo(fieldCost + ridgeCost + valleyCost + trimCost);
        ME.dataObj.clientTotal = ME.grandTotal;
        ME.dataObj.Clr = ME.ColorID;
        // Calculate Grand total the same way Admin does it and see if they match
        var lbr = ME.CONFIG.laborTotal;
        var Uc = lbr + ME.CONFIG.costSummary.Fx + ME.dataObj.Upgrade;
        var mu = ME.CONFIG.configMargin;
        ME.dataObj.MuU = ME.C.decimalPrecisionTwo(Uc * mu);
        ME.dataObj.clientTotal = Uc + ME.dataObj.MuU;
        ME.dataObj.upgradesSelected = "Field;" + fieldCost + "!Valley;" + valleyCost + "!Ridge;" + ridgeCost + "!Edge;" + trimCost + "!Total;" + ME.dataObj.Upgrade;


        // Contract Upgrades
        if(ME.UpgradeFieldNdx.Code==ME.L.upgradeDefaultSelection.Field){
            ME.ScopeOfWork.field_shingles = true;
            ME.ScopeOfWork.field_shingles_upgrade = false;
        }else{
             ME.ScopeOfWork.field_shingles = false;
            ME.ScopeOfWork.field_shingles_upgrade = true;
        }

        if(ME.UpgradeRidgeNdx.Code==ME.L.upgradeDefaultSelection.Ridge){
            ME.ScopeOfWork.ridge_shingles = true;
            ME.ScopeOfWork.ridge_shingles_upgrade = false;
        }else{
            ME.ScopeOfWork.ridge_shingles = false;
            ME.ScopeOfWork.ridge_shingles_upgrade = true;
        }

         if(ME.UpgradeValleyNdx.Code==ME.L.upgradeDefaultSelection.Valley){
            ME.ScopeOfWork.valley_flashing = true;
            ME.ScopeOfWork.valley_flashing_w = false;
        }else{
            ME.ScopeOfWork.valley_flashing = false;
            ME.ScopeOfWork.valley_flashing_w = true;
        }

        if(ME.UpgradeTrimNdx.Code==ME.L.upgradeDefaultSelection.Edge){
            ME.ScopeOfWork.drip_edge = true;
            ME.ScopeOfWork.drip_edge_extender = false;
        }else{
            ME.ScopeOfWork.drip_edge = false;
            ME.ScopeOfWork.drip_edge_extender = true;
        }
    };

    ME.saveJobConfig = function() {
        var items = [
            { Category: 'Field', Code: ME.UpgradeFieldNdx.Code },
            { Category: 'Ridge', Code: ME.UpgradeRidgeNdx.Code },
            { Category: 'Valley', Code: ME.UpgradeValleyNdx.Code },
            { Category: 'Edge', Code: ME.UpgradeTrimNdx.Code }
        ];

        ME.dataObj.configUpdates = items;
        ME.C.saveClientUpgrades(ME.dataObj);

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

        // Take out the Designer GAF - 
        for (var i = ME.shingleUpgrades.length - 1; i >= 0; i--) {
            if (ME.shingleUpgrades[i].Sort > 107 && ME.shingleUpgrades[i].Sort < 121) {
                ME.shingleUpgrades.splice(i, 1);
            }
        };
    };

    var setSelections = function() {
        ME.C.trace(me + "setSelections()");
        for (var i = 0; i < ME.shingleUpgrades.length; i++) {
            if (ME.shingleUpgrades[i].Checked === true) {
                ME.UpgradeFieldNdx.Code = ME.shingleUpgrades[i].Code;
                break;
            }
        };

        for (i = 0; i < ME.ridgeUpgrades.length; i++) {
            if (ME.ridgeUpgrades[i].Checked === true) {
                ME.UpgradeRidgeNdx.Code = ME.ridgeUpgrades[i].Code;
                break;
            }
        };

        for (i = 0; i < ME.valleyUpgrades.length; i++) {
            if (ME.valleyUpgrades[i].Checked === true) {
                ME.UpgradeValleyNdx.Code = ME.valleyUpgrades[i].Code;
                break;
            }
        };

        for (i = 0; i < ME.trimUpgrades.length; i++) {
            if (ME.trimUpgrades[i].Checked === true) {
                ME.UpgradeTrimNdx.Code = ME.trimUpgrades[i].Code;
                break;
            }
        };

        setColorChoices();
        ME.ColorID = ME.CONFIG.shingleColor;
        setManufacturer();
    };


    ME.changeFieldShingle = function() {
        // Field Shingle selection is also used to switch manufacturer
        ME.dataIsSaved = false;
        var firstChar = ME.UpgradeFieldNdx.Code[0];
        if (firstChar === "G" || firstChar === "S") { // S is for "STD***" used for Default Field and Ridge
            var selection = "GAF";
        } else {
            selection = "OC";
        };

        // If the manufacturer changes, reset the Ridge Selections
        if (ME.shingleManufacturer != selection) {
            ME.UpgradeRidgeNdx.Code = ME.L.upgradeDefaultSelection.Ridge;
            ME.shingleManufacturer = selection;
            ME.ridgeUpgrades = ME.C.getUpgrades("Ridge", ME.shingleManufacturer);
        };

        setColorChoices();
        ME.calculateTotal();
    };

    var setColorChoices = function() {
        ME.ColorID = "0";
        ME.shingleColors = [];
        for (var i = 0; i < ME.C.shingleColorsList.length; i++) {
            if (ME.C.shingleColorsList[i].Style == ME.UpgradeFieldNdx.Code) {
                ME.shingleColors.push(ME.C.shingleColorsList[i]);
            }
        }
    };

    var setManufacturer = function() {
        var firstChar = ME.UpgradeFieldNdx.Code[0];
        if (firstChar === "G" || firstChar === "S") {
            ME.shingleManufacturer = "GAF";
        } else {
            ME.shingleManufacturer = "OC";
        };
    };

    ME.printContract = function() {
        var x = this;
        $window.print();
    };


    $scope.$watch('$viewContentLoaded', function() {
        ME.C.trace(me + "$viewContentLoaded()");
        ME.dataIsSaved = true;
        var loggedIn = ME.C.loggedIn;
        if (!loggedIn) {
            $state.transitionTo('login');
        };
    });

    $scope.$on('client-upgrades-saved', function() {
        ME.dataIsSaved = true;
        ngDialog.open({
            template: '<h2>Your upgrades have been saved!</h2>',
            className: 'ngdialog-theme-calm',
            plain: true,
            overlay: true
        });
    });

    getUpgradeOptions();
    setSelections();
    ME.calculateTotal();


}]);
