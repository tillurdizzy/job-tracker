'use strict';
app.service('JobConfigSrvc',['$rootScope','underscore',function service($rootScope,underscore) {

    var self = this;
    self.ME = "JobConfigSrvc: ";
    var jobConfigArray = [];
    var jobConfigStr = "";
    var materialsConfigured = [];

    // Converts the long string saved in DB into array of objects
    self.parseJobConfig = function(ar) {
        jobConfigArray = [];
        if (ar.length > 0) {
           jobConfigStr = ar[0].strData;
            if (jobConfigStr != "") {
                var rootArr = jobConfigStr.split('!');
                for (var i = 0; i < rootArr.length; i++) {
                    var thisArr = rootArr[i].split(';');
                    var jobConfigObj = {};
                    jobConfigObj.Code = thisArr[0];
                    jobConfigObj.Qty = thisArr[1];
                    jobConfigObj.Checked = thisArr[2];
                    jobConfigObj.Price = thisArr[3];
                    self.jobConfigArray.push(jobConfigObj);
                }
            }
        }
        return self.jobConfigArray;
    };

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

    self.mergeConfig = function(materials,params) {
        materialsConfigured = [];
        for (var i = 0; i < materials.length; i++) {

            var paramKey = materials[i].InputParam;
            var customObj = returnCustomMaterial(materials[i].Code);

            // If the client has a 'Saved' obj for this material, use that Price and Qty, otherwise use current pricing
            if (customObj != null && customObj.Checked != undefined) {
                var itemPrice = Number(customObj.Price);
                var parameterVal = Number(customObj.Qty);
                var checked = customObj.Checked;
            } else {
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
        materialsConfigured = materials.slice();
        return materialsConfigured;
    };

    // If a Proposal has been Saved from the Proposal Review Pricing page, then it will have custom config (rather than default) pricing and qty.
    // The formatMaterials() function will call this function for each item to see if there is a saved value
    // If there is NOT a custom saved config, self.jobConfigArray will be an empty array
    var returnCustomMaterial = function(code) {
        var rtnObj = null;
        for (var i = 0; i < jobConfigArray.length; i++) {
            if (jobConfigArray[i].Code === code) {
                rtnObj = jobConfigArray[i];
                break;
            };
        };
        return rtnObj;
    };

    return self;
}]);
