'use strict';
app.service('AdminProposalSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function adminShared($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    self.ME = "AdminProposalSrvc: ";

    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;

    self.profitMargin = 10;
    self.CostSummary = {labor:0,materials:0,supplies:0};

    // self.materialsList sorted into categories
    // Consumed by view controller as data provider for Pricing Tab
    //self.materialsCatergorized = { Field: [], Ridge: [], Vents: [], Flashing: [], Caps: [], Flat: [], Other: [] };

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

    var getDefaultLabor = function() {
        DB.query("getLabor").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getLabor ---- " + resultObj.data);
            } else {
                self.laborDefault = resultObj.data[0];
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getLabor");
        });
    };

    var getConfigMargin = function() {
        DB.query("getConfigMargin").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getLabor ---- " + resultObj.data);
            } else {
                self.profitMargin = parseInt(resultObj.data[0].margin);
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getLabor");
        });
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

    var init = function(){
        getConfigMargin();
    };

    init();
   
    return self;
}]);
