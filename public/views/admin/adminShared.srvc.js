'use strict';
app.service('AdminSharedSrvc', ['$rootScope', 'AdminDataSrvc', 'ListSrvc', 'underscore', 'JobConfigSrvc', 'ngDialog', function adminShared($rootScope, AdminDataSrvc, ListSrvc, underscore, JobConfigSrvc, ngDialog) {

    var self = this;
    self.ME = "AdminSharedSrvc: ";
    var DB = AdminDataSrvc;
    var L = ListSrvc;
    var CONFIG = JobConfigSrvc;
    self.MATERIALS = [];
    self.CLIENTS = [];
    self.PROPERTIES = [];
    self.JOBS = [];
    self.ROOFS = [];
    self.SPECIAL = "";
    self.MULTIVENTS = [];
    self.MULTILEVELS = [];
    self.laborDefault = {};
    self.laborConfig = {};

    //jobVO's related to jobs that are in Proposal State
    var proposalsAsJob = [];

    // List of all Sales Reps
    self.salesReps = [];

    // propertyVO's related to jobs that are in Proposal State
    // DataProvider for DropDownList on Proposal Review Page
    self.proposalsAsProperty = [];

    // Selected item from above - i.e. one of the objects in the self.proposalsAsProperty list
    // Params are added during formatParams()
    self.proposalUnderReview = {};

    // Received from DB - default selections amd current pricing
    // Then Merged with self.jobConfig for custom selections and pricing
    // Totals calculated
    self.materialsList = [];

    // Extracted from materialsList... items that are marked as "Checked"
    self.materialsDefault = [];

    // Price to customer without any upgrades... Default selections + labor + Other Expenses
    self.basePrice = { Field: "", Valley: "", Ridge: "", Total: "" };

    // Selections and pricing specific to a job
    self.jobConfig = [];

    // Temporary (short-term ) vars
    var mergeDataFlag = {};
    mergeDataFlag.config = false;
    mergeDataFlag.materials = false;
    var jobParams = {};

    // self.materialsList sorted into categories
    // Consumed by view controller as data provider for Pricing Tab
    self.materialsCatergorized = { Field: [], Ridge: [], Starter: [], Vents: [], Flashing: [], Edge: [], Valley: [], Caps: [], Flat: [], Other: [] };

    // Step 1 : Select proposal/property from dropdown on AdminProposalCtrl
    // Called for both roofCodes 0 and 2, but code 2 halts before retrieving jobParameters
    self.selectProposal = function(ndx) {
        var rtnObj = {};
        if (ndx == -1) {
            self.resetProposalData(); // Clear vars
        } else {
            self.proposalUnderReview = self.proposalsAsProperty[ndx];

            rtnObj.propertyID = self.proposalUnderReview.PRIMARY_ID;
            rtnObj.jobID = -1; // this will change below for roofCode 0
            rtnObj.clientID = self.proposalUnderReview.client;
            rtnObj.roofCode = self.proposalUnderReview.roofCode;
            rtnObj.salesRep = self.returnSalesRep(self.proposalUnderReview.manager);
            // Set flags to false
            mergeDataFlag.config = false;
            mergeDataFlag.materials = false;

            // If roofCode == 0, get the jobID and use that to get the job parameters
            // there will only be ONE match here
            if (rtnObj.roofCode == 0) {
                for (var i = 0; i < proposalsAsJob.length; i++) {
                    if (proposalsAsJob[i].property === self.proposalUnderReview.PRIMARY_ID) {
                        self.proposalUnderReview.jobID = proposalsAsJob[i].PRIMARY_ID;
                        break;
                    }
                };
                rtnObj.jobID = self.proposalUnderReview.jobID;
                getJobParameters();
            } else if (rtnObj.roofCode == 2) {
                // There could be multiple matches here... get the roofID to retrieve the roof names to use in a list
                rtnObj.roofSelectionList = [{ label: "--- Select a Roof at this Property ---", jobID: -1 }];
                for (var i = 0; i < proposalsAsJob.length; i++) {
                    if (proposalsAsJob[i].property === self.proposalUnderReview.PRIMARY_ID) {
                        var listItem = {};
                        listItem.jobID = proposalsAsJob[i].PRIMARY_ID;
                        listItem.roofID = proposalsAsJob[i].roofID;
                        listItem.label = returnBldgNameFromRoofsByRoofID(proposalsAsJob[i].roofID);
                        rtnObj.roofSelectionList.push(listItem);
                    };
                };
            };
        };
        return rtnObj;
    };

    self.selectRoof = function(jobID) {
        self.proposalUnderReview.jobID = jobID;
        // Set flags to false
        mergeDataFlag.config = false;
        mergeDataFlag.materials = false;
        getJobParameters();
    }

    self.resetProposalData = function() {
        $rootScope.$broadcast('onResetProposalData');
        self.proposalUnderReview = {};
    };

    //Step 2
    // Data for the "Input" Tab on Proposal Review Page
    // Job Parameters AND Job Config must BOTH be updated after selecting a proposal before we can
    // call formatParams()
    // We'll use a flag (mergeDataFlag.params) to make sure both are updated...
    var getJobParameters = function() {
        DB.getJobParameters(self.proposalUnderReview.jobID).then(function(jobData) {
            if (jobData != false) {
                jobParams = jobData[0];
                mergeDataFlag.params = true;
                self.proposalUnderReview.propertyInputParams = CONFIG.formatParams(jobParams);
                $rootScope.$broadcast('onRefreshParamsData', jobParams);
                validateData();
                getJobConfig();
            } else {
                ngDialog.open({
                    template: '<h2>ERROR: This job has no proposal parameters.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.getJobParameters() at AdminSharedSrvc >>> getJobParameters()");
        });
    };

    //Step 3
    var getJobConfig = function() {
        var dataObj = { jobID: self.proposalUnderReview.jobID };
        DB.query("getJobConfig", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for getJobConfig()");
            } else {
                onGetJobConfig(resultObj.data);
            }
        }, function(error) {
            alert("ERROR returned for  getJobConfig()");
        });
    };

    // Send results over to CONFIG
    var onGetJobConfig = function(ar) {
        self.jobConfig = CONFIG.parseJobConfig(ar);
        mergeDataFlag.config = true;
        validateData();
    };

    // Checks to make sure both config and params are up to date from DB before calling formatParams();
    var validateData = function() {
        if (mergeDataFlag.config === true && mergeDataFlag.params === true) {
            mergeConfig();
        };
    };

    // Step 4
    // Take the generic materialList and merge it with the job-specific config (insert qty and price)
    var mergeConfig = function() {
        var aClone = DB.clone(self.MATERIALS);
        self.materialsList = CONFIG.mergeJobConfig(aClone, self.proposalUnderReview.propertyInputParams, true);
        self.materialsDefault = CONFIG.mergeJobConfig(self.materialsDefault, self.proposalUnderReview.propertyInputParams, true);

        // If there is a saved labor config, insert the cost and qty... otherwise return the laborDefault vals
        self.laborConfig = CONFIG.mergeLaborConfig(self.laborDefault, DB.clone(self.proposalUnderReview.propertyInputParams));
        calculateBasePrice();

        categorizeMaterials();
        getSpecialConsiderations();
    };

    var calculateBasePrice = function() {
        self.basePrice = {};
        // These 3 categories are the ones that the Client can upgrade
        // This function records the non-upgrade prices for each to use for the Baseline Price
        for (var i = 0; i < self.materialsDefault.length; i++) {
            var cat = self.materialsDefault[i].Category;
            if (cat == "Field") {
                self.basePrice.Field = self.materialsDefault[i].Total;
            } else if (cat == "Valley") {
                self.basePrice.Valley = self.materialsDefault[i].Total;
            } else if (cat == "Ridge") {
                self.basePrice.Ridge = self.materialsDefault[i].Total;
            }
        }
    };

    // Just replace the default labor with config labor if it exists
    // Labor was updated in CONFIG in Step 3... 
    // This will be called form labor.ctrl
    var returnLabor = function() {

    }

    // Categorizes and sorts the complete materials list into roof sections
    var categorizeMaterials = function() {
        self.materialsCatergorized = {};
        var field = [];
        var ridge = [];
        var starter = [];
        var caps = [];
        var vents = [];
        var flashing = [];
        var valley = [];
        var edge = [];
        var flat = [];
        var other = [];
        for (var i = 0; i < self.materialsList.length; i++) {
            var cat = self.materialsList[i].Category;
            if (cat == "Field") {
                field.push(self.materialsList[i]);
            } else if (cat == "Ridge") {
                ridge.push(self.materialsList[i]);
            } else if (cat == "Starter") {
                starter.push(self.materialsList[i]);
            } else if (cat == "Caps") {
                caps.push(self.materialsList[i]);
            } else if (cat == "Ventilation") {
                vents.push(self.materialsList[i]);
            } else if (cat == "Flashing") {
                flashing.push(self.materialsList[i]);
            } else if (cat == "Valley") {
                valley.push(self.materialsList[i]);
            } else if (cat == "Edge") {
                edge.push(self.materialsList[i]);
            } else if (cat == "LowSlope") {
                flat.push(self.materialsList[i]);
            } else if (cat == "Other") {
                other.push(self.materialsList[i]);
            }
        };

        self.materialsCatergorized.Field = field;
        self.materialsCatergorized.Ridge = ridge;
        self.materialsCatergorized.Starter = starter;
        self.materialsCatergorized.Caps = caps;
        self.materialsCatergorized.Vents = vents;
        self.materialsCatergorized.Flashing = flashing;
        self.materialsCatergorized.Valley = valley;
        self.materialsCatergorized.Edge = edge;
        self.materialsCatergorized.Flat = flat;
        self.materialsCatergorized.Other = other;

        $rootScope.$broadcast('onRefreshMaterialsData', self.materialsCatergorized);
    };

    // Called from Proposal Review Design page to manually edit qty or price of material
    self.editMaterial = function(vals) {
        var cat = vals.Category;
        var catArray = [];
        switch (cat) {
            case "Field":
                catArray = self.materialsCatergorized.Field;
                break;
            case "Ridge":
                catArray = self.materialsCatergorized.Ridge;
                break;
            case "Starter":
                catArray = self.materialsCatergorized.Starter;
                break;
            case "Caps":
                catArray = self.materialsCatergorized.Caps;
                break;
            case "Vents":
                catArray = self.materialsCatergorized.Vents;
                break;
            case "Flashing":
                catArray = self.materialsCatergorized.Flashing;
                break;
            case "Edge":
                catArray = self.materialsCatergorized.Edge;
                break;
            case "Valley":
                catArray = self.materialsCatergorized.Valley;
                break;
            case "Flat":
                catArray = self.materialsCatergorized.Flat;
                break;
            case "Other":
                catArray = self.materialsCatergorized.Other;
                break;
        }
        for (var i = 0; i < catArray.length; i++) {
            if (catArray[i].PRIMARY_ID == vals.ID) {
                catArray[i].PkgPrice = parseInt(vals.Price);
                catArray[i].Qty = parseInt(vals.Qty);
                catArray[i].Total = catArray[i].PkgPrice * catArray[i].Qty;
                break;
            }
        }
        $rootScope.$broadcast('onEditMaterial');
    };



    var getSpecialConsiderations = function() {
        self.SPECIAL = "";
        var dataObj = {};
        dataObj.jobID = self.proposalUnderReview.jobID;
        DB.query("getSpecialConsiderations", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for getSpecialConsiderations()");
            } else {
                self.SPECIAL = resultObj.data[0].body;
            }
        }, function(error) {
            alert("ERROR returned for  getSpecialConsiderations()");
        });
    };

    // Called during init() from getMaterialsList ... parses out default checked items in order to get a baseline price
    // Run result through mergeConfig function to insert prices and quantity
    var extractDefaultMaterials = function() {
        self.materialsDefault = [];
        for (var i = 0; i < self.materialsList.length; i++) {
            var c = parseInt(self.materialsList[i].Checked);
            if (c == undefined || c == null || c == NaN || c > 1) {
                self.materialsList[i].Checked == "0"
            }
            if (c == "1") {
                self.materialsDefault.push(self.materialsList[i]);
            }
        }
    };

    //Queries the properties table based on proposal status
    // Called from init() in adminProposal.ctrl
    self.getProposalsByProperty = function() {
        DB.query('getJobProposals').then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProposalsByProperty ---- " + resultObj.data);
            } else {
                self.proposalsAsProperty = resultObj.data;
                $rootScope.$broadcast('getProposalsByProperty');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };

    // Queries the job_list table for open proposals
    self.getProposalsByJob = function() {
        DB.query('getJobsWithProposalStatus').then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProposalsByJob ---- " + resultObj.data);
            } else {
                proposalsAsJob = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getProposalsByJob");
        });
    };

    var dataError = function(msg, res) {
        console.log(msg);
        console.log(res);
    };

    //Called on init
    var getMaterialsList = function() {
        var dataObj = {};
        DB.query("getMaterialsShingle", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getMaterialsShingle ---- " + resultObj.data);
            } else {
                self.MATERIALS = resultObj.data;
                self.MATERIALS = underscore.sortBy(self.MATERIALS, 'Sort');
                self.materialsList = DB.clone(self.MATERIALS);
                extractDefaultMaterials();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMaterialsList");
        });
    };


    var getSalesReps = function() {
        DB.query("getSalesReps", null).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
            } else {
                self.salesReps = resultObj.data;
                for (var i = 0; i < self.salesReps.length; i++) {
                    self.salesReps[i].displayName = self.salesReps[i].name_first + " " + self.salesReps[i].name_last;
                }
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getSalesReps");
        });
    };

    self.refreshSalesData = function() {
        getProperties();
    };


    // SALES DATA: Properties, Clients, Roofs and Jobs -- async GETs -- followed by merge and decode
    var getProperties = function() {
        DB.query("getProperties", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getProperties ---- " + resultObj.data);
            } else {
                self.PROPERTIES = resultObj.data;
                getClients();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getProperties");
        });
    };

    var getClients = function() {
        DB.query("getClients", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getClients ---- " + resultObj.data);
            } else {
                self.CLIENTS = resultObj.data;
                for (var i = 0; i < self.CLIENTS.length; i++) {
                    self.CLIENTS[i].type = parseInt(self.CLIENTS[i].type);
                    self.CLIENTS[i].manager = parseInt(self.CLIENTS[i].manager);
                    self.CLIENTS[i].PRIMARY_ID = parseInt(self.CLIENTS[i].PRIMARY_ID);
                };
                getJobs();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getClients");
        });
    };

    var getJobs = function() {
        DB.query("getJobs", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getJobs ---- " + resultObj.data);
            } else {
                self.JOBS = resultObj.data;
                getRoofs();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getJobs");
        });
    };

    var getRoofs = function() {
        DB.query("getRoofTable", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getRoofTable ---- " + resultObj.data);
            } else {
                self.ROOFS = resultObj.data;
                doJobsMerge();
                doPropertiesMerge();
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getRoofTable");
        });
    };

    var doJobsMerge = function() {
        // Translate related Client and Property ID #'s from Jobs into Names
        for (var i = 0; i < self.JOBS.length; i++) {
            var clientID = self.JOBS[i].client;
            var thisClient = returnDisplayNameFromClient(clientID);
            self.JOBS[i].clientName = thisClient;

            var managerID = self.JOBS[i].manager;
            self.JOBS[i].managerName = self.returnManagerNameByID(managerID);

            var propID = self.JOBS[i].property;

            var thisPropertyName = returnPropertyName(propID);
            self.JOBS[i].propertyName = thisPropertyName;

            var roofID = parseInt(self.JOBS[i].roofID);

            if (roofID > 0) {
                var bldgName = returnBldgNameFromRoofsByRoofID(roofID);
                self.JOBS[i].jobLabel = thisPropertyName + "-" + bldgName;
            } else {
                self.JOBS[i].jobLabel = thisPropertyName;
            }
        };
    };

    var doPropertiesMerge = function() {
        var tempProperties = [];
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            var clientID = self.PROPERTIES[i].client;
            self.PROPERTIES[i].clientDisplayName = returnDisplayNameFromClient(clientID);

            var managerID = self.PROPERTIES[i].manager;
            self.PROPERTIES[i].managerName = self.returnManagerNameByID(managerID);

            // PropertyDisplayName same as name unless multiple roofs, then append roof name to property name
            var roofCode = parseInt(self.PROPERTIES[i].roofCode);
            // roofNamesAndId = array with 1 element for roofID == 0, multiple elements for multi-roof properties
            var roofNamesAndId = returnBldgNameFromRoofsByPropID(self.PROPERTIES[i].PRIMARY_ID);

            if (roofNamesAndId.length > 0) {
                if (roofCode == 0) {
                    self.PROPERTIES[i].displayName = self.PROPERTIES[i].name;
                    self.PROPERTIES[i].roofID = roofNamesAndId[0].roofID;
                } else {
                    // The existing Property entry takes the first roof 
                    // Then duplicate it so that each roof (bldg) has it's own Property entry
                    self.PROPERTIES[i].displayName = self.PROPERTIES[i].name + " - " + roofNamesAndId[0].bldgName;
                    self.PROPERTIES[i].roofID = roofNamesAndId[0].roofID;
                    roofNamesAndId.shift();
                    var propToClone = self.PROPERTIES[i];
                    for (var x = 0; x < roofNamesAndId.length; x++) {
                        var clonedProp = DB.clone(propToClone);
                        clonedProp.displayName = clonedProp.name + " - " + roofNamesAndId[x].bldgName;
                        clonedProp.roofID = roofNamesAndId[x].roofID;
                        tempProperties.push(clonedProp);
                    };
                };
            };
        };

        for (i = 0; i < tempProperties.length; i++) {
            self.PROPERTIES.push(tempProperties[i]);
        };

        self.PROPERTIES = underscore.sortBy(self.PROPERTIES, 'displayName');

        $rootScope.$broadcast('onSalesDataRefreshed');
    };

    var returnDisplayNameFromClient = function(id) {
        for (var i = 0; i < self.CLIENTS.length; i++) {
            if (self.CLIENTS[i].PRIMARY_ID == id) {
                return self.CLIENTS[i].displayName;
            }
        };
        return "";
    };

    var returnBldgNameFromRoofsByPropID = function(id) {
        var rtnArray = [];
        for (var i = 0; i < self.ROOFS.length; i++) {
            if (self.ROOFS[i].propertyID == id) {
                rtnArray.push({ bldgName: self.ROOFS[i].name, roofID: self.ROOFS[i].PRIMARY_ID });
            }
        };
        if (rtnArray.length == 0) {
            rtnArray.push({ bldgName: "Missing Roof Description", roofID: -1 });
        }
        return rtnArray;
    };

    var returnBldgNameFromRoofsByRoofID = function(id) {
        for (var i = 0; i < self.ROOFS.length; i++) {
            if (self.ROOFS[i].PRIMARY_ID == id) {
                return self.ROOFS[i].name;
            }
        };
        return "";
    };

    var returnPropertyName = function(id) {
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            if (self.PROPERTIES[i].PRIMARY_ID == id) {
                return self.PROPERTIES[i].name;
            }
        };
        return "";
    };

    var returnRoofCode = function(id) {
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            if (self.PROPERTIES[i].PRIMARY_ID == id) {
                return parseInt(self.PROPERTIES[i].roofCode);
            }
        };
        return -1;
    };

    var decodeRoofVals = function(dataObj) {
        var returnVO = {};

        returnVO.name = dataObj.name;

        var val = parseInt(dataObj.numLevels);
        returnVO.numLevels = L.returnIdValue(L.levelOptions, val);

        val = parseInt(dataObj.shingleGrade);
        returnVO.shingleGrade = L.returnIdValue(L.shingleGradeOptions, val);

        val = parseInt(dataObj.roofDeck);
        returnVO.roofDeck = L.returnIdValue(L.roofDeckOptions, val);

        val = parseInt(dataObj.layers);
        returnVO.layers = L.returnIdValue(L.numbersToTen, val);

        val = parseInt(dataObj.edgeDetail);
        returnVO.edgeDetail = L.returnIdValue(L.edgeDetail, val);

        val = parseInt(dataObj.edgeTrim);
        returnVO.edgeTrim = L.returnIdValue(L.yesNo, val);

        val = parseInt(dataObj.valleyDetail);
        returnVO.valleyDetail = L.returnIdValue(L.valleyOptions, val);

        val = parseInt(dataObj.ridgeCap);
        returnVO.ridgeCap = L.returnIdValue(L.ridgeCapShingles, val);

        val = parseInt(dataObj.roofVents);
        returnVO.roofVents = L.returnIdValue(L.ventOptions, val);

        val = parseInt(dataObj.pitch);
        returnVO.pitch = L.returnIdValue(L.pitchOptions, val);

        return returnVO;
    };

    self.getMultiVents = function() {
        DB.query("getMultiVents", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getMultiVents ---- " + resultObj.data);
            } else {
                self.MULTIVENTS = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMultiVents");
        });
    };
    self.getMultiLevels = function() {
        DB.query("getMultiLevels", null).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getMultiLevels ---- " + resultObj.data);
            } else {
                self.MULTILEVELS = resultObj.data;
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getMultiLevels");
        });
    };

    var getConfigMargin = function() {
        dataObj = {};
        dataObj.jobID = self.proposalUnderReview.jobID;
        DB.query("getConfigMargin", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getLabor ---- " + resultObj.data);
            } else {

            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getLabor");
        });
    };

    self.saveLaborConfig = function(data) {
        var Labor = data.Labor;
        var thisItem = "";
        var strData = "";
        for (var i = 0; i < self.laborConfig.length; i++) {
            if (Labor == self.laborConfig[i].Labor) {
                self.laborConfig[i].Qty = data.Qty;
                self.laborConfig[i].Cost = data.Cost;
                self.laborConfig[i].Total = parseInt(data.Qty) * Number(data.Cost);
            };
            thisItem = "";
            if (i == 0) {
                var prefix = "";
            } else {
                prefix = "!";
            };
            thisItem = prefix + self.laborConfig[i].Labor + ";" + self.laborConfig[i].Qty + ";" + self.laborConfig[i].Cost;
            strData += thisItem;
        };

        var y = 0;
        for (var i = 0; i < self.laborConfig.length; i++) {
            var x = Number(self.laborConfig[i].Total);
            y += x;
        }
        strData += "!Total;" + y;

        var dataObj = {};
        dataObj.labor = strData;
        dataObj.jobID = self.proposalUnderReview.jobID;
        DB.query("updateConfigLabor", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("saveLaborConfig ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('onSaveLaborConfig');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> updateConfigConfig");
        });
    }

    self.saveMarginConfig = function(data) {
        var dataObj = {};
        dataObj.margin = data;
        dataObj.jobID = self.proposalUnderReview.jobID;
        DB.query("updateConfigMargin", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("saveMarginConfig ---- " + resultObj.data);
            } else {

                $rootScope.$broadcast('onSaveMarginConfig');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> updateConfigConfig");
        });
    }


    self.saveJobConfig = function() {
        var dataObj = {};
        var dataStr = "";
        dataObj.jobID = self.proposalUnderReview.jobID;

        for (var i = 0; i < self.materialsCatergorized.Field.length; i++) {
            var a = self.materialsCatergorized.Field[i].Code;
            var b = self.materialsCatergorized.Field[i].Qty;
            var c = self.materialsCatergorized.Field[i].Checked;
            var d = self.materialsCatergorized.Field[i].PkgPrice;
            var e = self.materialsCatergorized.Field[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Starter.length; i++) {
            a = self.materialsCatergorized.Starter[i].Code;
            b = self.materialsCatergorized.Starter[i].Qty;
            c = self.materialsCatergorized.Starter[i].Checked;
            d = self.materialsCatergorized.Starter[i].PkgPrice;
            e = self.materialsCatergorized.Starter[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Ridge.length; i++) {
            a = self.materialsCatergorized.Ridge[i].Code;
            b = self.materialsCatergorized.Ridge[i].Qty;
            c = self.materialsCatergorized.Ridge[i].Checked;
            d = self.materialsCatergorized.Ridge[i].PkgPrice;
            e = self.materialsCatergorized.Ridge[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Vents.length; i++) {
            a = self.materialsCatergorized.Vents[i].Code;
            b = self.materialsCatergorized.Vents[i].Qty;
            c = self.materialsCatergorized.Vents[i].Checked;
            d = self.materialsCatergorized.Vents[i].PkgPrice;
            e = self.materialsCatergorized.Vents[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Flashing.length; i++) {
            a = self.materialsCatergorized.Flashing[i].Code;
            b = self.materialsCatergorized.Flashing[i].Qty;
            c = self.materialsCatergorized.Flashing[i].Checked;
            d = self.materialsCatergorized.Flashing[i].PkgPrice;
            e = self.materialsCatergorized.Flashing[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Edge.length; i++) {
            a = self.materialsCatergorized.Edge[i].Code;
            b = self.materialsCatergorized.Edge[i].Qty;
            c = self.materialsCatergorized.Edge[i].Checked;
            d = self.materialsCatergorized.Edge[i].PkgPrice;
            e = self.materialsCatergorized.Edge[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Valley.length; i++) {
            a = self.materialsCatergorized.Valley[i].Code;
            b = self.materialsCatergorized.Valley[i].Qty;
            c = self.materialsCatergorized.Valley[i].Checked;
            d = self.materialsCatergorized.Valley[i].PkgPrice;
            e = self.materialsCatergorized.Valley[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Flat.length; i++) {
            a = self.materialsCatergorized.Flat[i].Code;
            b = self.materialsCatergorized.Flat[i].Qty;
            c = self.materialsCatergorized.Flat[i].Checked;
            d = self.materialsCatergorized.Flat[i].PkgPrice;
            e = self.materialsCatergorized.Flat[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Caps.length; i++) {
            a = self.materialsCatergorized.Caps[i].Code;
            b = self.materialsCatergorized.Caps[i].Qty;
            c = self.materialsCatergorized.Caps[i].Checked;
            d = self.materialsCatergorized.Caps[i].PkgPrice;
            e = self.materialsCatergorized.Caps[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        for (i = 0; i < self.materialsCatergorized.Other.length; i++) {
            a = self.materialsCatergorized.Other[i].Code;
            b = self.materialsCatergorized.Other[i].Qty;
            c = self.materialsCatergorized.Other[i].Checked;
            d = self.materialsCatergorized.Other[i].PkgPrice;
            e = self.materialsCatergorized.Other[i].Category;
            dataStr += a + ';' + b + ';' + c + ';' + d + ';' + e + '!';
        };

        dataObj.config = dataStr;

        DB.query("updateConfigConfig", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("updateConfig ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('onSaveJobConfig');
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> updateConfigConfig");
        });

        self.updateConfigCost();
    };

    self.updateConfigCost = function() {
        var dataObj = {};
        dataObj.materialsCost = "Field;" + self.basePrice.Field + "!Valley;" + self.basePrice.Valley + "!Ridge;" + self.basePrice.Ridge + "!Total;" + self.basePrice.Total;
        dataObj.profitMargin = "";
        DB.query("updateConfigCost", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("updateConfig ---- " + resultObj.data);
            } else {

            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> updateConfigCost");
        });
    };

    self.updateConfigLabor = function(strVals) {
        var dataObj = {};
        dataObj.labor = strVals;
        DB.query("updateConfigLabor", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("updateConfig ---- " + resultObj.data);
            } else {

            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> updateConfigLabor");
        });
    };

    self.getRoofsForProperty = function(propID) {
        var dataObj = {};
        dataObj.propID = propID;
        DB.query("getRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getRoofsForProperty ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('getRoofsForProperty', resultObj.data);
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getRoofsForProperty");
        });
    };

    var getDefaultLabor = function() {
        DB.query("getLabor").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getLabor ---- " + resultObj.data);
            } else {
                self.laborDefault = resultObj.data[0];
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getLabor");
        });
    };

    var getConfigLabor = function() {
        DB.query("getConfigLabor").then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getLabor ---- " + resultObj.data);
            } else {
                self.laborConfig = resultObj.data[0];
            }
        }, function(error) {
            alert("Query Error - AdminSharedSrvc >> getLabor");
        });
    };

    self.returnSalesRep = function(id) {
        var rtn = "";
        for (var i = 0; i < self.salesReps.length; i++) {
            if (self.salesReps[i].PRIMARY_ID == id) {
                rtn = self.salesReps[i].name_first + " " + self.salesReps[i].name_last;
                continue;
            }
        }
        return rtn;
    };

    self.returnClientNameByID = function(id) {
        for (var i = 0; i < self.CLIENTS.length; i++) {
            if (self.CLIENTS[i].PRIMARY_ID == id) {
                return self.CLIENTS[i].displayName;
            };
        };
    };

    self.returnManagerNameByID = function(id) {
        for (var i = 0; i < self.salesReps.length; i++) {
            if (self.salesReps[i].PRIMARY_ID == id) {
                return self.salesReps[i].displayName;
            };
        };
    };

    self.returnManagerObjByID = function(id) {
        for (var i = 0; i < self.salesReps.length; i++) {
            if (self.salesReps[i].PRIMARY_ID == id) {
                return self.salesReps[i];
            };
        };
    };

    self.returnPropertyNameByID = function(id) {
        for (var i = 0; i < self.PROPERTIES.length; i++) {
            if (self.PROPERTIES[i].PRIMARY_ID == id) {
                return self.PROPERTIES[i].name;
            };
        };
    };


    self.returnObjByPropID = function(set, id) {
        var rtnObj = {};
        for (var i = 0; i < set.length; i++) {
            if (set[i].propertyID == id) {
                rtnObj = set[i];
                break;
            };
        };
        return rtnObj;
    };

    self.returnObjFromSetByPrimaryID = function(set, id) {
        var rtnObj = {};
        for (var i = 0; i < set.length; i++) {
            if (set[i].PRIMARY_ID == id) {
                rtnObj = set[i];
                break;
            };
        };
        return rtnObj;
    };

    self.triggerDataCascade = function() {
        getProperties();
    };



    getMaterialsList();
    getSalesReps();
    getProperties();
    getDefaultLabor();

    return self;
}]);
