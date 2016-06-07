'use strict';
app.service('AdminProposalSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function ProposalService($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    var me = "AdminProposalSrvc: ";
    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;
    var currentJobId = 0;

    self.profitMargin = 30;
    self.CostSummary = {Lbr:0,Base:0,Sel:0,Fx:0,Mu:0};

    self.setJobId = function(id){
        currentJobId = id;
    };

    self.setSummaryItem = function(item,cost){
    	switch(item){
    		case "Lbr":self.CostSummary.Lbr = cost;break;
            case "Fx":self.CostSummary.Fx = cost;break;
    		case "Sel":self.CostSummary.Sel = cost;break;
            case "Base":self.CostSummary.Base = cost;break;
            case "Mu":self.CostSummary.Mu = cost;break;
    	}
    };
    
    /*var saveConfigMargin = function() {
        DB.query("updateConfigMargin").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log(me + "updateConfigMargin ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('onSaveMarginConfig');
            }
        }, function(error) {
            alert("Query Error - AdminProposalSrvc >> saveConfigMargin");
        });
    };*/
   
    return self;
}]);
