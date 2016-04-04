'use strict';

app.controller('AdminSalesJobsCtrl', ['AdminSharedSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', '$state',function(AdminSharedSrvc, AdminDataSrvc,ListSrvc,ngDialog,$state) {

    var ME = this;
    var myName = "AdminSalesJobsCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    var JOBS = [];

    ME.tableDataProvider = [];
    ME.EditMode = "Add Item";
    ME.modePrompt = "Add New Job: Fill in the form and submit.";
    ME.formStatus = "Pristine";
    ME.ouputDataObj = {};
    
    ME.jobSelected = {};
    ME.clientSelected = null;
    ME.propertySelected = {};
    ME.statusSelected = {};

    ME.clientDisplayName = "";
    ME.propertyDisplayName = "";
    ME.salesMgrDisplayName = "";

    ME.selectJob = function() {
        configOutObj();
    };

    ME.selectClient = function() {
        getClientSalesMgr();
        getClientProperties();
    };

    ME.selectProperty = function() {
        
    };

    ME.selectStatus = function() {
        
    };


    ME.addItem = function(){
        ME.EditMode = "Add Item";
        ME.modePrompt = "Add New Job: Fill in the form and submit."
        resetInputFields();
    };

    ME.updateItem = function(){
        ME.EditMode = "Update Item";
        ME.modePrompt = "Update Job: Choose a Job from the list to update/edit."
        resetInputFields();
    };

    ME.removeItem = function(){
        ME.EditMode = "Remove Item";
        ME.modePrompt = "Remove Job: Choose a Job from the list to remove."
        resetInputFields();
    };

    ME.formChange = function() {
        ME.formStatus = "Submit";
    }

    
    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    var getClientSalesMgr = function(){
        ME.salesMgr = "";
        for (var i = 0; i < ME.S.PROPERTIES.length; i++) {
            if(ME.S.PROPERTIES[i].client == ME.inputDataObj.client.PRIMARY_ID){
                Me.propertyOptions.push(Me.propertyList[i]);
            }
        };
    };

    var getClientProperties = function(){
        ME.propertyOptions = [];
        for (var i = 0; i < ME.S.PROPERTIES.length; i++) {
            if(ME.S.PROPERTIES[i].client == ME.inputDataObj.client.PRIMARY_ID){
                Me.propertyOptions.push(Me.propertyList[i]);
            }
        };
    };

    ME.configOutputObj = function(ID) {
        if(ID === "-1"){
            resetInputFields();
            ME.formStatus = "Pristine";
            return;
        }

        ME.clientSelected = {};
        ME.propertySelected = {};
        ME.statusSelected = {};
        ME.salesMgr = "";

        ME.ouputDataObj = { property: null, client: null, status: "Prospect", manager: null, dateProspect:null};

        for (var i = 0; i < ME.tableDataProvider.length; i++) {
            if (ME.tableDataProvider[i].PRIMARY_ID == ID) {
               
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
        ME.tableDataProvider.splice(0,0,{propertyDisplayName:"-- Select --",PRIMARY_ID:"-1"});
        ME.jobSelected = ME.tableDataProvider[0];
    };

    var resetInputFields = function() {
        var date = new Date();
        var val = date.valueOf();
        ME.ouputDataObj = { property: null, client: null, status: "Prospect", manager: null, dateProspect:val };
        ME.jobSelected = ME.tableDataProvider[0];
        ME.statusSelected = ME.L.jobStatusOptions[0];
        ME.clientSelected = null;
        ME.propertySelected = null;
        ME.formStatus = "Pristine";

        ME.clientDisplayName = "--";
        ME.propertyDisplayName = "--";
        ME.salesMgrDisplayName = "--";
    };


    resetInputFields();
    createDP();
}]);
