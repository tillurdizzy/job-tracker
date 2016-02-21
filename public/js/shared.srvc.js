'use strict';

app.service('SharedSrvc',['$rootScope',function sharedVars($rootScope){
	var self = this;
	
	self.myID = "SharedVars: ";

	// Full Lists of all data
	// Not filtered by Manager
	self.fullClientList = [];
	self.fullPropertyList = [];
	self.fullJobList = [];

	// User vars
	self.loggedIn = false;
	self.logInObj = {};
	self.dataRefreshed = false;
	self.managerID = "";
	self.managerName = "";
	self.managerJobs = [];
	self.managerClients = [];
	self.managerProperties = [];
	
	//User selections when editing
	self.selectedJobObj = {};
	self.selectedClientObj = {};
	self.selectedPropertyObj = {};

	// AWS Bucket Vars
	self.awsBucketUrl = "https://s3.amazonaws.com/"; // Specific to AWS Account

	self.keyValues = [];


	// Methods

	//Called after successful Log In
	self.setUser = function(obj){
		self.logInObj = obj;
		self.loggedIn = true;


		//... Get rid of these and adjust reference to above obj
		self.managerID = obj.PRIMARY_ID;
		self.managerName = obj.name_first + " " + obj.name_last;
		
	};

	self.logOut = function(){
		self.logInObj = {};
		self.managerID = "";
		self.managerName = "";
		self.loggedIn = false;
		self.managerJobs = [];
		self.managerClients = [];
		self.managerProperties = [];
	};


	//Called from their respective Summary Tables
	self.selectJob = function(obj){
		self.selectedJobObj = obj;
		self.setClientByID(self.selectedJobObj.client);
		self.setPropertyByID(self.selectedJobObj.property);
	};

	self.selectClient = function(obj){
		self.selectedClientObj = obj;
	};

	self.selectProperty = function(obj){
		self.selectedPropertyObj = obj;
	};

	self.setJobByID = function(id){
		for (var i = 0; i < self.managerJobs.length; i++) {
			if(self.managerJobs[i].PRIMARY_ID == id){
				self.selectedJobObj = self.managerJobs[i];
				break;
			}
		};
	};

	self.setClientByID = function(id){
		for (var i = 0; i < self.managerClients.length; i++) {
			if(self.managerClients[i].PRIMARY_ID == id){
				self.selectedClientObj = self.managerClients[i];
				break;
			}
		};
	};

	self.setPropertyByID = function(id){
		for (var i = 0; i < self.managerProperties.length; i++) {
			if(self.managerProperties[i].PRIMARY_ID == id){
				self.selectedPropertyObj = self.managerProperties[i];
				break;
			}
		};
	};


	// Jobs, Clients and Properties will always be refreshed together in that order
	// This is the first of 3 calls from DB as each one is completed
	self.setManagerJobsList = function(d){
		// Reset all 3 lists
		self.dataRefreshed = false;
		self.managerClients = [];
		self.managerProperties = [];
		self.managerJobs = [];
		self.managerJobs = d;
		//parseJobDates();
	};

	self.setManagerClients = function(c){
		var arr = c;
		self.managerClients = [];
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].manager == self.managerID){
				self.managerClients.push(arr[i]);
			}
		};
	};
	
	self.setManagerProperties = function(p){
		var arr = p;
		self.managerProperties = [];
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].manager == self.managerID){
				self.managerProperties.push(arr[i]);
			}
		};
		// Should have all 3 lists complete now
		// Collate Jobs with their Client and Property
		translateRelations();
	};


	self.setAllClients = function(c){
		self.fullClientList = c;	
	};
	self.setAllProperties = function(c){
		self.fullPropertyList = c;	
	};
	self.setAllJobs = function(c){
		self.fullJobsList = c;	
	};

	var returnCompany = function(id){
		for (var i = 0; i < self.managerClients.length; i++) {
			if(self.managerClients[i].PRIMARY_ID === id){
				return self.managerClients[i].company;
			}
		};
	};

	var returnDisplayNameFromClient = function(id){
		for (var i = 0; i < self.managerClients.length; i++) {
			if(self.managerClients[i].PRIMARY_ID === id){
				return self.managerClients[i].displayName;
			}
		};
	};

	var returnProperty = function(id){
		for (var i = 0; i < self.managerProperties.length; i++) {
			if(self.managerProperties[i].PRIMARY_ID === id){
				return self.managerProperties[i].name;
			}
		};
	};

	var translateRelations = function(){
		// Translate related Client and Property ID #'s from Jobs into Names
		for (var i = 0; i < self.managerJobs.length; i++) {
			var clientID = self.managerJobs[i].client;
			var thisClient = returnDisplayNameFromClient(clientID);
			self.managerJobs[i].clientName = thisClient;

			var propID = self.managerJobs[i].property;
			var thisProperty = returnProperty(propID);
			self.managerJobs[i].propertyName = thisProperty;
		};

		for (var i = 0; i < self.managerProperties.length; i++) {
			
			clientID=self.managerProperties[i].client;
			self.managerProperties[i].client = returnDisplayNameFromClient(clientID);

			var ID = self.managerProperties[i].numLevels;
			self.managerProperties[i].numLevels = self.returnIdValue(self.levelOptions,ID);

			ID = self.managerProperties[i].shingleGrade;
			self.managerProperties[i].shingleGrade = self.returnIdValue(self.shingleGradeOptions,ID);

			ID = self.managerProperties[i].roofDeck;
			self.managerProperties[i].roofDeck = self.returnIdValue(self.roofDeckOptions,ID);

			ID = self.managerProperties[i].layers;
			self.managerProperties[i].layers = self.returnIdValue(self.numbersToTen,ID);

			ID = self.managerProperties[i].edgeDetail;
			self.managerProperties[i].edgeDetail = self.returnIdValue(self.edgeDetail,ID);

			ID = self.managerProperties[i].edgeTrim;
			self.managerProperties[i].edgeTrim = self.returnIdValue(self.yesNo,ID);

			ID = self.managerProperties[i].valleyDetail;
			self.managerProperties[i].valleyDetail = self.returnIdValue(self.valleyOptions,ID);

			ID = self.managerProperties[i].ridgeCap;
			self.managerProperties[i].ridgeCap = self.returnIdValue(self.ridgeCapShingles,ID);

			ID = self.managerProperties[i].roofVents;
			self.managerProperties[i].roofVents = self.returnIdValue(self.ventOptions,ID);

			ID = self.managerProperties[i].pitch;
			self.managerProperties[i].pitch = self.returnIdValue(self.pitchOptions,ID);

			//ID = self.managerProperties[i].multiLevel;
			//self.managerProperties[i].multiLevel = self.returnIdValue(self.multiLevelOptions,ID);

			//ID = self.managerProperties[i].multiVents;
			//self.managerProperties[i].multiVents = self.returnIdValue(self.ventConfig,ID);


		}
		self.dataRefreshed = true;
		$rootScope.$broadcast("data-refreshed");
	};

	
	
	var convertDateToString = function(m){
		var dateStr = ""
		var d = new Date(m);
		return dateStr;
	};

	
	self.levelOptions = [
		{label:"One",id:1},
		{label:"Two",id:2},
		{label:"Three",id:3},
		{label:"Other",id:4}];

	self.shingleGradeOptions = [
		{label:"Standard (Three-Tab, Strip)",id:1},
		{label:"Dimensional (Architectural, Laminated)",id:2},
		{label:"Premium (Specialty, Designer)",id:3},
		{label:"Other",id:4}];

	self.roofDeckOptions = [
		{label:"Plywood",id:1},
		{label:"Tongue and Groove",id:2},
		{label:"Wood Shingles",id:3}];

	self.shingleTypeOptions = [
		{label:"Composition",id:1},
		{label:"Asphalt",id:2},
		{label:"Ceramic",id:3},
		{label:"Wood",id:4}];

	self.pitchOptions = [
		{label:"Flat (0-2)",id:1},
		{label:"Low (3-4)",id:2},
		{label:"Medium (5-8)",id:3},
		{label:"Steep (9-12)",id:4},
		{label:"Mansard",id:5},
		{label:"Multi-level",id:6}];

	self.multiLevelOptions = [
		{label:"NA",id:0},
		{label:"Flat (0-2)",id:1},
		{label:"Low (3-6)",id:2},
		{label:"Medium (7-9)",id:3},
		{label:"Steep (8+)",id:4}];

	self.percentOptions = [
		{label:"NA",id:0},
		{label:"10%",id:1},
		{label:"20%",id:2},
		{label:"30%",id:3},
		{label:"40%",id:4},
		{label:"50%",id:5},
		{label:"60%",id:6},
		{label:"70%",id:7},
		{label:"80%",id:8},
		{label:"90%",id:9}];

	self.coveredLayerOptions = [
		{label:"None (Deck)",id:1},
		{label:"Composition Shingles",id:2},
		{label:"Wood Shingles",id:3},
		{label:"Other",id:4}];

	self.numbersToTwelve = [
		{label:"One",id:1},{label:"Two",id:2},{label:"Three",id:3},{label:"Four",id:4},{label:"Five",id:5},
		{label:"Six",id:6},{label:"Seven",id:7},{label:"Eight",id:8},{label:"Nine",id:9},{label:"Ten",id:10},
		{label:"Eleven",id:11},{label:"Twelve+",id:12}];

	self.numbersToFive = [
		{label:"One",id:1},{label:"Two",id:2},{label:"Three",id:3},{label:"Four",id:4},{label:"Five",id:5}];

	self.numbersToTen = [
		{label:"Zero",id:0},{label:"One",id:1},{label:"Two",id:2},{label:"Three",id:3},{label:"Four",id:4},{label:"Five",id:5},
		{label:"Six",id:6},{label:"Seven",id:7},{label:"Eight",id:8},{label:"Nine",id:9},{label:"Ten",id:10}];
	
	self.edgeDetail = [
		{label:"None",id:0},
		{label:"Galvanized",id:1},
		{label:"Pre-painted",id:2}];

	self.valleyOptions = [
		{label:"Shingle-laced",id:1},
		{label:"Closed, with metal subflashing",id:2},
		{label:"Open metal",id:3}];

	self.ridgeCapShingles = [
		{label:"Standard Three-Tab",id:1},
		{label:"Z-Ridge / 9 in.",id:2},
		{label:"Premium / 12 in.",id:3}];

	self.ventOptions = [
		{label:"Ridge Vents",id:1},
		{label:"Various Other",id:2}];

	self.ventConfig = [
		{label:"Static / RV151",id:1},
		{label:"Turbine",id:2},
		{label:"Power",id:3},
		{label:"Solar",id:4}];

	self.trueFalse = [
		{label:"False",id:0},
		{label:"True",id:1}];

	self.yesNo = [
		{label:"No",id:0},
		{label:"Yes",id:1}];

	self.photoCats = [
	    {label:"Street View"},
	    {label:"Shingles"},
	    {label:"Deck"},
	    {label:"Edge Detail"},
	    {label:"Valley Detail"},
	    {label:"Ridge Detail"},
	    {label:"Ventilation"},
	    {label:"Other"}];

	self.returnIdValue = function(set,id){
		var rtnObj = {};
		for (var i = 0; i < set.length; i++) {
			if (set[i].id == id) {
				rtnObj = set[i];
			}
		}
		return rtnObj;
	};



	
	
}]);