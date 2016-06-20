'use strict';
app.service('AdminProposalSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function ProposalService($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    var me = "AdminProposalSrvc: ";
    var DB = AdminDataSrvc;
    var L = ListSrvc;
    self.CONFIG = JobConfigSrvc;
    var currentJobId = 0;

    self.profitMargin = 30;
    self.CostSummary = {Lbr:0,Base:0,Upgrade:0,Fx:0,MuB:0,MuU:0};

    var LOG = true;
    var trace = function(message){
        if(LOG){
            console.log(message);
        }
    };

    self.setJobId = function(id){
        currentJobId = id;
    };



    self.updateConfigContract = function(dataObj) {
        trace(me + "updateConfigContract()");
        DB.query("updateConfigContract", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("updateConfig ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('updateConfigContract');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> updateConfig_upgradesSelected");
        });
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

    self.clone = function(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = self.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = self.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    
    return self;
}]);
