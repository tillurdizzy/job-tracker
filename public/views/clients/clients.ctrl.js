'use strict';

app.controller('ClientsCtrl', ['$scope', '$state', 'evoDb', 'SharedSrvc', function($scope, $state, evoDb, SharedSrvc) {
    var DB = evoDb;
    var ME = this;
    var S = SharedSrvc;

    ME.managerID = S.managerID;
    ME.managerName = S.managerName;

    // data vars
    ME.clients = S.managerClients;
    ME.selectedClientObj = {};
    ME.clientPropreties = [];

    ME.showHelp = false;

    ME.showDetails = function(ndxStr) {

        var ndx = Number(ndxStr);
        for (var i = 0; i < ME.clients.length; i++) {
            if (ME.clients[i].PRIMARY_ID == ndx) {
                ME.selectedClientObj = ME.clients[i];
                break;
            }
        };

        // Send client selection to shared
        S.selectClient(ME.selectedClientObj);
        getClientProperties();
        $state.transitionTo("clients.details");
    };

    var getClientProperties = function() {
        var dataObj = {};
        dataObj.clientID = ME.selectedClientObj.PRIMARY_ID;
        DB.query("getPropertiesByClient", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.getPropertiesByClient() at >>> ClientsCtrl.getClientProperties()");
            } else {
                ME.clientPropreties = resultObj.data;
            }
        }, function(error) {
            alert("ERROR returned for DB.getPropertiesByClient() at >>> ClientsCtrl.getClientProperties()");
        });
    };

    ME.refreshList = function() {
        ME.getManagerJobs();
    };

    ME.goJobs = function() {
        $state.transitionTo("jobs");
    };

    ME.goProperties = function() {
        $state.transitionTo("properties");
    };

    // Triggers all 3 data queries (Clients, Properties, Jobs)
    ME.getManagerJobs = function() {
        var result = DB.getManagerJobs().then(function(result) {
            if (typeof result != "boolean") {
                //console.log("Successful getting job data");
            } else {
                ME.dataError("ClientsCtrl-getManagerJobs()-1", result);
            }
        }, function(error) {
            ME.dataError("ClientsCtrl-getManagerJobs()-2", result);
        });
    };

    ME.dataError = function() {

    };

    ME.backToList = function() {
        $state.transitionTo("clients");
    };

    ME.goNewClient = function() {
        $state.transitionTo("addNewClient");
    };

    $scope.$on('data-refreshed', function() {
        ME.clients = S.managerClients;
    });

    $scope.$watch('$viewContentLoaded', function() {
        var loggedIn = S.loggedIn;
        if (!loggedIn) {
            $state.transitionTo('login');
        }
    });

}]);
