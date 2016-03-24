'use strict';
app.service('JobConfigSrvc',['$rootScope','underscore',function service($rootScope,underscore) {

    var self = this;
    self.ME = "JobConfigSrvc: ";
    self.jobConfigArray = [];
    var jobConfigStr = "";
    var materialsConfigured = [];

    // Converts the long string saved in DB into array of objects
    self.parseJobConfig = function(ar) {
        self.jobConfigArray = [];
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
    // i.e. Replaces the current Checked item with the new one
    self.updateCheckedItemInCategory = function(catCodeArrObj){
    	for (var i = 0; i < catCodeArrObj.length; i++) {
    		var cat = catCodeArrObj[i].Category;
    		var code = catCodeArrObj[i].Code;
    		for (var i2 = 0; i2 < self.jobConfigArray.length; i2++) {
    			if(self.jobConfigArray[i2].Category === cat){
    				self.jobConfigArray[i2].Checked === false;
    			}
    		}
    		for (var i3 = 0; i3 < self.jobConfigArray.length; i3++) {
    			if(self.jobConfigArray[i3].Code === code){
    				self.jobConfigArray[i3].Checked === true;
    			}
    		}
    	}

    	DB.queryDB("getMaterialsList").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobMaterials ---- " + resultObj.data);
            } else {
                self.materialsList = resultObj.data;
                getDefaultSelections();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobMaterials");
        });

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
        for (var i = 0; i < self.jobConfigArray.length; i++) {
            if (self.jobConfigArray[i].Code === code) {
                rtnObj = self.jobConfigArray[i];
                break;
            };
        };
        return rtnObj;
    };

    return self;
}]);
