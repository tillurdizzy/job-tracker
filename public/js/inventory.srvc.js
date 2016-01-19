'use strict';

app.service('invtDb',['$http','$q',function eventQueries($http,$q){
	var self = this;
	self.ME = "invtDB: ";

	self.putItem = function(cat,dataObj){
		var phpFile = "";
		var deferred = $q.defer();
		switch(cat){
			case 0:phpFile="putMembrane.php";break;
			case 1:phpFile="putWalkway.php";break;
			case 2:phpFile="putFlashing.php";break;
			case 3:phpFile="putEdging.php";break;
			case 4:phpFile="putAdhesive.php";break;
			case 5:phpFile="putFastener.php";break;
			case 6:phpFile="putInsulation.php";break;
		}
		$http({method: 'POST', url: 'js/php/'+phpFile,data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	self.queryCategory = function(cat,dataObj){
		var deferred = $q.defer();
		switch(cat){
			case 0:phpFile="getMembrane.php";break;
			case 1:phpFile="getWalkway.php";break;
			case 2:phpFile="getFlashing.php";break;
			case 3:phpFile="getEdging.php";break;
			case 4:phpFile="getAdhesive.php";break;
			case 5:phpFile="getFastener.php";break;
			case 6:phpFile="getInsulation.php";break;
			case 7:phpFile="getShingleInvt.php";break;
		}
		$http({method: 'POST', url: 'js/php/'+phpFile}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
     			deferred.resolve(data);
			}else{
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

	
	self.updateItem = function(cat,dataObj){
		var deferred = $q.defer();
		switch(cat){
			case 0:phpFile="updateMembrane.php";break;
			case 1:phpFile="updateWalkway.php";break;
			case 2:phpFile="updateFlashing.php";break;
			case 3:phpFile="updateEdging.php";break;
			case 4:phpFile="updateAdhesive.php";break;
			case 5:phpFile="updateFastener.php";break;
			case 6:phpFile="updateInsulation.php";break;
		}
		$http({method: 'POST', url: 'js/php/'+phpFile,data:dataObj}).
		success(function(data, status, headers, config) {
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	
	return self;
}]);