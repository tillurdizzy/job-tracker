'use strict';

app.controller('ProposalCtrl', ['$state', '$scope', 'evoDb', 'SharedSrvc', 'ShingleSrvc', 'ngDialog', function($state, $scope, evoDb, SharedSrvc, ShingleSrvc, ngDialog) {
    var DB = evoDb;
    var ME = this;
    ME.S = SharedSrvc;
    ME.SRVC = ShingleSrvc;

    var myName = "ProposalCtrl";
    ME.managerID = DB.managerID;
    ME.managerName = DB.managerName;

    // data vars
    ME.jobs = ME.S.managerJobs;
    ME.selectedJobObj = ME.S.selectedJobObj;
    ME.selectedClientObj = ME.S.selectedClientObj;
    ME.selectedPropertyObj = ME.S.selectedPropertyObj;
    ME.proposalDate = ME.selectedJobObj.dateProposal;

    ME.jobMaterials = [];

    //DOM vars
    ME.inputOpen = false;
    ME.submitOpen = false;
    ME.specialOpen = false;
    ME.specialText = "";
    ME.specialCost = "";

    ME.PARAMS = {
        jobID: "",
        FIELD: "",
        TOPRDG: "",
        RKERDG: "",
        RKEWALL: "",
        EAVE: "",
        PRMITR: "",
        VALLEY: "",
        LPIPE1: "",
        LPIPE2: "",
        LPIPE3: "",
        LPIPE4: "",
        VENT8: "",
        TURBNS: "",
        PWRVNT: "",
        AIRHWK: "",
        SLRVNT: "",
        DECKNG: "",
        LOWSLP: "",
        PAINT: "2",
        CAULK: "2",
        CARPRT: "",
        SATDSH: ""
    };

    ME.submitEdit = function(ndx) {
        var ndx = Number(ndxStr);
    };

    ME.backToList = function() {
        $state.transitionTo("jobs");
    };

    ME.printSummary = function() {
        var dataObj = {};
        dataObj.materialsCost = ME.materialsCost;
    };

    ME.goClients = function() {
        $state.transitionTo("clients");
    };

    ME.goProperties = function() {
        $state.transitionTo("properties");
    };

    ME.submitForApproval = function() {
        updateStatus();
    };

    var updateStatus = function() {
        var d = new Date();
        var v = d.valueOf();
        ME.selectedJobObj.dateProposal = v;
        ME.S.selectedJobObj.dateProposal = v;
        var status = "Proposal";
        DB.updateJobStatus(ME.selectedJobObj.PRIMARY_ID, status, v).then(function(result) {
            if (result != false) {
                ngDialog.open({
                    template: '<h2>Job Status has been updated.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: true
                });
            } else {

            }
        }, function(error) {

        });
    };

    ME.submitSpecial = function() {
        var dataObj = {};
        dataObj.jobID = ME.S.selectedJobObj.PRIMARY_ID;
        dataObj.body = ME.specialText;
        dataObj.cost = "0";
        DB.query("updateSpecialConsiderations",dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("ERROR returned for updateSpecialConsiderations at " + myName);
                console.log(resultObj.data);
            } else {
                ngDialog.open({
                    template: '<h2>Special Considerations have been saved.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: true
                });
            }
        }, function(error) {
            alert("FALSE returned for updateSpecialConsiderations at " + myName);
        });
    };

    
    ME.submitParams = function() {
        DB.query("updateJobParameters",ME.PARAMS).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("ERROR returned for updateJobParameters at " + myName);
                console.log(resultObj.data);
            } else {
                ngDialog.open({
                    template: '<h2>Roof Parameters have been saved.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: true
                });
            }
        }, function(error) {
            alert("FALSE returned for updateJobParameters at " + myName);
        });
    };


    var getJobParameters = function() {
        var dataObj = {};
        dataObj.ID = ME.S.selectedJobObj.PRIMARY_ID;
        DB.query("getJobParameters",dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("ERROR returned for getJobParameters at " + myName);
                console.log(resultObj.data);
            } else {
                setParams(resultObj.data[0]);
            }
        }, function(error) {
            alert("FALSE returned for getJobParameters at " + myName);
        });
    };

    var setParams = function(dataObj) {
        ME.PARAMS = dataObj;
        console.log(ME.PARAMS);
    };

    var getSpecial = function() {
        var dataObj = {};
        dataObj.jobID = ME.S.selectedJobObj.PRIMARY_ID;
        DB.query('getSpecialConsiderations', dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("ERROR returned for getSpecialConsiderations at " + myName);
            } else {
                if(resultObj.data.length > 0){
                    ME.specialText = resultObj.data[0].body;
                }else{
                    ME.specialText = "";
                }
            }
        }, function(error) {
            alert("FALSE returned for getSpecialConsiderations at " + myName);
        });
    };

    ME.dataError = function(loc, error) {
        console.log(loc + " : " + error);
    };

    $scope.$watch('$viewContentLoaded', function() {
        var loggedIn = ME.S.loggedIn;
        if (!loggedIn) {
            $state.transitionTo('login');
        }
    });

    var initPage = function() {
        getJobParameters();
        getSpecial();
        console.log("INIT Proposal Ctrl");
    };

    initPage();

}]);
