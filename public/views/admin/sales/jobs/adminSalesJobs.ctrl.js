'use strict';

app.controller('AdminSalesJobsCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', function($state, $scope, AdminSharedSrvc, AdminDataSrvc) {

    var ME = this;
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.tableDataProvider = [];
    ME.EditMode = "Add Item";
    ME.inputDataObj = {};
    ME.selectedSalesRep

    var JOBS = [];
    ME.formStatus = "Pristine";

    ME.addItem = function(){
        ME.EditMode = "Add Item";
        ME.modePrompt = "Add New Job: Fill in the form and submit."
        resetInputFields();
    };
    ME.updateItem = function(){
        ME.EditMode = "Update Item";
        ME.modePrompt = "Update Job: Choose a Job from the list, update and submit."
    };

    ME.removeItem = function(){
        ME.EditMode = "Remove Item";
        ME.modePrompt = "Remove Job: Choose a Job from the list and submit."
    };

    ME.formChange = function() {
        ME.formStatus = "Dirty";
    }
     ME.selectClient = function() {
        ME.formStatus = "Dirty";
        getClientProperties();
    }
    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    var getClientProperties = function(){
        Me.propertyOptions = [];
        for (var i = 0; i < ME.S.PROPERTIES.length; i++) {
            if(ME.S.PROPERTIES[i].client == ME.inputDataObj.client.PRIMARY_ID){
                Me.propertyOptions.push(Me.propertyList[i]);
            }
        };
    }

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

    var add_Item = function(){
        var thisFunc = "add_Item()";
        var thisQuery = "DB.putJob()";
        DB.query("putJob",ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for "+thisQuery+" at "+myName+" >>> "+thisFunc);
            } else {
                resetInputFields();
            }
        }, function(error) {
            alert("ERROR returned for  "+thisQuery+" at "+myName+" >>> "+thisFunc);
        });
    };

    var update_Item = function() {

    };

    var remove_Item = function() {

    };


    var resetForm = function() {
        ME.formStatus = "Pristine";

    };

    var createDP = function() {
        ME.tableDataProvider = DB.clone(ME.S.JOBS);
        for (var i = 0; i < ME.tableDataProvider.length; i++) {
            var clientID = ME.tableDataProvider[i].client;
            ME.tableDataProvider[i].clientDisplayName = ME.S.returnClientNameByID(clientID);
            var managerID = ME.tableDataProvider[i].manager;
            ME.tableDataProvider[i].managerDisplayName = ME.S.returnManagerNameByID(managerID);
            var propertyID = ME.tableDataProvider[i].property;
            ME.tableDataProvider[i].propertyDisplayName = ME.S.returnPropertyNameByID(propertyID);
        }
    };

    var resetInputFields = function() {
        var date = new Date();
        var val = date.valueOf();
        ME.inputDataObj = { property: ME.S.PROPERTIES[0], client: ME.S.CLIENTS[0], status: "Prospect", manager: ME.S.salesReps[0], dateProspect: val };
    };



    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });


    resetInputFields();
    createDP();
}]);
