'use strict';

app.controller('AdminSalesPropertiesCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', 'ListSrvc', function($state, $scope, AdminSharedSrvc, AdminDataSrvc, ListSrvc) {

    var ME = this;
    var myName = "AdminSalesPropertiesCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    ME.tableDataProvider = [];
    ME.EditMode = "Add Item";
    ME.formStatus = "Pristine";
    ME.isMultiLevel = false;
    ME.isMultiVented = false;


    ME.addItem = function() {
        ME.EditMode = "Add Item";
        ME.modePrompt = "Add New Property: Fill in the form and submit."
        resetInputFields();
    };
    ME.updateItem = function() {
        ME.EditMode = "Update Item";
        ME.modePrompt = "Update Property: Choose a Property from the list, update and submit."
    };

    ME.removeItem = function() {
        ME.EditMode = "Remove Item";
        ME.modePrompt = "Remove Property: Choose a Property from the list and submit."
    };

    ME.formChange = function() {
        ME.formStatus = "Dirty";
    }

    ME.selectVentilation = function(){
        if(ME.inputDataObj.roofVents.label == "Various Other"){
             ME.isMultiVented = true;
        }
    }

    ME.selectPitch = function(){
        if(ME.inputDataObj.roofPitch.label == "Multi-level"){
             ME.isMultiLevel = true;
        }
    }

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.clickTableRow = function(ID) {
        ME.EditMode = "Update Item";
        ME.formStatus = "Pristine";
        ME.inputDataObj = {};
        for (var i = 0; i < ME.tableDataProvider.length; i++) {
            if (ME.tableDataProvider[i].PRIMARY_ID == ID) {
                ME.inputDataObj = ME.tableDataProvider[i];
            }
        }
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
        DB.query("putProperty", ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.putProperty() at " + myName + " >>> putProperty()");
            } else {
                var lastID = result.params.lastID;
            }
        }, function(error) {
            alert("ERROR returned for DB.putProperty() at " + myName + " >>> putProperty()");
        });
    };

    var update_Item = function() {

    };

    var remove_Item = function() {

    };

    var getProperties = function() {
        DB.query("getProperties").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.getProperties() at " + myName + " >>> getProperties()");
            } else {
                PROPERTIES = resultObj.data;
                createDP();
            }
        }, function(error) {
            alert("ERROR returned for DB.getProperties() at " + myName + " >>> getProperties()");
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
    };



    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

    var resetInputFields = function() {
        ME.inputDataObj = {
            manager: "",
            client: ME.S.CLIENTS[0],
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
            valleyDetail: ME.L.valleyOptions[0],
            ridgeCap: ME.L.ridgeCapShingles[0],
            roofVents: ME.L.ventOptions[0],
            roofPitch: ME.L.pitchOptions[0],
            multiLevel: "",
            multiVents: ""
        };
    };


    resetInputFields();
    createDP();

}]);
