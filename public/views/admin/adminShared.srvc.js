'use strict';
app.service('AdminSharedSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function adminShared($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    self.ME = "AdminSharedSrvc: ";
    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;
    self.MATERIALS = [];
    self.CLIENTS = [];
    self.PROPERTIES = [];
    self.JOBS = [];
    self.ROOFS = [];


    //jobVO's related to jobs that are in Proposal State
    var proposalsAsJob = [];

    // List of all Sales Reps
    self.salesReps = [];

    // propertyVO's related to jobs that are in Proposal State
    // DataProvider for DropDownList on Proposal Review Page
    self.proposalsAsProperty = [];

    // Selected item from above - i.e. one of the objects in the self.proposalsAsProperty list
    // Params are added during formatParams()
    self.proposalUnderReview = {};

    // Received from DB - default selections amd current pricing
    // Then Merged with self.jobConfig for custom selections and pricing
    // Totals calculated
    self.materialsList = [];

    // Selections and pricing specific to a job
    self.jobConfig = [];

    // Temporary (short-term ) vars
    var mergeDataFlag = {};
    mergeDataFlag.config = false;
    mergeDataFlag.materials = false;
    var jobParams = {};

    // self.materialsList sorted into categories
    // Consumed by view controller as data provider for Pricing Tab
    self.materialsCatergorized = { Field: [], Ridge: [], Vents: [], Flashing: [], Caps: [], Flat: [], Other: [] };

    // Step 1 : Select proposal from dropdown on AdminProposalCtrl
    self.selectProposal = function(ndx) {
        var rtnRepName = "";
        if (ndx == -1) {
            self.resetProposalData(); // Clear vars
        } else {
            self.proposalUnderReview = self.proposalsAsProperty[ndx];
            // Get the Job ID
            for (var i = 0; i < proposalsAsJob.length; i++) {
                if (proposalsAsJob[i].property === self.proposalUnderReview.PRIMARY_ID) {
                    self.proposalUnderReview.jobID = proposalsAsJob[i].PRIMARY_ID;
                    break;
                }
            }
            rtnRepName = self.returnSalesRep(self.proposalUnderReview.manager);
            // Set flags to false
            mergeDataFlag.config = false;
            mergeDataFlag.materials = false;
            // Call queries
            getJobParameters();

        }
        return rtnRepName;
    };

    self.resetProposalData = function() {
        $rootScope.$broadcast('onResetProposalData');
        self.proposalUnderReview = {};
    };

    //Step 2
    // Data for the "Input" Tab on Proposal Review Page
    // Job Parameters AND Job Config must BOTH be updated after selecting a proposal before we can
    // call formatParams()
    // We'll use a flag (mergeDataFlag.params) to make sure both are updated...
    var getJobParameters = function() {
        DB.getJobParameters(self.proposalUnderReview.jobID).then(function(jobData) {
            if (jobData != false) {
                jobParams = jobData[0];
                mergeDataFlag.params = true;
                self.proposalUnderReview.propertyInputParams = CONFIG.formatParams(jobParams);
                $rootScope.$broadcast('onRefreshParamsData', jobParams);
                validateData();
                getJobConfig();
            } else {
                ngDialog.open({
                    template: '<h2>ERROR: This job has no proposal parameters.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
        });
    };

    //Step 3
    var getJobConfig = function() {
        var dataObj = { jobID: self.proposalUnderReview.jobID };
        DB.query("getJobConfig", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for getJobConfig()");
            } else {
                onGetJobConfig(resultObj.data);
            }
        }, function(error) {
            alert("ERROR returned for  getJobConfig()");
        });
    };

    // Send results over to CONFIG
    var onGetJobConfig = function(ar) {
        self.jobConfig = CONFIG.parseJobConfig(ar);
        mergeDataFlag.config = true;
        validateData();
    };

    // Checks to make sure both config and params are up to date from DB before calling formatParams();
    var validateData = function() {
        if (mergeDataFlag.config === true && mergeDataFlag.params === true) {
            mergeConfig();
        }
    };

    // Step 4
    // Take the generic materialList and merge it with the job-specific config (insert qty and price)
    var mergeConfig = function() {
        var aClone = DB.clone(self.MATERIALS);
        self.materialsList = CONFIG.mergeConfig(aClone, self.proposalUnderReview.propertyInputParams,true);
        categorizeMaterials();
    };

    // Categorizes and sorts the complete materials list into roof sections
    var categorizeMaterials = function() {
        self.materialsCatergorized = {};
        var field = [];
        var ridge = [];
        var caps = [];
        var vents = [];
        var flashing = [];
        var flat = [];
        var other = [];
        for (var i = 0; i < self.materialsList.length; i++) {
            var cat = self.materialsList[i].Category;
            if (cat == "Field") {
                field.push(self.materialsList[i]);
            } else if (cat == "Ridge") {
                ridge.push(self.materialsList[i]);
            } else if (cat == "Caps") {
                caps.push(self.materialsList[i]);
            } else if (cat == "Ventilation") {
                vents.push(self.materialsList[i]);
            } else if (cat == "Flashing" || cat == "Valley" || cat == "Edge") {
                flashing.push(self.materialsList[i]);
            } else if (cat == "LowSlope") {
                flat.push(self.materialsList[i]);
            } else if (cat == "Other") {
                other.push(self.materialsList[i]);
            }
        };

        underscore.sortBy(field, 'Sort');
        underscore.sortBy(ridge, 'Sort');
        underscore.sortBy(caps, 'Sort');
        underscore.sortBy(vents, 'Sort');
        underscore.sortBy(flashing, 'Sort');
        underscore.sortBy(flat, 'Sort');
        underscore.sortBy(other, 'Sort');
        self.materialsCatergorized.Field = field;
        self.materialsCatergorized.Ridge = ridge;
        self.materialsCatergorized.Caps = caps;
        self.materialsCatergorized.Vents = vents;
        self.materialsCatergorized.Flashing = flashing;
        self.materialsCatergorized.Flat = flat;
        self.materialsCatergorized.Other = other;

        $rootScope.$broadcast('onRefreshMaterialsData', self.materialsCatergorized);
    };


    //Queries the properties table based on proposal status
    // Called from init() in adminProposal.ctrl
    self.getProposalsByProperty = function() {
        DB.query('getJobProposals').then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProposalsByJob ---- " + resultObj.data);
            } else {
                self.proposalsAsProperty = resultObj.data;
                self.proposalUnderReview = self.proposalsAsProperty[0];
                $rootScope.$broadcast('getProposalsByProperty');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };

    // Queries the job_list table for open proposals
    self.getProposalsByJob = function() {
        DB.query('getJobsWithProposalStatus').then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProposalsByJob ---- " + resultObj.data);
            } else {
                proposalsAsJob = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };

    var dataError = function(msg, res) {
        console.log(msg);
        console.log(res);
    };

    //Called on init
    var getMaterialsList = function() {
        var dataObj = {};
        DB.query("getMaterialsShingle", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getMaterialsShingle ---- " + resultObj.data);
            } else {
                self.MATERIALS = resultObj.data;
                self.MATERIALS = underscore.sortBy(self.MATERIALS, 'Sort');
                self.materialsList = DB.clone(self.MATERIALS);
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };

    
    var getSalesReps = function() {
        DB.query("getSalesReps", null).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
            } else {
                self.salesReps = resultObj.data;
                for (var i = 0; i < self.salesReps.length; i++) {
                    self.salesReps[i].displayName = self.salesReps[i].name_first + " " + self.salesReps[i].name_last;
                }
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getSalesReps");
        });
    };


    // Properties, Clients, Roofs and Jobs -- async gets -- after Jobs decodeJobData called
    var getProperties = function() {
        DB.query("getProperties", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProperties ---- " + resultObj.data);
            } else {
                self.PROPERTIES = resultObj.data;
                getClients();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getProperties");
        });
    };

    var getClients = function() {
        DB.query("getClients", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getClients ---- " + resultObj.data);
            } else {
                self.CLIENTS = resultObj.data;
                getJobs();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getClients");
        });
    };

    var getJobs = function() {
        DB.query("getJobs", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobs ---- " + resultObj.data);
            } else {
                self.JOBS = resultObj.data;
                getRoofs();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getJobs");
        });
    };

    var getRoofs = function() {
        DB.query("getRoofTable", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getRoofTable ---- " + resultObj.data);
            } else {
                self.ROOFS = resultObj.data;
                doJobsMerge();
                doPropertiesMerge();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getRoofTable");
        });
    };

    var doJobsMerge = function() {
        // Translate related Client and Property ID #'s from Jobs into Names
        for (var i = 0; i < self.JOBS.length; i++) {
            var clientID = self.JOBS[i].client;
            var thisClient = returnDisplayNameFromClient(clientID);
            self.JOBS[i].clientName = thisClient;

            var managerID = self.JOBS[i].manager;
            self.JOBS[i].managerName = self.returnManagerNameByID(managerID);

            var propID = self.JOBS[i].property;

            var thisPropertyName = returnPropertyName(propID);
            self.JOBS[i].propertyName = thisPropertyName;

            var roofID = parseInt(self.JOBS[i].roofID);
            if (roofID > 0) {
                var bldgName = returnBldgNameFromRoofsByRoofID(roofID);
                self.JOBS[i].jobLabel = thisPropertyName + "-" + bldgName;
            } else {
                self.JOBS[i].jobLabel = thisPropertyName;
            }
        };
    };

    var doPropertiesMerge = function() {
        var tempProperties = [];
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            var clientID = self.PROPERTIES[i].client;
            self.PROPERTIES[i].clientDisplayName = returnDisplayNameFromClient(clientID);

            var managerID = self.PROPERTIES[i].manager;
            self.PROPERTIES[i].managerName = self.returnManagerNameByID(managerID);

            // PropertyDisplayName same as name unless multiple roofs, then append roof name to property name
            var roofCode = parseInt(self.PROPERTIES[i].roofDesign);
            var roofNamesAndId = returnBldgNameFromRoofsByPropID(self.PROPERTIES[i].PRIMARY_ID);
            if (roofCode === 0) {
                self.PROPERTIES[i].displayName = self.PROPERTIES[i].name;
                self.PROPERTIES[i].roofID = roofNamesAndId[0].roofID;
            } else {
                self.PROPERTIES[i].displayName = self.PROPERTIES[i].name + " - " + roofNamesAndId[0].bldgName;
                self.PROPERTIES[i].roofID = roofNamesAndId[0].roofID;
                roofNamesAndId.shift();
                var propToClone = self.PROPERTIES[i];
                for (var x = 0; x < roofNamesAndId.length; x++) {
                    var clonedProp = DB.clone(propToClone);
                    clonedProp.displayName = clonedProp.name + " - " + roofNamesAndId[x].bldgName;
                    clonedProp.roofID = roofNamesAndId[x].roofID;
                    tempProperties.push(clonedProp);
                }
            }
        }
        for (i = 0; i < tempProperties.length; i++) {
            self.PROPERTIES.push(tempProperties[i]);
        }
    }

    var returnDisplayNameFromClient = function(id) {
        for (var i = 0; i < self.CLIENTS.length; i++) {
            if (self.CLIENTS[i].PRIMARY_ID == id) {
                return self.CLIENTS[i].displayName;
            }
        };
        return "";
    };

    var returnBldgNameFromRoofsByPropID = function(id) {
        var rtnArray = [];
        for (var i = 0; i < self.ROOFS.length; i++) {
            if (self.ROOFS[i].propertyID == id) {
                rtnArray.push({ bldgName: self.ROOFS[i].name, roofID: self.ROOFS[i].PRIMARY_ID });
            }
        };
        return rtnArray;
    };

    var returnBldgNameFromRoofsByRoofID = function(id) {
        for (var i = 0; i < self.ROOFS.length; i++) {
            if (self.ROOFS[i].PRIMARY_ID == id) {
                return self.ROOFS[i].name;
            }
        };
        return "";
    };

    var returnPropertyName = function(id) {
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            if (self.PROPERTIES[i].PRIMARY_ID == id) {
                return self.PROPERTIES[i].name;
            }
        };
        return "";
    };



    var returnRoofCode = function(id) {
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            if (self.PROPERTIES[i].PRIMARY_ID == id) {
                return parseInt(self.PROPERTIES[i].roofDesign);
            }
        };
        return -1;
    };

    var decodeRoofVals = function(dataObj) {
        var returnVO = {};

        returnVO.name = dataObj.name;

        var val = parseInt(dataObj.numLevels);
        returnVO.numLevels = L.returnIdValue(L.levelOptions, val);

        val = parseInt(dataObj.shingleGrade);
        returnVO.shingleGrade = L.returnIdValue(L.shingleGradeOptions, val);

        val = parseInt(dataObj.roofDeck);
        returnVO.roofDeck = L.returnIdValue(L.roofDeckOptions, val);

        val = parseInt(dataObj.layers);
        returnVO.layers = L.returnIdValue(L.numbersToTen, val);

        val = parseInt(dataObj.edgeDetail);
        returnVO.edgeDetail = L.returnIdValue(L.edgeDetail, val);

        val = parseInt(dataObj.edgeTrim);
        returnVO.edgeTrim = L.returnIdValue(L.yesNo, val);

        val = parseInt(dataObj.valleyDetail);
        returnVO.valleyDetail = L.returnIdValue(L.valleyOptions, val);

        val = parseInt(dataObj.ridgeCap);
        returnVO.ridgeCap = L.returnIdValue(L.ridgeCapShingles, val);

        val = parseInt(dataObj.roofVents);
        returnVO.roofVents = L.returnIdValue(L.ventOptions, val);

        val = parseInt(dataObj.pitch);
        returnVO.pitch = L.returnIdValue(L.pitchOptions, val);

        return returnVO;
    };

    self.getMultiVents = function() {
        DB.query("getMultiVents", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getMultiVents ---- " + resultObj.data);
            } else {
                self.MULTIVENTS = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMultiVents");
        });
    };
    self.getMultiLevels = function() {
        DB.query("getMultiLevels", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getMultiLevels ---- " + resultObj.data);
            } else {
                self.MULTILEVELS = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMultiLevels");
        });
    };


    self.saveJobConfig = function() {
        var dataObj = {};
        var dataStr = "";
        dataObj.jobID = self.proposalUnderReview.jobID;

        for (var i = 0; i < self.materialsCatergorized.Field.length; i++) {
            var a = self.materialsCatergorized.Field[i].Code;
            var b = self.materialsCatergorized.Field[i].Qty;
            var c = self.materialsCatergorized.Field[i].Checked;
            var d = self.materialsCatergorized.Field[i].PkgPrice;
            var e = self.materialsCatergorized.Field[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Ridge.length; i++) {
            a = self.materialsCatergorized.Ridge[i].Code;
            b = self.materialsCatergorized.Ridge[i].Qty;
            c = self.materialsCatergorized.Ridge[i].Checked;
            d = self.materialsCatergorized.Ridge[i].PkgPrice;
            e = self.materialsCatergorized.Ridge[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Vents.length; i++) {
            a = self.materialsCatergorized.Vents[i].Code;
            b = self.materialsCatergorized.Vents[i].Qty;
            c = self.materialsCatergorized.Vents[i].Checked;
            d = self.materialsCatergorized.Vents[i].PkgPrice;
            e = self.materialsCatergorized.Vents[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Flashing.length; i++) {
            a = self.materialsCatergorized.Flashing[i].Code;
            b = self.materialsCatergorized.Flashing[i].Qty;
            c = self.materialsCatergorized.Flashing[i].Checked;
            d = self.materialsCatergorized.Flashing[i].PkgPrice;
            e = self.materialsCatergorized.Flashing[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Flat.length; i++) {
            a = self.materialsCatergorized.Flat[i].Code;
            b = self.materialsCatergorized.Flat[i].Qty;
            c = self.materialsCatergorized.Flat[i].Checked;
            d = self.materialsCatergorized.Flat[i].PkgPrice;
            e = self.materialsCatergorized.Flat[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Caps.length; i++) {
            a = self.materialsCatergorized.Caps[i].Code;
            b = self.materialsCatergorized.Caps[i].Qty;
            c = self.materialsCatergorized.Caps[i].Checked;
            d = self.materialsCatergorized.Caps[i].PkgPrice;
            e = self.materialsCatergorized.Caps[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Other.length; i++) {
            a = self.materialsCatergorized.Other[i].Code;
            b = self.materialsCatergorized.Other[i].Qty;
            c = self.materialsCatergorized.Other[i].Checked;
            d = self.materialsCatergorized.Other[i].PkgPrice;
            e = self.materialsCatergorized.Other[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        dataObj.strData = dataStr;
        var query = DB.queryDBWithObj("http/update/updateConfig.php", dataObj).then(function(result) {
            if (result != false) {
                return true;
            } else {
                alert("FALSE returned from DB at AdminSharedSrvc >>> getMaterialsList()");
                return false;
            }
        }, function(error) {
            alert("ERROR returned returned from DB at AdminSharedSrvc >>> getMaterialsList()");
        });
    };

    self.returnSalesRep = function(id) {
        var rtn = "";
        for (var i = 0; i < self.salesReps.length; i++) {
            if (self.salesReps[i].PRIMARY_ID === id) {
                rtn = self.salesReps[i].name_first + " " + self.salesReps[i].name_last;
                continue;
            }
        }
        return rtn;
    };


    self.returnClientNameByID = function(id) {
        for (var i = 0; i < self.CLIENTS.length; i++) {
            if (self.CLIENTS[i].PRIMARY_ID === id) {
                return self.CLIENTS[i].displayName;
            };
        };
    };

    self.returnManagerNameByID = function(id) {
        for (var i = 0; i < self.salesReps.length; i++) {
            if (self.salesReps[i].PRIMARY_ID === id) {
                return self.salesReps[i].displayName;
            };
        };
    };

    self.returnManagerObjByID = function(id) {
        for (var i = 0; i < self.salesReps.length; i++) {
            if (self.salesReps[i].PRIMARY_ID === id) {
                return self.salesReps[i];
            };
        };
    };

    self.returnPropertyNameByID = function(id) {
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            if (self.PROPERTIES[i].PRIMARY_ID === id) {
                return self.PROPERTIES[i].name;
            };
        };
    };


    self.returnObjByPropID = function(set, id) {
        var rtnObj = {};
        for (var i = 0; i < set.length; i++) {
            if (set[i].propertyID === id) {
                rtnObj = set[i];
                break;
            };
        };
        return rtnObj;
    };

    self.returnObjFromSetByPrimaryID = function(set, id) {
        var rtnObj = {};
        for (var i = 0; i < set.length; i++) {
            if (set[i].PRIMARY_ID === id) {
                rtnObj = set[i];
                break;
            };
        };
        return rtnObj;
    };

    getMaterialsList();
    getSalesReps();
    getProperties();

    return self;
}]);
