'use strict';
app.service('ShingleSrvc',['$http','$q','SharedSrvc',function shingleStuff($http,$q,SharedSrvc){
	var self = this;
	self.ME = "ShingleSrvc: ";
	var S = SharedSrvc;

	// Shingle materials inventory
	self.jobMaterials = [];
	// Field input items
	self.inputFields = [];
	// Specific job data
	self.jobInput = [];


	// Add some properties that are not included in database
	var setProps = function(){
		for (var i = 0; i < self.jobMaterials.length; i++) {
			self.jobMaterials[i].Total = 0;
			self.jobMaterials[i].Tax = 0;
		};
	};

	var getShingleItems = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getShingleItems.php'}).
		success(function(data, status) {
			console.log(data);
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

	var getInventory = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getShingleInvt.php'}).
		success(function(data, status) {
			console.log(data);
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

	self.getJobInput = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getJobInput.php'}).
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

	

	var initService = function(){
		// 2. List of shingle input field items (generic)
		var fields = getShingleItems()
		.then(function(fields){
            if(fields != false){
               self.inputFields = fields;
               console.log("getShingleItems");
            }else{
               
            }
        },function(error){
           
        });

		//1. List of shingle inventory items (generic)
		var invtData = getInventory()
		.then(function(invtData){
            if(invtData != false){
               self.jobMaterials = invtData;
               console.log("getInventory");
               setProps();
            }else{
               
            }
        },function(error){
           
        });
	};

	// Need 2 DB calls on init, and one called from Ctrl
	// 1. List of shingle inventory items (generic)
	// 2. List of shingle input field items (generic)
	// 3. List of inputs for this job (job-specific)

	initService();

	return self;
}]);