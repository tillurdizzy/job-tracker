'use strict';
app.service('AdminProposalSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function adminShared($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    self.ME = "AdminProposalSrvc: ";

    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;

    self.CostSummary = {labor:0,materials:0,supplies:0};

    // self.materialsList sorted into categories
    // Consumed by view controller as data provider for Pricing Tab
    self.materialsCatergorized = { Field: [], Ridge: [], Vents: [], Flashing: [], Caps: [], Flat: [], Other: [] };

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
   
    return self;
}]);
