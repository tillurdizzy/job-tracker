'use strict';

app.controller('AddPropertyCtrl', ['$state', '$scope', 'PropertiesSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', function($state, $scope, PropertiesSrvc, AdminDataSrvc, ListSrvc, ngDialog) {
    var ME = this;
    var me = "AddPropertyCtrl: ";
    ME.P = PropertiesSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    ME.PROPERTIES = [];

    ME.SubmitBtnLabel = "Add Property";
    ME.submitInValid = true;
    ME.isMultiLevel = false;
    ME.isMultiVented = false;
    ME.isMultiUnit = false;

    ME.formVisibility = { stepOne: true, stepTwo: false };

    ME.newPropertyVars = { propertyID: 0, street: "", roofID: 0 };

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

    ME.submit = function() {
        ME.P.trace(me + "submit");
        if (ME.formVisibility.stepOne === true) {
            createPropertyDataObj();
        } else if (ME.formVisibility.stepTwo === true) {
            createRoofDataObj();
        };
    };

    ME.formChange = function() {
        ME.P.trace(me + "formChange");
        ME.submitInValid = true;
        if (ME.inputDataObj.client.PRIMARY_ID > -1 && ME.inputDataObj.name != "" && ME.inputDataObj.roofCode.id > -1) {
            ME.submitInValid = false;
        }
    };

    ME.selectClient = function() {
        ME.P.trace(me + "selectClient");
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
        ME.P.trace(me + "selectProperty");
        ME.configPropObj(ME.propertySelector.PRIMARY_ID);
        ME.formChange();
    };


    // Step One of Add New Property
    // Insert blank records for MultiVents, MultiLevels and Roof 
    // Insert Roof when Propety ID is returned
    // Insert Multi's when Roof ID is returnmed
    var createPropertyDataObj = function() {
        ME.P.trace(me + "createPropertyDataObj");
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

        ME.newPropertyVars.street = outputDataObj.street;

        putProperty(outputDataObj);
    };

    // Step Two of Add New Property
    var createRoofDataObj = function() {
        ME.P.trace(me + "createRoofDataObj");
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

        outputDataObj.propertyID = ME.newPropertyVars.propertyID;

        var d = new Date();
        outputDataObj.createdDate = d.valueOf();
        outputDataObj.name = ME.newPropertyVars.street;
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

    ME.selectVentilation = function() {
        ME.P.trace(me + "selectVentilation");
        if (ME.inputDataObj.roofVents.label == "Various Other") {
            ME.isMultiVented = true;
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

    ME.selectPitch = function() {
        ME.P.trace(me + "selectPitch");
        if (ME.inputDataObj.roofPitch.label == "Multi-level") {
            ME.isMultiLevel = true;
        } else {
            ME.isMultiLevel = false;
            ME.multiLevelModel = {
                levelOne: { percent: ME.L.percentOptions[0] },
                levelTwo: { percent: ME.L.percentOptions[0] },
                levelThree: { percent: ME.L.percentOptions[0] },
                levelFour: { percent: ME.L.percentOptions[0] }
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

    var putProperty = function(dataObj) {
        ME.P.trace(me + "putProperty");
        ME.newPropertyVars.propertyID = 0;
        DB.query("putProperty", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.putProperty() at " + myName + " >>> putProperty()");
                console.log(resultObj.data);
            } else {
                ME.newPropertyVars.propertyID = resultObj.data.id;
                if (dataObj.roofCode == "0") {
                    ME.formVisibility = { stepOne: false, stepTwo: true };
                    ME.SubmitBtnLabel = "Add Roof";
                    insertRoof();
                    ngDialog.open({
                        template: '<h2>Property with single pitched roof has been added. Continue with Roof Assembly.</h2>' +
                            '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">Continue</button></div>',
                        className: 'ngdialog-theme-calm',
                        plain: true,
                        overlay: false
                    });
                } else {
                    ME.addItem();
                    ngDialog.open({
                        template: '<h2>Property has been added. Add roofs to this multi-unit property from the Update Tab.</h2>',
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

    ////////////////////////////////// BEGIN INSERTS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    // Inserts a default Roof row then triggers insertion of 
    // MultiLevel and MultiVents once lastID is returned.
    var insertRoof = function() {
        ME.P.trace(me + "insertRoof");
        var dataObj = {};
        dataObj.propertyID = ME.newPropertyVars.propertyID
        DB.query("insertRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.insertRoof() at " + myName + " >>> insertRoof()");
                console.log(resultObj.data);
            } else {
                ME.newPropertyVars.roofID = resultObj.data.id;
                var dataObj = {};
                dataObj.roofID = resultObj.data.id;
                dataObj.propertyID = ME.newPropertyVars.propertyID;
                insertMultiLevels(dataObj);
                insertMultiVents(dataObj);
            }
        }, function(error) {
            alert("ERROR returned for DB.insertRoof() at " + myName + " >>> insertRoof()");
        });
    };

    var insertMultiVents = function(dataObj) {
        ME.P.trace(me + "insertMultiVents");
        DB.query("insertMultiVents", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.insertMultiVents() at " + myName + " >>> insertMultiVents()");
                console.log(resultObj.data);
            } else {
                console.log(resultObj.data);
            }
        }, function(error) {
            alert("ERROR returned for DB.insertMultiVents() at " + myName + " >>> insertMultiVents()");
        });
    };

    var insertMultiLevels = function(dataObj) {
        ME.P.trace(me + "insertMultiLevels");
        DB.query("insertMultiLevels", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.insertMultiLevels() at " + myName + " >>> insertMultiLevels()");
                console.log(resultObj.data);
            } else {
                console.log(resultObj.data);
            }
        }, function(error) {
            alert("ERROR returned for DB.insertMultiLevels() at " + myName + " >>> insertMultiLevels()");
        });
    };
    ////////////////////////////////// END INSERTS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


    //////////////////////////////////// BEGIN UPDATES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    // Needed for Part Two - Default inserts for Step One, Updates for Step Two
    var updateRoof = function(dataObj) {
        ME.P.trace(me + "updateRoof");
        DB.query("updateRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.updateRoof() at " + myName + " >>> updateRoof()");
                console.log(resultObj.data);
            } else {
                ME.P.refreshSalesData();// Triggers the Sales Data Cascade beginning with getProperties() in Adminshared
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
        ME.P.trace(me + "updateMultiLevels");
        ME.multiLevelObj.propertyID = ME.newPropertyVars.propertyID;
        ME.multiLevelObj.roofID = ME.newPropertyVars.roofID;
        DB.query("updateMultiLevels", ME.multiLevelObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.updateMultiLevels() at " + myName + " >>> updateMultiLevels()");
                console.log(resultObj.data);
            } else {
                //console.log(resultObj.data);
            }
        }, function(error) {
            alert("ERROR returned for DB.updateMultiLevels() at " + myName + " >>> updateMultiLevels()");
        });
    };

    var updateMultiVents = function() {
        ME.P.trace(me + "updateMultiVents");
        ME.multiVentObj.propertyID = ME.newPropertyVars.propertyID;
        ME.multiVentObj.roofID = ME.newPropertyVars.roofID;
        DB.query("updateMultiVents", ME.multiVentObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.updateMultiVents() at " + myName + " >>> updateMultiVents()");
                console.log(resultObj.data);
            } else {
                //console.log(resultObj.data);
            }
        }, function(error) {
            alert("ERROR returned for DB.updateMultiVents() at " + myName + " >>> updateMultiVents()");
        });
    };

    //////////////////////////////////// END UPDATES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


    var resetInputFields = function() {
        ME.P.trace(me + "resetInputFields");
        ME.formVisibility = { stepOne: true, stepTwo: false };
        ME.SubmitBtnLabel = "Add Property";
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

        ME.multiLevelObj = {};

        ME.multiVentObj = {};

    };

    var createDP = function() {
        ME.P.trace(me + "createDP");
        ME.PROPERTIES = DB.clone(ME.P.PROPERTIES);
        ME.CLIENTS = DB.clone(ME.P.CLIENTS);
        resetInputFields();
    };

    createDP();
    resetInputFields();

    $scope.$on('onSalesDataRefreshed', function() {
        ME.P.refreshDataProviders();
        createDP();
    });

}]);
