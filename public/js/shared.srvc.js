'use strict';

app.service('SharedSrvc',['$rootScope',function sharedVars($rootScope){
	var self = this;
	
	self.myID = "SharedVars: ";

	// Full Lists of all data
	// Not filtered by Manager
	self.fullClientList = [];
	self.fullPropertyList = [];
	self.fullJobList = [];

	// Manager vars
	self.loggedIn = false;
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
	
	// Methods

	//Called after successful Log In
	self.setManagerID = function(id,n){
		self.managerID = id;
		self.managerName = n;
		self.loggedIn = true;
	};

	self.logOut = function(){
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
		parseJobDates();
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
		collateLists();
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

	var returnProperty = function(id){
		for (var i = 0; i < self.managerProperties.length; i++) {
			if(self.managerProperties[i].PRIMARY_ID === id){
				return self.managerProperties[i].name;
			}
		};
	};

	var collateLists = function(){
		for (var i = 0; i < self.managerJobs.length; i++) {
			var clientID = self.managerJobs[i].client;
			var thisClient = returnCompany(clientID);
			self.managerJobs[i].clientName = thisClient;

			var propID = self.managerJobs[i].property;
			var thisProperty = returnProperty(propID);
			self.managerJobs[i].propertyName = thisProperty;
		};
		self.dataRefreshed = true;
		$rootScope.$broadcast("data-refreshed");
	};


	// Using angular filter instead
	var parseJobDates = function(){
		for (var i = 0; i < self.managerJobs.length; i++) {
			var d = self.managerJobs[i].dateProposal;
			if(d == "0"){
				self.managerJobs[i].dateProposal = "";
			}
			
			d = self.managerJobs[i].dateContract;
			if(d == "0"){
				self.managerJobs[i].dateContract = "";
			}
			
			d = self.managerJobs[i].dateActive;
			if(d == "0"){
				self.managerJobs[i].dateActive = "";
			}
			
			d = self.managerJobs[i].dateComplete;
			if(d == "0"){
				self.managerJobs[i].dateComplete = "";
			}
			
		}
	};

	

	var convertDateToString = function(m){
		var dateStr = ""
		var d = new Date(m);
		return dateStr;
	};

	self.roofOptions = [
		{label:"3-tab",id:0},
		{label:"Dimensional",id:1},
		{label:"Speciality",id:2}];

	self.compositionOptions = [
		{label:"Composition over plywood deck",id:0},
		{label:"Composition over deck low slope",id:1},
		{label:"Composition over wood shingles",id:2}];

	self.compositionLayers = [
		{label:"1",id:1},{label:"2",id:2},{label:"3",id:3},{label:"4",id:4},{label:"5",id:5},
		{label:"6",id:6},{label:"7",id:7},{label:"8",id:8},{label:"9",id:9},{label:"10",id:10},
		{label:"11",id:11},{label:"12",id:12}];

	self.deckOptions = [
		{label:"Plywood",id:0},
		{label:"Tongue and Groove",id:1}];

	self.edgeDetail = [
		{label:"Painted drip edge",id:0},
		{label:"With 1x2 trim",id:1}];

	self.valleyOptions = [
		{label:"Shingle-laced",id:0},
		{label:"Open metal",id:1}];

	self.ridgeOptions = [
		{label:"Standard 3-tab",id:0},
		{label:"Enhanced ridge detail",id:1}];

	self.ventilationOptions = [
		{label:"Ridge vents",id:0},
		{label:"Static vents",id:1},
		{label:"Turbine vents",id:2},
		{label:"Power vents",id:3},
		{label:"Solar vents",id:4}];
	

	
}]);