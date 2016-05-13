'use strict';
app.service('ClientDataSrvc', ['$http', '$q', function($http, $q) {

    var self = this;
    self.ME = "ClientDataSrvc: ";

    self.UserID = "";
    self.UserName = "";

    var httpPathPrefix = "http/";

    var queryPaths = {
        getJobsByClient: httpPathPrefix + "getJobsByClient.php",
        getPropertiesByClient: httpPathPrefix + "getPropertiesByClient.php",
        getClientByLogIn: httpPathPrefix + "getClientByLogIn.php",
        getJobParameters: httpPathPrefix + "getJobParameters.php",
        getKeyValuePairs: httpPathPrefix + "getIdVals.php",
        getMultiVents: httpPathPrefix + "getMultiVents.php",
        getMultiLevel: httpPathPrefix + "getMultiLevel.php",
        getMaterialsList: httpPathPrefix + "getMaterialsShingle.php",
        getJobConfig: httpPathPrefix + "getJobConfig.php",
        getPhotoGallery: httpPathPrefix + "getPhotos.php",
        updateConfig: httpPathPrefix + "updateConfig.php",
        getDefaultConfigMaterials: httpPathPrefix + "getDefaultConfigMaterials.php"
    };


    self.queryDB = function(query, dataObj) {
        var rtnObj = {};
        var phpPath = queryPaths[query];
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpPath, data: dataObj })
            .success(function(data, status) {
                rtnObj.result = "Success";
                rtnObj.data = data;
                if(data.msg == "Error"){
                    alert("QUERY Error - see console.");
                    console.log(data.query);
                }
                deferred.resolve(rtnObj);
            })
            .error(function(data, status, headers, config) {
                rtnObj.result = "Error";
                rtnObj.data = data;
                deferred.reject(rtnObj);
            });
        return deferred.promise;
    };


    self.logOut = function() {
        self.managerID = "";
        self.managerName = "";
    };


   

    console.log("ClientData Complete");
    return self;
}]);
