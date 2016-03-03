'use strict';
app.service('AdminSharedSrvc',['$rootScope','AdminDataSrvc',function adminShared($rootScope,AdminDataSrvc){

	var self = this;
	self.ME = "AdminSharedSrvc: ";
	var DB = AdminDataSrvc;
	
	var jobsList = [];
	self.openProposals = [];// propertyVO's related to jobs that are in Proposal State
	self.proposalUnderReview = {};

	self.selectProposal = function(ndx){
		self.proposalUnderReview = self.openProposals[ndx];
		// get the Job ID
		for (var i = 0; i < jobsList.length; i++) {
			if (jobsList[i].property === self.proposalUnderReview.PRIMARY_ID){
				self.proposalUnderReview.jobID = jobsList[i].PRIMARY_ID;
			}
		}
		 getTabsData();
	};

	// We have three Tabs in UI... get data for all 3 even though user is only viewing one of them at a time
	var getTabsData = function(){
		getJobParameters();
	}

	var getJobParameters = function() {
        var jobData = DB.getJobParameters(self.proposalUnderReview.jobID).then(function(jobData) {
            if (jobData != false) { 
                setParams(jobData[0]);
            } else {
               
            }
        }, function(error) {

        });
    };

    var setParams = function(dataObj){
        self.proposalUnderReview.propertyInputParams = dataObj;
        $rootScope.$broadcast('onRefreshParamsData', dataObj);
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

	
    

	
	return self;
}]);