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

    // Materials reflects the default options
    // 
    self.jobParameters = [{
            Code: "FIELD",
            Qty: 0,
            Materials: ["A1"]
        }, //Field
        {
            Code: "TOPRDG",
            Qty: 0,
            Materials: ["E1"]
        }, //Top Ridge
        {
            Code: "RKERDG",
            Qty: 0,
            Materials: ["E1"]
        }, //Rake Ridge
        {
            Code: "PRMITR",
            Qty: 0,
            Materials: ["F1", "M1"]
        }, //Perimeter: Calculates drip edge
        {
            Code: "LOWSLP",
            Qty: 0,
            Materials: ["J1", "L1"]
        }, // Low Slope
        {
            Code: "VALLEY",
            Qty: 0,
            Materials: ["P1"]
        }, //Valley
        {
            Code: "LEDBF1",
            Qty: 0,
            Materials: ["T1"]
        }, //Lead 1.5
        {
            Code: "LEDBF2",
            Qty: 0,
            Materials: ["U1"]
        }, //Lead 2
        {
            Code: "LEDBF3",
            Qty: 0,
            Materials: ["G2"]
        }, //Lead 3
        {
            Code: "LEDBF4",
            Qty: 0,
            Materials: ["V1"]
        }, //Lead 4
        {
            Code: "JKVNT8",
            Qty: 0,
            Materials: ["S1"]
        }, //8"Vents
        {
            Code: "FLHSH8",
            Qty: 0,
            Materials: ["O1"]
        }, //8x8
        {
            Code: "TURBNS",
            Qty: 0,
            Materials: ["Z1"]
        }, //Turbines
        {
            Code: "PWRVNT",
            Qty: 0,
            Materials: ["X1"]
        }, //P Vents
        {
            Code: "AIRHWK",
            Qty: 0,
            Materials: ["Y1"]
        }, //Air Hawks
        {
            Code: "DECKNG",
            Qty: 0,
            Materials: ["A2"]
        }, //Decking
        {
            Code: "PAINT",
            Qty: 0,
            Materials: ["F2"]
        }, //Paint
        {
            Code: "CAULK",
            Qty: 0,
            Materials: ["C2"]
        }, //Caulk
        {
            Code: "CARPRT",
            Qty: 0,
            Materials: []
        }, //Carport
        
        {
            Code: "SATDSH",
            Qty: 0,
            Materials: ["D2", ""]
        } //Satellite Dish
        
    ];

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

        // Gets the "inv_shingle" DB table 
    var getInventory = function() {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: 'views/proposals/http/getShingleMaterials.php'
        }).
        success(function(data, status) {
            if (typeof data != 'string' && data.length > 0) {
                deferred.resolve(data);
            } else {
                deferred.resolve(false);
            }
        }).
        error(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
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