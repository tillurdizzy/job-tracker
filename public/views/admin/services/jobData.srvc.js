'use strict';
app.service('JobDataSrvc', ['$http', '$q', 'LogInSrvc', function adminData($http, $q, LogInSrvc) {

    var self = this;
    self.ME = "JobDataSrvc: ";
    var L = LogInSrvc;
    var job_list = [];

    var pathPrefix = "http/";
    var queryPaths = {};
    var propertyStatusPaths = {};

    var init = function() {
       
        queryPaths.getJobsProspect = pathPrefix + "getJobsWithProspectStatus.php";
        queryPaths.getJobsContract = pathPrefix + "getJobsWithContractStatus.php";
        queryPaths.getJobsActive = pathPrefix + "getJobsWithActiveStatus.php";
        queryPaths.getJobsComplete = pathPrefix + "getJobsWithCompleteStatus.php";

        queryPaths.getPropertiesProspect = pathPrefix + "getPropertiesWithProspectStatus.php";
        queryPaths.getPropertiesContract = pathPrefix + "getPropertiesWithContractStatus.php";
        queryPaths.getPropertiesActive = pathPrefix + "getPropertiesWithActiveStatus.php";
        queryPaths.getPropertiesComplete = pathPrefix + "getPropertiesWithCompleteStatus.php";

        queryPaths.getJobList = pathPrefix + "getJobs.php";

        getJobList();
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
                alert("HTTP data fault at " + self.ME + " : queryByStatus : " + data);
            }
        }).error(function(data, status, headers, config) {
            deferred.reject(false);
            alert("HTTP Error at " + self.ME + " : queryByStatus : " + data);
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


    var getJobList = function() {
        var path = queryPaths.getJobList;
        $http({ method: 'POST', url:path}).success(function(data, status) {
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

    var returnQueryPath = function(q) {
        var rtnPath = "";
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
                rtnPath = queryPaths.getPropertiesProspect;
                break;
            case "PropertyContract":
                rtnPath = queryPaths.getPropertiesContract;
                break;
            case "PropertyActive":
                rtnPath = queryPaths.getPropertiesActive;
                break;
            case "PropertyComplete":
                rtnPath = queryPaths.getPropertiesComplete;
                break;
        }
        return rtnPath;
    };


    init();

    return self;
}]);
