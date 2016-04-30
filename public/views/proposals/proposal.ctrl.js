'use strict';

app.controller('ProposalCtrl', ['$state','$scope','evoDb','SharedSrvc','ShingleSrvc', 'ngDialog',function($state,$scope,evoDb,SharedSrvc,ShingleSrvc,ngDialog) {
    var DB = evoDb;
    var ME = this;
    ME.S = SharedSrvc;
    ME.SRVC = ShingleSrvc;

    ME.controllerName = "ProposalCtrl";
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

    ME.params = {
        jobID:"",
        FIELD:"",
        TOPRDG:"",
        RKERDG:"",
        RKEWALL:"",
        EAVE:"",
        PRMITR:"",
        VALLEY:"",
        LPIPE1:"",
        LPIPE2:"",
        LPIPE3:"",
        LPIPE4:"",
        VENT8:"",
        TURBNS:"",
        PWRVNT:"",
        AIRHWK:"",
        SLRVNT:"",
        DECKNG:"",
        LOWSLP:"",
        PAINT:"2",
        CAULK:"2",
        CARPRT:"",
        SATDSH:""};
   

    //pricing
    //ME.materialsCost = "";
    //ME.laborCost = "0.00";
    //ME.totalCost = "0.00";


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
        ME.S.selectedJobObj.dateProposal = v;
        var status="Proposal";
        DB.updateJobStatus(ME.selectedJobObj.PRIMARY_ID,status,v).then(function(result) {
            if (result != false) { 
                ngDialog.open({
                    template: '<h2>Job Status has been updated.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            } else {
               
            }
        }, function(error) {

        });
    };

    ME.submitSpecial = function(){
        var dataObj = {};
        dataObj.jobID = ME.S.selectedJobObj.PRIMARY_ID;
        dataObj.body = ME.specialText;
        dataObj.cost = "0";
        DB.runQueryWithObj('http/updateSpecialConsiderations.php',dataObj).then(function(result) {
            if (result != false) { 
                ngDialog.open({
                    template: '<h2>Special Considerations have been saved.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            } else {
               
            }
        }, function(error) {

        });
    };

    ME.submitParams = function() {
        ME.params.jobID = ME.S.selectedJobObj.PRIMARY_ID;
        var result = ME.SRVC.submitParams(ME.params).then(function(result) {
            if (result != false) { 
                ngDialog.open({
                    template: '<h2>Roof Parameters have been saved.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
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
        dataObj.jobID = ME.S.selectedJobObj.PRIMARY_ID;
        DB.runQueryWithObj('http/getSpecialConsiderations.php',dataObj).then(function(result) {
            if (result != false) { 
                ME.specialText = result[0].body;
            } else {
               
            }
        }, function(error) {

        });
    };

    ME.dataError = function(loc, error) {
        console.log(loc + " : " + error);
    };

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.S.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }
    });

    var initPage = function() {
        //CALCME.S.resetService();
        getJobParameters();
        getSpecial();
        console.log("INIT Proposal Ctrl");
    };

    initPage();

}]);
