'use strict';

app.controller('NavCtrl',['$state',function ($state) {
	
	var Me = this;
	Me.menuOpen =  false;
	

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