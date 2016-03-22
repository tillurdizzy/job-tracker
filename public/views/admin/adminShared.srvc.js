'use strict';
app.service('AdminSharedSrvc', ['$rootScope', 'AdminDataSrvc', 'underscore', 'JobConfigSrvc',function adminShared($rootScope, AdminDataSrvc, underscore,JobConfigSrvc) {

    var self = this;
    self.ME = "AdminSharedSrvc: ";
    var DB = AdminDataSrvc;
    var CONFIG = JobConfigSrvc;

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

    // 
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
                }
            }
            rtnRepName = self.returnSalesRep(self.proposalUnderReview.manager);
            // Set flags to false
            mergeDataFlag.config = false;
            mergeDataFlag.materials = false;
            // Call queries
            getJobParameters();
            getJobConfig();
        }
        return rtnRepName;
    };

    self.resetProposalData = function() {
        $rootScope.$broadcast('onResetProposalData');
        self.proposalUnderReview = {};
    };

    // Data for the "Input" Tab on Proposal Review Page
    // Job Parameters AND Job Config must BOTH be updated after selecting a proposal before we can
    // call formatParams()
    // We'll use a flag to make sure both are updated...
    var getJobParameters = function() {
        DB.getJobParameters(self.proposalUnderReview.jobID).then(function(jobData) {
            if (jobData != false) {
                jobParams = jobData[0];
                mergeDataFlag.params = true;
                self.proposalUnderReview.propertyInputParams = CONFIG.formatParams(jobParams);
                $rootScope.$broadcast('onRefreshParamsData', jobParams);
                validateData();
            } else {
                alert("FALSE returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
        });
    };


    var getJobConfig = function() {
        var dataObj = { jobID: self.proposalUnderReview.jobID };
        DB.getJobConfig(dataObj).then(function(result) {
            if (result === false) {
                alert("FALSE returned for DB.getJobConfig() at AdminSharedSrvc >>> getJobConfig()");
            } else {
                var resultObj = result;
                onGetJobConfig(resultObj); 
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobConfig() at AdminSharedSrvc >>> getJobConfig()");
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
        if (mergeDataFlag.config == true && mergeDataFlag.params == true) {
            mergeConfig();
        }
    };

    // Take the generic materialList and merge it with the job-specific config (insert qty and price)
    var mergeConfig = function() {
        self.materialsList = CONFIG.mergeConfig(self.materialsList,self.proposalUnderReview.propertyInputParams);
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
            } else if (cat == "Flashing" || cat == "Valley"  || cat == "Edge") {
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
        DB.queryDB('views/admin/http/getJobProposals.php').then(function(result) {
            if (typeof result != "boolean") {
                self.proposalsAsProperty = result;
                self.proposalUnderReview = self.proposalsAsProperty[0];
                $rootScope.$broadcast('getProposalsByProperty');
            } else {
                dataError("AdminSharedSrvc-getProposalsByProperty()-1", result);
            }
        }, function(error) {
            dataError("AdminSharedSrvc-getProposalsByProperty()-2", result);
        });
    };

    // Queries the job_list table for open proposals
    self.getProposalsByJob = function() {
        DB.queryDB('views/admin/http/getJobsWithProposalStatus.php').then(function(result) {
            if (typeof result != "boolean") {
                proposalsAsJob = result;
            } else {
                dataError("AdminSharedSrvc-getProposalsByJob()-1", result);
            }
        }, function(error) {
            dataError("AdminSharedSrvc-getProposalsByJob()-2", "404");
        });
    };

    var dataError = function(msg, res) {
        console.log(msg);
        console.log(res);
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


    //Called on init
    var getMaterialsList = function() {
        var dataObj = {};
        DB.query("getMaterialsShingle", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
            } else {
                self.materialsList = resultObj.data;
                self.materialsList = underscore.sortBy(self.materialsList, 'Sort');
                removeCategoryHeaders();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };

    // Remove entries with "X" in the Checked field
    var removeCategoryHeaders = function() {
        for (var i = self.materialsList.length - 1; i >= 0; i--) {
            if (self.materialsList[i].Checked == "X") {
                self.materialsList.splice(i, 1);
            }
        }
    };

    var getSalesReps = function() {
        DB.query("getSalesReps", null).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
            } else {
                self.salesReps = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getSalesReps");
        });
    };


    self.saveJobConfig = function() {
        var dataObj = {};
        var dataStr = "";
        dataObj.jobID = self.proposalUnderReview.jobID;

        for (var i = 0; i < self.materialsCatergorized.Field.length; i++) {
            var a = self.materialsCatergorized.Field[i].Code;
            var b = self.materialsCatergorized.Field[i].Qty;
            var c = self.materialsCatergorized.Field[i].Default;
            var d = self.materialsCatergorized.Field[i].PkgPrice;
            dataStr += a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (var i = 0; i < self.materialsCatergorized.Ridge.length; i++) {
            var a = self.materialsCatergorized.Ridge[i].Code;
            var b = self.materialsCatergorized.Ridge[i].Qty;
            var c = self.materialsCatergorized.Ridge[i].Default;
            var d = self.materialsCatergorized.Ridge[i].PkgPrice;
            dataStr += a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Vents.length; i++) {
            var a = self.materialsCatergorized.Vents[i].Code;
            var b = self.materialsCatergorized.Vents[i].Qty;
            var c = self.materialsCatergorized.Vents[i].Default;
            var d = self.materialsCatergorized.Vents[i].PkgPrice;
            dataStr += a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Flashing.length; i++) {
            var a = self.materialsCatergorized.Flashing[i].Code;
            var b = self.materialsCatergorized.Flashing[i].Qty;
            var c = self.materialsCatergorized.Flashing[i].Default;
            var d = self.materialsCatergorized.Flashing[i].PkgPrice;
            dataStr += a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Flat.length; i++) {
            var a = self.materialsCatergorized.Flat[i].Code;
            var b = self.materialsCatergorized.Flat[i].Qty;
            var c = self.materialsCatergorized.Flat[i].Default;
            var d = self.materialsCatergorized.Flat[i].PkgPrice;
            dataStr += a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Caps.length; i++) {
            var a = self.materialsCatergorized.Caps[i].Code;
            var b = self.materialsCatergorized.Caps[i].Qty;
            var c = self.materialsCatergorized.Caps[i].Default;
            var d = self.materialsCatergorized.Caps[i].PkgPrice;
            dataStr += a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Other.length; i++) {
            var a = self.materialsCatergorized.Other[i].Code;
            var b = self.materialsCatergorized.Other[i].Qty;
            var c = self.materialsCatergorized.Other[i].Default;
            var d = self.materialsCatergorized.Other[i].PkgPrice;
            dataStr += a + ';' + b + ';' + c + ';' + d + '!';
        };
        dataObj.strData = dataStr;
        var query = DB.queryDBWithObj("views/admin/http/updateJobMaterial.php", dataObj).then(function(result) {
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

    getMaterialsList();
    getSalesReps();

    return self;
}]);