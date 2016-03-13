'use strict';
app.service('ClientDataSrvc',['$http','$q',function ($http,$q){
	// This service provides DB interaction for a Shingle Job Proposal

	var self = this;
	self.ME = "ClientDataSrvc: ";
	
	
	self.UserID = "";
	self.UserName = "";

	var localPathPrefix="client/http/";
	var globalPathPrefix="js/php/";

	var queryPaths = {
		getJobsByClient:localPathPrefix + "getJobsByClient.php",
		getPropertiesByClient:localPathPrefix + "getPropertiesByClient.php",
		getJobParameters:"views/proposals/http/getJobParameters.php",
		getKeyValuePairs:globalPathPrefix + "getIdVals.php",
		getMultiVents:globalPathPrefix + "getMultiVents.php",
		getMultiLevel:globalPathPrefix + "getMultiLevel.php"
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
	}

	var returnQueryPath = function(q){
		var rtnStr = "";
		switch(q){
			case "getJobsByClient":rtnStr = queryPaths.getJobsByClient;break;
			case "getPropertiesByClient":rtnStr = queryPaths.getPropertiesByClient;break;
			case "getKeyValuePairs":rtnStr = queryPaths.getKeyValuePairs;break;
			case "getJobParameters":rtnStr = queryPaths.getJobParameters;break;
		}
		return rtnStr;
	};
		

	

	
	return self;
}]);