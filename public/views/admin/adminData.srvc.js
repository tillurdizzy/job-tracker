'use strict';
app.service('AdminDataSrvc',['$http','$q','SharedSrvc','LogInSrvc',function adminData($http,$q,SharedSrvc,LogInSrvc){
	// This service provides DB interaction for a Shingle Job Proposal

	var self = this;
	self.ME = "AdminDataSrvc: ";
	var S = SharedSrvc;
	var L = LogInSrvc;
	
	self.UserID = "";
	self.UserName = "";
	
	var localPathPrefix="views/admin/http/";
	var globalPathPrefix="js/php/";
	var httpPathPrefix = "http/";

	var queryPaths = {
		getMaterialsShingle:httpPathPrefix + "getMaterialsShingle.php",
		getSalesReps:httpPathPrefix + "getSalesReps.php",
		getClients:httpPathPrefix + "getClients.php",
		getJobs:httpPathPrefix + "getJobs.php",
		getRoofTable:httpPathPrefix + "getRoofTable.php",
		getMultiVents:httpPathPrefix + "getMultiVents.php",
		getMultiLevels:httpPathPrefix + "getMultiLevels.php",
		getProperties:httpPathPrefix + "getProperties.php",
		getAllPhotos:httpPathPrefix + "getAllPhotos.php",
		getJobConfig:httpPathPrefix + "getJobConfig.php",
		getAllJobParameters:httpPathPrefix + "getAllJobParameters.php",
		getAllJobConfigs:httpPathPrefix + "getAllJobConfigs.php",
		getJobProposals:httpPathPrefix + "getJobProposals.php",
		getSpecialConsiderations:httpPathPrefix + "getSpecialConsiderations.php",
		getJobsWithProposalStatus:httpPathPrefix + "getJobsWithProposalStatus.php",
		getLabor:httpPathPrefix + "getLabor.php",
		doesJobExist:httpPathPrefix + "getDoesJobExist.php",
		insertMultiLevels: httpPathPrefix + "insertMultiLevels.php",
        insertMultiVents: httpPathPrefix + "insertMultiVents.php",
        insertRoof: httpPathPrefix + "insertRoof.php",
		putProperty:httpPathPrefix + "putProperty.php",
		putJob:httpPathPrefix + "putJob.php",
		putClient:httpPathPrefix + "putClient.php",
		putPitchedInvtItem:httpPathPrefix + "putPitchedInventoryItem.php",
		putMultiLevels:httpPathPrefix + "putMultiLevels.php",
		putMultiVents:httpPathPrefix + "putMultiVents.php",
		updateProperty:httpPathPrefix + "updateProperty.php",
		updateMultiLevels:httpPathPrefix + "updateMultiLevels.php",
		updateMultiVents:httpPathPrefix + "updateMultiVents.php",
		updateClient:httpPathPrefix + "updateClient.php",
		updateProspectDate:httpPathPrefix + "updateProspectDate.php",
		updateProposalDate:httpPathPrefix + "updateProposalDate.php",
		updateContractDate:httpPathPrefix + "updateContractDate.php",
		updateActiveDate:httpPathPrefix + "updateActiveDate.php",
		updateCompleteDate:httpPathPrefix + "updateCompleteDate.php",
		updateConfig:httpPathPrefix + "updateConfig.php",
		deleteProperty:httpPathPrefix + "deleteProperty.php",
		deleteClient:httpPathPrefix + "deleteClient.php",
		deleteJob:httpPathPrefix + "deleteJob.php",
		deletePitchedInvtItem:httpPathPrefix + "deletePitchedInvtItem.php",
		deleteMultiLevel:httpPathPrefix + "deleteMultiLevel.php",
		deleteMultiVents:httpPathPrefix + "deleteMultiVents.php",
		deleteRoof:httpPathPrefix + "deleteRoof.php"
	};

	self.query = function(query,dataObj){
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


// Phases this one out in favor of above
	self.queryDB = function(phpFile){
		var deferred = $q.defer();
		$http({method: 'POST', url:phpFile}).
		success(function(data, status) {
			if(typeof data != 'string'){
     			deferred.resolve(data);
     		}else{
     			console.log(data);
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
		$http({method: 'POST', url:phpFile,data:dataObj}).success(function(data, status) {
			if(typeof data != 'string' && data.result != false){
     			deferred.resolve(data);
     		}else{
				deferred.resolve(false);
     		}
	    }).error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise;
	};

	self.logOut = function(){
		self.managerID = "";
		self.managerName = "";
	};

	
	self.getJobConfig = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'http/getJobConfig.php',data:dataObj}).
		success(function(data, status) {
			if(data === false){
				deferred.resolve(false);
     		}else{
				deferred.resolve(data);
     		}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(false);
	    });
	    return deferred.promise;
	}
	

	var getShingleIntputFields = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'http/getShingleFields.php'}).
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
		$http({method: 'POST', url: 'http/getJobParameters.php',data:dataObj}).
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
		$http({method: 'POST', url: 'http/updateJobParameters.php',data:dataObj}).
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
		$http({method: 'POST', url: 'http/insertJobParameter.php',data:dataObj}).
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

	self.queryLogInGoogle = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'http/getGoogleUser.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
     			self.UserID = data[0].PRIMARY_ID;
     			self.UserName = data[0].name_first + " " + data[0].name_last;
     			S.setUser(data[0]);
     			L.setUser(data[0]);
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

	self.getIdValues = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'http/getIdVals.php'}).
		success(function(data, status, headers, config) {
			self.keyValues = data;
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	self.convertToBoolean = function(input){
        var boolOut = false;
        if (input === "1" || input === "true" || input === "True" || input === "TRUE" || input === 1 || input === true) {
            boolOut = true;
        }
        var num = Number(input);
        var isNum = isNaN(num);
        if (!isNum) {
            if(num > 0){
                boolOut = true;
            }
        }
        return boolOut;
    };

	self.clone = function(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = self.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = self.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };



	return self;
}]);