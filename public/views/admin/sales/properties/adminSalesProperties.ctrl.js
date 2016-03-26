'use strict';

app.controller('AdminSalesPropertiesCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', function($state, $scope, AdminSharedSrvc, AdminDataSrvc) {

    var ME = this;
    var myName = "AdminSalesPropertiesCtrl";
    var S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.tableDataProvider = [];
    ME.EditMode = "";

    var PROPERTIES = [];
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
        var dataObj = {};
        DB.query("putProperty",dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.putProperty() at "+myName+" >>> putProperty()");
            } else {
                var lastID = result.params.lastID;
            }
        }, function(error) {
            alert("ERROR returned for DB.putProperty() at "+myName+" >>> putProperty()");
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
                PROPERTIES = resultObj.data;
                createDP();
            }
        }, function(error) {
            alert("ERROR returned for DB.getClients() at "+myName+" >>> getClients()");
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
        ME.tableDataProvider = DB.clone(PROPERTIES);
    };



    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

    getClients();

}]);
