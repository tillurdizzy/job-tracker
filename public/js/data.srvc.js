'use strict';

app.service('evoDb',['$http','$q','SharedSrvc','LogInSrvc',function eventQueries($http,$q,SharedSrvc,LogInSrvc){
	var self = this;
	self.lastResult = [];
	self.ME = "evoDB: ";
	self.managerID = "";
	var S = SharedSrvc;
	var L = LogInSrvc;
	var serverAvailable = false;
	self.keyValues = [];

	var globalPathPrefix="js/php/";
	var httpPathPrefix = "http/";

	var queryPaths = {
		getRoof:httpPathPrefix + "getRoof.php",
		putPropertyAddress:httpPathPrefix + "putPropertyAddress.php",
		putRoof:httpPathPrefix + "putRoof.php",
		putJob:httpPathPrefix + "putJob.php",
		putMultiLevels:httpPathPrefix + "putMultiLevels.php",
		putMultiVents:httpPathPrefix + "putMultiVents.php"
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

	self.setManagerID = function(id){
		self.managerID = id;
		self.managerName = "Admin";
	};

	self.logOut = function(){
		self.managerID = "";
		self.managerName = "";
	};
	
	self.sendEmail = function(dataObj){
		$http({method: 'POST', url: 'js/php/sendEmail.php',data:dataObj});
	};

	self.returnRawData = function(phpFile){
		var deferred = $q.defer();
		$http({method: 'POST', url:phpFile}).
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
	}

	self.returnRawDataWithObj = function(phpFile,dataObj){
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

	self.runQueryWithObj = function(phpFile,dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url:phpFile,data:dataObj}).
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
	};

	self.putClient = function(dataObj){
		dataObj.manager = self.managerID;
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'putClient.php',data:dataObj}).
		success(function(data, status, headers, config) {
			self.getManagerClients();
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
		$http({method: 'POST', url: httpPathPrefix + 'putProperty.php',data:dataObj}).
		success(function(data, status, headers, config) {
			self.getManagerProperties();
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putJob = function(dataObj){
		dataObj.manager = self.managerID;
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'putJob.php',data:dataObj}).
		success(function(data, status, headers, config) {
			var newJobID = data.params;
			var dataObj = {jobID:newJobID};
			self.putJobParams(dataObj);
			self.putMaterialOptions(dataObj);
			self.putSpecialConsiderations(dataObj);
			self.putMultiLevel(dataObj);
			self.putJobMaterials(dataObj);
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putJobMaterials = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'insertJobMaterial.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putJobParams = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'insertJobParameters.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putMaterialOptions = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'insertMaterialOptions.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putSpecialConsiderations = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'insertSpecialConsiderations.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putMultiLevel = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'putMultiLevel.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.putMultiVents = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'putMultiVents.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.updateMultiLevel = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'updateMultiLevel.php',data:dataObj}).
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
		$http({method: 'POST', url: httpPathPrefix + 'putManager.php',data:dataObj}).
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
		$http({method: 'POST', url: httpPathPrefix + 'getUser.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
				self.lastResult = data;
     			self.managerID = data[0].PRIMARY_ID;
     			self.managerName = data[0].name_first + " " + data[0].name_last;
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

	self.queryLogInGoogle = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'getGoogleUser.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
				self.lastResult = data;
     			self.managerID = data[0].PRIMARY_ID;
     			self.managerName = data[0].name_first + " " + data[0].name_last;
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

	self.putLogIn = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'putUser.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	
	self.getAllClients = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url:httpPathPrefix +  'getClients.php'}).
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
		$http({method: 'POST', url: httpPathPrefix + 'getClientsByManager.php',data:dataObj}).
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
		$http({method: 'POST', url: httpPathPrefix + 'getProperties.php'}).
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
		$http({method: 'POST', url: httpPathPrefix + 'getPropertiesByManager.php',data:dataObj}).
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

	// Triggered after successful log in and whenever user chooses Refresh data buttons
	// When successful, will trigger getManagerClients, which will then trigger getManagerProperties
	self.getManagerJobs = function(){
		if(S.managerID === ""){
			S.setManagerID("3","Admin");
		}
		var dataObj = {manager:S.managerID};
		var deferred = $q.defer();
		$http({method: 'POST', url:httpPathPrefix +  'getJobsByManager.php',data:dataObj}).
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

	self.getActiveProposals = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'getJobProposals.php'}).
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
	    return deferred.promise; //return the data
	};

	self.getJobByID = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'getJobByID.php',data:dataObj}).
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
	    return deferred.promise; //return the data
	};

	self.updateJobStatus = function(jobid,status,val){
		var dataObj = {};
		dataObj.id = jobid;
		dataObj.val = val;
		dataObj.status = status;
		var query = "";
		switch(status){
			case "Proposal":query="updateProposalDate.php";break;
			case "Contract":query="updateContractDate.php";break;
			case "Active":query="updateActiveDate.php";break;
			case "Complete":query="updateCompleteDate.php";break;
		}
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + query,data:dataObj}).
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
	    return deferred.promise; //return the data
	}

	self.getClientByID = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'getClientByID.php',data:dataObj}).
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
	    return deferred.promise; //return the data
	};
	self.getPropertyByID = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'getPropertyByID.php',data:dataObj}).
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
	    return deferred.promise; //return the data
	};

	// Called form Edit-form
	self.updateStatus = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'updateStatus.php',data:dataObj}).
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
		$http({method: 'POST', url:httpPathPrefix +  'updateDetails.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	self.putSpecial = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'putSpecial.php',data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	self.getJobMaterials = function(jobIDObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'getJobMaterials.php',data:jobIDObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	self.updateMaterialsItem = function(primaryIDObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'updateMaterialsItem.php',data:primaryIDObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	self.getIdValues = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: httpPathPrefix + 'getIdVals.php'}).
		success(function(data, status, headers, config) {
			self.keyValues = data;
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}

	
	return self;
}]);