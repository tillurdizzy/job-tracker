'use strict';
app.service('AdminSharedSrvc',['$rootScope','AdminDataSrvc','underscore',function adminShared($rootScope,AdminDataSrvc,underscore){

	var self = this;
	self.ME = "AdminSharedSrvc: ";
	var DB = AdminDataSrvc;
	
	var jobsList = [];
	self.openProposals = [];// propertyVO's related to jobs that are in Proposal State
	self.proposalUnderReview = {};
    self.materialPricing_dp = {Shingles:[],Vents:[],Edge:[],Caps:[],Flat:[],Other:[]};  // Data Provider for Pricing Tab

	self.selectProposal = function(ndx){
        if(ndx == -1){
            $rootScope.$broadcast('onResetProposalData');
            self.proposalUnderReview = {};
        }else{
            self.proposalUnderReview = self.openProposals[ndx];
            // get the Job ID
            for (var i = 0; i < jobsList.length; i++) {
                if (jobsList[i].property === self.proposalUnderReview.PRIMARY_ID){
                    self.proposalUnderReview.jobID = jobsList[i].PRIMARY_ID;
                }
            }
            getJobParameters();
        }
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
            var itemPrice = parseInt(self.materialsList[i].ItemPrice);
            var usage = parseInt(self.materialsList[i].Usage);
            var over = parseInt(self.materialsList[i].Overage);
            var paramKey = self.materialsList[i].InputParam;
            var parameterVal = parseInt(self.proposalUnderReview.propertyInputParams[paramKey]);
            var total = (itemPrice * parameterVal / usage) * over;

            self.materialsList[i].Qty = parameterVal;
            self.materialsList[i].Total = total;

            var checked = self.materialsList[i].Default;
            if(checked === "true"){
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


	//Queries the properties table based on open proposals
	self.getPropertiesWithProposalJobStatus = function(){
		DB.queryDB('views/admin/http/getJobProposals.php').then(function(result){
            if(typeof result != "boolean"){
             	self.openProposals = result;
             	self.proposalUnderReview = self.openProposals[0];
             	$rootScope.$broadcast('onGetPropertiesWithProposalJobStatus');
            }else{
              dataError("AdminSharedSrvc-getPropertiesWithProposalJobStatus()-1",result); 
            }
        },function(error){
            dataError("AdminSharedSrvc-getPropertiesWithProposalJobStatus()-2",result);
        });
	};

    //Queries the job_list table for open proposals
	self.getJobsWithOpenProposals = function(){
    	DB.queryDB('views/admin/http/getJobsWithProposalStatus.php').then(function(result){
            if(typeof result != "boolean"){
             	jobsList = result;
            }else{
              dataError("AdminSharedSrvc-getJobsWithOpenProposals()-1",result); 
            }
        },function(error){
            dataError("AdminSharedSrvc-getJobsWithOpenProposals()-2","404");
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

    getMaterialsList();
	
	return self;
}]);