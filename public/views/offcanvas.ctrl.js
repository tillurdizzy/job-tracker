'use strict';

app.controller('OffCanvasCtrl',['$state','LogInSrvc',function ($state,LogInSrvc) {
	
	var Me = this;
	Me.menuOpen =  false;
	Me.L = LogInSrvc;
	
	Me.toggleNav = function(){
		Me.menuOpen = !Me.menuOpen;
	};

	Me.menuClick = function(s){
		$state.transitionTo(s);
		Me.menuOpen =  false;
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