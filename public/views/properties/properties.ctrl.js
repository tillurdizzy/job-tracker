'use strict';

app.controller('PropertiesCtrl', ['$scope', '$state', 'evoDb', 'SharedSrvc', 'TempVarSrvc',function($scope, $state, evoDb, SharedSrvc,TempVarSrvc) {
    var DB = evoDb;
    var ME = this;
    var S = SharedSrvc;
    ME.T = TempVarSrvc;
    ME.controllerName = "PropertiesCtrl";
    ME.managerID = S.managerID;
    ME.managerName = S.managerName;
    ME.selectedPropertyObj = {};

    // data vars
    ME.properties = S.managerProperties;
    ME.roofDescriptions = [];


    ME.showDetails = function(ndxStr) {
        var ndx = Number(ndxStr);
        for (var i = 0; i < ME.properties.length; i++) {
            if (ME.properties[i].PRIMARY_ID == ndx) {
                ME.selectedPropertyObj = ME.properties[i];
                continue;
            }
        };

        // Send client selection to shared
        S.selectProperty(ME.selectedPropertyObj);
        getRoof();
        // Single or Multi-unit details page
        if (ME.selectedPropertyObj.multiUnit == "0" || ME.selectedPropertyObj.multiUnit == 0) {
            $state.transitionTo("properties.details");
        } else {
            $state.transitionTo("properties.detailsMultiUnit");
        };
    };

    var getRoof = function() {
        var dataObj = { propID: ME.selectedPropertyObj.PRIMARY_ID };
        DB.query("getRoof",dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.getRoof() at >>> PropertiesCtrl.getRoof()");
            } else {
            	decodeRoofVals(resultObj.data);
            }
        }, function(error) {
            alert("ERROR returned for DB.getRoof() at >>> PropertiesCtrl.getRoof()");
        });
    };

    var decodeRoofVals = function(dataArr){
    	 ME.roofDescriptions = [];
    	for (var i = 0; i < dataArr.length; i++) {
    		var decoded = S.decodeRoofVals(dataArr[i]);
    		ME.roofDescriptions.push(decoded);
    	}
    };

    ME.goClients = function() {
        $state.transitionTo("clients");
    };

    ME.goJobs = function() {
        $state.transitionTo("jobs");
    };

    ME.backToList = function() {
        $state.transitionTo("properties");
    };

    ME.goNewProperty = function() {
        $state.transitionTo("addNewProperty");
    };

    ME.goAddMultiUnit = function() {
        $state.transitionTo("addNewProperty.roof");
    };

    ME.editRoofDetails = function() {
        $state.transitionTo("addNewProperty.roof");
    };

    ME.getManagerJobs = function() {
        var result = DB.getManagerJobs()
            .then(function(result) {
                if (typeof result != "boolean") {
                    // DB sent the data to the SharedSrvc

                } else {
                    ME.dataError("JobsCtrl-getManagerJobs()-1", result);
                }
            }, function(error) {
                ME.dataError("JobsCtrl-getManagerJobs()-2", result);
            });
    };

    ME.dataError = function(loc, error) {
        console.log(loc + " : " + error);
    };

    $scope.$watch(function() {
        return S.managerProperties;
    }, function(jobs) {
        ME.properties = S.managerProperties;
    });

    $scope.$watch('$viewContentLoaded', function() {
        var loggedIn = S.loggedIn;
        if (!loggedIn) {
            $state.transitionTo('login');
        } else {
            ME.getManagerJobs();
        }
    });

}]);
