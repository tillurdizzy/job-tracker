'use strict';

app.controller('AdminSalesPropertiesCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminDataSrvc, ListSrvc, ngDialog) {

    var ME = this;
    var myName = "AdminSalesPropertiesCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    ME.PROPERTIES = [];
    ME.EditMode = "Add Property";
    ME.modePrompt = "Add New Property: Fill in the form and submit."
    ME.formStatus = "Pristine";
    ME.submitInValid = true;
    ME.isMultiLevel = false;
    ME.isMultiVented = false;
    ME.isMultiUnit = false;

    var newPropertyVars = {propertyID:0,street:"",roofID:0};
   
    // IMPORTANT!!! Add New Property is submitted in TWO steps... we need an ID from the database for the Address before we submit the Roof Assembly
    ME.formVisibility = { propertySelection: false, clientSelection: true, locationInput: true, roofCode: true, roofInput: false };

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

    var setFormVisibility = function(form) {
        switch (form) {
            case "addStepOne":
                ME.formVisibility = { propertySelection: false, clientSelection: true, locationInput: true, roofCode: true, roofInput: false };
                break;
            case "addStepTwo":
                ME.EditMode = "Add Roof Description";
                ME.modePrompt = "Add Roof Description for: " + newPropertyVars.street;
                ME.formVisibility = { propertySelection: false, clientSelection: false, locationInput: false, roofCode: false, roofInput: true };
                break;
            case "update":
                ME.formVisibility = { propertySelection: true, clientSelection: true, locationInput: true, roofCode: false, roofInput: true };
                break;
            case "remove":
                ME.formVisibility = { propertySelection: true, clientSelection: true, locationInput: true, roofCode: false, roofInput: true };
                break;
        }
    };

    ME.submit = function() {
        switch (ME.EditMode) {
            case "Add Property":
                createPropertyDataObj();
                break;
            case "Add Roof Description":
                createRoofDataObj();
                break;
            case "Update Property":
                createDataObj();
                break;
            case "Remove Property":
                remove_Item();
                break;
        }
    };

    ME.addItem = function() {
        ME.EditMode = "Add Property";
        ME.modePrompt = "Add New Property: Fill in the form and submit."
        setFormVisibility("addStepOne");
        resetInputFields();
    };

    ME.updateItem = function() {
        ME.EditMode = "Update Property";
        ME.modePrompt = "Update Property: Choose a property to edit/update."
        setFormVisibility("update");
        resetInputFields();
    };

    ME.removeItem = function() {
        ME.EditMode = "Remove Property";
        ME.modePrompt = "Remove Property: Choose a property to remove."
        setFormVisibility("remove");
        resetInputFields();
    };

    ME.formChange = function() {
        ME.formStatus = "Dirty";
        ME.submitInValid = true;
        var min = ME.validateMinimumRequirements();

        if (ME.EditMode == "Add Property") {

        } else if (ME.EditMode == "Update Property") {

        } else if (ME.EditMode == "Remove Property") {

        }

    };


    ME.selectClient = function() {
        var clientType = parseInt(ME.inputDataObj.client.type);
        if (clientType == 1) {
            var name = ME.inputDataObj.client.name_last;
            ME.inputDataObj.name = name + " Residence";
            ME.inputDataObj.street = ME.inputDataObj.client.street;
            ME.inputDataObj.city = ME.inputDataObj.client.city;
            ME.inputDataObj.state = ME.inputDataObj.client.state;
            ME.inputDataObj.zip = ME.inputDataObj.client.zip;
        } else {
            ME.inputDataObj.name = "Business Property";
            ME.inputDataObj.street = "";
            ME.inputDataObj.city = "";
            ME.inputDataObj.state = "";
            ME.inputDataObj.zip = "";
        }
        ME.formChange();
    };


    ME.selectProperty = function() {
        ME.configPropObj(ME.propertySelector.PRIMARY_ID);
        ME.formChange();
    };

    ME.selectRoof = function() {
        ME.formChange();
        if (ME.EditMode == "Add Property") {

        } else if (ME.EditMode == "Update Property") {

        } else if (ME.EditMode == "Remove Property") {

        }
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


    // Called on Update and Remove when Property selected
    ME.configPropObj = function(ID) {
        ME.formStatus = "Pristine";
        ME.inputDataObj = {};
        for (var i = 0; i < ME.PROPERTIES.length; i++) {
            if (ME.PROPERTIES[i].PRIMARY_ID == ID) {
                ME.inputDataObj = ME.PROPERTIES[i];
                break;
            };
        };

        ME.inputDataObj.client = ME.S.returnObjFromSetByPrimaryID(ME.CLIENTS, ME.inputDataObj.client);
        ME.inputDataObj.roofCode = ME.L.returnObjById(ME.L.roofCode, ME.inputDataObj.roofCode);
    };


    // Used by Update and Remove when retrieving roof data
    ME.configRoofObj = function(ID) {
        ME.formStatus = "Pristine";
        ME.inputDataObj = {};
        for (var i = 0; i < ME.PROPERTIES.length; i++) {
            if (ME.PROPERTIES[i].PRIMARY_ID == ID) {
                ME.inputDataObj = ME.PROPERTIES[i];
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



    // Step One of Add New Property
    // Insert blank records for MultiVents, MultiLevels and Roof 
    // Insert Roof when Propety ID is returned
    // Insert Multi's when Roof ID is returnmed
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

        newPropertyVars.street = outputDataObj.street;

        putProperty(outputDataObj);
    };

    // Step Two of Add New Property
    var createRoofDataObj = function() {
        var outputDataObj = {};
        
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
            }else{
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

        outputDataObj.propertyID = newPropertyVars.propertyID;
       
        var d = new Date();
        outputDataObj.createdDate = d.valueOf();
        outputDataObj.name = newPropertyVars.street;
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

        updateRoof(outputDataObj);
    };

    var putProperty = function(dataObj) {
        newPropertyVars.propertyID = 0;
        DB.query("putProperty", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.putProperty() at " + myName + " >>> putProperty()");
                console.log(resultObj.data);
            } else {
                newPropertyVars.propertyID = resultObj.data.id;
                if (dataObj.roofCode == "0") {
                    setFormVisibility("addStepTwo");
                    insertRoof();
                    ngDialog.open({
                        template: '<h2>Property with single pitched roof has been added. Continue with Roof Assembly.</h2>' +
                            '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">Close Me</button></div>',
                        className: 'ngdialog-theme-calm',
                        plain: true,
                        overlay: false
                    });
                } else {
                    ngDialog.open({
                        template: '<h2>Property has been added.</h2>',
                        className: 'ngdialog-theme-calm',
                        plain: true,
                        overlay: false
                    });
                }
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

    var insertRoof = function() {
        var dataObj = {};
        dataObj.propertyID = newPropertyVars.propertyID
        DB.query("insertRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.MultiLevels() at " + myName + " >>> MultiLevels()");
                console.log(resultObj.data);
            } else {
                newPropertyVars.roofID = resultObj.data.id;
                var dataObj = {};
                dataObj.roofID = resultObj.data.id;
                dataObj.propertyID = newPropertyVars.propertyID;
                insertMultiLevels(dataObj);
                insertMultiVents(dataObj);
            }
        }, function(error) {
            alert("ERROR returned for DB.MultiLevels() at " + myName + " >>> MultiLevels()");
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

    var insertMultiVents = function(dataObj) {
        DB.query("insertMultiVents", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.insertMultiVents() at " + myName + " >>> insertMultiVents()");
                console.log(resultObj.data);
            } else {

            }
        }, function(error) {
            alert("ERROR returned for DB.insertMultiVents() at " + myName + " >>> insertMultiVents()");
        });
    };

    var insertMultiLevels = function(dataObj) {
        DB.query("insertMultiLevels", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.insertMultiLevels() at " + myName + " >>> insertMultiLevels()");
                console.log(resultObj.data);
            } else {

            }
        }, function(error) {
            alert("ERROR returned for DB.insertMultiLevels() at " + myName + " >>> insertMultiLevels()");
        });
    };

    var submitMultiVents = function(id) {
        ME.multiVentObj.propertyID = id;
        DB.query("putMultiVents", ME.multiVentObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.submitMultiVents() at " + myName + " >>> submitMultiVents()");
                console.log(resultObj.data);
            } else {

            }
        }, function(error) {
            alert("ERROR returned for DB.submitMultiVents() at " + myName + " >>> submitMultiVents()");
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

    var update_Item = function() {

    };

    var remove_Item = function() {
        var dataObj = { propertyID: ME.inputDataObj.PRIMARY_ID };
        removeAssociatedPropertyData(dataObj);
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

    var removeAssociatedPropertyData = function(dataObj) {
        DB.query("deleteMultiLevel", dataObj);
        DB.query("deleteMultiVents", dataObj);
        DB.query("deleteRoof", dataObj);
    };

    var resetForm = function() {
        ME.formStatus = "Pristine";
    };

    var createDP = function() {
        ME.PROPERTIES = DB.clone(ME.S.PROPERTIES);

        ME.PROPERTIES.unshift({ displayName: "-- Select --", PRIMARY_ID: -1 });

        ME.CLIENTS = DB.clone(ME.S.CLIENTS);
        ME.CLIENTS.unshift({ displayName: "-- Select --", PRIMARY_ID: -1 });

        resetInputFields();

    };

    ME.validateMinimumRequirements = function() {
        var rtnBol = false;
        ME.submitInValid = true;
        if (ME.EditMode == "Add Property") {
            if (ME.inputDataObj.client.PRIMARY_ID > -1 && ME.inputDataObj.name != "" && ME.inputDataObj.roofCode.id > -1) {
                ME.submitInValid = false;
            }
        } else if (ME.EditMode == "Update Property") {
            if (ME.inputDataObj.client.PRIMARY_ID > -1 && ME.inputDataObj.name != "") {
                rtnBol = true;
            }
        } else if (ME.EditMode == "Remove Property") {

        }
        return rtnBol;
    };

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

    var resetInputFields = function() {
        ME.submitInValid = true;
        ME.inputDataObj = {
            manager: "",
            client: ME.CLIENTS[0],
            createdDate: "",
            name: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            roofCode: ME.L.roofCode[0],
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
        ME.propertySelector = ME.PROPERTIES[0];
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



    createDP();

    ME.S.getMultiVents();
    ME.S.getMultiLevels();

}]);
