'use strict';
app.service('JobConfigSrvc', ['$rootScope', 'underscore', function jobConfigSrvc($rootScope, underscore) {

    var self = this;
    var me = "JobConfigSrvc: ";
    var LOG = true;

    var materialsConfigured = [];
    self.jobConfigStr = "";
    self.jobConfigArray = [];
    self.materialsList = [];
    self.defaultCheckedMaterials = [];

    self.configLabor = [];
    self.laborTotal = [];
    self.configContract = {};
    self.upgradeItemsBasePrice = {};
    self.costSummary = { Fx: 0, Base: 0, Sel: 0, Pm: 0, Mu: 0, muPercent: 0, clientBase: 0, clientTotal: 0 };
    self.configMargin = 0;
    self.profitMargin = 0;
    self.shingleColor = 0;

    var trace = function(message) {
        if (LOG) {
            console.log(message);
        }
    };

    var validateNumber = function(x) {
        var n = Number(x);
        if (isNaN(n)) {
            return 0;
        } else {
            return n;
        };
    };

    var decimalPrecisionTwo = function(data) {
        var num = Number(data);
        var result = Math.round(num * 100) / 100
        return result;
    };

    // Step 3 of events triggered by selection of a Proposal from Proposal Review
    // Converts the long string saved in DB into array of objects
    // Also called from ClientSharedSrvc during flow of events triggered by LogIn
    self.parseJobConfig = function(ar) {
        trace(me + "parseJobConfig");
        // 1. Materials config - referred to as jobConfig
        self.jobConfigArray = [];

        if (ar.length == 0) {
            return [];
        } else {
            var dataObj = ar[0];
        };

        self.jobConfigStr = dataObj.config;
        if (self.jobConfigStr != "") {
            var rootArr = self.jobConfigStr.split('!');
            for (var i = 0; i < rootArr.length; i++) {
                var thisArr = rootArr[i].split(';');
                var jobConfigObj = {};
                jobConfigObj.Code = thisArr[0];
                jobConfigObj.Qty = validateNumber(thisArr[1]);
                jobConfigObj.Checked = thisArr[2];
                jobConfigObj.Price = validateNumber(thisArr[3]);
                jobConfigObj.Category = thisArr[4];
                self.jobConfigArray.push(jobConfigObj);
            }
        } else {
            alert("Missing Config!");
        };

        // 2. Labor config
        self.configLabor = [];
        var laborStr = dataObj.labor;
        if (laborStr != "") {
            var laborArr = laborStr.split('!');
            for (var i = 0; i < laborArr.length; i++) {
                var thisItem = laborArr[i].split(';');
                var itemObj = {};
                itemObj.Labor = thisItem[0];
                itemObj.Qty = thisItem[1];
                itemObj.Cost = thisItem[2];
                if (thisItem[0] != "Total") {
                    self.configLabor.push(itemObj);
                } else {
                    self.laborTotal = Number(thisItem[2]);
                }
            }
        } else {
            alert("Missing Labor!");
        };
        // 3. Base Cost config
        self.upgradeItemsBasePrice = {};
        var upgradesBaseStr = dataObj.upgradesBase;
        if (upgradesBaseStr != "") {
            var upgradesBaseArr = upgradesBaseStr.split('!');
            for (var i = 0; i < upgradesBaseArr.length; i++) {
                var thisItem = upgradesBaseArr[i].split(';');
                self.upgradeItemsBasePrice[thisItem[0]] = validateNumber(thisItem[1]);
            }
        } else {
            alert("Missing upgradesBaseStr!");
        };

        // 4. Cost Summaries
        self.costSummary.Fx = validateNumber(dataObj.Fx);
        self.costSummary.Base = validateNumber(dataObj.Base);
        self.costSummary.Upgrade = validateNumber(dataObj.Upgrade);
        self.costSummary.Bc = validateNumber(dataObj.Bc);
        self.costSummary.MuB = validateNumber(dataObj.MuB);
        self.costSummary.Uc = validateNumber(dataObj.Uc);
        self.costSummary.MuU = validateNumber(dataObj.MuU);
        self.costSummary.muPercent = validateNumber(dataObj.muPercent);
        self.costSummary.clientBase = validateNumber(dataObj.clientBase);
        self.costSummary.clientTotal = validateNumber(dataObj.clientTotal);

        // 5. Markup
        var NUM = Number(dataObj.muPercent);
        if (isNaN(NUM)) {
            self.configMargin = .1;
        } else {
            self.configMargin = NUM / 100;
        };

        // 6. Profit margin dollar amount - Only for client App
        NUM = Number(dataObj.Base);
        if (isNaN(NUM)) {
            self.profitMargin = 0;
        } else {
            self.profitMargin = NUM;
        };

        // 7. Shingle Color
        self.shingleColor = dataObj.Clr;

        // 8. Contract config
        if (dataObj.contract != "") {
            try {
                self.configContract = JSON.parse(dataObj.contract);
            } catch (e) {
               self.configContract = {};
            } 
        }

        /* var contractStr = dataObj.contract;
         if (contractStr != "") {
             var contractArr = contractStr.split('!');
             for (var i = 0; i < contractArr.length; i++) {
                 thisItem = contractArr[i].split(';');
                 itemObj = {};
                 var key = thisItem[0];
                 itemObj[key] = convertToBoolean(thisItem[1]);
                 //itemObj.item = thisItem[0];
                 //itemObj.state = convertToBoolean(thisItem[1]);
                 self.configContract.push(itemObj);
             }
         };*/

        // Only the jobConfig is returned
        return self.jobConfigArray;
    };

    // Step 4 of events triggered by selection of a Proposal from Proposal Review
    // This takes the list of materials, and fills in the Qty and Price
    // !!IMPORTANT!! For a customObj, "checked" no longer means default... it may be what was chosen instead of the default.
    self.mergeJobConfig = function(materials, params, useConfig) {
        trace(me + "mergeJobConfig");
        for (var i = 0; i < materials.length; i++) {
            var thisItem = materials[i].Item;

            // Is the current paramKey one of the default items????  Compare to this list.
            // Checked by default only matters in certain categories because there are multiple choices
            // using the same Input parameter

            var thisCat = materials[i].Category;
            var paramKey = materials[i].InputParam;
            // Inclusion in either of these lists means "only check 1 item from this category even though other items may have quantity values (derived from params)"
            var defaultCheckCatList = ["Field", "Starter", "Edge", "Valley"];
            var defaultCheckParamList = ["LPIPE1", "LPIPE2", "LPIPE3", "LPIPE4"];
            var restrictChecksToDefaultOnly = false;
            // For categories
            for (var x = 0; x < defaultCheckParamList.length; x++) {
                if (paramKey == defaultCheckParamList[x]) {
                    restrictChecksToDefaultOnly = true;
                    break;
                }
            };
            // For params
            for (var x = 0; x < defaultCheckCatList.length; x++) {
                if (thisCat == defaultCheckCatList[x]) {
                    restrictChecksToDefaultOnly = true;
                    break;
                }
            };

            var isCheckedByDefault = convertToBoolean(materials[i].Checked);

            // If the client has a 'Saved' customObj for this material, use that Price and Qty, otherwise use current pricing
            // customObj will be null unless Admin has altered Design or Client has chosen upgrade
            var customObj = returnCustomMaterial(materials[i].Code);

            var checked = false;

            // CASE 1: Normal usage when merging a custom config with materials 
            if (customObj != null && customObj.Checked != undefined && useConfig === true) {
                // There is a config and useConfig === true
                // Get both the Qty and Price from config
                var itemPrice = Number(customObj.Price);
                var parameterVal = Number(customObj.Qty);
                checked = convertToBoolean(customObj.Checked);

                // CASE 2: Used by Client portal...useConfig is false...
            } else if (customObj != null && customObj.Checked != undefined && useConfig === false) {
                // There is a config and useConfig === false
                // This will retain the Checked items from database (i.e. Default) , but uses Price and Qty from Config
                // This is specifically to get the default selections but uses price from whenever it was saved
                itemPrice = Number(customObj.Price);
                parameterVal = Number(params[paramKey]);

                // If restrictChecksToDefaultOnly is true, then only Check the one with default... otherwise check everything that has a value > 0
                // Because... all the materials have the Qty for their PARAM... 
                // I.E this keeps ALL the different shingle types/models/variants from being selected...
                if (restrictChecksToDefaultOnly) {
                    if (isCheckedByDefault && parameterVal > 0) {
                        checked = true;
                    }
                } else {
                    if (parameterVal > 0) {
                        checked = true;
                    }
                };
                // CASE 3: There is no config... use the current values from database
            } else {
                itemPrice = Number(materials[i].PkgPrice);
                parameterVal = Number(params[paramKey]);

                // When there is no custom config saved, there will be material items that need to be "checked" on the display because they have a value in the params, 
                // but that are not "checked" by default.  This is where we "check" those items

                // However, there are also items where the param is applied, but that should NOT be checked, only the default one is checked

                // If restrictChecksToDefaultOnly is true, then only check the one(s) with default... otherwise check everything that has a value > 0
                if (restrictChecksToDefaultOnly) {
                    if (isCheckedByDefault && parameterVal > 0) {
                        checked = true;
                    }
                } else {
                    if (parameterVal > 0) {
                        checked = true;
                    }
                }
            };

            var qtyCoverage = Number(materials[i].QtyCoverage);
            var QtyPkg = Number(materials[i].QtyPkg);
            var Margin = Number(materials[i].Margin);
            var roundUp = Number(materials[i].RoundUp);

            var isNum = isNaN(parameterVal);
            var total = 0;
            // If the inputParam col from materials is blank OR this param has no number then Total is 0
            if (isNum) {
                parameterVal = 0;
                total = 0;
            } else {
                var numPkgs = (parameterVal / qtyCoverage) * QtyPkg;
                var withOverage = (numPkgs * Margin);
                var roundedUp = Math.ceil(withOverage);
                total = (roundedUp * itemPrice);
            };
            // materials list Qty and Total come in as null and are quantified here
            // PkgQty is a new value added into the list
            materials[i].Qty = parameterVal;
            materials[i].PkgPrice = itemPrice;
            materials[i].PkgQty = roundedUp;
            materials[i].Total = total;
            materials[i].Checked = checked;
        };

        return materials;
    };

    // This is called from AdminShared
    self.mergeLaborConfig = function(defaultLabor, params) {
        trace(me + "mergeLaborConfig");
        if (self.configLabor.length === 0) {
            // there is no custom labor config

            // Get total Sqs from input params
            var P = numberize(params);
            var linerFt = P.TOPRDG + P.RKERDG + P.EAVE;
            var linearToSqs = (linerFt / 35) / 3.3;
            var totalSquares = P.FIELD + linearToSqs;
            totalSquares = Math.ceil(totalSquares);
            var laborField = totalSquares * parseInt(defaultLabor.square);

            var includeRoofDeck = false;

            if (includeRoofDeck) {
                var laborDeck = totalSquares * parseInt(defaultLabor.deck);
            } else {
                var laborDeck = 0;
            };

            var itemObj = {};
            itemObj.Labor = "Field";
            itemObj.Qty = totalSquares;
            itemObj.Units = "Sqs";
            itemObj.Cost = defaultLabor.square;
            itemObj.Total = laborField;
            self.configLabor.push(itemObj);

            itemObj = {};
            itemObj.Labor = "Deck";
            itemObj.Qty = 0;
            itemObj.Units = "Sqs";
            itemObj.Cost = defaultLabor.deck;
            itemObj.Total = laborDeck;
            self.configLabor.push(itemObj);

            // Additional labor to install low slope underlayment
            itemObj = {};
            itemObj.Labor = "Low Slope";
            itemObj.Qty = 0;
            itemObj.Units = "Sqs";
            itemObj.Cost = defaultLabor.flat;
            itemObj.Total = 0;
            self.configLabor.push(itemObj);

            itemObj = {};
            itemObj.Labor = "Trim";
            itemObj.Qty = 0;
            itemObj.Units = "Feet";
            itemObj.Cost = defaultLabor.trim;
            itemObj.Total = 0;
            self.configLabor.push(itemObj);

            itemObj = {};
            itemObj.Labor = "Other";
            itemObj.Qty = 0;
            itemObj.Units = "Each";
            itemObj.Cost = defaultLabor.other;
            itemObj.Total = 0;
            self.configLabor.push(itemObj);

        } else { // saved config
            // Qty is saved with config but we still need to calculate total
            for (var i = 0; i < self.configLabor.length; i++) {
                if (self.configLabor[i].Labor == "Field") {
                    var x = parseInt(self.configLabor[i].Qty);
                    var y = parseInt(self.configLabor[i].Cost);
                    self.configLabor[i].Total = decimalPrecisionTwo(x * y);
                    self.configLabor[i].Units = "Sqs";
                } else if (self.configLabor[i].Labor == "Deck") {
                    x = parseInt(self.configLabor[i].Qty);
                    y = parseInt(self.configLabor[i].Cost);
                    self.configLabor[i].Total = decimalPrecisionTwo(x * y);
                    self.configLabor[i].Units = "Sqs";
                } else if (self.configLabor[i].Labor == "Low Slope") {
                    x = parseInt(self.configLabor[i].Qty);
                    y = parseInt(self.configLabor[i].Cost);
                    self.configLabor[i].Total = decimalPrecisionTwo(x * y);
                    self.configLabor[i].Units = "Sqs";
                }else if (self.configLabor[i].Labor == "Trim") {
                    x = parseInt(self.configLabor[i].Qty);
                    y = parseInt(self.configLabor[i].Cost);
                    self.configLabor[i].Total = decimalPrecisionTwo(x * y);
                    self.configLabor[i].Units = "Feet";
                }else if (self.configLabor[i].Labor == "Other") {
                    x = parseInt(self.configLabor[i].Qty);
                    y = parseInt(self.configLabor[i].Cost);
                    self.configLabor[i].Total = decimalPrecisionTwo(x * y);
                    self.configLabor[i].Units = "Each";
                }
            }
        };

        return self.configLabor;
    };


    // Called from Client... no need to merge etc.  Everything needed by this time should be saved in config
    self.returnLaborGrandTotal = function() {
        trace(me + "returnLaborGrandTotal");
        var gTotal = 0;
        for (var i = 0; i < self.configLabor.length; i++) {
            if (self.configLabor[i].Labor == "Field") {
                var x = parseInt(self.configLabor[i].Qty);
                var y = parseInt(self.configLabor[i].Cost);
                self.configLabor[i].Total = x * y;
                self.configLabor[i].Units = "Sqs";
                gTotal += self.configLabor[i].Total;
            } else if (self.configLabor[i].Labor == "Deck") {
                x = parseInt(self.configLabor[i].Qty);
                y = parseInt(self.configLabor[i].Cost);
                self.configLabor[i].Total = x * y;
                self.configLabor[i].Units = "Sqs";
                gTotal += self.configLabor[i].Total;
            } else if (self.configLabor[i].Labor == "Flat") {
                x = parseInt(self.configLabor[i].Qty);
                y = parseInt(self.configLabor[i].Cost);
                self.configLabor[i].Total = x * y;
                self.configLabor[i].Units = "Sqs";
                gTotal += self.configLabor[i].Total;
            }
        }

        return gTotal;
    }

    self.returnProfitMargin = function() {

    }


    // Make all vals numbers
    var numberize = function(inputObj) {
        for (var prop in inputObj) {
            if (!inputObj.hasOwnProperty(prop)) {
                //The current property is not a direct property of p
                continue;
            }
            var x = inputObj[prop];
            var xInt = parseInt(x);
            if (isNaN(x)) {
                inputObj[prop] = 0;
            } else {
                inputObj[prop] = xInt;
            }
        }
        return inputObj;
    };

    var convertToBoolean = function(input) {
        var boolOut = false;
        if (input === "1" || input === "true" || input === "True" || input === "TRUE" || input === 1 || input === true) {
            boolOut = true;
        }
        var num = Number(input);
        var isNum = isNaN(num);
        if (!isNum) {
            if (num > 0) {
                boolOut = true;
            }
        }
        return boolOut;
    };

    // Takes object with Category and Code
    // Sets Checked=false to every Item within the Category 
    // Sets Checked=true on the item matching the Code
    self.updateCheckedItemInCategory = function(catCodeArrObj) {
        trace(me + "updateCheckedItemInCategory");
        for (var i = 0; i < catCodeArrObj.length; i++) {
            var cat = catCodeArrObj[i].Category;
            var code = catCodeArrObj[i].Code;
            for (var i2 = 0; i2 < self.jobConfigArray.length; i2++) {
                if (self.jobConfigArray[i2].Category === cat) {
                    self.jobConfigArray[i2].Checked = false;
                }
            }
            for (var i3 = 0; i3 < self.jobConfigArray.length; i3++) {
                if (self.jobConfigArray[i3].Code === code) {
                    self.jobConfigArray[i3].Checked = true;
                }
            }
        };
        return self.jobConfigArray;
    };

    self.convertConfigToString = function() {
        trace(me + "convertConfigToString");
        var dataStr = "";
        for (var i = 0; i < self.jobConfigArray.length; i++) {
            var thisObj = self.jobConfigArray[i];
            var a = thisObj.Code;
            var b = thisObj.Qty;
            var c = thisObj.Checked;
            var d = thisObj.Price;
            var e = thisObj.Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        }
        var dataObj = {};
        dataObj.config = dataStr;
        return dataObj;
    };

    self.formatParamsForTableDisplay = function(jobParams) {
        trace(me + "formatParamsForTableDisplay");
        // If the field is empty, set a dash "-" for display purposes
        underscore.each(jobParams, function(value, key, obj) {
            if (value == "" || value == null || value == "0") {
                obj[key] = "-";
            }
        });
        // Alias items
        // Add Ridges
        var top = parseInt(jobParams.TOPRDG);
        var rake = parseInt(jobParams.RKERDG);
        if (isNaN(top)) { top = 0; };
        if (isNaN(rake)) { rake = 0; };
        var rdg = top + rake;
        jobParams.RIDGETOTAL = rdg;
        return jobParams;
    };


    // If a Proposal has been Saved from the Proposal Review Pricing page, then it will have custom config (rather than default) pricing and qty.
    // The formatMaterials() function will call this function for each item to see if there is a saved value
    // If there is NOT a custom saved config, self.jobConfigArray will be an empty array
    var returnCustomMaterial = function(code) {
        var rtnObj = null;
        for (var i = 0; i < self.jobConfigArray.length; i++) {
            if (self.jobConfigArray[i].Code === code) {
                rtnObj = self.jobConfigArray[i];
                break;
            };
        };
        return rtnObj;
    };

    /*self.returnDefaultMaterial = function(cat) {
        trace(me + "returnDefaultMaterial");
        var rtnObject = {};
        for (var i = 0; i < self.defaultCheckedMaterials.length; i++) {
            var category = self.defaultCheckedMaterials[i].Category;
            if (category === cat) {
                rtnObject = self.defaultCheckedMaterials[i];
                break;
            }
        };
        return rtnObject;
    };*/

    return self;
}]);
