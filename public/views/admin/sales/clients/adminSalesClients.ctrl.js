'use strict';

app.controller('AdminSalesClientsCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminDataSrvc,ngDialog) {

    var ME = this;
    var myName = "AdminSalesClientsCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    var CLIENTS = [];

    ME.clientsDP = [];
    ME.EditMode = "Add Client";
    ME.modePrompt = "Add New Client: Fill in the form and submit.";
    ME.formStatus = "Pristine";

    ME.inputDataObj = {};
    ME.selectedSalesRep = ME.S.salesReps[0];
    ME.selectedClient = null;

    ME.selectClient = function() {
        ME.configDataObj();
        if(ME.EditMode == "Remove Client"){
            ME.formStatus = "Submit";
        }else if(ME.EditMode == "Update Client"){
            ME.formStatus = "Incomplete";
        }
    };
    
    ME.addItem = function(){
        ME.EditMode = "Add Client";
        ME.modePrompt = "Add New Client: Fill in the form and submit."
        resetInputFields();
    };

    ME.updateItem = function(){
        ME.EditMode = "Update Client";
        ME.modePrompt = "Update Client: Select a Client to edit/update."
        resetInputFields();
    };

    ME.removeItem = function(){
        ME.EditMode = "Remove Client";
        ME.modePrompt = "Remove Client: Select a Client to remove."
        resetInputFields();
    };

    ME.formChange = function(){
        ME.formStatus = "Submit";
    };

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.configDataObj = function(){
        var ID = parseInt(ME.selectedClient.PRIMARY_ID);
        if(ID === -1){
            resetInputFields();
            ME.formStatus = "Pristine";
            return;
        }
        
        ME.inputDataObj = {};
        for (var i = 0; i <  ME.clientsDP.length; i++) {
            if(ME.clientsDP[i].PRIMARY_ID == ID){
                 ME.inputDataObj = ME.clientsDP[i];
            }
        };
        var mgrID = ME.selectedClient.manager;
        ME.selectedSalesRep = ME.S.returnManagerObjByID(mgrID);
    };

    ME.submit = function(){
        if(ME.formStatus != "Submit"){
            ngDialog.open({
                    template: '<h2>Form is invalid or incomplete.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
        }else{
           switch(ME.EditMode){
                case "Add Client": add_Item();break;
                case "Update Client": update_Item();break;
                case "Remove Client": remove_Item();break;
            } 
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
                ngDialog.open({
                    template: '<h2>Client has been added.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for  "+thisQuery+" at "+myName+" >>> "+thisFunc);
        });
    };

    var update_Item = function(){
        DB.query("updateClient",ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for "+thisQuery+" at "+myName+" >>> "+thisFunc);
            } else {
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Client has been updated.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for  "+thisQuery+" at "+myName+" >>> "+thisFunc);
        });
    };

    var remove_Item = function(){
        var dataObj = { ID: ME.inputDataObj.PRIMARY_ID };
        DB.query("deleteClient", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("FALSE returned for DB.deleteProperty() at " + myName + " >>> remove_Item()");
                console.log(resultObj.data);
            } else {
                var x = resultObj.data;
                ngDialog.open({
                    template: '<h2>Client has been deleted.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.deleteProperty() at " + myName + " >>> remove_Item()");
        });
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
        ME.selectedClient = ME.clientsDP[0];
    };

    var createDP = function() {
        ME.clientsDP = DB.clone(CLIENTS);
        
        for (var i = 0; i < ME.clientsDP.length; i++) {
            var managerID = ME.clientsDP[i].manager;
            ME.clientsDP[i].managerName = ME.S.returnManagerNameByID(managerID);
        }
        ME.clientsDP.splice(0,0,{displayName:"-- Select --",PRIMARY_ID:"-1"});
        ME.selectedClient = ME.clientsDP[0];
    };

    $scope.$watch('$viewContentLoaded', function() {
        console.log(myName+" >>> $viewContentLoaded");
    });

    var resetInputFields = function(){
        ME.formStatus = "Pristine";
        ME.inputDataObj = {type:"",manager:"",company:"",displayName:"",name_first:"",name_last:"",street:"",city:"",state:"",zip:"",phone_bus:"",
        phone_cell:"",email:""};
        ME.selectedSalesRep = ME.S.salesReps[0];
        ME.selectedClient = ME.clientsDP[0];
    };

    getClients();
    resetInputFields();

}]);
