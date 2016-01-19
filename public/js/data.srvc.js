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
	
	// Called from Home.New Prospect
	self.putProspect = function(dataObj){
		dataObj.manager = self.managerID;
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/putProspect.php',data:dataObj}).
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
	}

	// Called from Jobs to populate  lists of manager's jobs
	// 
	self.getManagerJobsList = function(){
		if(S.managerID === ""){
			S.setManagerID("3","Admin");
		}
		var dataObj = {manager:S.managerID};
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getJobsByManager.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string'){
				self.lastResult = data;
				S.setRawData(data);
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