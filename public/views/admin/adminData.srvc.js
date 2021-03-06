'use strict';
app.service('AdminDataSrvc',['$http','$q','SharedSrvc','LogInSrvc',function adminData($http,$q,SharedSrvc,LogInSrvc){
	// This service provides DB interaction for a Shingle Job Proposal

	var self = this;
	var me = "AdminDataSrvc: ";
	var LOG = true;

	var S = SharedSrvc;
	var L = LogInSrvc;
	
	var localPathPrefix="views/admin/http/";
	var globalPathPrefix="js/php/";
	var httpPathPrefix = "http/";

	var trace = function(message){
        if(LOG){
            console.log(message);
        }
    };

	var queryPaths = {
		getMaterialsShingle:httpPathPrefix + "getMaterialsShingle.php",
		getShingleColors: httpPathPrefix + "getShingleColors.php",
		getSalesReps:httpPathPrefix + "getSalesReps.php",
		getClients:httpPathPrefix + "getClients.php",
		getJobs:httpPathPrefix + "getJobs.php",
		getRoofTable:httpPathPrefix + "getRoofTable.php",
		getMultiVents:httpPathPrefix + "getMultiVents.php",
		getMultiLevels:httpPathPrefix + "getMultiLevels.php",
		getProperties:httpPathPrefix + "getProperties.php",
		getAllPhotos:httpPathPrefix + "getAllPhotos.php",
		getJobConfig:httpPathPrefix + "getJobConfig.php",
		getConfigMargin:httpPathPrefix + "getConfigMargin.php",
		getAllJobParameters:httpPathPrefix + "getAllJobParameters.php",
		getAllJobConfigs:httpPathPrefix + "getAllJobConfigs.php",
		getJobProposals:httpPathPrefix + "getJobProposals.php",
		getSpecialConsiderations:httpPathPrefix + "getSpecialConsiderations.php",
		getJobsWithProposalStatus:httpPathPrefix + "getJobsWithProposalStatus.php",
		getLabor:httpPathPrefix + "getLabor.php",
		getRoof:httpPathPrefix + "getRoof.php",
		doesJobExist:httpPathPrefix + "getDoesJobExist.php",
		insertMultiLevels: httpPathPrefix + "insertMultiLevels.php",
        insertMultiVents: httpPathPrefix + "insertMultiVents.php",
        insertRoof: httpPathPrefix + "insertRoof.php",
        insertJobConfig: httpPathPrefix + "insertJobConfig.php",
        insertJobParameters: httpPathPrefix + "insertJobParameters.php",
        insertSpecialConsiderations: httpPathPrefix + "insertSpecialConsiderations.php",
		putProperty:httpPathPrefix + "putProperty.php",
		putJob:httpPathPrefix + "putJob.php",
		putClient:httpPathPrefix + "putClient.php",
		putPitchedInvtItem:httpPathPrefix + "putPitchedInventoryItem.php",
		putMultiLevels:httpPathPrefix + "putMultiLevels.php",
		putMultiVents:httpPathPrefix + "putMultiVents.php",
		updateProperty:httpPathPrefix + "updateProperty.php",
		updateMaterialsShingle:httpPathPrefix + "updateMaterialsShingle.php",
		updateMultiLevels:httpPathPrefix + "updateMultiLevels.php",
		updateMultiVents:httpPathPrefix + "updateMultiVents.php",
		updateClient:httpPathPrefix + "updateClient.php",
		updateProspectDate:httpPathPrefix + "updateProspectDate.php",
		updateProposalDate:httpPathPrefix + "updateProposalDate.php",
		updateContractDate:httpPathPrefix + "updateContractDate.php",
		updateActiveDate:httpPathPrefix + "updateActiveDate.php",
		updateCompleteDate:httpPathPrefix + "updateCompleteDate.php",
		updateConfig:httpPathPrefix + "updateConfig.php",
		updateConfigCost:httpPathPrefix + "updateConfig_cost.php",
		updateConfigContract:httpPathPrefix + "updateConfig_contract.php",
		updateConfigSummary:httpPathPrefix + "updateConfigSummary.php",
		updateConfigLabor:httpPathPrefix + "updateConfig_labor.php",
		updateConfigMargin:httpPathPrefix + "updateConfig_margin.php",
		updateConfigMaterials:httpPathPrefix + "updateConfig_materials.php",
		updatePitchedItemPrice:httpPathPrefix + "updatePitchedItemPrice.php",
		updateConfigConfig:httpPathPrefix + "updateConfig_config.php",
		updateConfigUpgradesSelected:httpPathPrefix + "updateConfig_upgradesSelected.php",
		updateConfigUpgradeBase:httpPathPrefix + "updateConfig_upgrades.php",
		updateRoof:httpPathPrefix + "updateRoof.php",
		deleteProperty:httpPathPrefix + "deleteProperty.php",
		deleteClient:httpPathPrefix + "deleteClient.php",
		deleteJob:httpPathPrefix + "deleteJob.php",
		deletePitchedInvtItem:httpPathPrefix + "deletePitchedInvtItem.php",
		deleteMultiLevel:httpPathPrefix + "deleteMultiLevel.php",
		deleteMultiVents:httpPathPrefix + "deleteMultiVents.php",
		deleteRoof:httpPathPrefix + "deleteRoof.php"
	};

	self.query = function(query,dataObj){
		trace(me + "query = " + query);
		var rtnObj = {};
		var phpPath = queryPaths[query];
		var deferred = $q.defer();
		$http({method: 'POST', url:phpPath,data:dataObj})
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

	
	self.getJobConfig = function(dataObj){
		trace(me + "!!! getJobConfig");
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
		trace(me + "!!! getShingleIntputFields");
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
		trace(me + "!!! getJobParameters");
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
		trace(me + "!!! submitParams");
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
		trace(me + "!!! insertJobItem");
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
		trace(me + "queryLogInGoogle");
		var deferred = $q.defer();
		$http({method: 'POST', url: 'http/getGoogleUser.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
     			
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
		trace(me + "!!! getIdValues");
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