'use strict';

app.controller('ProposalCtrl', ['$state','evoDb','SharedSrvc','ShingleSrvc','ShingleCalcs', function($state,evoDb,SharedSrvc,ShingleSrvc,ShingleCalcs) {
    var DB = evoDb;
    var ME = this;
    var S = SharedSrvc;
    ME.SRVC = ShingleSrvc;
    var CALCS = ShingleCalcs;


    ME.controllerName = "ProposalCtrl";
    ME.managerID = DB.managerID;
    ME.managerName = DB.managerName;

    // data vars
    ME.jobs = S.managerJobs;
    ME.selectedJobObj = S.selectedJobObj;
    ME.selectedClientObj = S.selectedClientObj;
    ME.selectedPropertyObj = S.selectedPropertyObj;
    ME.proposalDate = ME.selectedJobObj.dateProposal;

    // These 2 lists basically tracking the same data... user input of roof elements.
    // jobInput is how items inserted and retrieved from database... only includes items with non-zero values and has job ID
    // jobInputFields includes ALL fields and used for repeat on the view and to pass to CALCS for pricing calculations
    ME.jobInput = [];
    ME.jobInputFields = ME.SRVC.inputFields;
    ME.jobMaterials = [];
   

    //pricing
    ME.materialsCost = CALCS.runningTotal;
    ME.laborCost = "0.00";
    ME.totalCost = "0.00";


    ME.submitEdit = function(ndx) {
        var ndx = Number(ndxStr);
    };

    ME.backToList = function() {
        $state.transitionTo("jobs");
    };

    // Called from Directive
    ME.submitItemQty = function(dObj) {
        var itemCode = dObj.itemCode;

        // Update item in jobInput list IF it already exists
        var itemExists = false;
        for (var x = 0; x < ME.jobInput.length; x++) {
            if (ME.jobInput[x].Code == itemCode) {
                ME.jobInput[x].Qty = dObj.qty;
                itemExists = true;
                continue;
            }
        }
        // Create data object
        var dataObj = {};
        dataObj.ID = ME.selectedJobObj.PRIMARY_ID;
        dataObj.Code = dObj.itemCode;
        dataObj.Qty = dObj.qty;

        // Insert or update in DB
        // Push to jobInput if did not already exist
        if (itemExists == true) {
            ME.SRVC.updateJobItem(dataObj);
        } else {
            ME.jobInput.push(dataObj);
            ME.SRVC.insertJobItem(dataObj);
        }

        // Update pricing
       mergeInputLists();
    };

    var mergeInputLists = function() {
        // Place any recorded Qty from jobInput into jobInputFields for view display
        for (var i = 0; i < ME.jobInputFields.length; i++) {
            var itemCode = ME.jobInputFields[i].Code;
            ME.jobInputFields[i].Qty = 0;
            for (var x = 0; x < ME.jobInput.length; x++) {
                if (ME.jobInput[x].Code == itemCode) {
                    ME.jobInputFields[i].Qty = ME.jobInput[x].Qty;
                    continue;
                }
            };
        };
        ME.jobMaterials = CALCS.updatePrices(ME.jobInputFields);
        ME.materialsCost = CALCS.runningTotal;
    };


    var initPage = function() {
        CALCS.resetService();
        ME.jobInputFields = ME.SRVC.inputFields.slice(0);
        getJobInput();
    };

    var getJobInput = function() {
        var jobData = ME.SRVC.getJobInput()
            .then(function(jobData) {
                if (jobData != false) { // false just meaqns there were no records found
                    ME.jobInput = jobData;
                    mergeInputLists();
                } else {
                    mergeInputLists();
                }
            }, function(error) {

            });
    };

    ME.dataError = function(loc, error) {
        console.log(loc + " : " + error);
    };

    initPage();

}]);
