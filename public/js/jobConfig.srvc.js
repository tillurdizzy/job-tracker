'use strict';
app.service('JobConfigSrvc',['$rootScope','underscore',function service($rootScope,underscore) {

    var self = this;
    self.ME = "JobConfigSrvc: ";
    var jobConfigArray = [];
    var jobConfigStr = "";

    // Converts the long string saved in DB into array of objects
    self.parseJobConfig = function(ar) {
        self.jobConfigObj = {};
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
                    self.jobConfig.push(materialObj);
                }
            }
        }
        return self.jobConfig;
    };

    

    return self;
}]);
