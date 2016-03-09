'use strict';
app.service('AdminSharedSrvc',['$rootScope','AdminDataSrvc','underscore',function adminShared($rootScope,AdminDataSrvc,underscore){

	var self = this;
	self.ME = "AdminSharedSrvc: ";
	var DB = AdminDataSrvc;
	
	var proposalsAsJob = [];
    self.salesReps=[];
	self.proposalsAsProperty = [];// propertyVO's related to jobs that are in Proposal State
	self.proposalUnderReview = {};
    self.materialPricing_dp = {Shingles:[],Vents:[],Edge:[],Caps:[],Flat:[],Other:[]};  // Data Provider for Pricing Tab

	self.selectProposal = function(ndx){
        var rtnRepName = "";
        if(ndx == -1){
           self.resetProposalData();
        }else{
            self.proposalUnderReview = self.proposalsAsProperty[ndx];
            // Get the Job ID
            for (var i = 0; i < proposalsAsJob.length; i++) {
                if (proposalsAsJob[i].property === self.proposalUnderReview.PRIMARY_ID){
                    self.proposalUnderReview.jobID = proposalsAsJob[i].PRIMARY_ID;
                }
            }
            rtnRepName = self.returnSalesRep(self.proposalUnderReview.manager);
            getJobParameters();
        }
        return rtnRepName;
	};

    self.resetProposalData = function(){
        $rootScope.$broadcast('onResetProposalData');
        self.proposalUnderReview = {};
    };

    // Data for the "Input" Tab on Proposal Review Page
    // Continues after success to calculate pricing and supplies
	var getJobParameters = function() {
        var jobData = DB.getJobParameters(self.proposalUnderReview.jobID).then(function(jobData) {
            if (jobData != false) { 
                formatParams(jobData[0]);
            } else {
               alert("FALSE returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
        });
    };

    // Called from getJobParameters() after successful result from DB
    // Format, set to var, and broadcast 
    var formatParams = function(dataObj){
        underscore.each(dataObj,function(value, key, obj){
            if(value == "" || value == null){
                obj[key] = "-";
            }
        });
        // Alias items
        // Add Ridges
        var top = parseInt(dataObj.TOPRDG);
        var rake = parseInt(dataObj.RKERDG);
        if(isNaN(top)){top = 0;};
        if(isNaN(rake)){rake = 0;};
        var rdg  = top + rake;
        dataObj.RIDGETOTAL = rdg;
        self.proposalUnderReview.propertyInputParams = dataObj;
        $rootScope.$broadcast('onRefreshParamsData', dataObj);

        formatMaterials();
    };

    var formatMaterials = function() {
       for (var i = 0; i < self.materialsList.length; i++) {
            var itemPrice = Number(self.materialsList[i].PkgPrice);
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

    var categorizeMaterials = function(){
        self.materialPricing_dp = {};
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
        }

        underscore.sortBy(shingles, 'Sort');
        underscore.sortBy(caps, 'Sort');
        underscore.sortBy(vents, 'Sort');
        underscore.sortBy(edge, 'Sort');
        underscore.sortBy(flat, 'Sort');
        underscore.sortBy(other, 'Sort');

        self.materialPricing_dp.Shingles = shingles;
        self.materialPricing_dp.Caps = caps;
        self.materialPricing_dp.Vents = vents;
        self.materialPricing_dp.Edge = edge;
        self.materialPricing_dp.Flat = flat;
        self.materialPricing_dp.Other = other;

        $rootScope.$broadcast('onRefreshPricingData',self.materialPricing_dp);
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

    

    getMaterialsList();
    getSalesReps();
	
	return self;
}]);