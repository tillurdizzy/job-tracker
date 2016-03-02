'use strict';

app.controller('ReferenceCtrl',['$state',function ($state) {
	
	var Me = this;

	Me.goRefPage = function(page){
		$state.transitionTo(page);
	};

	Me.goLogin = function(){
		$state.transitionTo("login");
	};

	Me.goSplash = function(){
		$state.transitionTo("splash");
	};

	Me.goReference = function(){
		$state.transitionTo("reference");
	};


 }]);