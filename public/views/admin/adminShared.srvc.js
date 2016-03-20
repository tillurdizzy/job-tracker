'use strict';
app.service('AdminSharedSrvc', ['$rootScope', 'AdminDataSrvc', 'underscore', function adminShared($rootScope, AdminDataSrvc, underscore) {

    var self = this;
    self.ME = "AdminSharedSrvc: ";
    var DB = AdminDataSrvc;

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
    // Then Merged with self.materialsJob for custom selections and pricing
    // Totals calculated
    self.materialsList = [];

    // Selections and pricing specific to a job
    self.materialsJob = [];

    // Temporary (short-term ) vars
    var proposalDataFlag = {};
    proposalDataFlag.params = false;
    proposalDataFlag.materials = false;
    var jobParams = {};

    // self.materialsList sorted into categories
    // Consumed by view controller as data provider for Pricing Tab
    self.materialsCatergorized = { Field:[],Ridge:[],Vents: [], Flashing:[],Caps: [], Flat: [], Other: [] };

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
            proposalDataFlag.params = false;
            proposalDataFlag.materials = false;
            // Call queries
            getJobParameters();
            getJobMaterials();
        }
        return rtnRepName;
    };

    self.resetProposalData = function() {
        $rootScope.$broadcast('onResetProposalData');
        self.proposalUnderReview = {};
    };

    // Data for the "Input" Tab on Proposal Review Page
    // Job Parameters AND Job Materials must BOTH be updated after selecting a proposal before we can
    // call formatParams()
    // We'll use a flag to make sure both are updated...
    var getJobParameters = function() {
        DB.getJobParameters(self.proposalUnderReview.jobID).then(function(jobData) {
            if (jobData != false) {
                proposalDataFlag.params = true;
                jobParams = jobData[0];
                validateData();
            } else {
                alert("FALSE returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
        });
    };


    // !!!!!!!!!!!!!!!!!!!!! Move these functions concerning specific job to ClientSelectionsService!!!!!!!!!!!!!!!!!!
    var getJobMaterials = function() {
        var dataObj = { jobID: self.proposalUnderReview.jobID };
        DB.getJobMaterials(dataObj).then(function(result) {
            if (result === false) {
                alert("FALSE returned for DB.getJobMaterials() at AdminSharedSrvc >>> getJobMaterials()");
            } else {
                proposalDataFlag.materials = true;
                var resultObj = result;
                parseMaterialsResult(resultObj);
                validateData();
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobMaterials() at AdminSharedSrvc >>> getJobMaterials()");
        });
    };

    var parseMaterialsResult =  function(ar){
        self.materialsJob = [];
        if(ar.length > 0){
            var strData = ar[0].strData;
            if(strData != ""){
                var rootArr = strData.split('!');
                for (var i = 0; i < rootArr.length; i++) {
                   var thisArr = rootArr[i].split(';');
                   var materialObj = {};
                   materialObj.Code = thisArr[0];
                   materialObj.Qty = thisArr[1];
                   materialObj.Checked = thisArr[2];
                   materialObj.Price = thisArr[3];
                   self.materialsJob.push(materialObj);
                }
            } 
        } 
    };

    // Checks to make sure both params and materials are up to date from DB before calling formatParams();
    var validateData = function() {
        if (proposalDataFlag.params == true && proposalDataFlag.materials == true) {
            formatParams();
        }
    };

    // Called from getJobParameters() >> validateData() after successful result from DB
    // Format, set to var, and broadcast 
    var formatParams = function() {
        // If the field is empty, set a dash "-" for display purposes
        underscore.each(jobParams, function(value, key, obj) {
            if (value == "" || value == null) {
                obj[key] = "-";
            }
        });
        // Alias items
        // Add Ridges
        var top = parseInt(jobParams.TOPRDG);
        var rake = parseInt(jobParams.RKERDG);
        if (isNaN(top)) { top = 0; };
        if (isNaN(rake)) { rake = 0; };
        var rdg = top + rake;
        jobParams.RIDGETOTAL = rdg;
        self.proposalUnderReview.propertyInputParams = jobParams;
        $rootScope.$broadcast('onRefreshParamsData', jobParams);

        formatMaterials();
    };

    var formatMaterials = function() {
        for (var i = 0; i < self.materialsList.length; i++) {

            var paramKey = self.materialsList[i].InputParam;
            var customObj = returnCustomMaterial(self.materialsList[i].Code);

            // If the client has a 'Saved' obj for this material, use that Price and Qty, otherwise use current pricing
            if (customObj != null && customObj.Checked != undefined) {
                var itemPrice = Number(customObj.Price);
                var parameterVal = Number(customObj.Qty);
                var checked = customObj.Checked;
            } else {
                itemPrice = Number(self.materialsList[i].PkgPrice);
                parameterVal = Number(self.proposalUnderReview.propertyInputParams[paramKey]);
                checked = self.materialsList[i].Checked;
            }

            var usage = Number(self.materialsList[i].QtyPkg);
            var over = Number(self.materialsList[i].Margin);
            var roundUp = Number(self.materialsList[i].RoundUp);

            var isNum = isNaN(parameterVal);
            var total = 0;
            if (isNum) {
                parameterVal = 0;
                total = 0;
            } else {
                total = (((parameterVal / usage) * itemPrice * over) * roundUp) / roundUp;
            }

            self.materialsList[i].Qty = parameterVal;
            self.materialsList[i].Total = total;

            
            if (checked === "true" || checked === true || checked === 1) {
                self.materialsList[i].Checked = true;
            } else {
                self.materialsList[i].Checked = false;
            }
        }
        categorizeMaterials();
    };

    // If a Proposal has been Saved from the Proposal Review Pricing page, then it will have custom config (rather than default) pricing and qty.
    // The formatMaterials() function will call this function for each item to see if there is a saved value
    // If there is NOT a custom saved config, self.materialsJob will be an empty array
    var returnCustomMaterial = function(code) {
        var rtnObj = null;

        for (var i = 0; i < self.materialsJob.length; i++) {
            if (self.materialsJob[i].Code === code) {
               rtnObj = self.materialsJob[i];
               break;
            };
        };
        return rtnObj;
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
            } else if (cat == "Flashing") {
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

    //Queries the job_list table for open proposals
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

    // Remove elements with "X" in the Default field
    var parseMaterialList = function() {
        for (var i = self.materialsList.length - 1; i >= 0; i--) {
            if (self.materialsList[i].Default == "X") {
                self.materialsList.splice(i, 1);
            }
        }
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

    var getMaterialsList = function() {
        var query = DB.queryDB("views/admin/http/getMaterialsShingle.php").then(function(result) {
            if (result != false) {
                self.materialsList = result;
                self.materialsList = underscore.sortBy(self.materialsList, 'Sort');
                parseMaterialList();
            } else {
                alert("FALSE returned from DB at AdminSharedSrvc >>> getMaterialsList()");
            }
        }, function(error) {
            alert("ERROR returned returned from DB at AdminSharedSrvc >>> getMaterialsList()");
        });
    };

    var getSalesReps = function() {
        var query = DB.queryDB("views/admin/http/getSalesReps.php").then(function(result) {
            if (result != false) {
                self.salesReps = result;
            } else {
                alert("FALSE returned from DB at AdminSharedSrvc >>> getSalesReps()");
            }
        }, function(error) {
            alert("ERROR returned returned from DB at AdminSharedSrvc >>> getSalesReps()");
        });
    };

    self.saveJobMaterials = function() {
        var dataObj =  {};
        var dataStr = "";
        dataObj.jobID = self.proposalUnderReview.jobID;

        for (var i = 0; i < self.materialsCatergorized.Shingles.length; i++) {
            var a=self.materialsCatergorized.Shingles[i].Code;
            var b=self.materialsCatergorized.Shingles[i].Qty;
            var c=self.materialsCatergorized.Shingles[i].Default;
            var d=self.materialsCatergorized.Shingles[i].PkgPrice;
            dataStr+=a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Vents.length; i++) {
            var a=self.materialsCatergorized.Vents[i].Code;
            var b=self.materialsCatergorized.Vents[i].Qty;
            var c=self.materialsCatergorized.Vents[i].Default;
            var d=self.materialsCatergorized.Vents[i].PkgPrice;
            dataStr+=a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Edge.length; i++) {
            var a=self.materialsCatergorized.Edge[i].Code;
            var b=self.materialsCatergorized.Edge[i].Qty;
            var c=self.materialsCatergorized.Edge[i].Default;
            var d=self.materialsCatergorized.Edge[i].PkgPrice;
            dataStr+=a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Flat.length; i++) {
            var a=self.materialsCatergorized.Flat[i].Code;
            var b=self.materialsCatergorized.Flat[i].Qty;
            var c=self.materialsCatergorized.Flat[i].Default;
            var d=self.materialsCatergorized.Flat[i].PkgPrice;
            dataStr+=a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Caps.length; i++) {
            var a=self.materialsCatergorized.Caps[i].Code;
            var b=self.materialsCatergorized.Caps[i].Qty;
            var c=self.materialsCatergorized.Caps[i].Default;
            var d=self.materialsCatergorized.Caps[i].PkgPrice;
            dataStr+=a + ';' + b + ';' + c + ';' + d + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Other.length; i++) {
            var a=self.materialsCatergorized.Other[i].Code;
            var b=self.materialsCatergorized.Other[i].Qty;
            var c=self.materialsCatergorized.Other[i].Default;
            var d=self.materialsCatergorized.Other[i].PkgPrice;
            dataStr+=a + ';' + b + ';' + c + ';' + d + '!';
        };
        dataObj.strData = dataStr;
        var query = DB.queryDBWithObj("views/admin/http/updateJobMaterial.php",dataObj).then(function(result) {
            if (result != false) {
                return true;
            } else {
                alert("FALSE returned from DB at AdminSharedSrvc >>> getMaterialsList()");
                return false;
            }
        }, function(error) {
            alert("ERROR returned returned from DB at AdminSharedSrvc >>> getMaterialsList()");
        });
    }

    getMaterialsList();
    getSalesReps();

    return self;
}]);
