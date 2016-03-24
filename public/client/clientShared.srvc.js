'use strict';
app.service('ClientSharedSrvc', ['$rootScope', 'ClientDataSrvc', 'JobConfigSrvc', 'underscore', function adminShared($rootScope, ClientDataSrvc, JobConfigSrvc, underscore) {

    var self = this;
    self.ME = "ClientSharedSrvc: ";
    var DB = ClientDataSrvc;
    var CONFIG = JobConfigSrvc;

    self.displayName = "";
    self.loggedIn = false;
    self.jobID = 0;

    self.materialsList = [];
    self.materialsListConfig = [];
    self.baseLineTotal = 0;
    var mergeDataFlag = { params: false, config: false };
    self.jobResults = []; // Original array from DB
    self.propertyResults = []; // Original array from DB
    self.jobObj = {};
    self.clientObj = {};
    self.propertyObj = {};
    self.jobParameters = {};
    self.multiVents = {};
    self.multiLevels = {};
    self.jobConfig = {};
    self.photoGallery = [];
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
    var basePriceConfig = {};
    var photoGalleryPath = "";
    var keyValPairs = [];

    //Called after successful Log In
    self.LogIn = function(name, clientObj) {
        self.displayName = name;
        self.clientObj = clientObj;
        self.loggedIn = true;
        getJobsByClient();
    };

    // Called from  self.LogIn()
    // This function starts a chain of DB calls
    // 1.getJobsByClient()  2.getPropertiesByClient() 3.getJobParameters() 4.getMultiVents(); 5. getMultiLevels() 
    // 6. getJobMaterials(); 7.getMaterialsList() 8. getJobConfig() 9. getPhotos()
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
        self.propertyObj = self.propertyResults[0];
        var propID = self.propertyObj.PRIMARY_ID;
        for (var i = 0; i < self.jobResults.length; i++) {
           if(self.jobResults[i].property == propID){
            self.jobObj = self.jobResults[i];
            break;
           }
        }
        
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
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobParameters ---- " + resultObj.data);
            } else {
                self.jobParameters = CONFIG.formatParams(resultObj.data[0]);
                mergeDataFlag.params = true;
                validateMergeData();
                getMultiVents();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobParameters");
        });
    }

    var getMultiVents = function() {
        var dataObj = { ID: self.propertyObj.PRIMARY_ID };
        DB.queryDB("getMultiVents", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
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
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getMultiVents ---- " + resultObj.data);
            } else {
                self.multiLevels = resultObj.data[0];
                buildRoofDescription();
                getJobConfig();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getMultiVents");
        });
    }

    var getJobConfig = function() {
        var dataObj = { jobID: self.jobObj.PRIMARY_ID };
        DB.queryDB("getJobConfig", dataObj).then(function(resultObj) {
            if (resultObj.result === "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobConfig ---- " + resultObj.data);
            } else {
                onGetJobConfig(resultObj.data);
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobConfig");
        });
    };

    self.saveJobConfig = function(dataObj){
        self.jobConfig = CONFIG.updateCheckedItemInCategory(dataObj);
    };


    // Converts the long string saved in DB into array of objects
    var onGetJobConfig = function(ar) {
        self.jobConfig = CONFIG.parseJobConfig(ar); // CONFIG keeps a copy!!!!  Don't really need it returned
        mergeDataFlag.config = true;
        validateMergeData();
        getPhotoGallery();
    };

    // Checks to make sure both config and materials are up to date from DB before calling formatParams();
    var validateMergeData = function() {
        var listCopy = self.materialsList.slice();
        if (mergeDataFlag.config == true && mergeDataFlag.params == true) {
            self.materialsListConfig = CONFIG.mergeConfig(listCopy, self.jobParameters);
            self.getBaseTotal();
        }
    };


    var getPhotoGallery = function() {
        var dataObj = { ID: self.jobObj.PRIMARY_ID };
        DB.queryDB("getPhotoGallery", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getPhotoGallery ---- " + resultObj.data);
            } else {
                parseGalleryResult(resultObj.data);
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getPhotoGallery");
        });
    };

    var parseGalleryResult = function(result) {
        var clientDirectory = self.clientObj.name_last.toLowerCase();
        photoGalleryPath = "client/img/" + clientDirectory + "/";
        self.photoGallery = [];
        for (var i = 0; i < result.length; i++) {
            var obj = {};
            obj.full = photoGalleryPath + "full/" + result[i].url;
            obj.thumb = photoGalleryPath + "thumb/" + result[i].url;
            obj.category = result[i].category;
            obj.cap = result[i].caption;
            self.photoGallery.push(obj);
        }
    };

    // These do not require specific ID's - get them as soon as srvc in initialized.
    var getMaterialsList = function() {
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
    };

    var getDefaultSelections = function(){
       for (var i = 0; i < self.materialsList.length; i++) {
            var category = self.materialsList[i].Category;
            if (category === "Field") {
                var ckd = self.materialsList[i].Checked;
                 if (ckd === "true"){
                    basePriceConfig.Field = self.materialsList[i].Code;
                    break;
                }
            }
        };

        for (var i = 0; i < self.materialsList.length; i++) {
            var category = self.materialsList[i].Category;
            if (category === "Valley") {
                var ckd = self.materialsList[i].Checked;
                 if (ckd === "true"){
                    basePriceConfig.Valley = self.materialsList[i].Code;
                    break;
                }
            }
        };

        for (var i = 0; i < self.materialsList.length; i++) {
            var category = self.materialsList[i].Category;
            if (category === "EdgeTrim") {
                var ckd = self.materialsList[i].Checked;
                 if (ckd === "true"){
                    basePriceConfig.EdgeTrim = self.materialsList[i].Code;
                    break;
                }
            }
        };

        for (var i = 0; i < self.materialsList.length; i++) {
            var category = self.materialsList[i].Category;
            if (category === "Ridge") {
                var ckd = self.materialsList[i].Checked;
                 if (ckd === "true"){
                    basePriceConfig.Ridge = self.materialsList[i].Code;
                    break;
                }
            }
        };
    }

    var getKeyValuePairs = function() {
        var dataObj = {};
        DB.queryDB("getKeyValuePairs", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getKeyValuePairs ---- " + resultObj.data);
            } else {
                self.keyValPairs = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getKeyValuePairs");
        });
    };


    self.getBaseTotal = function() {
        var include = false;
        for (var i = 0; i < self.materialsListConfig.length; i++) {
            include = self.materialsListConfig[i].Checked;
            if (include) {
                self.baseLineTotal += parseInt(self.materialsListConfig[i].Total)
            }
        }
         $rootScope.$broadcast("on-data-collection-complete");
    };

    self.getUpgrades = function(cat) {
        // The users Prices are in the Configured List, but the default selection is in the Original List
        var basePrice = 0;
        var thisCategoryConfigured = [];
        var rtnArray = [];

        // Step 1: Extract Field Category from Configured AND Original List
        for (var i = 0; i < self.materialsListConfig.length; i++) {
            var category = self.materialsListConfig[i].Category;
            if (category === cat) {
                thisCategoryConfigured.push(self.materialsListConfig[i]);
            }
        };
       
        // Step 2: Find Base Price
        var defaultItemCode = basePriceConfig[cat];
        for (i = 0; i < self.materialsListConfig.length; i++) {
            var itemCode = self.materialsListConfig[i].Code;
            if (itemCode === defaultItemCode) {
                basePrice = parseInt(self.materialsListConfig[i].Total);
                break;
            }
        };

        // Step 3: Calculate upgrade price and insert into list as new property
        for (i = 0; i < thisCategoryConfigured.length; i++) {
            var t = parseInt(thisCategoryConfigured[i].Total);
            var upgradePrice = t - basePrice;
            thisCategoryConfigured[i].upgradePrice = upgradePrice;
        };
        return thisCategoryConfigured;
    };


    var validateIsNumber = function(n) {
        if (n === "") {
            n = 0;
        }
        if (isNaN(n)) {
            n = 0;
        }
        return n;
    }

    getKeyValuePairs();
    getMaterialsList();

    return self;
}]);