'use strict';

app.service('LogInSrvc',[function logInSrvc(){
	var self = this;
	
	self.loggedIn = false;
	self.userVO = {};
	self.userID = 0;
	self.userName = "";
	self.userType = "";
	self.jobID = 0;// we only use this if the user is of type client
	self.showTopBar = false;
	
	//Called after successful Log In
	self.setUser = function(vo){
		self.userVO = vo;
		self.userID = self.userVO.PRIMARY_ID;
		self.userName = self.userVO.name_first + " " + self.userVO.name_last;
		self.userType = self.userVO.userType;
		self.jobID = self.userVO.jobID;
		self.loggedIn = true;
		if(self.userType != "client"){
			self.showTopBar = true;
		}
	};

	self.logOut = function(){
		self.loggedIn = false;
		self.userVO = {};
		self.userID = 0;
		self.userName = "";
		self.userType = "";
		self.showTopBar = false;
	};

}]);