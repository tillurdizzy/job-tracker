'use strict';
app.service('JobDataSrvc', ['$http', '$q', 'LogInSrvc', function adminData($http, $q, LogInSrvc) {

    var self = this;
    self.ME = "JobDataSrvc: ";
    var L = LogInSrvc;
    var job_list = [];

    var pathPrefix = "views/admin/http/";
    var queryPaths = {};
    var propertyStatusPaths = {};

    var init = function() {
        getJobList();
        queryPaths.getJobsProspect = pathPrefix + "getJobsWithProspectStatus.php";
        queryPaths.getJobsContract = pathPrefix + "getJobsWithContractStatus.php";
        queryPaths.getJobsActive = pathPrefix + "getJobsWithActiveStatus.php";
        queryPaths.getJobsComplete = pathPrefix + "getJobsWithCompleteStatus.php";

        queryPaths.getPropertiesProspect = pathPrefix + "getPropertiesWithProspectStatus.php";
        queryPaths.getPropertiesContract = pathPrefix + "getPropertiesWithContractStatus.php";
        queryPaths.getPropertiesActive = pathPrefix + "getPropertiesWithActiveStatus.php";
        queryPaths.getPropertiesComplete = pathPrefix + "getPropertiesWithCompleteStatus.php";
    };

    self.queryByStatus = function(status) {
        var phpPath = returnQueryPath(status);
        if (phpPath == "") {
            return status + " is undefined" }
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpPath }).success(function(data, status) {
            if (typeof data != 'string') {
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
                alert("HTTP data fault at " + self.ME + " : queryJobsByStatus : " + data);
            }
        }).error(function(data, status, headers, config) {
            deferred.reject(false);
            alert("HTTP Error at " + self.ME + " : getJoblist : " + data);
        });
        return deferred.promise;
    };

    self.queryPropertiesByStatus = function(status) {
        var phpPath = returnQueryPath(status);
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpPath }).success(function(data, status) {
            if (typeof data != 'string') {
                deferred.resolve(data);
            } else {
                console.log(data);
                deferred.resolve(false);
            }
        }).error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise;
    };

    self.queryDB = function(phpFile) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpFile }).success(function(data, status) {
            if (typeof data != 'string') {
                deferred.resolve(data);
            } else {
                console.log(data);
                deferred.resolve(false);
            }
        }).error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise;
    };

    self.queryDBWithObj = function(phpFile, dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpFile, data: dataObj }).success(function(data, status) {
            if (typeof data != 'string' && data.result != false) {
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise;
    };


    var getJoblist = function() {
        $http({ method: 'POST', url: '' }).success(function(data, status) {
                if (typeof data != 'string') {
                    job_list = data;
                } else {
                    alert("HTTP data fault at " + self.ME + " : getJoblist : " + data);
                }
            })
            .error(function(data, status, headers, config) {
                alert("HTTP Error at " + self.ME + " : getJoblist : " + data);
            });
    };

    self.returnQueryPath = function(q) {
        rtnPath = "";
        switch (q) {
            case "JobsProspect":
                rtnPath = queryPaths.getJobsProspect;
                break;
            case "JobsContract":
                rtnPath = queryPaths.getJobsContract;
                break;
            case "JobsActive":
                rtnPath = queryPaths.getJobsActive;
                break;
            case "JobsComplete":
                rtnPath = queryPaths.getJobsComplete;
                break;
            case "PropertyProspect":
                rtnPath = queryPaths.getJobsProspect;
                break;
            case "PropertyContract":
                rtnPath = queryPaths.getJobsContract;
                break;
            case "PropertyActive":
                rtnPath = queryPaths.getJobsActive;
                break;
            case "PropertyComplete":
                rtnPath = queryPaths.getJobsComplete;
                break;
        }
        return rtnPath;
    };


    init();

    return self;
}]);
