'use strict';

app.controller('AdminSalesPropertiesCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminDataSrvc, ListSrvc, ngDialog) {

    var ME = this;
    var myName = "AdminSalesPropertiesCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    ME.tableDataProvider = [];
    ME.EditMode = "Add Item";
    ME.modePrompt = "Add New Property: Fill in the form and submit."
    ME.formStatus = "Pristine";
    ME.isMultiLevel = false;
    ME.isMultiVented = false;
    ME.isMultiUnit = false;

    ME.formVisibility = {propertySelection:false,clientSelection:true,locationInput:true,roofSelection:false,roofInput:false};

    // Model Vars
    ME.inputDataObj = {};
    ME.multiVentModel = {};
    ME.multiLevelModel = {};
    ME.propertySelector = null;

    ME.multiLevelObj = { propertyID: 0, LEVONE: 0, LEVTWO: 0, LEVTHR: 0, LEVFOU: 0 };
    ME.multiVentObj = { propertyID: 0, TURBNS: 0, STATIC: 0, PWRVNT: 0, AIRHWK: 0, SLRVNT: 0 };

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.addItem = function() {
        ME.EditMode = "Add Item";
        ME.modePrompt = "Add New Property: Fill in the form and submit."
        resetInputFields();
    };

    ME.updateItem = function() {
        ME.EditMode = "Update Item";
        ME.modePrompt = "Update Property: Choose a property to edit/update."
    };

    ME.removeItem = function() {
        ME.EditMode = "Remove Item";
        ME.modePrompt = "Remove Property: Choose a property to remove."
    };

    ME.formChange = function() {
        ME.formStatus = "Dirty";
    };

    ME.selectProperty = function() {
        ME.configPropObj(ME.propertySelector.PRIMARY_ID);
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

    ME.submit_roofPitch = function() {
        if (ME.isMultiLevel === true) {
            ME.multiLevelObj.LEVONE = ME.multiLevelModel.levelOne.percent.id;
            ME.multiLevelObj.LEVTWO = ME.multiLevelModel.levelTwo.percent.id;
            ME.multiLevelObj.LEVTHR = ME.multiLevelModel.levelThree.percent.id;
            ME.multiLevelObj.LEVFOU = ME.multiLevelModel.levelFour.percent.id;

            var percentTotal = ME.multiLevelObj.LEVONE + ME.multiLevelObj.LEVTWO +
                ME.multiLevelObj.LEVTHR + ME.multiLevelObj.LEVFOU;
            if (percentTotal == 10) {

            } else {
                alert("Percent column must total 100.");
            }
        }
    };

    ME.submit_roofVents = function() {
        ME.multiVentObj.TURBNS = ME.multiVentModel.TURBNS.id;
        ME.multiVentObj.STATIC = ME.multiVentModel.STATIC.id;
        ME.multiVentObj.PWRVNT = ME.multiVentModel.PWRVNT.id;
        ME.multiVentObj.AIRHWK = ME.multiVentModel.AIRHWK.id;
        ME.multiVentObj.SLRVNT = ME.multiVentModel.SLRVNT.id;
    };

    ME.configPropObj = function(ID) {

        ME.formStatus = "Pristine";
        ME.inputDataObj = {};
        for (var i = 0; i < ME.tableDataProvider.length; i++) {
            if (ME.tableDataProvider[i].PRIMARY_ID == ID) {
                ME.inputDataObj = ME.tableDataProvider[i];
                break;
            };
        };

        ME.inputDataObj.client = ME.S.returnObjFromSetByPrimaryID(ME.S.CLIENTS, ME.inputDataObj.client);
        ME.inputDataObj.edgeDetail = returnObjById(ME.L.edgeDetail, ME.inputDataObj.edgeDetail);
        ME.inputDataObj.edgeTrim = returnObjById(ME.L.yesNo, ME.inputDataObj.edgeTrim);
        ME.inputDataObj.layers = returnObjById(ME.L.numbersToFive, ME.inputDataObj.layers);
        ME.inputDataObj.numLevels = returnObjById(ME.L.levelOptions, ME.inputDataObj.numLevels);
        ME.inputDataObj.roofPitch = returnObjById(ME.L.pitchOptions, ME.inputDataObj.pitch);
        ME.inputDataObj.ridgeCap = returnObjById(ME.L.ridgeCapShingles, ME.inputDataObj.ridgeCap);
        ME.inputDataObj.roofDeck = returnObjById(ME.L.roofDeckOptions, ME.inputDataObj.roofDeck);
        ME.inputDataObj.roofVents = returnObjById(ME.L.ventOptions, ME.inputDataObj.roofVents);
        ME.inputDataObj.shingleGrade = returnObjById(ME.L.shingleGradeOptions, ME.inputDataObj.shingleGrade);
        ME.inputDataObj.valleyDetail = returnObjById(ME.L.valleyOptions, ME.inputDataObj.valleyDetail);

        if (ME.inputDataObj.roofPitch.id == 6) {
            ME.isMultiLevel = true;
            var myPitches = ME.S.returnObjByPropID(ME.S.MULTILEVELS, ME.inputDataObj.PRIMARY_ID);
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
            var myVents = ME.S.returnObjByPropID(ME.S.MULTIVENTS, ME.inputDataObj.PRIMARY_ID);
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

    ME.submit = function() {
        switch (ME.EditMode) {
            case "Add Item":
                createDataObj();
                break;
            case "Update Item":
                createDataObj();
                break;
            case "Remove Item":
                remove_Item();
                break;
        }
    };

    var createDataObj = function() {
        var outputDataObj = {};
        // Validate Multilevel selections
        if (ME.isMultiLevel === true) {
            ME.multiLevelObj.LEVONE = ME.multiLevelModel.levelOne.percent.id;
            ME.multiLevelObj.LEVTWO = ME.multiLevelModel.levelTwo.percent.id;
            ME.multiLevelObj.LEVTHR = ME.multiLevelModel.levelThree.percent.id;
            ME.multiLevelObj.LEVFOU = ME.multiLevelModel.levelFour.percent.id;

            var percentTotal = ME.multiLevelObj.LEVONE + ME.multiLevelObj.LEVTWO +
                ME.multiLevelObj.LEVTHR + ME.multiLevelObj.LEVFOU;
            if (percentTotal != 10) {
                alert("Percent column must total 100.");
                return;
            }
        } else {
            ME.multiLevelObj = { propertyID: 0, LEVONE: 0, LEVTWO: 0, LEVTHR: 0, LEVFOU: 0 };
        };

        if (ME.isMultiVented === true) {
            ME.multiVentObj.TURBNS = ME.multiVentModel.TURBNS.id;
            ME.multiVentObj.STATIC = ME.multiVentModel.STATIC.id;
            ME.multiVentObj.PWRVNT = ME.multiVentModel.PWRVNT.id;
            ME.multiVentObj.AIRHWK = ME.multiVentModel.AIRHWK.id;
            ME.multiVentObj.SLRVNT = ME.multiVentModel.SLRVNT.id;
        } else {
            ME.multiVentObj = { propertyID: 0, TURBNS: 0, STATIC: 0, PWRVNT: 0, AIRHWK: 0, SLRVNT: 0 };
        };
        outputDataObj.PRIMARY_ID = ME.inputDataObj.PRIMARY_ID;
        outputDataObj.manager = ME.inputDataObj.client.manager;
        outputDataObj.client = ME.inputDataObj.client.PRIMARY_ID;
        var d = new Date();
        outputDataObj.createdDate = d.valueOf();
        outputDataObj.name = ME.inputDataObj.name;
        outputDataObj.street = ME.inputDataObj.street;
        outputDataObj.city = ME.inputDataObj.city;
        outputDataObj.state = ME.inputDataObj.state;
        outputDataObj.zip = ME.inputDataObj.zip;
        outputDataObj.numLevels = ME.inputDataObj.numLevels.id;
        outputDataObj.shingleGrade = ME.inputDataObj.shingleGrade.id;
        outputDataObj.roofDeck = ME.inputDataObj.roofDeck.id;
        outputDataObj.layers = ME.inputDataObj.layers.id;
        outputDataObj.edgeDetail = ME.inputDataObj.edgeDetail.id;
        outputDataObj.edgeTrim = ME.inputDataObj.edgeTrim.id;
        outputDataObj.valleyDetail = ME.inputDataObj.valleyDetail.id;
        outputDataObj.ridgeCap = ME.inputDataObj.ridgeCap.id;
        outputDataObj.roofVents = ME.inputDataObj.roofVents.id;
        outputDataObj.pitch = ME.inputDataObj.roofPitch.id;

        switch (ME.EditMode) {
            case "Add Item":
                putProperty(outputDataObj);
                break;
            case "Update Item":
                updateProperty(outputDataObj);
                updateMultiLevels(outputDataObj.PRIMARY_ID);
                updateMultiVents(outputDataObj.PRIMARY_ID);
                break;
        }
    };

    var putProperty = function(dataObj) {
        DB.query("putProperty", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.putProperty() at " + myName + " >>> putProperty()");
                console.log(resultObj.data);
            } else {
                var thisPropertyID = resultObj.data.id;
                submitMultiLevels(thisPropertyID);
                submitMultiVents(thisPropertyID);
                ngDialog.open({
                    template: '<h2>Property has been added.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.putProperty() at " + myName + " >>> putProperty()");
        });
    };

    var updateProperty = function(dataObj) {
        DB.query("updateProperty", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                console.log(resultObj.data);
                alert("FALSE returned for DB.updateProperty() at " + myName + " >>> updateProperty()");
            } else {
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

    var submitMultiLevels = function(id) {
        ME.multiLevelObj.propertyID = id;
        DB.query("putMultiLevels", ME.multiLevelObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.MultiLevels() at " + myName + " >>> MultiLevels()");
                console.log(resultObj.data);
            } else {

            }
        }, function(error) {
            alert("ERROR returned for DB.MultiLevels() at " + myName + " >>> MultiLevels()");
        });
    };

    var submitMultiVents = function(id) {
        ME.multiVentObj.propertyID = id;
        DB.query("putMultiVents", ME.multiVentObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.putMultiVents() at " + myName + " >>> putMultiVents()");
                console.log(resultObj.data);
            } else {

            }
        }, function(error) {
            alert("ERROR returned for DB.putMultiVents() at " + myName + " >>> putMultiVents()");
        });
    };

    var updateMultiLevels = function(id) {
        ME.multiLevelObj.propertyID = id;
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

    var updateMultiVents = function(id) {
        ME.multiVentObj.propertyID = id;
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

    var update_Item = function() {

    };

    var remove_Item = function() {
        var dataObj = { propertyID: ME.inputDataObj.PRIMARY_ID };
        DB.query("deleteProperty", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("FALSE returned for DB.deleteProperty() at " + myName + " >>> remove_Item()");
                console.log(resultObj.data);
            } else {
                var x = resultObj.data;
                ngDialog.open({
                    template: '<h2>Property has been deleted.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.deleteProperty() at " + myName + " >>> remove_Item()");
        });
    };

    var resetForm = function() {
        ME.formStatus = "Pristine";
    };

    var createDP = function() {
        ME.tableDataProvider = DB.clone(ME.S.PROPERTIES);
        for (var i = 0; i < ME.tableDataProvider.length; i++) {
            var clientID = ME.tableDataProvider[i].client;
            ME.tableDataProvider[i].clientDisplayName = ME.S.returnClientNameByID(clientID);
            var managerID = ME.tableDataProvider[i].manager;
            ME.tableDataProvider[i].managerDisplayName = ME.S.returnManagerNameByID(managerID);
        }

        ME.tableDataProvider.unshift({street:"-- Select --",PRIMARY_ID:-1});

        ME.CLIENTS = DB.clone(ME.S.CLIENTS);
        ME.CLIENTS.unshift({displayName:"-- Select --",PRIMARY_ID:-1});
        ME.inputDataObj.client = ME.CLIENTS[0];
    };

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

    var resetInputFields = function() {
        ME.inputDataObj = {
            manager: "",
            client: null,
            createdDate: "",
            name: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            numLevels: ME.L.levelOptions[0],
            shingleGrade: ME.L.shingleGradeOptions[0],
            roofDeck: ME.L.roofDeckOptions[0],
            layers: ME.L.numbersToFive[0],
            edgeDetail: ME.L.edgeDetail[0],
            edgeTrim: ME.L.yesNo[0],
            valleyDetail: ME.L.valleyOptions[0],
            ridgeCap: ME.L.ridgeCapShingles[0],
            roofVents: ME.L.ventOptions[0],
            roofPitch: ME.L.pitchOptions[0],
            multiLevel: ME.multiLevelObj,
            multiVents: ME.multiVentObj
        };
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
        ME.multiLevelObj = { propertyID: 0, LEVONE: 0, LEVTWO: 0, LEVTHR: 0, LEVFOU: 0 };
        ME.multiVentObj = { propertyID: 0, TURBNS: 0, STATIC: 0, PWRVNT: 0, AIRHWK: 0, SLRVNT: 0 };
    };


    resetInputFields();
    createDP();
    ME.S.getMultiVents();
    ME.S.getMultiLevels();

}]);
