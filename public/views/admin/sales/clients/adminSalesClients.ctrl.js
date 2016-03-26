'use strict';

app.controller('AdminSalesClientsCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', function($state, $scope, AdminSharedSrvc, AdminDataSrvc) {

    var ME = this;
    var S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.tableDataProvider = [];
    ME.EditMode = "";

    var CLIENTS = [];
    ME.formStatus = "Pristine";
    
    ME.addItem = function(){
        ME.EditMode = "Add Item";
    };
    ME.updateItem = function(){
        ME.EditMode = "Update Item";
    };

    ME.removeItem = function(){
        ME.EditMode = "Remove Item";
    };

    ME.formChange = function(){
        ME.formStatus = "Dirty";
    }

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.clickTableRow = function(ID){
        for (var i = 0; i <  ME.tableDataProvider.length; i++) {
            if(ME.tableDataProvider[i].PRIMARY_ID == ID){
                
            }
        }
    }

    ME.submit = function(){
        switch(ME.EditMode){
            case "Add Item": add_Item();break;
            case "Update Item": update_Item();break;
            case "Remove Item": remove_Item();break;
        }
    };

    var add_Item = function(){

    };

    var update_Item = function(){
        
    };

    var remove{Item = function(){
        
    };

    var getClients = function() {
        DB.query("getClients").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.getClients() at AdminSalesClientsCtrl >>> getClients()");
            } else {
                CLIENTS = resultObj.data;
                createDP();
            }
        }, function(error) {
            alert("ERROR returned for DB.getClients() at AdminSalesClientsCtrl >>> getClients()");
        });
    };

    var resetForm = function(){
        ME.formStatus = "Pristine";
        if(ME.EditMode == "Add Item"){
            var sortNum = parseInt(ME.inputDataObj.Sort);
            sortNum+=1;
            ME.inputDataObj.Sort =  sortNum;
        }
    };


    var createDP = function() {
        ME.tableDataProvider = DB.clone(CLIENTS);
    };



    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

    getClients();

}]);
