'use strict';

app.controller('UpdatePropertyCtrl', ['$state', '$scope', 'PropertiesSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', function($state, $scope, PropertiesSrvc, AdminDataSrvc, ListSrvc, ngDialog) {
    var ME = this;
    var myName = "UpdatePropertyCtrl";
    ME.P = PropertiesSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    ME.PROPERTIES = [];
    ME.Roof = {};
    ME.EditMode = "Update Property";
    ME.modePrompt = "Update Property: Choose a property to edit/update."
    ME.SubmitBtnLabel = "Update Property";

    ME.submitInValid = true;
    ME.isMultiLevel = false;
    ME.isMultiVented = false;
    ME.isMultiUnit = false;

    ME.formVisibility = { stepOne: true, stepTwo: false };

    // Model Vars
    ME.propertySelector = null;
    ME.inputDataObj = {};

    ME.multiVentModel = {};
    ME.multiLevelModel = {};

    ME.multiLevelObj = {};
    ME.multiVentObj = {};

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.selectProperty = function() {
        ME.configPropObj(ME.propertySelector.PRIMARY_ID);
    };

    ME.submit = function() {
        ME.createPropertyDataObj()
    };

    ME.formChange = function() {
        ME.submitInValid = true;
        var min = ME.validateMinimumRequirements();
    };

    ME.selectRoof = function() {
        ME.formChange();
    };

    ME.selectVentilation = function() {
        if (ME.inputDataObj.roofVents.label == "Various Other") {
            ME.isMultiVented = true;
        } else {
            ME.isMultiVented = false;
        }
    };

    ME.selectPitch = function() {
        if (ME.inputDataObj.roofPitch.label == "Multi-level") {
            ME.isMultiLevel = true;
        } else {
            ME.isMultiLevel = false;
        }
    };


    // Called on Update and Remove when Property selected
    // Both this and ME.configRoofObj() called from propetySelected()
    ME.configPropObj = function(ID) {
        ME.inputDataObj = {};
        for (var i = 0; i < ME.PROPERTIES.length; i++) {
            if (ME.PROPERTIES[i].PRIMARY_ID == ID) {
                ME.inputDataObj = ME.PROPERTIES[i];
                break;
            };
        };
        getPropRoof();
        ME.inputDataObj.client = ME.P.returnObjFromSetByPrimaryID(ME.CLIENTS, ME.inputDataObj.client);
        ME.inputDataObj.roofCode = ME.L.returnObjById(ME.L.roofCode, ME.inputDataObj.roofCode);

        if (ME.inputDataObj.roofCode == 0) {
            ME.configRoofObj(ME.propertySelector.PRIMARY_ID);

        } else {
            ME.formVisibility = { stepOne: true, stepTwo: false };
        }
    };

    // Used by Update and Remove when retrieving roof data
    var configRoofObj = function() {

        ME.inputDataObj.edgeDetail = returnObjById(ME.L.edgeDetail, ME.Roof.edgeDetail);
        ME.inputDataObj.edgeTrim = returnObjById(ME.L.yesNo, ME.Roof.edgeTrim);
        ME.inputDataObj.layers = returnObjById(ME.L.numbersToFive, ME.Roof.layers);
        ME.inputDataObj.numLevels = returnObjById(ME.L.levelOptions, ME.Roof.numLevels);
        ME.inputDataObj.roofPitch = returnObjById(ME.L.pitchOptions, ME.Roof.pitch);
        ME.inputDataObj.ridgeCap = returnObjById(ME.L.ridgeCapShingles, ME.Roof.ridgeCap);
        ME.inputDataObj.roofDeck = returnObjById(ME.L.roofDeckOptions, ME.Roof.roofDeck);
        ME.inputDataObj.roofVents = returnObjById(ME.L.ventOptions, ME.Roof.roofVents);
        ME.inputDataObj.shingleGrade = returnObjById(ME.L.shingleGradeOptions, ME.Roof.shingleGrade);
        ME.inputDataObj.valleyDetail = returnObjById(ME.L.valleyOptions, ME.Roof.valleyDetail);

        ME.multiLevelObj = { LEVONE: 0, LEVTWO: 0, LEVTHR: 0, LEVFOU: 0 };
        ME.multiVentObj = { TURBNS: 0, STATIC: 0, PWRVNT: 0, AIRHWK: 0, SLRVNT: 0 };

        if (ME.inputDataObj.roofPitch.id == 6) {
            ME.P.logMultis();
            ME.isMultiLevel = true;
            var myPitches = ME.P.returnObjByRoofID(ME.P.MULTILEVELS, ME.Roof.PRIMARY_ID);
            if (myPitches.hasOwnProperty('LEVONE')) {
                ME.multiLevelModel.levelOne.percent = returnObjById(ME.L.percentOptions, myPitches.LEVONE);
                ME.multiLevelModel.levelTwo.percent = returnObjById(ME.L.percentOptions, myPitches.LEVTWO);
                ME.multiLevelModel.levelThree.percent = returnObjById(ME.L.percentOptions, myPitches.LEVTHR);
                ME.multiLevelModel.levelFour.percent = returnObjById(ME.L.percentOptions, myPitches.LEVFOU);
            }
        } else {
            ME.isMultiLevel = false;
            ME.multiLevelModel = {
                levelOne: { percent: ME.L.percentOptions[0] },
                levelTwo: { percent: ME.L.percentOptions[0] },
                levelThree: { percent: ME.L.percentOptions[0] },
                levelFour: { percent: ME.L.percentOptions[0] }
            };
        };

        if (ME.inputDataObj.roofVents.id == 2) {
            ME.isMultiVented = true;
            var myVents = ME.P.returnObjByRoofID(ME.P.MULTIVENTS, ME.Roof.PRIMARY_ID);
            if (myVents.hasOwnProperty('TURBNS')) {
                ME.multiVentModel.TURBNS = returnObjById(ME.L.numbersToTen, myVents.TURBNS);
                ME.multiVentModel.STATIC = returnObjById(ME.L.numbersToTen, myVents.STATIC);
                ME.multiVentModel.PWRVNT = returnObjById(ME.L.numbersToTen, myVents.PWRVNT);
                ME.multiVentModel.AIRHWK = returnObjById(ME.L.numbersToTen, myVents.AIRHWK);
                ME.multiVentModel.SLRVNT = returnObjById(ME.L.numbersToTen, myVents.SLRVNT);
            }
        } else {
            ME.isMultiVented = false;
            ME.multiVentModel = {
                TURBNS: ME.L.numbersToTen[0],
                STATIC: ME.L.numbersToTen[0],
                PWRVNT: ME.L.numbersToTen[0],
                AIRHWK: ME.L.numbersToTen[0],
                SLRVNT: ME.L.numbersToTen[0]
            };
        };
    };

    var getPropRoof = function() {
        var dataObj = { propID: ME.propertySelector.PRIMARY_ID };
        DB.query("getRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for getJobConfig()");
            } else {
                ME.Roof = resultObj.data[0];
                ME.formVisibility = { stepOne: true, stepTwo: true };
                configRoofObj();
            }
        }, function(error) {
            alert("ERROR returned for  getJobConfig()");
        });
    };

    var returnObjById = function(set, id) {
        var rtnObj = {};
        if (id === null || id === undefined) {
            return id;
        }
        for (var i = 0; i < set.length; i++) {
            if (set[i].id == id) {
                rtnObj = set[i];
            }
        }
        return rtnObj;
    };



    // Step One Update
    var createPropertyDataObj = function() {
        var outputDataObj = {};
        outputDataObj.manager = ME.inputDataObj.client.manager;
        outputDataObj.client = ME.inputDataObj.client.PRIMARY_ID;
        var d = new Date();
        outputDataObj.createdDate = d.valueOf();
        outputDataObj.name = ME.inputDataObj.name;
        outputDataObj.street = ME.inputDataObj.street;
        outputDataObj.city = ME.inputDataObj.city;
        outputDataObj.state = ME.inputDataObj.state;
        outputDataObj.zip = ME.inputDataObj.zip;
        outputDataObj.roofCode = ME.inputDataObj.roofCode.id;

        updateProperty(outputDataObj);
        createRoofDataObj();
    };

    // Step Two
    var createRoofDataObj = function() {
        var outputRoofDataObj = {};

        // Multi-Levels
        ME.multiLevelObj = {};
        if (ME.isMultiLevel === true) {
            // Property and Roof IDs are inserted when update function called
            ME.multiLevelObj.LEVONE = ME.multiLevelModel.levelOne.percent.id;
            ME.multiLevelObj.LEVTWO = ME.multiLevelModel.levelTwo.percent.id;
            ME.multiLevelObj.LEVTHR = ME.multiLevelModel.levelThree.percent.id;
            ME.multiLevelObj.LEVFOU = ME.multiLevelModel.levelFour.percent.id;

            var percentTotal = ME.multiLevelObj.LEVONE + ME.multiLevelObj.LEVTWO +
                ME.multiLevelObj.LEVTHR + ME.multiLevelObj.LEVFOU;
            if (percentTotal != 10) {
                ngDialog.open({
                    template: '<h2>Levels must total 100%.</h2>' +
                        '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">Close Me</button></div>',
                    className: 'ngdialog-theme-alert',
                    plain: true,
                    overlay: false
                });
                return;
            } else {
                updateMultiLevels();
            }
        };

        // Multi-Vents
        ME.multiVentObj = {};
        if (ME.isMultiVented === true) {
            // Property and Roof IDs are inserted when update function called
            ME.multiVentObj.TURBNS = ME.multiVentModel.TURBNS.id;
            ME.multiVentObj.STATIC = ME.multiVentModel.STATIC.id;
            ME.multiVentObj.PWRVNT = ME.multiVentModel.PWRVNT.id;
            ME.multiVentObj.AIRHWK = ME.multiVentModel.AIRHWK.id;
            ME.multiVentObj.SLRVNT = ME.multiVentModel.SLRVNT.id;
            updateMultiVents();
        };

        outputRoofDataObj.propertyID = newPropertyVars.propertyID;

        var d = new Date();
        outputRoofDataObj.createdDate = d.valueOf();
        outputRoofDataObj.name = newPropertyVars.street;
        outputRoofDataObj.numLevels = ME.inputDataObj.numLevels.id;
        outputRoofDataObj.shingleGrade = ME.inputDataObj.shingleGrade.id;
        outputRoofDataObj.roofDeck = ME.inputDataObj.roofDeck.id;
        outputRoofDataObj.layers = ME.inputDataObj.layers.id;
        outputRoofDataObj.edgeDetail = ME.inputDataObj.edgeDetail.id;
        outputRoofDataObj.edgeTrim = ME.inputDataObj.edgeTrim.id;
        outputRoofDataObj.valleyDetail = ME.inputDataObj.valleyDetail.id;
        outputRoofDataObj.ridgeCap = ME.inputDataObj.ridgeCap.id;
        outputRoofDataObj.roofVents = ME.inputDataObj.roofVents.id;
        outputRoofDataObj.pitch = ME.inputDataObj.roofPitch.id;

        updateRoof(outputRoofDataObj);
    };



    var updateProperty = function(dataObj) {
        DB.query("updateProperty", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                console.log(resultObj.data);
                alert("FALSE returned for DB.updateProperty() at " + myName + " >>> updateProperty()");
            } else {
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Property has been updated.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.updateProperty() at " + myName + " >>> updateProperty()");
        });
    };

    var updateRoof = function(dataObj) {
        DB.query("updateRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.updateRoof() at " + myName + " >>> updateRoof()");
                console.log(resultObj.data);
            } else {
                ME.addItem();
                ngDialog.open({
                    template: '<h2>Roof Description accepted.  The next step would be to create a job for this property.</h2>',
                    className: 'ngdialog-theme-calm',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.updateRoof() at " + myName + " >>> updateRoof()");
        });
    };

    var updateMultiLevels = function() {
        ME.multiLevelObj.propertyID = newPropertyVars.propertyID;
        ME.multiLevelObj.roofID = newPropertyVars.roofID;
        DB.query("updateMultiLevels", ME.multiLevelObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.updateMultiLevels() at " + myName + " >>> updateMultiLevels()");
                console.log(resultObj.data);
            } else {

            }
        }, function(error) {
            alert("ERROR returned for DB.updateMultiLevels() at " + myName + " >>> updateMultiLevels()");
        });
    };

    var updateMultiVents = function() {
        ME.multiVentObj.propertyID = newPropertyVars.propertyID;
        ME.multiVentObj.roofID = newPropertyVars.roofID;
        DB.query("updateMultiVents", ME.multiVentObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.updateMultiVents() at " + myName + " >>> updateMultiVents()");
                console.log(resultObj.data);
            } else {

            }
        }, function(error) {
            alert("ERROR returned for DB.updateMultiVents() at " + myName + " >>> updateMultiVents()");
        });
    };


    ME.validateMinimumRequirements = function() {
        // no validation at this time
        ME.submitInValid = true;
    };



    var resetInputFields = function() {
        ME.submitInValid = true;
        ME.inputDataObj = {};
        ME.propertySelector = ME.PROPERTIES[0];

        ME.multiLevelObj = {};
        ME.multiVentObj = {};

        ME.multiLevelModel = {
            levelOne: { percent: ME.L.percentOptions[0] },
            levelTwo: { percent: ME.L.percentOptions[0] },
            levelThree: { percent: ME.L.percentOptions[0] },
            levelFour: { percent: ME.L.percentOptions[0] }
        };

        ME.multiVentModel = {
            TURBNS: ME.L.numbersToTen[0],
            STATIC: ME.L.numbersToTen[0],
            PWRVNT: ME.L.numbersToTen[0],
            AIRHWK: ME.L.numbersToTen[0],
            SLRVNT: ME.L.numbersToTen[0]
        };

    };

    var createDP = function() {
        ME.PROPERTIES = DB.clone(ME.P.PROPERTIES);
        ME.CLIENTS = DB.clone(ME.P.CLIENTS);
        resetInputFields();
    };

    createDP();

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

}]);
