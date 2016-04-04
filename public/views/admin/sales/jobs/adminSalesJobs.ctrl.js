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
    ME.clientManager = {};
    ME.statusSelected = {};

    ME.salesMgrDisplayName = "";

    ME.selectJob = function() {
       ME.statusSelected = ME.L.returnObjByLabel(ME.L.jobStatusOptions,ME.jobSelected.status);
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
        if(ME.EditMode == "Add Item"){

        }else{

        }
        //ME.formStatus = "Submit";
    }

    
    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    var getClientSalesMgr = function(){
        ME.salesMgrDisplayName = "";
        ME.clientManager = ME.S.returnManagerObjByID(ME.clientSelected.manager);
        ME.salesMgrDisplayName = ME.clientManager.displayName;
    };

    var getClientProperties = function(){
        ME.propertyOptions = [];
        for (var i = 0; i < ME.S.PROPERTIES.length; i++) {
            if(ME.S.PROPERTIES[i].client == ME.clientSelected.PRIMARY_ID){
                ME.propertyOptions.push(ME.S.PROPERTIES[i]);
            }
        };
        if(ME.propertyOptions.length > 0){
            ME.propertySelected = ME.propertyOptions[0];
        }
    };

    

    var configAddOutputObj = function() {
        ME.ouputDataObj = { property: null, client: null, status: "Prospect", manager: null, dateProspect:null};
        ME.ouputDataObj.property = ME.propertySelected.PRIMARY_ID;
        ME.ouputDataObj.client = ME.clientSelected.PRIMARY_ID;
        ME.ouputDataObj.manager = ME.clientManager.PRIMARY_ID;
        ME.ouputDataObj.status = ME.statusSelected.label;

        var date = new Date();
        var val = date.valueOf();

        switch(ME.statusSelected.label){
            case "Prospect":ME.ouputDataObj.dateProspect = val;break;
            case "Proposal":ME.ouputDataObj.dateProposal = val;break;
            case "Contract":ME.ouputDataObj.dateContract = val;break;
            case "Active":ME.ouputDataObj.dateActive = val;break;
            case "Complete":ME.ouputDataObj.dateComplete = val;break;
        };

        add_Item();
    };

    ME.submit = function() {
        switch (ME.EditMode) {
            case "Add Item":
                configAddOutputObj();
                break;
            case "Update Item":
                configUpdateOutputObj();
                break;
            case "Remove Item":
                remove_Item();
                break;
        }
    };

    var configUpdateOutputObj = function(){
        if(ME.jobSelected.PRIMARY_ID == "-1"){
            ngDialog.open({
                    template: '<h2>Form is invalid or incomplete.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
        }else{
            ME.outputDataObj = {};
            ME.outputDataObj.id = ME.jobSelected.PRIMARY_ID;
            ME.outputDataObj.status = ME.statusSelected.label;
            var date = new Date();
            var val = date.valueOf();
            ME.outputDataObj.val = val;
            update_Item();
        };
    };

    var add_Item = function(){
        var thisFunc = "add_Item()";
        var thisQuery = "DB.putJob()";

        DB.query("putJob",ME.outputDataObj).then(function(resultObj) {
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
        var thisFunc = "update_Item()";
        var thisQuery = "";
        switch(ME.statusSelected.label){
            case "Prospect":thisQuery="updateProspectDate";break;
            case "Proposal":thisQuery="updateProposalDate";break;
            case "Contract":thisQuery="updateContractDate";break;
            case "Active":thisQuery="updateActiveDate";break;
            case "Complete":thisQuery="updateCompleteDate";break;
        };

        DB.query(thisQuery,ME.outputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for "+thisQuery+" at "+myName+" >>> "+thisFunc);
            } else {
                var stat =  ME.statusSelected.label;
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Job Status updated to ' + stat + '</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
               
            }
        }, function(error) {
            alert("ERROR returned for  "+thisQuery+" at "+myName+" >>> "+thisFunc);
        });
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

            ME.tableDataProvider[i].jobLabel = ME.S.returnPropertyNameByID(propertyID);
        }
        ME.tableDataProvider.splice(0,0,{jobLabel:"-- Select --",propertyDisplayName:"--",clientDisplayName:"--",managerDisplayName:"--",status:"--",PRIMARY_ID:"-1"});
        ME.jobSelected = ME.tableDataProvider[0];
    };

    var resetInputFields = function() {
        
        ME.jobSelected = ME.tableDataProvider[0];
        ME.statusSelected = ME.L.jobStatusOptions[0];
        ME.clientSelected = null;
        ME.propertySelected = null;
        ME.clientManager = null;
        ME.formStatus = "Pristine";

        ME.salesMgrDisplayName = "--";

    };


    resetInputFields();
    createDP();
}]);
