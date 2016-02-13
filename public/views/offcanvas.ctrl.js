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


 }]);