'use strict';

app.service('SharedSrvc',[function sharedVars(){
	var self = this;
	
	self.myID = "SharedVars: ";

	// Full Lists of all data
	// Not filtered by Manager
	self.fullClientList = [];
	self.fullPropertyList = [];
	self.fullJobList = [];

	// Manager vars
	self.loggedIn = false;
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

	//Called from their rrespective Summary Tables
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

	// Triggered every time viewContentLoaded on Job Summary page
	// Jobs, Clients and Properties will always be refreshed together in that order
	// When Properties is set, we can go ahead and collate every time
	self.setManagerJobsList = function(d){
		// Reset all 3 lists
		self.managerClients = [];
		self.managerProperties = [];
		self.managerJobs = [];
		self.managerJobs = d;
		parseJobDates();
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


	self.setManagerClients = function(c){
		var arr = c;
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].manager == self.managerID){
				self.managerClients.push(arr[i]);
			}
		};
	};
	
	self.setManagerProperties = function(p){
		var arr = p;
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].manager == self.managerID){
				self.managerProperties.push(arr[i]);
			}
		};
		// Should have all 3 lists complete now
		// Collate Jobs with their Client and Property
		collateLists();
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

	

	
}]);