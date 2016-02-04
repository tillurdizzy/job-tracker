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
    ME.jobInput = [];
    ME.jobInputFields = ME.SRVC.inputFields;
    ME.jobItemFeed = [];

    //pricing
    ME.materialsCost = "0.00";
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
        // 1. Update database
        var itemCode = dObj.itemCode;
        // Decide whether to create new entry or update
        var itemExists = false;
        for (var x = 0; x < ME.jobInput.length; x++) {
            if (ME.jobInput[x].Code == itemCode) {
                ME.jobInput[x].Qty = dObj.qty;
                itemExists = true;
                continue;
            }
        }
        var dataObj = {};
        dataObj.ID = ME.selectedJobObj.PRIMARY_ID;
        dataObj.Code = dObj.itemCode;
        dataObj.Qty = dObj.qty;
        ME.jobInput.push(dataObj);
        if (itemExists == true) {
            ME.SRVC.updateJobItem(dataObj);
        } else {
            ME.SRVC.insertJobItem(dataObj);
        }

        // Update pricing
        CALCS.updatePrices(ME.jobInput);
    };

    var assembleFeed = function() {
        // Place any recorded Qty from jobInput into jobInputFields for view display
        for (var i = 0; i < ME.jobInputFields.length; i++) {
            var itemCode = ME.jobInputFields[i].Code;
            ME.jobInputFields[i].Qty = "0";
            for (var x = 0; x < ME.jobInput.length; x++) {
                if (ME.jobInput[x].Code == itemCode) {
                    ME.jobInputFields[i].Qty = ME.jobInput[x].Qty;
                }
            };
        };
        CALCS.updatePrices(ME.jobInput);
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
                    assembleFeed();
                } else {
                    assembleFeed();
                }
            }, function(error) {

            });
    };

    ME.dataError = function(loc, error) {
        console.log(loc + " : " + error);
    };

    initPage();

}]);
