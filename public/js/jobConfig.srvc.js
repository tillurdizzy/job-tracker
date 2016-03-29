'use strict';
app.service('JobConfigSrvc', ['$rootScope', 'underscore',function jobConfigSrvc($rootScope, underscore) {

    var self = this;
    var Me = "JobConfigSrvc: ";
    
    var materialsConfigured = [];
    self.jobConfigStr = "";
    self.jobConfigArray = [];
    self.materialsList = [];
    self.defaultConfigSelections = [];

    // Converts the long string saved in DB into array of objects
    self.parseJobConfig = function(ar) {
        console.log("JobConfigSrvc ---- parseJobConfig(()");
        self.jobConfigArray = [];
        if (ar.length > 0) {
            self.jobConfigStr = ar[0].strData;
            if (self.jobConfigStr != "") {
                var rootArr = self.jobConfigStr.split('!');
                for (var i = 0; i < rootArr.length; i++) {
                    var thisArr = rootArr[i].split(';');
                    var jobConfigObj = {};
                    jobConfigObj.Code = thisArr[0];
                    jobConfigObj.Qty = thisArr[1];
                    jobConfigObj.Checked = thisArr[2];
                    jobConfigObj.Price = thisArr[3];
                    jobConfigObj.Category = thisArr[4];
                    self.jobConfigArray.push(jobConfigObj);
                }
            }
        }
        return self.jobConfigArray;
    };

    // Takes object with Category and Code
    // Sets Checked=false to every Item within the Category 
    // Sets Checked=true on the item matching the Code
    self.updateCheckedItemInCategory = function(catCodeArrObj) {
        for (var i = 0; i < catCodeArrObj.length; i++) {
            var cat = catCodeArrObj[i].Category;
            var code = catCodeArrObj[i].Code;
            for (var i2 = 0; i2 < self.jobConfigArray.length; i2++) {
                if (self.jobConfigArray[i2].Category === cat) {
                    self.jobConfigArray[i2].Checked === false;
                }
            }
            for (var i3 = 0; i3 < self.jobConfigArray.length; i3++) {
                if (self.jobConfigArray[i3].Code === code) {
                    self.jobConfigArray[i3].Checked === true;
                }
            }
        };

        var dataObj = convertConfigToString();

       // Broadcast here with dataObj for DataSrvc to save....

        return self.jobConfigArray;
    };

    self.convertConfigToString = function() {
        for (var i = 0; i < self.jobConfigArray.length; i++) {
            var thisObj = self.jobConfigArray[i];
            var a = thisObj.Code;
            var b = thisObj.Qty;
            var c = thisObj.Checked;
            var d = thisObj.PkgPrice;
            var e = thisObj.Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        }
        var dataObj = {};
        dataObj.strData = dataStr;
        return dataObj;
    }

    self.formatParams = function(jobParams) {
        // If the field is empty, set a dash "-" for display purposes
        underscore.each(jobParams, function(value, key, obj) {
            if (value == "" || value == null) {
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

    self.mergeConfig = function(materials, params,useConfig) {
       
        for (var i = 0; i < materials.length; i++) {

            var paramKey = materials[i].InputParam;
            var customObj = returnCustomMaterial(materials[i].Code);

            // If the client has a 'Saved' obj for this material, use that Price and Qty, otherwise use current pricing
            if (customObj != null && customObj.Checked != undefined && useConfig===true) {
                // There is a config and useConfig === true
                // All values are from config
                var itemPrice = Number(customObj.Price);
                var parameterVal = Number(customObj.Qty);
                var checked = customObj.Checked;
            }else if (customObj != null && customObj.Checked != undefined && useConfig===false) {
                // There is a config and useConfig === false
                // This will retain the Checked values from database, but uses Price from Config
                // This is specifically to get the default selections but uses price from wheever it was saved
                // !!!! Maybe we sould save a default config so if defauls change over time!!  YES do this.
                itemPrice = Number(customObj.Price);
                parameterVal = Number(params[paramKey]);
                checked = materials[i].Checked;
            } else {
                // There is no config... use the current values from database
                itemPrice = Number(materials[i].PkgPrice);
                parameterVal = Number(params[paramKey]);
                checked = materials[i].Checked;
            }

            var usage = Number(materials[i].QtyPkg);
            var over = Number(materials[i].Margin);
            var roundUp = Number(materials[i].RoundUp);

            var isNum = isNaN(parameterVal);
            var total = 0;
            if (isNum) {
                parameterVal = 0;
                total = 0;
            } else {
                total = (((parameterVal / usage) * itemPrice * over) * roundUp) / roundUp;
            }

            materials[i].Qty = parameterVal;
            materials[i].Total = total;

            if (checked === "true" || checked === true || checked === 1) {
                materials[i].Checked = true;
            } else {
                materials[i].Checked = false;
            }
        }
       
        return materials;
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

    self.returnDefaultMaterial = function(cat){
        var rtnObject = {};
        for (var i = 0; i < self.defaultConfigSelections.length; i++) {
            var category = self.defaultConfigSelections[i].Category;
            if (category === cat) {
                rtnObject = self.defaultConfigSelections[i];
                break;
            }
        };
        return rtnObject;
    };

   
    console.log("jobConfig Complete");
    return self;
}]);
