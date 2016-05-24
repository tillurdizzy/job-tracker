'use strict';

app.service('evoDb', ['$http', '$q', 'SharedSrvc', 'LogInSrvc', 'underscore', function eventQueries($http, $q, SharedSrvc, LogInSrvc, underscore) {
    var self = this;
    self.lastResult = [];
    self.ME = "evoDB: ";
    self.managerID = "";
    var S = SharedSrvc;
    var L = LogInSrvc;
    var serverAvailable = false;
    self.keyValues = [];

    var globalPathPrefix = "js/php/";
    var httpPathPrefix = "http/";

    var queryPaths = {
        getRoof: httpPathPrefix + "getRoof.php",
        getShingleFields:httpPathPrefix + "getShingleFields.php",
        getRoofTable: httpPathPrefix + "getRoofTable.php",
        getJobParameters: httpPathPrefix + "getJobParameters.php",
        getSpecialConsiderations: httpPathPrefix + "getSpecialConsiderations.php",
        putPropertyAddress: httpPathPrefix + "putPropertyAddress.php",
        getPropertiesByClient: httpPathPrefix + "getPropertiesByClient.php",
        putRoof: httpPathPrefix + "putRoof.php",
        insertRoof: httpPathPrefix + "insertRoof.php",
        insertJobParameters: httpPathPrefix + "insertJobParameters.php",
        insertSpecialConsiderations: httpPathPrefix + "insertSpecialConsiderations.php",
        insertJobConfig: httpPathPrefix + "insertJobConfig.php",
        putMultiLevels: httpPathPrefix + "putMultiLevels.php",
        putMultiVents: httpPathPrefix + "putMultiVents.php",
        updateJobParameters:httpPathPrefix + "updateJobParameters.php",
        updateSpecialConsiderations:httpPathPrefix + "updateSpecialConsiderations.php"
    };

    self.query = function(query, dataObj) {
        var rtnObj = {};
        var phpPath = queryPaths[query];
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpPath, data: dataObj })
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

    self.setManagerID = function(id) {
        self.managerID = id;
        self.managerName = "Admin";
    };

    self.logOut = function() {
        self.managerID = "";
        self.managerName = "";
    };

    self.sendEmail = function(dataObj) {
        $http({ method: 'POST', url: 'js/php/sendEmail.php', data: dataObj });
    };

    self.returnRawData = function(phpFile) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpFile }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise;
    }

    self.returnRawDataWithObj = function(phpFile, dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpFile, data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise;
    };

    
    self.putClient = function(dataObj) {
        dataObj.manager = self.managerID;
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putClient.php', data: dataObj }).
        success(function(data, status, headers, config) {
            self.getManagerClients();
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    self.putProperty = function(dataObj) {
        dataObj.manager = self.managerID;
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putProperty.php', data: dataObj }).
        success(function(data, status, headers, config) {
            self.getManagerProperties();
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    self.putJob = function(dataObj) {
        dataObj.manager = self.managerID;
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putJob.php', data: dataObj }).
        success(function(data, status, headers, config) {
            var newJobID = data.id;
            putJobPartTwo(newJobID);
           
            var rtnObj = {};
            rtnObj.result = "Success";
            rtnObj.data = data;
            deferred.resolve(rtnObj);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var putJobPartTwo = function(jobID){
        var dataObj = { jobID: jobID };
        self.query('insertJobConfig',dataObj);
        self.query('insertJobParameters',dataObj);
        self.query('insertSpecialConsiderations',dataObj);
    };


    self.putMultiLevel = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putMultiLevels.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    self.putMultiVents = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putMultiVents.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    self.updateMultiLevel = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'updateMultiLevel.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    self.putManager = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putManager.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    // Called from login page to verify name/password
    self.queryLogIn = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getUser.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string' && data.length > 0) {
                self.lastResult = data;
                self.managerID = data[0].PRIMARY_ID;
                self.managerName = data[0].name_first + " " + data[0].name_last;
                S.setUser(data[0]);
                L.setUser(data[0]);
                deferred.resolve(data);
            } else {
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

    self.queryLogInGoogle = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getGoogleUser.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string' && data.length > 0) {
                self.lastResult = data;
                self.managerID = data[0].PRIMARY_ID;
                self.managerName = data[0].name_first + " " + data[0].name_last;
                S.setUser(data[0]);
                L.setUser(data[0]);
                deferred.resolve(data);
            } else {
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

    self.putLogIn = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putUser.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    }


    self.getAllClients = function() {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getClients.php' }).
        success(function(data, status) {
            if (typeof data != 'string') {
                for (var i = 0; i < data.length; i++) {
                    data[i].manager = parseInt(data[i].manager);
                    data[i].type = parseInt(data[i].type);
                }
                S.setManagerClients(data);
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    self.getManagerClients = function() {
        var dataObj = { manager: S.managerID };
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getClientsByManager.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
                for (var i = 0; i < data.length; i++) {
                	data[i].PRIMARY_ID = parseInt(data[i].PRIMARY_ID);
                    data[i].manager = parseInt(data[i].manager);
                    data[i].type = parseInt(data[i].type);
                }
                self.getManagerProperties();
                S.setManagerClients(data);
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    self.getAllProperties = function() {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getProperties.php' }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                S.setManagerProperties(data);
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    self.getManagerProperties = function() {
        var dataObj = { manager: S.managerID };
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getPropertiesByManager.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
                for (var i = 0; i < data.length; i++) {
                	data[i].PRIMARY_ID = parseInt(data[i].PRIMARY_ID);
                    data[i].manager = parseInt(data[i].manager);
                    data[i].client = parseInt(data[i].client);
                    data[i].roofCode = parseInt(data[i].roofCode);
                }
                S.setManagerProperties(data);
                self.getRoofTable();
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    self.getRoofTable = function() {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getRoofTable.php' }).
        success(function(data, status) {
            if (typeof data != 'string') {
                for (var i = 0; i < data.length; i++) {
                	data[i].PRIMARY_ID = parseInt(data[i].PRIMARY_ID);
                    data[i].propertyID = parseInt(data[i].propertyID);
                    data[i].numLevels = parseInt(data[i].numLevels);
                    data[i].pitch = parseInt(data[i].pitch);
                    data[i].shingleGrade = parseInt(data[i].shingleGrade);
                    data[i].roofDeck = parseInt(data[i].roofDeck);
                    data[i].layers = parseInt(data[i].layers);
                    data[i].edgeDetail = parseInt(data[i].edgeDetail);
                    data[i].edgeTrim = parseInt(data[i].edgeTrim);
                    data[i].valleyDetail = parseInt(data[i].valleyDetail);
                    data[i].ridgeCap = parseInt(data[i].ridgeCap);
                    data[i].roofVents = parseInt(data[i].roofVents);
                }
                S.setRoofTable(data);
                deferred.resolve(data);
            } else {
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
    self.getManagerJobs = function() {
        if (S.managerID === "") {
            S.setManagerID("3", "Admin");
        }
        var dataObj = { manager: S.managerID };
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getJobsByManager.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
            	for (var i = 0; i < data.length; i++) {
            		data[i].PRIMARY_ID = parseInt(data[i].PRIMARY_ID);
                    data[i].manager = parseInt(data[i].manager);
                    data[i].property = parseInt(data[i].property);
                    data[i].roofID = parseInt(data[i].roofID);
                    data[i].client = parseInt(data[i].client);
                    data[i].dateActive = parseInt(data[i].dateActive);
                    data[i].dateComplete = parseInt(data[i].dateComplete);
                    data[i].dateContract = parseInt(data[i].dateContract);
                    data[i].dateProposal = parseInt(data[i].dateProposal);
                    data[i].dateProspect = parseInt(data[i].dateProspect);
                }
                self.getManagerClients();
                S.setManagerJobsList(data);
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    self.getActiveProposals = function() {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getJobProposals.php' }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    self.getJobByID = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getJobByID.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    self.updateJobStatus = function(jobid, status, val) {
        var dataObj = {};
        dataObj.id = jobid;
        dataObj.val = val;
        dataObj.status = status;
        var query = "";
        switch (status) {
            case "Proposal":
                query = "updateProposalDate.php";
                break;
            case "Contract":
                query = "updateContractDate.php";
                break;
            case "Active":
                query = "updateActiveDate.php";
                break;
            case "Complete":
                query = "updateCompleteDate.php";
                break;
        }
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + query, data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    }

    self.getClientByID = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getClientByID.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };
    self.getPropertyByID = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getPropertyByID.php', data: dataObj }).
        success(function(data, status) {
            if (typeof data != 'string') {
                self.lastResult = data;
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(false);
        });
        return deferred.promise; //return the data
    };

    // Called form Edit-form
    self.updateStatus = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'updateStatus.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    // Called form Edit-form
    self.updateDetails = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'updateDetails.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    self.putSpecial = function(dataObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'putSpecial.php', data: dataObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    self.getJobMaterials = function(jobIDObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getJobMaterials.php', data: jobIDObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    self.updateMaterialsItem = function(primaryIDObj) {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'updateMaterialsItem.php', data: primaryIDObj }).
        success(function(data, status, headers, config) {
            deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    self.getIdValues = function() {
        var deferred = $q.defer();
        $http({ method: 'POST', url: httpPathPrefix + 'getIdVals.php' }).
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
