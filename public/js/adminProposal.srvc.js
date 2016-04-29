'use strict';

app.service('AdminProposalSrvc',[function AdminPropSrvc(){
	var self = this;
	
	self.myID = "ClientSrvc: ";
	self.loggedIn = false;

	
	self.displayName = "";
	self.jobID = 0;
	
	//Client data objects
	self.jobObj = {};
	self.idObj = {};
	self.propertyObj = {};

	self.setData = function(obj,set){
		switch(set){
			case "job":self.jobObj = obj;break;
			case "property":self.propertyObj = obj;break;
			case "id":self.idObj = obj;break;
		}
	}
	

	//Called after successful Log In
	self.LogIn = function(obj){
		self.displayName = obj.name_first + " " + obj.name_last;
		self.jobID = obj.jobID;
		self.loggedIn = true;
	};

	self.logOut = function(){
		self.clientID = "";
		self.displayName = "";
		self.loggedIn = false;
		self.jobObj = {};
		self.idObj = {};
		self.propertyObj = {};
	};

}]);