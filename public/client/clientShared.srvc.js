'use strict';
app.service('ClientSharedSrvc', ['$rootScope', 'ClientDataSrvc', 'JobConfigSrvc', 'underscore', function($rootScope, ClientDataSrvc, JobConfigSrvc, underscore) {

    var self = this;
    var me = "ClientSharedSrvc: ";
    var DB = ClientDataSrvc;
    var CONFIG = JobConfigSrvc;
    var LOG = true;

    self.displayName = "";
    self.loggedIn = false;
    self.jobID = 0;
    self.materialsList = [];
    self.materialsListConfig = [];
    self.defaultCheckedMaterials = [];
    self.jobConfig = {};



    self.baseLineTotal = 0;
    var baseLineItems = [];
    var mergeDataFlag = { params: false, config: false };
    self.jobResults = []; // Original array from DB
    self.propertyResults = []; // Original array from DB
    self.jobObj = {};
    self.clientObj = {};
    self.propertyObj = {};
    self.jobParameters = {};
    self.roofObj = {};
    self.multiVents = {};
    self.multiLevels = {};
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
        self.trace(me + "LogIn()");
        self.displayName = name;
        self.clientObj = clientObj;
        self.loggedIn = true;
        getJobsByClient();
    };

    self.trace = function(message) {
        if (LOG) {
            console.log(message);
        }
    };

    // Called from  self.LogIn()
    // This function starts a chain of DB calls
    // getJobsByClient() >>> getPropertiesByClient() >>> setClientJob();

    // getJobParameters() >>> getRoofForProperty() >>> getMultiVents() >>> getMultiLevels() 
    // getJobMaterials(); 7.getMaterialsList() 8. getJobConfig() 9. getPhotos()
    // Ending on buildRoofDescription() which creates a DOM dataProvider from all these different sources
    var getJobsByClient = function() {
        self.trace(me + "getJobsByClient()");
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
        self.trace(me + "getPropertiesByClient()");
        var dataObj = { clientID: self.clientObj.PRIMARY_ID };
        DB.queryDB("getPropertiesByClient", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getPropertiesByClient ---- " + resultObj.data);
            } else {
                self.propertyResults = resultObj.data;
                $rootScope.$broadcast("on-client-properties-complete", self.propertyResults);
                setClientJob();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getPropertiesByClient");
        });
    };

    // Eliminate or revise when user can select between multiple properties
    // For now set to the first object in array
    // Make sure Property is assigned to a Job and the Job has Parameters recorded
    var setClientJob = function() {
        self.trace(me + "setClientJob()");
        self.propertyObj = self.propertyResults[0];
        self.jobObj = null;
        var propID = self.propertyObj.PRIMARY_ID;
        for (var i = 0; i < self.jobResults.length; i++) {
            if (self.jobResults[i].property == propID) {
                self.jobObj = self.jobResults[i];
                break;
            }
        };
        if (self.jobObj == null) {
            alert("This property has no associated Job.");
        } else {
            getJobParameters();
        };
    };

    // Translates the roof description database entries to text for display
    var buildRoofDescription = function() {
        self.trace(me + "buildRoofDescription()");
        self.existingRoofDescription.levels = self.roofObj.numLevels;
        self.existingRoofDescription.deck = returnKeyValue("roofDeckOptions", self.roofObj.roofDeck);
        self.existingRoofDescription.shingles = returnKeyValue("shingleGradeOptions", self.roofObj.shingleGrade);
        self.existingRoofDescription.edge = returnKeyValue("edgeDetail", self.roofObj.edgeDetail);
        self.existingRoofDescription.valley = returnKeyValue("valleyOptions", self.roofObj.valleyDetail);
        self.existingRoofDescription.ridge = returnKeyValue("ridgeCapShingles", self.roofObj.ridgeCap);
        self.existingRoofDescription.ventilation = returnKeyValue("ventOptions", self.roofObj.roofVents);
        self.existingRoofDescription.pitch = returnKeyValue("pitchOptions", self.roofObj.pitch);
        
        self.existingRoofDescription.plumbingVents =
            parseInt(validateIsNumber(self.jobParameters.LPIPE1)) +
            parseInt(validateIsNumber(self.jobParameters.LPIPE2)) +
            parseInt(validateIsNumber(self.jobParameters.LPIPE3)) +
            parseInt(validateIsNumber(self.jobParameters.LPIPE4));

        self.existingRoofDescription.turbines = validateIsNumber(self.jobParameters.TURBNS);
        self.existingRoofDescription.heaterVents = validateIsNumber(self.jobParameters.VENT8);
        self.existingRoofDescription.rakeWalls = validateIsNumber(self.jobParameters.RKEWALL);
        self.existingRoofDescription.eave = validateIsNumber(self.jobParameters.EAVE);
        self.existingRoofDescription.perimiter = validateIsNumber(self.jobParameters.PRMITR);
    };

    self.logOut = function() {
        self.trace(me + "LogIn()");
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
                break;
            }
        }
        return rtnStr;
    };

    var getJobParameters = function() {
        self.trace(me + "getJobParameters()");
        var dataObj = { ID: self.jobObj.PRIMARY_ID };
        DB.queryDB("getJobParameters", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobParameters ---- " + resultObj.data);
            } else {
                var arr = resultObj.data;
                if (arr.length > 0) {
                    self.jobParameters = CONFIG.formatParamsForTableDisplay(resultObj.data[0]);
                    mergeDataFlag.params = true;
                    validateMergeData();
                    getRoofForProperty();
                }else{
                    alert("Job has no parameters recorded.");
                }
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobParameters");
        });
    };

    var getRoofForProperty = function() {
        self.trace(me + "getRoofForProperty()");
        var dataObj = { propID: self.propertyObj.PRIMARY_ID };
        DB.queryDB("getRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getRoofForProperty ---- " + resultObj.data);
            } else {
                self.roofObj = resultObj.data[0];
                getMultiVents();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getRoofForProperty");
        });
    };

    var getMultiVents = function() {
        self.trace(me + "getMultiVents()");
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
        self.trace(me + "getMultiLevels()");
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
        self.trace(me + "getJobConfig()");
        var dataObj = { jobID: self.jobObj.PRIMARY_ID };
        DB.queryDB("getJobConfig", dataObj).then(function(resultObj) {
            if (resultObj.result === "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobConfig ---- " + resultObj.data);
            } else {
                onGetConfigResult(resultObj.data);
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobConfig");
        });
    };

    self.saveClientUpgrades = function(dataObj) {
        self.trace(me + "saveClientUpgrades()");
        self.jobConfig = CONFIG.updateCheckedItemInCategory(dataObj.configUpdates);
        var configObj = CONFIG.convertConfigToString();
        dataObj.config = configObj.config;
        dataObj.jobID = self.jobObj.PRIMARY_ID;

        DB.queryDB("updateConfigClient", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("ClientSharedSrvc >> saveClientUpgrades ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast("client-upgrades-saved");
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> saveClientUpgrades");
        });
    };


    // Converts the long string saved in DB into array of objects
    var onGetConfigResult = function(ar) {
        self.trace(me + "onGetConfigResult()");
        self.jobConfig = CONFIG.parseJobConfig(ar); // CONFIG keeps a copy!!!!  Don't really need it returned
        mergeDataFlag.config = true;
        validateMergeData();
        getPhotoGallery();
    };

    // Checks to make sure both config and materials are imported
    var validateMergeData = function() {
        self.trace(me + "validateMergeData()");
        var listCopy = clone(self.materialsList);
        if (mergeDataFlag.config === true && mergeDataFlag.params === true) { 
            // Insert saved config Prices and Qty into the Default materials, but don't change the "Checked" value
            self.defaultCheckedMaterials = CONFIG.mergeJobConfig(self.defaultCheckedMaterials, self.jobParameters, false);

            // Insert saved config Prices and Qty into the materialsList, but don't change the "Checked" value
            self.materialsList = CONFIG.mergeJobConfig(self.materialsList, self.jobParameters, false);

            // Insert saved config Prices and Qty AND Checked value into the materialsListConfig
            self.materialsListConfig = CONFIG.mergeJobConfig(listCopy, self.jobParameters, true);

            CONFIG.defaultCheckedMaterials = self.defaultCheckedMaterials;

            self.getBaseTotal();
        }
    };

    var clone = function(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };


    var getPhotoGallery = function() {
        self.trace(me + "getPhotoGallery()");
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
        self.trace(me + "parseGalleryResult()");
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

    self.getBaseTotal = function() {
        self.trace(me + "getBaseTotal()");
        baseLineItems = [];
        var include = false;
        for (var i = 0; i < self.materialsListConfig.length; i++) {
            include = self.materialsListConfig[i].Checked;
            if (include === true) {
                baseLineItems.push(self.materialsListConfig[i]);
                //self.baseLineTotal += Number(self.materialsListConfig[i].Total);
            }
        };


        // Add Labor
        var labor = CONFIG.returnLaborGrandTotal();
       
        var profitMargin = CONFIG.profitMargin;
        self.baseLineTotal = CONFIG.costSummary.Base;
        
        $rootScope.$broadcast("on-data-collection-complete");
    };

    // Called from Crtl:  Creates list of items to show for upgrade options in each category (Field,Valley,Ridge,Edge)
    self.getUpgrades = function(cat,manufacturer) {

        self.trace(me + "getUpgrades() - " + cat);
        // The Client's Prices are in the Configured List, but the Default Selection is in the Original List
        var basePrice = 0;
        var thisCategoryConfigured = [];
        var rtnArray = [];

        // Step 1: Extract all items in Category from Configured List
        for (var i = 0; i < self.materialsListConfig.length; i++) {
            var category = self.materialsListConfig[i].Category;
            if (category === cat) {
                if(manufacturer == undefined){
                    thisCategoryConfigured.push(self.materialsListConfig[i]);
                }else{
                    var m = self.materialsListConfig[i].Manufacturer;
                    if(m == manufacturer || m == "VARIABLE"){
                        thisCategoryConfigured.push(self.materialsListConfig[i]);
                    }
                }
            }
        };

        // Step 2: Find Base Price
        basePrice = CONFIG.upgradeItemsBasePrice[cat];
        var mu = CONFIG.configMargin + 1;
        // Step 3: Calculate upgrade price and insert into list as new property
        // Price shown to Client includes % Markup
        for (i = 0; i < thisCategoryConfigured.length; i++) {
            var t = Number(thisCategoryConfigured[i].Total);
            var upgradePrice = (t - basePrice) * mu;
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
    };

    // Init functions chained

    var getKeyValuePairs = function() {
        self.trace(me + "getKeyValuePairs()");
        var dataObj = {};
        DB.queryDB("getKeyValuePairs", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getKeyValuePairs ---- " + resultObj.data);
            } else {
                self.keyValPairs = resultObj.data;
                getDefaultConfigSelections();
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getKeyValuePairs");
        });
    };
    var getDefaultConfigSelections = function() {
        //SELECT * FROM materials_shingle WHERE Checked = 1
        self.trace(me + "getDefaultConfigMaterials()...checked = 1");
        // SELECT * FROM materials_shingle WHERE Checked = 1
        DB.queryDB("getDefaultConfigMaterials", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("jobConfig >> getDefaultConfigMaterials ---- " + resultObj.data);
            } else {
                self.defaultCheckedMaterials = resultObj.data;
                getMaterialsList();
            }
        }, function(error) {
            alert("Query Error - jobConfig >> getDefaultConfigMaterials");
        });
    };
    var getMaterialsList = function() {
        self.trace(me + "getMaterialsList()");
        DB.queryDB("getMaterialsList").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobMaterials ---- " + resultObj.data);
            } else {
                self.materialsList = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - ClientSharedSrvc >> getJobMaterials");
        });
    };

    self.decimalPrecisionTwo = function(data){
        var num = Number(data);
        var result=Math.round(num*100)/100
        return result;
    }


    var init = function() {
        getKeyValuePairs();
    };

    init();

    return self;
}]);
