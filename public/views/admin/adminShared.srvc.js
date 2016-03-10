'use strict';
app.service('AdminSharedSrvc',['$rootScope','AdminDataSrvc','underscore',function adminShared($rootScope,AdminDataSrvc,underscore){

	var self = this;
	self.ME = "AdminSharedSrvc: ";
	var DB = AdminDataSrvc;

	//jobVO's related to jobs that are in Proposal State
	var proposalsAsJob = [];

    // List of all Sales Reps
    self.salesReps=[];

    // propertyVO's related to jobs that are in Proposal State
    // DataProvider for DropDownList on Proposal Review Page
	self.proposalsAsProperty = [];

    // Selected item from above - i.e. one of the objects in the self.proposalsAsProperty list
    // Params are added during formatParams()
	self.proposalUnderReview = {};

    // As received from DB - default selections amd current pricing
    self.materialsList = [];

    // Selections and pricing specific to a job
    self.materialsJob = [];


    // Temporary (short-term ) vars
    var proposalDataFlag = {};
    proposalDataFlag.params = false;
    proposalDataFlag.materials = false;
    var jobParams = {};

    // self.materialsList reformatted into categories
    // Merged with self.materialsJob for selections and pricing
    // Totals calculated
    // Consumed by view controller as data provider for Pricing Tab
    self.materialsCatergorized = {Shingles:[],Vents:[],Edge:[],Caps:[],Flat:[],Other:[]};  

    // 
	self.selectProposal = function(ndx){
        var rtnRepName = "";
        if(ndx == -1){
           self.resetProposalData(); // Clear vars
        }else{
            self.proposalUnderReview = self.proposalsAsProperty[ndx];
            // Get the Job ID
            for (var i = 0; i < proposalsAsJob.length; i++) {
                if (proposalsAsJob[i].property === self.proposalUnderReview.PRIMARY_ID){
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

    self.resetProposalData = function(){
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
                jobParams=jobData[0];
                validateData();
            } else {
               alert("FALSE returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
        });
    };

    var getJobMaterials = function() {
        var dataObj = {jobID:self.proposalUnderReview.jobID};
        DB.queryDBWithObj('views/admin/http/getJobMaterials.php',dataObj).then(function(result) {
            if (result === false) { 
                 alert("FALSE returned for DB.getJobMaterials() at AdminSharedSrvc >>> getJobMaterials()");
            } else {
                proposalDataFlag.materials = true;
                self.materialsJob = result;
                validateData();
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobMaterials() at AdminSharedSrvc >>> getJobMaterials()");
        });
    };

    // Checks to make sure both params and materials are up to date from DB before processing
    var validateData = function(){
        if(proposalDataFlag.params==true && proposalDataFlag.materials==true){
            formatParams();
        }
    };

    // Called from getJobParameters() >> validateData() after successful result from DB
    // Format, set to var, and broadcast 
    var formatParams = function(){
        // If the field is empty, set a dash "-" for display purposes
        underscore.each(jobParams,function(value, key, obj){
            if(value == "" || value == null){
                obj[key] = "-";
            }
        });
        // Alias items
        // Add Ridges
        var top = parseInt(jobParams.TOPRDG);
        var rake = parseInt(jobParams.RKERDG);
        if(isNaN(top)){top = 0;};
        if(isNaN(rake)){rake = 0;};
        var rdg  = top + rake;
        jobParams.RIDGETOTAL = rdg;
        self.proposalUnderReview.propertyInputParams = jobParams;
        $rootScope.$broadcast('onRefreshParamsData', jobParams);

        formatMaterials();
    };

    var formatMaterials = function() {
       for (var i = 0; i < self.materialsList.length; i++) {
            var customObj = returnCustomMaterial(self.materialsList[i].Code);
            
            if(customObj.flag===true){
                var itemPrice = Number(customObj.price);
            }else{
                itemPrice = Number(self.materialsList[i].PkgPrice);
            }
            
            var usage = Number(self.materialsList[i].QtyPkg);
            var over = Number(self.materialsList[i].Margin);
            var roundUp = Number(self.materialsList[i].RoundUp);
            var paramKey = self.materialsList[i].InputParam;
            var parameterVal = Number(self.proposalUnderReview.propertyInputParams[paramKey]);
            var isNum = isNaN(parameterVal);
            var total = 0;
            if(isNum){
                parameterVal = 0;
                total = 0;
            }else{
                 total = (((parameterVal / usage) * itemPrice * over) * roundUp)/roundUp;
            }
           
            self.materialsList[i].Qty = parameterVal;
            self.materialsList[i].Total = total;

            var checked = self.materialsList[i].Default;
            if(checked === "true" || checked === true || checked === 1){
                self.materialsList[i].Default = true;
            }else{
                 self.materialsList[i].Default = false;
            }
        }
        categorizeMaterials();
    };

    // If a Proposal has been Saved from the Proposal Review Pricing page, then it will have custom (rather than default) pricing and qty.
    // The formatMaterials() function will call this function for each item to see if there is a saved value
    var returnCustomMaterial = function(code){
        var rtnObj = {flag:false,qty:"",price:""}
        for (var i = 0; i < self.materialsJob.length; i++) {
            if(self.materialsJob[i].materialCode === code){
                rtnObj.flag = true;
                rtnObj.qty = self.materialsJob[i].qty;
                rtnObj.price = self.materialsJob[i].price;
                continue;
            }
        }
        return rtnObj;
    };

    var categorizeMaterials = function(){
        self.materialsCatergorized = {};
        var shingles = [];
        var caps = [];
        var vents = [];
        var edge = [];
        var flat = [];
        var other = [];
        for (var i = 0; i < self.materialsList.length; i++) {
            var sortNum = parseInt(self.materialsList[i].Sort);
            if(sortNum > 100 && sortNum < 200){
                shingles.push(self.materialsList[i]); 
            }else if(sortNum > 200 && sortNum < 300){
                caps.push(self.materialsList[i]); 
            }else if(sortNum > 300 && sortNum < 400){
                vents.push(self.materialsList[i]); 
            }else if(sortNum > 400 && sortNum < 500){
                edge.push(self.materialsList[i]); 
            }else if(sortNum > 600 && sortNum < 700){
                flat.push(self.materialsList[i]); 
            }else if(sortNum > 800 && sortNum < 900){
                other.push(self.materialsList[i]); 
            }
        };

        underscore.sortBy(shingles, 'Sort');
        underscore.sortBy(caps, 'Sort');
        underscore.sortBy(vents, 'Sort');
        underscore.sortBy(edge, 'Sort');
        underscore.sortBy(flat, 'Sort');
        underscore.sortBy(other, 'Sort');

        self.materialsCatergorized.Shingles = shingles;
        self.materialsCatergorized.Caps = caps;
        self.materialsCatergorized.Vents = vents;
        self.materialsCatergorized.Edge = edge;
        self.materialsCatergorized.Flat = flat;
        self.materialsCatergorized.Other = other;

        $rootScope.$broadcast('onRefreshMaterialsData',self.materialsCatergorized);
    };


	//Queries the properties table based on proposal status
	self.getProposalsByProperty = function(){
		DB.queryDB('views/admin/http/getJobProposals.php').then(function(result){
            if(typeof result != "boolean"){
             	self.proposalsAsProperty = result;
             	self.proposalUnderReview = self.proposalsAsProperty[0];
             	$rootScope.$broadcast('getProposalsByProperty');
            }else{
              dataError("AdminSharedSrvc-getProposalsByProperty()-1",result); 
            }
        },function(error){
            dataError("AdminSharedSrvc-getProposalsByProperty()-2",result);
        });
	};

    //Queries the job_list table for open proposals
	self.getProposalsByJob = function(){
    	DB.queryDB('views/admin/http/getJobsWithProposalStatus.php').then(function(result){
            if(typeof result != "boolean"){
             	proposalsAsJob = result;
            }else{
              dataError("AdminSharedSrvc-getProposalsByJob()-1",result); 
            }
        },function(error){
            dataError("AdminSharedSrvc-getProposalsByJob()-2","404");
        });
    };

    var dataError = function(msg,res){
    	console.log(msg);
    	console.log(res);
    };

    // Remove elements with "X" in the Default field
    var parseMaterialList = function(){
        for (var i = self.materialsList.length-1; i>= 0; i--) {
            if(self.materialsList[i].Default == "X"){
                self.materialsList.splice(i,1);
            }
        }
    };

    self.returnSalesRep = function(id){
        var rtn ="";
        for (var i = 0; i < self.salesReps.length; i++) {
            if(self.salesReps[i].PRIMARY_ID === id){
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

    self.saveJobMaterials = function(){
      for (var i = 0; i < self.materialsCatergorized.Shingles.length; i++) {
           include = self.materialsCatergorized.Shingles[i].Default;
           if(include){
                DB.putJobMaterial();
           }
        };

        for (var i = 0; i < self.materialsCatergorized.Vents.length; i++) {
           include = self.materialsCatergorized.Vents[i].Default;
           if(include){
                ME.VentsTotal+=parseInt(self.materialsCatergorized.Vents[i].Total)
           }
        };

        for (var i = 0; i < self.materialsCatergorized.Edge.length; i++) {
           include = self.materialsCatergorized.Edge[i].Default;
           if(include){
                ME.EdgeTotal+=parseInt(self.materialsCatergorized.Edge[i].Total)
           }
        };

        for (var i = 0; i < self.materialsCatergorized.Flat.length; i++) {
           include = self.materialsCatergorized.Flat[i].Default;
           if(include){
                ME.FlatTotal+=parseInt(self.materialsCatergorized.Flat[i].Total)
           }
        };

        for (var i = 0; i < self.materialsCatergorized.Caps.length; i++) {
           include = self.materialsCatergorized.Caps[i].Default;
           if(include){
                ME.CapsTotal+=parseInt(self.materialsCatergorized.Caps[i].Total)
           }
        };

        for (var i = 0; i < self.materialsCatergorized.Other.length; i++) {
           include = self.materialsCatergorized.Other[i].Default;
           if(include){
                ME.OtherTotal+=parseInt(self.materialsCatergorized.Other[i].Total)
           }
        };
    }

    getMaterialsList();
    getSalesReps();
	
	return self;
}]);