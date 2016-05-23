'use strict';

app.controller('AdminSalesClientsCtrl', ['$state', '$scope', 'AdminSharedSrvc', 'AdminDataSrvc', 'ngDialog', function($state, $scope, AdminSharedSrvc, AdminDataSrvc, ngDialog) {

    var ME = this;
    var myName = "AdminSalesClientsCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    var CLIENTS = [];

    ME.clientsDP = [];
    ME.salesRepsDP = [];
    ME.EditMode = "Add Client";
    ME.modePrompt = "Add New Client: Fill in the form and submit.";
    ME.formStatus = "Pristine";

    ME.inputDataObj = {};
    ME.selectedSalesRep = ME.S.salesReps[0];
    ME.selectedClient = null;
    ME.submitInValid = true;

    ME.selectClient = function() {
        ME.configDataObj();
        if (ME.EditMode == "Remove Client") {
            ME.formStatus = "Submit";
            ME.submitInValid = false;
        } else if (ME.EditMode == "Update Client") {
            ME.formStatus = "Pristine";
            ME.submitInValid = true;
        };
    };

    ME.selectRep = function() {
       ME.formStatus = "Dirty";
       if (ME.EditMode == "Update Client") {
            ME.formStatus = "Submit";
            ME.submitInValid = false;
        }else if(ME.EditMode == "Add Client"){
            validateForm();
        }
    };

    ME.addItem = function() {
        ME.EditMode = "Add Client";
        ME.modePrompt = "Add New Client: Fill in the form and submit."
        resetInputFields();
    };

    ME.updateItem = function() {
        ME.EditMode = "Update Client";
        ME.modePrompt = "Update Client: Select a Client to edit/update."
        resetInputFields();
        ME.inputDataObj.type = null;
    };

    ME.removeItem = function() {
        ME.EditMode = "Remove Client";
        ME.modePrompt = "Remove Client: Select a Client to remove."
        resetInputFields();
        ME.inputDataObj.type = null;
    };

    ME.formChange = function() {
        ME.formStatus = "Submit";
        if (ME.EditMode == "Update Client") {
            ME.formStatus = "Dirty";
            ME.submitInValid = false;
        }else if(ME.EditMode == "Add Client"){
            validateForm();
        }
    };

    var validateForm = function(){
        // Make sure we have minimum of first and last name and sales rep
        if(ME.inputDataObj.name_first.length > 0 && ME.inputDataObj.name_last.length > 2 && ME.selectedSalesRep.PRIMARY_ID > 0){
            ME.formStatus = "Submit";
            ME.submitInValid = false;
        }
    };

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.configDataObj = function() {
        var ID = parseInt(ME.selectedClient.PRIMARY_ID);
        if (ID === -1) {
            resetInputFields();
            ME.formStatus = "Pristine";
            return;
        };

        ME.inputDataObj = {};
        for (var i = 0; i < ME.clientsDP.length; i++) {
            if (ME.clientsDP[i].PRIMARY_ID == ID) {
                ME.inputDataObj = ME.clientsDP[i];
                break;
            }
        };

        var mgrID = ME.selectedClient.manager;
        ME.selectedSalesRep = returnManagerObjByID(mgrID);
    };

    ME.submit = function() {
        if (ME.formStatus != "Submit") {
            ngDialog.open({
                template: '<h2>Form is invalid or incomplete.</h2>',
                className: 'ngdialog-theme-alert',
                plain: true,
                overlay: false
            });
        } else {
            switch (ME.EditMode) {
                case "Add Client":
                    add_Item();
                    break;
                case "Update Client":
                    update_Item();
                    break;
                case "Remove Client":
                    remove_Item();
                    break;
            }
        }
    };

    var add_Item = function() {
        var thisFunc = "add_Item()";
        var thisQuery = "DB.putClient()";
        ME.inputDataObj.username = ME.inputDataObj.email;
        ME.inputDataObj.displayName = ME.inputDataObj.name_first + " " + ME.inputDataObj.name_last;
        ME.inputDataObj.manager = ME.selectedSalesRep.PRIMARY_ID;
        
        DB.query("putClient", ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for " + thisQuery + " at " + myName + " >>> " + thisFunc);
            } else {
                var clientName = ME.inputDataObj.displayName;
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Client ' + clientName + ' has been saved!</h2>',
                    className: 'ngdialog-theme-calm',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for  " + thisQuery + " at " + myName + " >>> " + thisFunc);
        });
    };

    var update_Item = function() {
        DB.query("updateClient", ME.inputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for " + thisQuery + " at " + myName + " >>> " + thisFunc);
            } else {
                var clientName = ME.inputDataObj.displayName;
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Client ' + clientName + ' has been updated!</h2>',
                    className: 'ngdialog-theme-calm',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for  " + thisQuery + " at " + myName + " >>> " + thisFunc);
        });
    };

    var remove_Item = function() {
        var dataObj = { ID: ME.inputDataObj.PRIMARY_ID };
        DB.query("deleteClient", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("FALSE returned for DB.deleteProperty() at " + myName + " >>> remove_Item()");
                console.log(resultObj.data);
            } else {
                var x = resultObj.data;
                ngDialog.open({
                    template: '<h2>Client has been deleted.</h2>',
                    className: 'ngdialog-theme-calm',
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
                alert("FALSE returned for DB.getClients() at " + myName + " >>> getClients()");
            } else {
                CLIENTS = resultObj.data;
                createDataProviders();
            }
        }, function(error) {
            alert("ERROR returned for DB.getClients() at " + myName + " >>> getClients()");
        });
    };

    var resetForm = function() {
        ME.formStatus = "Pristine";
        ME.selectedClient = ME.clientsDP[0];
    };

    var createDataProviders = function() {
        ME.clientsDP = DB.clone(CLIENTS);

        for (var i = 0; i < ME.clientsDP.length; i++) {
            var managerID = ME.clientsDP[i].manager;
            ME.clientsDP[i].managerName = ME.S.returnManagerNameByID(managerID);
        }

        ME.clientsDP.splice(0, 0, { displayName: "-- Select One --", PRIMARY_ID: "-1" });
        ME.selectedClient = ME.clientsDP[0];

        ME.salesRepsDP = DB.clone(ME.S.salesReps);
        ME.salesRepsDP.splice(0, 0, { displayName: "-- Select One --", PRIMARY_ID: "-1" });
        ME.selectedSalesRep = ME.salesRepsDP[0];
    };

    $scope.$watch('$viewContentLoaded', function() {
        console.log(myName + " >>> $viewContentLoaded");
    });

    var returnManagerObjByID = function(id) { 
        for (var i = 0; i < ME.salesRepsDP.length; i++) {
            if (ME.salesRepsDP[i].PRIMARY_ID == id) {
                return ME.salesRepsDP[i];
            };
        };
    };

    var resetInputFields = function() {
        ME.formStatus = "Pristine";
        ME.inputDataObj = {
            type: "1",
            manager: "",
            company: "",
            displayName: "",
            name_first: "",
            name_last: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            phone_bus: "",
            phone_cell: "",
            email: "",
            username: ""
        };
        ME.selectedSalesRep = ME.salesRepsDP[0];
        ME.selectedClient = ME.clientsDP[0];
        ME.submitInValid = true;
    };

    getClients();
    resetInputFields();

}]);
