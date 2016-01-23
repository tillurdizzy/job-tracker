'use strict';

app.controller('OffCanvasCtrl',['$state',function ($state) {
	
	var Me = this;
	Me.menuOpen =  false;

	
	Me.toggleNav = function(){
		Me.menuOpen = !Me.menuOpen;
		
	};

	Me.menuClick = function(s){
		$state.transitionTo(s);
		Me.menuOpen =  false;
	};


 }]);