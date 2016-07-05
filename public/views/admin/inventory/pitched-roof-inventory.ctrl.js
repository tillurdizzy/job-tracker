'use strict';

app.controller('PitchedRoofInventoryCtrl', ['$state', '$scope', 'SharedSrvc', 'AdminDataSrvc', 'ngDialog', function($state, $scope, SharedSrvc, AdminDataSrvc, ngDialog) {

    var ME = this;
    ME.S = SharedSrvc;
    var DB = AdminDataSrvc;

    ME.pitchedInventoryList = [];
    ME.EditMode = "Add Item";
    ME.modePrompt = "Add New Item: Fill in the form and submit.";
    ME.inputDataObj = {};
    ME.formStatus = "Pristine";
    ME.itemSelected = {};
    ME.selectDataObj_dp = {
        Package: ME.S.packageOptions[0],
        UnitPkg: ME.S.unitOptions[0],
        UnitCoverage: ME.S.unitOptions[0],
        InputParam: ME.S.propertyParams[0],
        Checked: ME.S.trueFalse[0]
    };

    ME.addItem = function() {
        ME.EditMode = "Add Item";
        ME.modePrompt = "Add New Item: Fill in the form and submit.";
        //resetInputFields();
    };
    ME.updateItem = function() {
        ME.EditMode = "Update Item";
        ME.modePrompt = "Update Item: Select item from list or table below.";
        resetInputFields();
    };

     ME.updatePrice = function() {
        ME.EditMode = "Update Price";
        ME.modePrompt = "Update Price: Select item from list or table below.";
        resetInputFields();
    };

    ME.removeItem = function() {
        ME.EditMode = "Remove Item";
        ME.modePrompt = "Remove Item: Select item from list or table below.";
        resetInputFields();
    };

    ME.formChange = function() {
        ME.formStatus = "Dirty";
    };

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.selectItem = function() {
        ME.configSelectedItemObj(ME.itemSelected.Code);
    };

    ME.refreshInventoryList = function() {
        ME.pitchedInventoryList = [];
        getInventory();
    };

    ME.configSelectedItemObj = function(code) {
        ME.updateItem();
        ME.inputDataObj = {};
        for (var i = 0; i < ME.pitchedInventoryList.length; i++) {
            if (ME.pitchedInventoryList[i].Code == code) {
                ME.inputDataObj = ME.pitchedInventoryList[i];
                ME.itemSelected = ME.pitchedInventoryList[i];
            }
        };
        // For SELECT components, get the options object that matches the data 
        ME.selectDataObj_dp.Package = ME.S.returnObjByLabel(ME.S.packageOptions, ME.inputDataObj.Package);
        ME.selectDataObj_dp.UnitPkg = ME.S.returnObjByLabel(ME.S.unitOptions, ME.inputDataObj.UnitPkg);
        ME.selectDataObj_dp.UnitCoverage = ME.S.returnObjByLabel(ME.S.unitOptions, ME.inputDataObj.UnitCoverage);
        ME.selectDataObj_dp.InputParam = ME.S.returnObjByLabel(ME.S.propertyParams, ME.inputDataObj.InputParam);
        ME.selectDataObj_dp.Checked = ME.S.returnObjById(ME.S.trueFalse, ME.inputDataObj.Checked);
    };


    ME.submit = function() {
        switch (ME.EditMode) {
            case "Add Item":
                add_Item();
                break;
            case "Update Item":
                update_Item();
                break;
            case "Remove Item":
                remove_Item();
                break;
        }
    };

    var add_Item = function() {
        parseSelectionProviders();
        DB.query("putPitchedInvtItem", ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> add_Item()");
            } else {
                resetForm();
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

    var update_Item = function() {
        parseSelectionProviders();
        DB.query("updateMaterialsShingle", ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> update_Item()");
            } else {
                resetForm();
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

    var remove_Item = function() {
        DB.query("deletePitchedInvtItem", ME.itemSelected.PRIMARY_ID).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> remove_Item()");
            } else {
                resetForm();
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



    var parseSelectionProviders = function() {
        ME.inputDataObj.Package = ME.selectDataObj_dp.Package.label;
        ME.inputDataObj.UnitPkg = ME.selectDataObj_dp.UnitPkg.label;
        ME.inputDataObj.UnitCoverage = ME.selectDataObj_dp.UnitCoverage.label;
        ME.inputDataObj.InputParam = ME.selectDataObj_dp.InputParam.label;
        ME.inputDataObj.Checked = ME.selectDataObj_dp.Checked.id;
    };

    var resetForm = function() {
        //ME.formStatus = "Pristine";
        //resetInputFields();
        if (ME.EditMode == "Add Item") {
            var sortNum = parseInt(ME.inputDataObj.Sort);
            sortNum += 1;
            ME.inputDataObj.Sort = sortNum;
        }
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
        ME.selectDataObj_dp = {
            Package: ME.S.packageOptions[0],
            UnitPkg: ME.S.unitOptions[0],
            UnitCoverage: ME.S.unitOptions[0],
            InputParam: ME.S.propertyParams[0],
            Checked: ME.S.trueFalse[0]
        };
        ME.itemSelected = {};
    };


    getInventory();
    resetInputFields();


}]);
