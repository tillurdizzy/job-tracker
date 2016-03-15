'use strict';

app.controller('ReviewCtrl',['$scope','$state','ClientSharedSrvc',function ($scope,$state,ClientSharedSrvc) {
	
	var ME = this;
	
	ME.C = ClientSharedSrvc;
	ME.UpgradeRidgeCaps = {};
	ME.UpgradeDripEdge = {};
	ME.baseLineTotal = "5855.76";
	ME.grandTotal = ME.baseLineTotal;

	ME.UpgradeFieldShingleSelection = "GAFTBRNAT";
	ME.UpgradeRidgeSelection = "Default";
	ME.UpgradeValleySelection = "Default";
	ME.UpgradeTrimSelection = "Default";

	ME.showUpgrades = {field:true,ridge:false,valley:false,trim:false};
	ME.shingleUpgradePrices = {GAFTBRNAT:"0",GAFTBRHD:"248",GAFTBRUHD:"302",GAFTBRCOOL:"389",GAFARMSH:"633",GAFGRNSEQ:"677"};
	ME.ridgeUpgradePrices = {Default:"0",Upgrade:"248"};
	ME.valleyUpgradePrices = {Default:"0",Upgrade:"102"};
	ME.trimUpgradePrices = {Default:"0",Upgrade:"133"};


	ME.calculateTotal = function(){
		var fieldUpgradeCost = Number(ME.shingleUpgradePrices[ME.UpgradeFieldShingleSelection]);
		var ridgeUpgradeCost = Number(ME.ridgeUpgradePrices[ME.UpgradeRidgeSelection]);
		var valleyUpgradeCost = Number(ME.valleyUpgradePrices[ME.UpgradeValleySelection]);
		var trimUpgradeCost = Number(ME.trimUpgradePrices[ME.UpgradeTrimSelection]);
		var base = Number(ME.baseLineTotal);
		ME.grandTotal = base + fieldUpgradeCost + ridgeUpgradeCost + valleyUpgradeCost + trimUpgradeCost;

	}
	
	
	$scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.C.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }
    });

   

 }]);