'use strict';
app.service('ShingleSrvc',['$http','$q','SharedSrvc',function shingleJobForm($http,$q,SharedSrvc){
	// This service provides DB interaction for a Shingle Job Proposal

	var self = this;
	self.ME = "ShingleSrvc: ";
	var S = SharedSrvc;

	// Field input items
	self.inputFields = [];
	// Specific job data
	self.jobInput = [];

	var httpPathPrefix = "http/";

	var queryPaths = {
		getShingleFields:httpPathPrefix + "getShingleFields.php",
		insertJobParameters:httpPathPrefix + "insertJobParameters.php",
		updateJobParameters:httpPathPrefix + "updateJobParameters.php"
	};

	self.query = function(query,dataObj){
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

	
	// Retrieve input from a proposal in progress or complete
	// Called from ProposalCtrl
	/*self.getJobParameters = function(){
		var dataObj = {};
		dataObj.ID = S.selectedJobObj.PRIMARY_ID;
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
	};*/

	
	/*self.submitParams = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'http/updateJobParameters.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.result != false){
     			deferred.resolve(data);
			}else{
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}*/

	// Inserts a field to the DB
	/*self.insertJobItem = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'http/insertJobParameter.php',data:dataObj}).
		success(function(data, status) {
			if(typeof data != 'string' && data.result != false){
     			deferred.resolve(data);
			}else{
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	}*/

	
	var initService = function(){
		// List of shingle input field items (generic)
		self.query("getShingleFields").then(function(result){
            if(result != false){
               self.inputFields = result;
               console.log("getShingleIntputFields");
            }else{
               
            }
        },function(error){
           
        });
	};



	initService();

	return self;
}]);