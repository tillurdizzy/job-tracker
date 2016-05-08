'use strict';

app.controller('RemovePropertyCtrl', ['$state', '$scope', 'PropertiesSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', function($state, $scope, PropertiesSrvc, AdminDataSrvc, ListSrvc, ngDialog) {
    var ME = this;
    var myName = "AdminSalesPropertiesCtrl";
    ME.P = PropertiesSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    ME.PROPERTIES = [];
    ME.EditMode = "Remove Property";
    ME.modePrompt = "Remove Property: Choose a property to remove."
    ME.SubmitBtnLabel = "Remove Property";
   
    ME.submitInValid = true;
   
    ME.isMultiUnit = false;


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

    
    ME.submit = function() {
        remove_Item();
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


   

    ME.selectProperty = function() {
        ME.configPropObj(ME.propertySelector.PRIMARY_ID);
        ME.formChange();
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
        ME.PROPERTIES = DB.clone(ME.P.PROPERTIES);
        ME.CLIENTS = DB.clone(ME.P.CLIENTS);
        resetInputFields();
    };


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

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

}]);
