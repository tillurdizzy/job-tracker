'use strict';

app.controller('ProposalCtrl', ['$state','$scope','evoDb','SharedSrvc','ShingleSrvc',function($state,$scope,evoDb,SharedSrvc,ShingleSrvc) {
    var DB = evoDb;
    var ME = this;
    var S = SharedSrvc;
    ME.SRVC = ShingleSrvc;
    //var CALCS = ShingleCalcs;

    ME.controllerName = "ProposalCtrl";
    ME.managerID = DB.managerID;
    ME.managerName = DB.managerName;

    // data vars
    ME.jobs = S.managerJobs;
    ME.selectedJobObj = S.selectedJobObj;
    ME.selectedClientObj = S.selectedClientObj;
    ME.selectedPropertyObj = S.selectedPropertyObj;
    ME.proposalDate = ME.selectedJobObj.dateProposal;

    ME.jobMaterials = [];

    //DOM vars
    ME.inputOpen = false;
    ME.submitOpen = false;
    ME.specialOpen = false;
    ME.specialText = "";
    ME.specialCost = "";

    ME.params = {
        jobID:"",
        FIELD:"",
        TOPRDG:"",
        RKERDG:"",
        PRMITR:"",
        VALLEY:"",
        LPIPE1:"",
        LPIPE2:"",
        LPIPE3:"",
        LPIPE4:"",
        JKVNT8:"",
        FLHSH8:"",
        TURBNS:"",
        PWRVNT:"",
        AIRHWK:"",
        SLRVNT:"",
        DECKNG:"",
        LOWSLOPE:"",
        PAINT:"2",
        CAULK:"2",
        CARPRT:"",
        SATDSH:""};
   

    //pricing
    ME.materialsCost = "";
    ME.laborCost = "0.00";
    ME.totalCost = "0.00";


    ME.submitEdit = function(ndx) {
        var ndx = Number(ndxStr);
    };

    ME.backToList = function() {
        $state.transitionTo("jobs");
    };

    ME.printSummary = function(){
        var dataObj = {};
        dataObj.materialsCost = ME.materialsCost;
        //PDF.newPDF(dataObj);
    };

    ME.goClients = function(){
      $state.transitionTo("clients");
    };

    ME.goProperties = function(){
      $state.transitionTo("properties");
    };

    ME.submitForApproval = function(){
       updateStatus();
    };

    var updateStatus = function(){
        var d = new Date();
        var v = d.valueOf();
        ME.selectedJobObj.dateProposal = v;
        S.selectedJobObj.dateProposal = v;
        var status="Proposal";
        DB.updateJobStatus(ME.selectedJobObj.PRIMARY_ID,status,v).then(function(result) {
            if (result != false) { 
                alert("OK");
            } else {
               
            }
        }, function(error) {

        });
    }

    ME.submitSpecial = function(){
        var dataObj = {};
        dataObj.jobID = S.selectedJobObj.PRIMARY_ID;
        dataObj.body = ME.specialText;
        dataObj.cost = ME.specialCost;
        DB.runQueryWithObj('views/proposals/http/updateSpecialConsiderations.php',dataObj).then(function(result) {
            if (result != false) { 
                alert("OK");
            } else {
               
            }
        }, function(error) {

        });
    };

    ME.submitParams = function() {
        ME.params.jobID = S.selectedJobObj.PRIMARY_ID;
        var result = ME.SRVC.submitParams(ME.params).then(function(result) {
            if (result != false) { 
                alert("OK");
            } else {
               
            }
        }, function(error) {

        });
    };

    var getJobParameters = function() {
        var jobData = ME.SRVC.getJobParameters().then(function(jobData) {
            if (jobData != false) { 
                setParams(jobData[0]);
            } else {
               
            }
        }, function(error) {

        });
    };

    var setParams = function(dataObj){
        ME.params = dataObj;
        
    };

    var getSpecial = function(){
        var dataObj = {};
        dataObj.jobID = S.selectedJobObj.PRIMARY_ID;
        DB.runQueryWithObj('views/proposals/http/getSpecialConsiderations.php',dataObj).then(function(result) {
            if (result != false) { 
                ME.specialText = result[0].body;
                ME.specialCost = result[0].cost;
            } else {
               
            }
        }, function(error) {

        });
    }

    ME.dataError = function(loc, error) {
        console.log(loc + " : " + error);
    };

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = S.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }
    });

    var initPage = function() {
        //CALCS.resetService();
        getJobParameters();
        getSpecial();
        console.log("INIT Proposal Ctrl");
    };

    initPage();

}]);
