'use strict';
app.service('ClientSharedSrvc', ['$rootScope', 'ClientDataSrvc', 'underscore', function adminShared($rootScope, ClientDataSrvc, underscore) {

    var self = this;
    self.ME = "ClientSharedSrvc: ";
    var DB = ClientDataSrvc;

    self.displayName = "";
    self.loggedIn = false;
    self.jobID = 0;

    //Client data
    self.jobResults = []; // Original array from DB
    self.propertyResults = []; // Original array from DB
    self.jobObj = {};
    self.clientObj = {};
    self.propertyObj = {};
    self.jobParameters = {};
    self.multiVents = {};
    self.multiLevels = {};
    self.jobMaterials = {};
    self.existingRoofDescription = {
        shingles: "",
        deck: "",
        edge: "",
        valley: "",
        ridge: "",
        ventilation: "",
        pitch: "",
        turbines: "",
        plumbingVents: "",
        heatingVents: ""
    };


    var keyValPairs = [];


    //Called after successful Log In
    self.LogIn = function(name, clientObj) {
        self.displayName = name;
        self.clientObj = clientObj;
        self.loggedIn = true;
        getJobsByClient();
    };


    // This function starts a chain of DB calls
    // 1.getJobsByClient()  2.getPropertiesByClient() 3.getJobParameters() 4.getMultiVents(); 5. getMultiLevels() 6. getJobMaterials(); 7.getMaterialsList()
    // Ending on buildRoofDescription() which creates a DOM dataProvider from all these different sources
    var getJobsByClient = function() {
        var dataObj = { clientID: self.clientObj.PRIMARY_ID };
        DB.queryDB("getJobsByClient", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getJobsByClient ---- " + resultObj.data);
            } else {
                self.jobResults = resultObj.data;
                getPropertiesByClient();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobsByClient");
        });
    };

    var getPropertiesByClient = function() {
        var dataObj = { clientID: self.clientObj.PRIMARY_ID };
        DB.queryDB("getPropertiesByClient", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getPropertiesByClient ---- " + resultObj.data);
            } else {
                self.propertyResults = resultObj.data;
                $rootScope.$broadcast("on-client-properties-complete", self.propertyResults);
                setClientJob();
                getJobParameters();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getPropertiesByClient");
        });
    };

    // Eliminate or revise when user can select between multiple properties
    // For now set to the first object in array
    var setClientJob = function() {
        self.jobObj = self.jobResults[0];
        self.propertyObj = self.propertyResults[0];
        self.jobID = self.jobObj.PRIMARY_ID;
    };

    var buildRoofDescription = function() {
        self.existingRoofDescription.levels = self.propertyObj.numLevels;
        self.existingRoofDescription.deck = returnKeyValue("roofDeckOptions", self.propertyObj.roofDeck);
        self.existingRoofDescription.shingles = returnKeyValue("shingleGradeOptions", self.propertyObj.shingleGrade);
        self.existingRoofDescription.edge = returnKeyValue("edgeDetail", self.propertyObj.edgeDetail);
        self.existingRoofDescription.valley = returnKeyValue("valleyOptions", self.propertyObj.valleyDetail);
        self.existingRoofDescription.ridge = returnKeyValue("ridgeCapShingles", self.propertyObj.ridgeCap);
        self.existingRoofDescription.ventilation = returnKeyValue("ventOptions", self.propertyObj.roofVents);
        self.existingRoofDescription.pitch = returnKeyValue("pitchOptions", self.propertyObj.pitch);
        self.existingRoofDescription.turbines = self.jobParameters.TURBNS;

        self.existingRoofDescription.plumbingVents =
            parseInt(validateIsNumber(self.jobParameters.LPIPE1)) +
            parseInt(validateIsNumber(self.jobParameters.LPIPE2)) +
            parseInt(validateIsNumber(self.jobParameters.LPIPE3)) +
            parseInt(validateIsNumber(self.jobParameters.LPIPE4));

        self.existingRoofDescription.heaterVents = self.jobParameters.JKVNT8;
        self.existingRoofDescription.rakeWalls = self.jobParameters.FLHSH8;
    }

    self.logOut = function() {
        self.clientID = "";
        self.displayName = "";
        self.loggedIn = false;
        self.jobObj = {};
        self.idObj = {};
        self.propertyObj = {};
        self.jobResults = [];
        self.propertyResults = [];
    };

    var returnKeyValue = function(set, id) {
        var rtnStr = "";
        for (var i = 0; i < self.keyValPairs.length; i++) {
            if (self.keyValPairs[i].setName == set && self.keyValPairs[i].id == id) {
                rtnStr = self.keyValPairs[i].val;
                continue;
            }
        }
        return rtnStr;
    };

    var getJobParameters = function() {
        var dataObj = { ID: self.jobObj.PRIMARY_ID };
        DB.queryDB("getJobParameters", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getJobParameters ---- " + resultObj.data);
            } else {
                self.jobParameters = resultObj.data[0];
                getMultiVents();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobParameters");
        });
    }

    var getMultiVents = function() {
        var dataObj = { ID: self.propertyObj.PRIMARY_ID };
        DB.queryDB("getMultiVents", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getMultiVents ---- " + resultObj.data);
            } else {
                self.multiVents = resultObj.data[0];
                getMultiLevels();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getMultiVents");
        });
    }

    var getMultiLevels = function() {
        var dataObj = { ID: self.propertyObj.PRIMARY_ID };
        DB.queryDB("getMultiVents", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getMultiVents ---- " + resultObj.data);
            } else {
                self.multiLevels = resultObj.data[0];
                getJobMaterials();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getMultiVents");
        });
    }

    var getJobMaterials = function() {
        var dataObj = { ID: self.jobObj.PRIMARY_ID };
        DB.queryDB("getJobMaterials", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getJobMaterials ---- " + resultObj.data);
            } else {
                buildRoofDescription();
                self.jobMaterials = resultObj.data[0];
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobMaterials");
        });
    };


    // These do not require specific ID's - get them as soon as srvc in initialized.

    var getMaterialsList = function() {
        DB.queryDB("getMaterialsList").then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getJobMaterials ---- " + resultObj.data);
            } else {
                self.materialsList = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobMaterials");
        });
    }

    var getKeyValuePairs = function() {
        var dataObj = {};
        DB.queryDB("getKeyValuePairs", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("getKeyValuePairs ---- " + resultObj.data);
            } else {
                self.keyValPairs = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getKeyValuePairs");
        });
    }

    var validateIsNumber = function(n){
        if(n === ""){
            n = 0;
        }
        if(isNaN(n)){
            n = 0;
        }
        return n;
    }

    getKeyValuePairs();
    getMaterialsList();

    return self;
}]);
