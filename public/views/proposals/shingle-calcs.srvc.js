'use strict';
app.service('ShingleCalcs', ['$http','$q','ShingleSrvc','SharedSrvc', function ($http,$q,ShingleSrvc,SharedSrvc) {
    var self = this;
    var S = SharedSrvc;
    var SH = ShingleSrvc;
    self.ME = "ShingleCalcs: ";
    var Options = {TOPRDG:"",RKERDG:"",SHNGLS:"",NAILS:"",EDGTRM:"",VALLEY:"",DECKNG:"",};
   
    var jobInput = [];
    self.jobMaterials = [];
    self.runningTotal = 0;

    
    var zeroOutLists = function(){
    	for (var i = 0; i < self.jobMaterials.length; i++) {
    		self.jobMaterials[i].Total = 0;
    		self.jobMaterials[i].Amt = 0;
    	};

    	for (i = 0; i < self.jobParameters.length; i++) {
    		self.jobParameters[i].Qty = 0;
    	};
    };

    var updateJobInput = function(){
    	for (var x = 0; x < jobInput.length; x++) {
            var inputCode = jobInput[x].Code;
            for (var i = 0; i < self.jobParameters.length; i++) {
                if (self.jobParameters[i].Code == inputCode) {
                    self.jobParameters[i].Qty = jobInput[x].Qty;
                    continue;
                }
            }
        };
    };
    // jobParameters: the items listed on view... Field, Top Ridge, Valey etc...
    var calculateCosts  = function(){
    	self.runningTotal = 0;
    	 for (var i = 0; i < self.jobParameters.length; i++) {
        	if(self.jobParameters[i].Qty != 0){ // User has entered a value
        		var Q = self.jobParameters[i].Qty;
        		var M = self.jobParameters[i].Materials; // List of materials affected by this item
        		for (var x = 0; x < M.length; x++) {
		            var Mcode = M[x];
		            for (var z = 0; z < self.jobMaterials.length; z++) {
		                if (self.jobMaterials[z].Code == Mcode) { // When match is found, 
		                    var Amt = Math.ceil( Q / self.jobMaterials[z].Usage); // 
		                    var Total = Math.round(Amt * self.jobMaterials[z].Price * 100) / 100;
		                   	self.jobMaterials[z].Amt += Amt;
		                    self.jobMaterials[z].Total += Total;
		                    self.runningTotal+=Total;
		                }
		            };
		        };
        	}
        }
    };

    self.calculateRidge = function(){
        if(Options.topRidge == "E1"){

        }
        

    }


    self.updatePrices = function(jI) {
    	jobInput = jI;
    	zeroOutLists();
        updateJobInput();
        // Calculate each item


        calculateCosts();
        return self.jobMaterials;
    };

  
    self.resetService = function() {
        for (var i = 0; i < self.jobParameters.length; i++) {
            self.jobParameters[i].Qty = 0;
        };
    };
    var initService = function() {
        var invt = getInventory().then(function(result) {
            if (result != false) { // false just means there were no records found
                self.jobMaterials = result;
            } else {}
        }, function(error) {});
    }

    

    initService();
    return self;
}]);