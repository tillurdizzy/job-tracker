'use strict';
app.service('ClientSharedSrvc', ['$rootScope', 'ClientDataSrvc', 'underscore', function adminShared($rootScope, ClientDataSrvc, underscore) {

    var self = this;
    self.ME = "ClientSharedSrvc: ";
    var DB = ClientDataSrvc;

    var getJobMaterials = function() {
        var dataObj = { jobID: self.proposalUnderReview.jobID };
        DB.getJobMaterials(dataObj).then(function(result) {
            if (result === false) {
                alert("FALSE returned for DB.getJobMaterials() at AdminSharedSrvc >>> getJobMaterials()");
            } else {
                proposalDataFlag.materials = true;
                var resultObj = result;
                parseMaterialsResult(resultObj);
                validateData();
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobMaterials() at AdminSharedSrvc >>> getJobMaterials()");
        });
    };

    var parseMaterialsResult =  function(obj){
        self.materialsJob = [];
        var strData = obj[0].strData;
        if(strData != ""){
            var rootArr = strData.split('!');
            for (var i = 0; i < rootArr.length; i++) {
               var thisArr = rootArr[i].split(';');
               var materialObj = {};
               materialObj.Code = thisArr[0];
               materialObj.Qty = thisArr[1];
               materialObj.Checked = thisArr[2];
               materialObj.Price = thisArr[3];
               self.materialsJob.push(materialObj);
            }
        }
    };

    return self;
}]);
