'use strict';
app.service('ShingleCalcs', ['$http','$q','ShingleSrvc','SharedSrvc', function ($http,$q,ShingleSrvc,SharedSrvc) {
    var self = this;
    var S = SharedSrvc;
    var SH = ShingleSrvc;
    self.ME = "ShingleCalcs: ";
    self.jobMaterials = [];
    self.TOTAL = "";
    self.roofElements = [{
            Code: "SHFI",
            Qty: 0,
            Materials: ["A1", "G1", "H1", "K1", "Q1"]
        }, //Field
        {
            Code: "SHTR",
            Qty: 0,
            Materials: ["C1", "E1", "W1"]
        }, //Top Ridge
        {
            Code: "SHRR",
            Qty: 0,
            Materials: ["D1", "E1"]
        }, //Ridge Rake
        {
            Code: "SHPR",
            Qty: 0,
            Materials: ["F1", "M1", "N1"]
        }, //Perimeter
        {
            Code: "SHLS",
            Qty: 0,
            Materials: ["J1", "L1"]
        }, // Low Slope
        {
            Code: "SHVA",
            Qty: 0,
            Materials: ["P1", "R1"]
        }, //Valley
        {
            Code: "SHL1",
            Qty: 0,
            Materials: ["T1"]
        }, //Lead 1.5
        {
            Code: "SHL2",
            Qty: 0,
            Materials: ["U1"]
        }, //Lead 2
        {
            Code: "SHL3",
            Qty: 0,
            Materials: ["G2"]
        }, //Lead 3
        {
            Code: "SHL4",
            Qty: 0,
            Materials: ["V1"]
        }, //Lead 4
        {
            Code: "SHV8",
            Qty: 0,
            Materials: ["S1"]
        }, //8"Vents
        {
            Code: "SH8X",
            Qty: 0,
            Materials: ["O1"]
        }, //8x8
        {
            Code: "SHTU",
            Qty: 0,
            Materials: ["Z1"]
        }, //Turbines
        {
            Code: "SHPV",
            Qty: 0,
            Materials: ["X1"]
        }, //P Vents
        {
            Code: "SHAH",
            Qty: 0,
            Materials: ["Y1"]
        }, //Air Hawks
        {
            Code: "SHDK",
            Qty: 0,
            Materials: ["A2", "B2"]
        }, //Decking
        {
            Code: "SHPT",
            Qty: 0,
            Materials: ["F2"]
        }, //Paint
        {
            Code: "SHCK",
            Qty: 0,
            Materials: ["C2"]
        }, //Caulk
        {
            Code: "SHCP",
            Qty: 0,
            Materials: []
        }, //Carport
        {
            Code: "SHDL",
            Qty: 0,
            Materials: ["E2"]
        }, //Delivery
        {
            Code: "SHSA",
            Qty: 0,
            Materials: ["D2", ""]
        }, //Satellite
        {
            Code: "SH",
            Qty: 0,
            Materials: ["", ""]
        }
    ];
    self.updatePrices = function(jobInput) {
            /*for (var x = 0; x < jobInput.length; x++) {
                var inputCode = jobInput[x].item_code;
                for (var i = 0; i < self.roofElements.length; i++) {
                    if (self.roofElements[i].Code = inputCode) {
                        self.roofElements[i].Qty = roofElementsInput[x].qty;
                        var M = self.roofElements[i].Materials;
                        for (var y = 0; y < M.length; y++) {
                            var Mcode = M[y];
                            for (var z = 0; z < self.MATERIALS.length; z++) {
                                if (self.MATERIALS[z].Code == Mcode) {
                                    var Amt = Math.ceil(self.roofElements[i].Qty / self.MATERIALS[z].Usage);
                                    var Total = Math.round(Amt * self.MATERIALS[z].Price * 100) / 100;
                                }
                            };
                        };
                    };
                };
            };*/
        }

        // Gets the "inv_shingle" DB table 
    var getInventory = function() {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: 'views/jobs/proposals/http/getShingleMaterials.php'
        }).
        success(function(data, status) {
            console.log(data);
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
        for (var i = 0; i < self.roofElements.length; i++) {
            self.roofElements[i].Qty = 0;
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