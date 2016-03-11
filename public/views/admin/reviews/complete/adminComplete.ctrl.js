'use strict';

app.controller('JobsCompleteCtrl', ['$state', 'JobDataSrvc', '$scope', 'AdminSharedSrvc', function($state,JobDataSrvc,$scope,AdminSharedSrvc) {
    var DB = JobDataSrvc;
    var ME = this;
    var S = AdminSharedSrvc;

    ME.tableDataProvider = [];
    var jobList = [];
    var propertyList = [];

    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    var getMyJobs = function() {
    	DB.queryByStatus("JobsComplete").then(function(result) {
            if (result === false) {
                alert("FALSE returned for DB.queryByStatus() at ActiveJobsCtrl >>> getMyJobs()");
            } else {
                jobList = result;
                getMyProperties();
            }
        }, function(error) {
            alert("ERROR returned for DB.queryByStatus() at ActiveJobsCtrl >>> getMyJobs()");
        });
    };

    var getMyProperties = function() {
    	DB.queryByStatus("PropertyComplete").then(function(result) {
            if (result === false) {
                alert("FALSE returned for DB.queryByStatus() at ActiveJobsCtrl >>> getMyProperties()");
            } else {
                propertyList = result;
                formatDataProvider();
            }
        }, function(error) {
            alert("ERROR returned for DB.queryByStatus() at ActiveJobsCtrl >>> getMyProperties()");
        });
    };

    var formatDataProvider = function(){
    	ME.tableDataProvider = [];
    	for (var i = 0; i < propertyList.length; i++) {
    		var dpObj = {};
    		dpObj.name = propertyList[i].name;
    		dpObj.street = propertyList[i].street;
    		dpObj.city = propertyList[i].city;
    		
    		for (var x = 0; x < jobList.length; x++) {
    			if(jobList[x].property == propertyList[i].PRIMARY_ID){
    				dpObj.date = jobList[x].dateComplete;
    			}
    		}
    		var repID = propertyList[i].manager;
    		dpObj.rep = S.returnSalesRep(repID);
    		ME.tableDataProvider.push(dpObj);
    	}
    };


    $scope.$watch('$viewContentLoaded', function() {
        getMyJobs();
        console.log("ActiveCompleteCtrl >>> $viewContentLoaded");
    });

}]);
