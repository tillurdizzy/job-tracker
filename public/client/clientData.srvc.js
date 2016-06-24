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
        getShingleColors: httpPathPrefix + "getShingleColors.php",
        getJobParameters: httpPathPrefix + "getJobParameters.php",
        getKeyValuePairs: httpPathPrefix + "getIdVals.php",
        getMultiVents: httpPathPrefix + "getMultiVents.php",
        getMultiLevel: httpPathPrefix + "getMultiLevel.php",
        getMaterialsList: httpPathPrefix + "getMaterialsShingle.php",
        getJobConfig: httpPathPrefix + "getJobConfig.php",
        getRoof: httpPathPrefix + "getRoof.php",
        getPhotoGallery: httpPathPrefix + "getPhotos.php",
        updateConfigClient:httpPathPrefix + "updateConfigClient.php",
        getDefaultConfigMaterials: httpPathPrefix + "getDefaultConfigMaterials.php",
        getSalesRepByID: httpPathPrefix + "getSalesRepByID.php"
    };

    self.queryDB = function(query, dataObj) {
        var rtnObj = {};
        var phpPath = queryPaths[query];
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpPath, data: dataObj })
            .success(function(data, status) {
                if(typeof data === "string"){
                    rtnObj.result = "Success";
                    rtnObj.data = data;
                    console.log(data);
                    alert("QUERY Error - see console.");
                    
                }else if(data.msg == "Error"){
                    rtnObj.result = "Error";
                    console.log(data.query);
                    alert("QUERY Error - see console.");
                }else{
                    rtnObj.result = "Success";
                    rtnObj.data = data;
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

    return self;
}]);
