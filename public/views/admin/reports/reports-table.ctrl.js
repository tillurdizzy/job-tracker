'use strict';

app.controller('ReportTablesCtrl', ['$state', '$scope', 'AdminDataSrvc', function($state, $scope, AdminDataSrvc) {

    var ME = this;
    var DB = AdminDataSrvc;

    ME.tableList = [
        { label: '-- Select One --', request: '' },
        { label: 'clients', request: 'getClients' },
        { label: 'jobs_list', request: 'getJobs' },
        { label: 'job_config', request: 'getAllJobConfigs' },
        { label: 'job_parameters', request: 'getAllJobParameters' },
        { label: 'labor', request: 'getLabor' },
        { label: 'login', request: 'getSalesReps' },
        { label: 'materials_shingle', request: 'getMaterialsShingle' },
        { label: 'multi_level', request: 'getMultiLevels' },
        { label: 'multi_vents', request: 'getMultiVents' },
        { label: 'photos', request: 'getAllPhotos' },
        { label: 'properties', request: 'getProperties' },
        { label: 'roof', request: 'getRoofTable' }
    ];

    ME.tableSelected = ME.tableList[0];

    // Data Models
    ME.clientData = [];
    ME.jobsData = [];
    ME.jobConfigData = [];
    ME.jobParamData = [];
    ME.keyData = [];
    ME.materialsShingleData = [];
    ME.multiLevelData = [];
    ME.multiVentData = [];
    ME.propertyData = [];
    ME.laborData = [];
    ME.loginData = [];
    ME.roofData = [];
    ME.shingleInputData = [];
    ME.specialData = [];
    ME.paragraphsData = [];

    var assignData = function(data) {
        switch (ME.tableSelected.label) {
            case "-- Select One --":
                break;
            case "clients":
                ME.clientData = data;
                break;
            case "jobs_list":
                ME.jobsData = data;
                break;
            case "job_config":
                ME.jobConfigData = data;
                break;
            case "job_parameters":
                ME.jobParamData = data;
                break;
            case "labor":
                ME.laborData = data;
                break;
            case "login":
                ME.loginData = data;
                break;
            case "materials_shingle":
                ME.materialsShingleData = data;
                break;
            case "multi_level":
                ME.multiLevelData = data;
                break;
            case "multi_vents":
                ME.multiVentData = data;
                break;
            case "properties":
                ME.propertyData = data;
                break;
            case "roof":
                ME.roofData = data;
                break;
            case "shingle_input_fields":
                ME.shingleInputData = data;
                break;
            case "special_considerations":
                ME.specialData = data;
                break;
            case "standard_paragraphs":
                ME.paragraphsData = data;
                break;
        }
    };

    ME.selectTable = function() {
        getData();
    };


    ME.backToHome = function() {
        $state.transitionTo('admin');
    };


    ME.refreshCurrentTable = function() {
        assignData([]);
        getData();
    };

    var getData = function() {
        DB.query(ME.tableSelected.request).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProposalsByJob ---- " + resultObj.data);
            } else {
                assignData(resultObj.data);
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };

}]);
