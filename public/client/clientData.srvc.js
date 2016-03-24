'use strict';
app.service('ClientDataSrvc',['$http','$q',function ($http,$q){
	
	var self = this;
	self.ME = "ClientDataSrvc: ";
	
	self.UserID = "";
	self.UserName = "";

	var localPathPrefix="client/http/";
	var globalPathPrefix="js/php/";
	var httpPathPrefix="http/";

	var queryPaths = {
		getJobsByClient:localPathPrefix + "getJobsByClient.php",
		getPropertiesByClient:localPathPrefix + "getPropertiesByClient.php",
		getJobParameters:"views/proposals/http/getJobParameters.php",
		getKeyValuePairs:globalPathPrefix + "getIdVals.php",
		getMultiVents:globalPathPrefix + "getMultiVents.php",
		getMultiLevel:globalPathPrefix + "getMultiLevel.php",
		getMaterialsList:"views/admin/http/getMaterialsShingle.php",
		getJobConfig:"views/admin/http/getJobConfig.php",
		getPhotoGallery:"views/proposals/http/getPhotos.php",
		updateConfig:httpPathPrefix + "update/updateConfig.php"
	};


	self.queryDB = function(query,dataObj){
		var rtnObj = {};
		var phpPath = queryPaths[query];
		var deferred = $q.defer();
		$http({method: 'POST', url:phpPath,data:dataObj})
		.success(function(data, status) {
			rtnObj.result = "Success";
			rtnObj.data = data;
			deferred.resolve(rtnObj);
	    })
	    .error(function(data, status, headers, config) {
			rtnObj.result = "Error";
			rtnObj.data = data;
			deferred.reject(rtnObj);
	    });
	    return deferred.promise;
	};


	self.logOut = function(){
		self.managerID = "";
		self.managerName = "";
	};

	
	self.clientLogIn = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'client/http/getClientByLogIn.php',data:dataObj})
		.success(function(data, status) {
			deferred.resolve(data);
	    })
	    .error(function(data, status, headers, config) {
			deferred.reject(false);
	    });

	    return deferred.promise;
	};

	
	return self;
}]);