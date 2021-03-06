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

	var getShingleIntputFields = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/jobs/proposals/http/getShingleFields.php'}).
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

	// Retrieve input from a proposal in progress or complete
	// Called from ProposalCtrl
	self.getJobInput = function(){
		var dataObj = {};
		dataObj.ID = S.selectedJobObj.PRIMARY_ID;
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/jobs/proposals/http/getJobInput.php',data:dataObj}).
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

	// Updates a field to the DB
	// Called from ProposalCtrl
	self.updateJobItem = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/jobs/proposals/http/updateJobItem.php',data:dataObj}).
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
	}
	// Inserts a field to the DB
	self.insertJobItem = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'views/jobs/proposals/http/insertJobItem.php',data:dataObj}).
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
	}

	
	var initService = function(){
		// List of shingle input field items (generic)
		var fields = getShingleIntputFields()
		.then(function(result){
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