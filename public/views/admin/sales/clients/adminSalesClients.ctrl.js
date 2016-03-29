'use strict';

app.controller('AdminSalesClientsCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', function($state, $scope, AdminSharedSrvc, AdminDataSrvc) {

    var ME = this;
    var myName = "AdminSalesClientsCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.tableDataProvider = [];
    ME.EditMode = "Add Item";
    ME.modePrompt = "Add New Client: Fill in the form and submit."
    ME.inputDataObj = {};
    ME.selectedSalesRep = ME.S.salesReps[0];

    var CLIENTS = [];
    ME.formStatus = "Pristine";
    
    ME.addItem = function(){
        ME.EditMode = "Add Item";
        ME.modePrompt = "Add New Client: Fill in the form and submit."
        resetInputFields();
    };
    ME.updateItem = function(){
        ME.EditMode = "Update Item";
        ME.modePrompt = "Update Client: Choose a Client from the list, update and submit."
    };

    ME.removeItem = function(){
        ME.EditMode = "Remove Item";
        ME.modePrompt = "Remove Client: Choose a Client from the list and submit."
    };

    ME.formChange = function(){
        ME.formStatus = "Dirty";
    }

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.clickTableRow = function(ID){
        ME.EditMode = "Update Item";
        ME.formStatus = "Pristine";
        ME.inputDataObj = {};
        for (var i = 0; i <  ME.tableDataProvider.length; i++) {
            if(ME.tableDataProvider[i].PRIMARY_ID == ID){
                 ME.inputDataObj = ME.tableDataProvider[i];
            }
        }
    };

    ME.submit = function(){
        switch(ME.EditMode){
            case "Add Item": add_Item();break;
            case "Update Item": update_Item();break;
            case "Remove Item": remove_Item();break;
        }
    };

    var add_Item = function(){
        var thisFunc = "add_Item()";
        var thisQuery = "DB.putClient()";
        DB.query("putClient",ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for "+thisQuery+" at "+myName+" >>> "+thisFunc);
            } else {
                resetInputFields();
            }
        }, function(error) {
            alert("ERROR returned for  "+thisQuery+" at "+myName+" >>> "+thisFunc);
        });
    };

    var update_Item = function(){
        
    };

    var remove_Item = function(){
        
    };

    var getClients = function() {
        DB.query("getClients").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.getClients() at "+myName+" >>> getClients()");
            } else {
                CLIENTS = resultObj.data;
                createDP();
            }
        }, function(error) {
            alert("ERROR returned for DB.getClients() at "+myName+" >>> getClients()");
        });
    };

    var resetForm = function(){
        ME.formStatus = "Pristine";
    };

    var createDP = function() {
        ME.tableDataProvider = DB.clone(CLIENTS);
        for (var i = 0; i < ME.tableDataProvider.length; i++) {
            var managerID = ME.tableDataProvider[i].manager;
            ME.tableDataProvider[i].managerDisplayName = S.returnManagerNameByID(managerID);
        }
    };

    $scope.$watch('$viewContentLoaded', function() {
        console.log(myName+" >>> $viewContentLoaded");
    });

    var resetInputFields = function(){
        ME.inputDataObj = {type:"",manager:"",company:"",displayName:"",name_first:"",name_last:"",street:"",city:"",state:"",zip:"",phone_bus:"",
        phone_cell:"",email:""};
        ME.selectedSalesRep = ME.S.salesReps[0];
    };

    getClients();
    resetInputFields();

}]);
