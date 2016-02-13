'use strict';

app.service('ClientSrvc',[function clientSrvc(){
	var self = this;
	
	self.myID = "ClientSrvc: ";
	self.loggedIn = false;

	self.clientID = "";
	self.clientName = "";
	self.clientJobID = 0;
	
	//User selections when editing
	self.clientJobObj = {};
	self.clientInfoObj = {};
	self.clientPropertyObj = {};
	

	//Called after successful Log In
	self.setClientID = function(id,name,jobid){
		self.clientID = id;
		self.clientName = n;
		self.clientJobID = jobid;
		self.loggedIn = true;
	};

	self.logOut = function(){
		self.clientID = "";
		self.clientName = "";
		self.loggedIn = false;
		self.clientJobObj = {};
		self.clientInfoObj = {};
		self.clientPropertyObj = {};
	};


	

	
}]);