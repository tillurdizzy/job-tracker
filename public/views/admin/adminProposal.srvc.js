'use strict';
app.service('AdminProposalSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function ProposalService($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    var me = "AdminProposalSrvc: ";
    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;
    var currentJobId = 0;

    self.profitMargin = 30;
    self.CostSummary = {Lbr:0,Base:0,Upgrade:0,Fx:0,MuB:0,MuU:0};

    self.setJobId = function(id){
        currentJobId = id;
    };

    self.setSummaryItem = function(item,cost){
    	switch(item){
    		case "Lbr":self.CostSummary.Lbr = cost;break;
            case "Fx":self.CostSummary.Fx = cost;break;
    		case "Upgrade":self.CostSummary.Upgrade = cost;break;
            case "Base":self.CostSummary.Base = cost;break;
            case "MuB":self.CostSummary.MuB = cost;break;
            case "MuU":self.CostSummary.MuU = cost;break;
    	}
    };

    self.resetSummary = function(){
        self.CostSummary = {Lbr:0,Base:0,Sel:0,Fx:0,Mu:0};
    }
    
    return self;
}]);
