'use strict';

app.controller('PitchedRoofInventoryCtrl', ['$state', '$scope', 'SharedSrvc', 'AdminDataSrvc', 'ngDialog', function($state, $scope, SharedSrvc, AdminDataSrvc, ngDialog) {

    var ME = this;
    ME.S = SharedSrvc;
    var DB = AdminDataSrvc;

    ME.pitchedInventoryList = [];
    ME.EditMode = "Add Item";
    ME.modePrompt = "Add New Item: Select an item for example if needed.";
    ME.inputDataObj = {};
    ME.submitDisabled = true;
    ME.itemSelected = {};
    ME.selectDataObj_dp = {
        Package: ME.S.packageOptions[0],
        UnitPkg: ME.S.unitOptions[0],
        UnitCoverage: ME.S.unitOptions[0],
        InputParam: ME.S.propertyParams[0],
        Checked: ME.S.trueFalse[0]
    };

    ME.sampleDataObj = {};

    ME.addItem = function() {
        ME.EditMode = "Add Item";
        ME.modePrompt = "Add New Item: Select an item for example if needed.";
        $state.transitionTo("admin.pitchedInventory.addItem");
        resetInputFields();
    };
    ME.updateItem = function() {
        ME.EditMode = "Update Item";
        ME.modePrompt = "Update Item: Select item to update.";
        $state.transitionTo("admin.pitchedInventory.updateItem");
        resetInputFields();
    };

    ME.updatePrice = function() {
        ME.EditMode = "Update Price";
        ME.modePrompt = "Update Price: Select item to update price.";
        $state.transitionTo("admin.pitchedInventory.updatePrice");
        resetInputFields();
    };

    ME.removeItem = function() {
        ME.EditMode = "Remove Item";
        ME.modePrompt = "Remove Item: Select item from list or table below.";
        $state.transitionTo("admin.pitchedInventory.removeItem");
        resetInputFields();
    };

  
    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.selectItem = function() {
        configSampleDataObj(ME.itemSelected.Code);
        if (ME.EditMode == "Update Item") {
            configInputDataObj(ME.itemSelected.Code);
            ME.submitDisabled = false;
        } else if (ME.EditMode == "Add Item") {
            configPartialInputDataObj(ME.itemSelected.Code);
        }else if (ME.EditMode == "Remove Item") {
           ME.submitDisabled = false;
        }else if (ME.EditMode == "Update Price") {
            configInputDataObj(ME.itemSelected.Code);
        }
    };

    ME.refreshInventoryList = function() {
        ME.pitchedInventoryList = [];
        getInventory();
    };

    // Enables Submit button
    ME.formChange = function(){
        ME.submitDisabled = false;
    }

    var configInputDataObj = function(code) {
        ME.inputDataObj = {};
        for (var i = 0; i < ME.pitchedInventoryList.length; i++) {
            if (ME.pitchedInventoryList[i].Code == code) {
                ME.inputDataObj = ME.pitchedInventoryList[i];
                //ME.itemSelected = ME.pitchedInventoryList[i];
            }
        };
        // For SELECT components, get the options object that matches the data 
        ME.selectDataObj_dp.Package = ME.S.returnObjByLabel(ME.S.packageOptions, ME.inputDataObj.Package);
        ME.selectDataObj_dp.UnitPkg = ME.S.returnObjByLabel(ME.S.unitOptions, ME.inputDataObj.UnitPkg);
        ME.selectDataObj_dp.UnitCoverage = ME.S.returnObjByLabel(ME.S.unitOptions, ME.inputDataObj.UnitCoverage);
        ME.selectDataObj_dp.InputParam = ME.S.returnObjByLabel(ME.S.propertyParams, ME.inputDataObj.InputParam);
        ME.selectDataObj_dp.Checked = ME.S.returnObjById(ME.S.trueFalse, ME.inputDataObj.Checked);
    };

    var configSampleDataObj = function(code) {
        ME.sampleDataObj = {};
        for (var i = 0; i < ME.pitchedInventoryList.length; i++) {
            if (ME.pitchedInventoryList[i].Code == code) {
                ME.sampleDataObj = ME.pitchedInventoryList[i];
            }
        };
    };

    var configPartialInputDataObj = function() {
        ME.inputDataObj.Category = ME.sampleDataObj.Category;
        ME.inputDataObj.Package = ME.sampleDataObj.Package;
        ME.selectDataObj_dp.Package = ME.S.returnObjByLabel(ME.S.packageOptions, ME.inputDataObj.Package);
        ME.inputDataObj.QtyPkg = ME.sampleDataObj.QtyPkg;
        ME.inputDataObj.UnitPkg = ME.sampleDataObj.UnitPkg;
        ME.selectDataObj_dp.UnitPkg = ME.S.returnObjByLabel(ME.S.unitOptions, ME.inputDataObj.UnitPkg);
        ME.inputDataObj.PkgPrice = ME.sampleDataObj.PkgPrice;
        ME.inputDataObj.QtyCoverage = ME.sampleDataObj.QtyCoverage;
        ME.inputDataObj.UnitCoverage = ME.sampleDataObj.UnitCoverage;
        ME.selectDataObj_dp.UnitCoverage = ME.S.returnObjByLabel(ME.S.unitOptions, ME.inputDataObj.UnitCoverage);
        ME.inputDataObj.RoundUp = ME.sampleDataObj.RoundUp;
        ME.inputDataObj.Margin = ME.sampleDataObj.Margin;
        ME.inputDataObj.InputParam = ME.sampleDataObj.InputParam;
        ME.selectDataObj_dp.InputParam = ME.S.returnObjByLabel(ME.S.propertyParams, ME.inputDataObj.InputParam);
        ME.inputDataObj.Checked = ME.sampleDataObj.Checked;
        ME.selectDataObj_dp.Checked = ME.S.returnObjById(ME.S.trueFalse, ME.inputDataObj.Checked);
    };


    ME.submitAddItem = function() {
        parseSelectionProviders();
        DB.query("putPitchedInvtItem", ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> add_Item()");
            } else {
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Item added successfully.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> add_Item()");
        });
    };

    ME.submitUpdateItem = function() {
        parseSelectionProviders();

        DB.query("updateMaterialsShingle", ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> update_Item()");
            } else {
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Item updated successfully.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> update_Item()");
        });
    };

    ME.submitRemoveItem = function() {
        DB.query("deletePitchedInvtItem", ME.itemSelected.PRIMARY_ID).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> remove_Item()");
            } else {
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Item deleted successfully.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> remove_Item()");
        });
    };

    ME.submitUpdatePrice = function() {
        var dataObj = {};
        dataObj.ID = ME.itemSelected.PRIMARY_ID;
        dataObj.PkgPrice = ME.inputDataObj.PkgPrice;
        DB.query("updatePitchedItemPrice", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> updatePrice()");
            } else {
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Price updated successfully.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> updatePrice()");
        });
    };



    var parseSelectionProviders = function() {
        ME.inputDataObj.Package = ME.selectDataObj_dp.Package.label;
        ME.inputDataObj.UnitPkg = ME.selectDataObj_dp.UnitPkg.label;
        ME.inputDataObj.UnitCoverage = ME.selectDataObj_dp.UnitCoverage.label;
        ME.inputDataObj.InputParam = ME.selectDataObj_dp.InputParam.label;
        ME.inputDataObj.Checked = ME.selectDataObj_dp.Checked.id;
    };

   
    var getInventory = function() {
        DB.query("getMaterialsShingle").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProposalsByJob ---- " + resultObj.data);
            } else {
                ME.pitchedInventoryList = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };

    var resetInputFields = function() {
        ME.inputDataObj = {
            Sort: "",
            Category: "",
            Manufacturer: "",
            Item: "",
            Code: "",
            Package: "",
            QtyPkg: "",
            UnitPkg: "",
            PkgPrice: "",
            QtyCoverage: "",
            UnitCoverage: "",
            RoundUp: "",
            Margin: "",
            InputParam: "",
            Checked: "",
            Notes: "",
            url: ""
        };
        ME.sampleDataObj = {
            Sort: "",
            Category: "",
            Manufacturer: "",
            Item: "",
            Code: "",
            Package: "",
            QtyPkg: "",
            UnitPkg: "",
            PkgPrice: "",
            QtyCoverage: "",
            UnitCoverage: "",
            RoundUp: "",
            Margin: "",
            InputParam: "",
            Checked: "",
            Notes: "",
            url: ""
        };
        ME.selectDataObj_dp = {
            Package: ME.S.packageOptions[0],
            UnitPkg: ME.S.unitOptions[0],
            UnitCoverage: ME.S.unitOptions[0],
            InputParam: ME.S.propertyParams[0],
            Checked: ME.S.trueFalse[0]
        };
        ME.itemSelected = {};
        ME.submitDisabled = true;
    };


    getInventory();
    resetInputFields();


}]);
