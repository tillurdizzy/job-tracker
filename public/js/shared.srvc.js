'use strict';

app.service('SharedSrvc',[function sharedVars(){
	var self = this;
	
	self.myID = "SharedVars: ";

	// Session Vars - will usually remain unchanged for user's session
	self.managerID = "";
	self.managerClients = [];
	self.managerProperties = [];

	//Database vars
	self.jobList = [];//unfiltered, unsorted directly from database
	self.status_0 = [];//prospects
	self.status_1 = [];//proposals
	self.status_2 = [];//contracts
	self.status_3 = [];//active jobs
	self.status_4 = [];//completed jobs

	// Current Vars for a specific selected property/job
	self.selectedJobObj = {};
	

	// Methods

	self.setManagerID = function(id,n){
		self.managerID = id;
		self.managerName = n;
	};

	self.selectJob = function(obj){
		self.selectedJobObj = obj;
	}

	self.setRawData = function(d){
		self.jobList = [];//unfiltered, unsorted directly from database
		self.jobList = d;
		self.status_0 = [];//prospects
		self.status_1 = [];//proposals
		self.status_2 = [];//contracts
		self.status_3 = [];//active jobs
		self.status_4 = [];//completed jobs
		self.sortData();
	};

	self.sortData = function(){
		for (var i = 0; i < self.jobList.length; i++) {
			var thisStatus = self.jobList[i].status;
			switch(thisStatus){
				case "Prospect": self.status_0.push(self.jobList[i]);break;
				case "Proposal": self.status_1.push(self.jobList[i]);break;
				case "Contract": self.status_2.push(self.jobList[i]);break;
				case "Active": self.status_3.push(self.jobList[i]);break;
				case "Complete": self.status_4.push(self.jobList[i]);break;
			};
		};
	};

	self.setManagerClients = function(c){
		var allClients = c;
		self.managerClients = [];
		for (var i = 0; i < allClients.length; i++) {
			if(allClients[i].manager == self.managerID){
				self.managerClients.push(allClients[i]);
			}
		};
	};

	self.setManagerProperties = function(p){
		var allProperties = p;
		self.managerProperties = [];
		for (var i = 0; i < allProperties.length; i++) {
			if(allProperties[i].manager == self.managerID){
				self.managerProperties.push(allProperties[i]);
			}
		};
	};

	

	
}]);