'use strict';
app.service('AdminProposalSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function ProposalService($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    self.ME = "AdminProposalSrvc: ";

    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;
    var currentJobId = 0;

    self.profitMargin = 30;
    self.CostSummary = {labor:0,materialsTotal:0,materialsFixed:0};

    self.setJobId = function(id){
        currentJobId = id;
    };

    self.setSummaryItem = function(item,cost){
    	switch(item){
    		case "labor":self.CostSummary.labor = cost;break;
            case "materials-fixed":self.CostSummary.materialsFixed = cost;break;
    		case "materials-total":self.CostSummary.materialsTotal = cost;break;
    	}
    };
    
    var saveConfigMargin = function() {
        DB.query("updateConfigMargin").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("updateConfigMargin ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('onSaveMarginConfig');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getLabor");
        });
    };
   
    return self;
}]);
