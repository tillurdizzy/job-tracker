'use strict';

app.service('evoDb',['$http','$q','SharedSrvc',function eventQueries($http,$q,SharedSrvc){
	var self = this;
	self.lastResult = [];
	self.ME = "evoDB: ";
	self.managerID = "";
	var S = SharedSrvc;


	self.setManagerID = function(id){
		self.managerID = id;
		self.managerName = "Admin";
	};
	
	self.sendEmail = function(dataObj){
		$http({method: 'POST', url: 'js/php/sendEmail.php',data:dataObj});
	};

	self.putClient = function(dataObj){
		dataObj.manager = self.managerID;
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/putClient.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};
	
	
	self.putProperty = function(dataObj){
		dataObj.manager = self.managerID;
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/putProperty.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putManager = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/putManager.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	// Called from login page to verify name/password
	self.queryLogIn = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getManager.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
				//console.log(typeof data);
				self.lastResult = data;
     			self.managerID = data[0].PRIMARY_ID;
     			self.managerName = data[0].name_first + " " + data[0].name_last;
     			S.setManagerID(self.managerID,self.managerName);
     			deferred.resolve(data);
			}else{
				// 0 length means password/username match not found
				console.log(data);
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			console.log(data);
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	

	self.getAllClients = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getClients.php'}).
		success(function(data, status) {
			if(typeof data != 'string'){
				self.lastResult = data;
				S.setManagerClients(data);
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise; //return the data
	};


	self.getManagerClients = function(){
		var dataObj = {manager:S.managerID};
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getClientsByManager.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string'){
				self.lastResult = data;
				self.getManagerProperties();
				S.setManagerClients(data);
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise; //return the data
	};

	self.getAllProperties = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getProperties.php'}).
		success(function(data, status) {
			if(typeof data != 'string'){
				self.lastResult = data;
				S.setManagerProperties(data);
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise; //return the data
	};

	self.getManagerProperties = function(){
		var dataObj = {manager:S.managerID};
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getPropertiesByManager.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string'){
				self.lastResult = data;
				S.setManagerProperties(data);
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise; //return the data
	};

	// Triggered every time viewContentLoaded on Job Summary page
	// When successful, will trigger getManagerClients, which will then trigger getManagerProperties
	self.getManagerJobs = function(){
		if(S.managerID === ""){
			S.setManagerID("3","Admin");
		}
		var dataObj = {manager:S.managerID};
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getJobsByManager.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string'){
				self.lastResult = data;
				self.getManagerClients();
				S.setManagerJobsList(data);
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise; //return the data
	};

	// Called form Edit-form
	self.updateStatus = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/updateStatus.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	// Called form Edit-form
	self.updateDetails = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/updateDetails.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	
	return self;
}]);