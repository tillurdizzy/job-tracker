'use strict';

app.controller('AdminSalesJobsCtrl', ['AdminSharedSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', '$state', function(AdminSharedSrvc, AdminDataSrvc, ListSrvc, ngDialog, $state) {

    var ME = this;
    var myName = "AdminSalesJobsCtrl";
    ME.S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;


    ME.JOBS = [];
    ME.EditMode = "Add Job";
    ME.modePrompt = "Add New Job: Fill in the form and submit.";
    ME.formStatus = "Pristine";
    ME.outputDataObj = {};
    ME.clientsDP = [];

    ME.jobSelected = {};
    ME.clientSelected = null;
    ME.propertySelected = {};
    ME.clientManager = {};
    ME.statusSelected = {};
    ME.submitInValid = true;
    ME.addJobInsertID = 0;

    ME.salesMgrDisplayName = "";

    // Update and Remove use selectJob()
    ME.selectJob = function() {
        ME.statusSelected = ME.L.returnObjByLabel(ME.L.jobStatusOptions, ME.jobSelected.status);
        if(ME.EditMode == "Update Job"){

        }else if(ME.EditMode == "Remove Job"){
            ME.submitInValid = false;
        }
    };

    // Add uses selectClient() and selectProperty()
    ME.selectClient = function() {
        ME.submitInValid = true;
        var id = parseInt(ME.clientSelected.PRIMARY_ID);
        if (id > -1) {
            getClientSalesMgr();
            getClientProperties();
        }else{
            ME.salesMgrDisplayName = "--";
            ME.propertySelected = null;
        }
    };

    ME.selectProperty = function() {
        doesJobExist();
    };


    ME.selectStatus = function() {

    };

    ME.selectStatusUpdate = function(){
         ME.submitInValid = false;
    }

    // Is user creating a duplicate?
    var doesJobExist = function() {
        var dataObj = {};
        dataObj.propID = ME.propertySelected.PRIMARY_ID;
        dataObj.clientID = ME.clientSelected.PRIMARY_ID;
        DB.query("doesJobExist", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for " + thisQuery + " at " + myName + " >>> " + thisFunc);
            } else {
                ME.submitInValid = true;
                if (resultObj.data.length != 0) {
                    ME.propertySelected = ME.propertyOptions[0];
                    ngDialog.open({
                        template: '<h2>Job already exists.</h2>',
                        className: 'ngdialog-theme-alert',
                        plain: true,
                        overlay: false
                    });
                }else{
                    ME.submitInValid = false;
                }
            }
        }, function(error) {
            alert("ERROR returned for  " + thisQuery + " at " + myName + " >>> " + thisFunc);
        });
    };


    ME.addItem = function() {
        ME.EditMode = "Add Job";
        ME.modePrompt = "Add New Job: Fill in the form and submit."
        resetInputFields();

    };

    ME.updateItem = function() {
        ME.EditMode = "Update Job";
        ME.modePrompt = "Update Job: Select a Job from the list to update/edit."
        resetInputFields();
    };

    ME.removeItem = function() {
        ME.EditMode = "Remove Job";
        ME.modePrompt = "Remove Job: Select a Job from the list to remove."
        resetInputFields();
    };

    ME.formChange = function() {
        if (ME.EditMode == "Add Job") {

        } else {

        }
        //ME.formStatus = "Submit";
    }


    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    var getClientSalesMgr = function() {
        ME.salesMgrDisplayName = "";
        ME.clientManager = ME.S.returnManagerObjByID(ME.clientSelected.manager);
        ME.salesMgrDisplayName = ME.clientManager.displayName;
    };

    var getClientProperties = function() {
        ME.propertyOptions = [];
        ME.propertyOptions.push({ propertyName: "--Select--", PRIMARY_ID: "-1" });
        for (var i = 0; i < ME.JOBS.length; i++) {
            if (ME.JOBS[i].client == ME.clientSelected.PRIMARY_ID) {
                ME.propertyOptions.push(ME.JOBS[i]);
            }
        };
        if (ME.propertyOptions.length > 0) {
            ME.propertySelected = ME.propertyOptions[0];
        }
    };


    ME.submit = function() {
        switch (ME.EditMode) {
            case "Add Job":
                configAddOutputObj();
                break;
            case "Update Job":
                configUpdateOutputObj();
                break;
            case "Remove Job":
                remove_Item();
                break;
        }
    };

    var configAddOutputObj = function() {
        ME.outputDataObj = { property: null, client: null, status: "Prospect", manager: null, dateProspect: null };
        ME.outputDataObj.property = ME.propertySelected.PRIMARY_ID;
        ME.outputDataObj.client = ME.clientSelected.PRIMARY_ID;
        ME.outputDataObj.manager = ME.clientManager.PRIMARY_ID;
        var date = new Date();
        var val = date.valueOf();
        ME.outputDataObj.dateProspect = val;

        add_Item();
    };

    var configUpdateOutputObj = function() {
        if (ME.jobSelected.PRIMARY_ID == "-1") {
            ngDialog.open({
                template: '<h2>Form is invalid or incomplete.</h2>',
                className: 'ngdialog-theme-default',
                plain: true,
                overlay: false
            });
        } else {
            ME.outputDataObj = {};
            ME.outputDataObj.id = ME.jobSelected.PRIMARY_ID;
            ME.outputDataObj.status = ME.statusSelected.label;
            var date = new Date();
            var val = date.valueOf();
            ME.outputDataObj.val = val;
            update_Item();
        };
    };

    var add_Item = function() {
        var thisFunc = "add_Item()";
        var thisQuery = "DB.putJob()";

        DB.query("putJob", ME.outputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for " + thisQuery + " at " + myName + " >>> " + thisFunc);
                console.log(resultObj.data);
            } else {
                ME.addJobInsertID = resultObj.data.insertID;
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Add Job Successful.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for  " + thisQuery + " at " + myName + " >>> " + thisFunc);
        });
    };

    var update_Item = function() {
        var thisFunc = "update_Item()";
        var thisQuery = "";
        switch (ME.statusSelected.label) {
            case "Prospect":
                thisQuery = "updateProspectDate";
                break;
            case "Proposal":
                thisQuery = "updateProposalDate";
                break;
            case "Contract":
                thisQuery = "updateContractDate";
                break;
            case "Active":
                thisQuery = "updateActiveDate";
                break;
            case "Complete":
                thisQuery = "updateCompleteDate";
                break;
        };

        DB.query(thisQuery, ME.outputDataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for " + thisQuery + " at " + myName + " >>> " + thisFunc);
            } else {
                var stat = ME.statusSelected.label;
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Job Status updated to ' + stat + '</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });

            }
        }, function(error) {
            alert("ERROR returned for  " + thisQuery + " at " + myName + " >>> " + thisFunc);
        });
    };

    var remove_Item = function() {
        var dataObj = {};
        dataObj.ID = ME.jobSelected.PRIMARY_ID;
        DB.query("deleteJob", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("ERROR returned for " + thisQuery + " at " + myName + " >>> " + thisFunc);
                console.log(resultObj.data);
            } else {
                resetInputFields();
                ngDialog.open({
                    template: '<h2>Job Deleted.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for  " + thisQuery + " at " + myName + " >>> " + thisFunc);
        });
    };


    var createDP = function() {
        ME.JOBS = DB.clone(ME.S.JOBS);
       
        ME.JOBS.splice(0, 0, { jobLabel: "-- Select --", propertyName: "--", clientName: "--", managerName: "--", status: "--", PRIMARY_ID: "-1" });
        ME.jobSelected = ME.JOBS[0];

        ME.clientsDP = DB.clone(ME.S.CLIENTS);
        ME.clientsDP.splice(0, 0, { displayName: "-- Select --", PRIMARY_ID: "-1" });
        ME.clientSelected = ME.clientsDP[0];
    };

    var resetInputFields = function() {
        ME.submitInValid = true;
        ME.jobSelected = ME.JOBS[0];
        ME.statusSelected = ME.L.jobStatusOptions[0];
        ME.clientSelected = ME.clientsDP[0];
        ME.propertySelected = null;
        ME.clientManager = null;
        ME.formStatus = "Pristine";
        ME.salesMgrDisplayName = "--";

    };

    createDP();
    resetInputFields();
    
}]);
