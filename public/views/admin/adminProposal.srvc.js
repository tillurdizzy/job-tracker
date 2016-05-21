'use strict';
app.service('AdminProposalSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function adminShared($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    self.ME = "AdminProposalSrvc: ";

    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;
    var currentJobId = 0;

    self.profitMargin = 10;
    self.CostSummary = {labor:0,materials:0,supplies:0};

    self.setJobId = function(id){
        currentJobId = id;
    };

    self.setSummaryItem = function(item,cost){
    	switch(item){
    		case "labor":self.CostSummary.labor = cost;break;
    		case "materials":
    			self.CostSummary.materials = cost;
    			self.CostSummary.supplies = cost;
    			break;
    		case "supplies":self.CostSummary.supplies = cost;break;
    	}
    	// temporary -- set supplies same as materials
    };
    
    var saveConfigMargin = function() {
        DB.query("updateConfigMargin").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getLabor ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('onSaveMarginConfig');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getLabor");
        });
    };
   
    return self;
}]);
