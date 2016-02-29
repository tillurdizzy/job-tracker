'use strict';
app.service('AdminDataSrvc',['$http','$q',function adminData($http,$q){
	// This service provides DB interaction for a Shingle Job Proposal

	var self = this;
	self.ME = "AdminDataSrvc: ";
	

	self.queryDB = function(phpFile){
		var deferred = $q.defer();
		$http({method: 'POST', url:phpFile}).
		success(function(data, status) {
			if(typeof data != 'string'){
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise;
	}

	self.queryDBWithObj = function(phpFile,dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url:phpFile,data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string'){
				self.lastResult = data;
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise;
	};
	

	var getShingleIntputFields = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/proposals/http/getShingleFields.php'}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
     			deferred.resolve(data);
			}else{
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	
	self.getJobParameters = function(id){
		var dataObj = {};
		dataObj.ID = id;
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/admin/http/getJobParameters.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
     			deferred.resolve(data);
			}else{
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	
	self.submitParams = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/proposals/http/updateJobParameters.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string'){
     			deferred.resolve(data);
			}else{
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}
	
	self.insertJobItem = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/proposals/http/insertJobParameter.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string'){
     			deferred.resolve(data);
			}else{
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}


	return self;
}]);