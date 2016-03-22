'use strict';

app.controller('ReviewCtrl',['$scope','$state','ClientSharedSrvc','ngDialog','$controller',function ($scope,$state,ClientSharedSrvc,ngDialog,$controller) {
	
	var ME = this;

	// Selections and pricing specific to a job
    ME.jobConfig = [];
    var jobParams = {};
	
	ME.C = ClientSharedSrvc;
	ME.UpgradeRidgeCaps = {};
	ME.UpgradeDripEdge = {};
	ME.baseLineTotal = ME.C.baseLineTotal;
	ME.grandTotal = ME.baseLineTotal;
	ME.imagePath = "client/img/";
	ME.selectedPhoto = {path:"",cap:""};
	ME.shingleManufacturer = "GAF";

	ME.UpgradeFieldShingleSelection = "GAFROYSOV";
	ME.UpgradeRidgeSelection = "Default";
	ME.UpgradeValleySelection = "Default";
	ME.UpgradeTrimSelection = "Default";

	ME.showUpgrades = {field:true,ridge:false,valley:false,trim:false};

	ME.shingleUpgradePrices = {GAFROYSOV:0,GAFTBRNAT:"215",GAFTBRHD:"248",GAFTBRUHD:"302",GAFTBRCOOL:"389",GAFARMSH:"633",GAFGRNSEQ:"677",OCSUPRM:"0",OCOAKRDG:"156",
OCDURATN:"233",OCDURPRCL:"365",OCWTHRGRD:"415",OCBRKSHR:"678"};
	ME.ridgeUpgradePrices = {Default:"0",GAFRDG:"248",OCPROEDG:"0",OCDURARDG:"0",OCDECORDG:"0",OCDECODUR:"0",OCBERKRDG:"0"};
	ME.valleyUpgradePrices = {Default:"0",Upgrade:"102"};
	ME.trimUpgradePrices = {Default:"0",Upgrade:"133"};

	ME.OC_RidgeShingles = [{label:"Owens Corning RIZERidge",price:""}];


	ME.calculateTotal = function(){
		var fieldUpgradeCost = Number(ME.shingleUpgradePrices[ME.UpgradeFieldShingleSelection]);
		var ridgeUpgradeCost = Number(ME.ridgeUpgradePrices[ME.UpgradeRidgeSelection]);
		var valleyUpgradeCost = Number(ME.valleyUpgradePrices[ME.UpgradeValleySelection]);
		var trimUpgradeCost = Number(ME.trimUpgradePrices[ME.UpgradeTrimSelection]);
		var base = Number(ME.baseLineTotal);
		ME.grandTotal = base + fieldUpgradeCost + ridgeUpgradeCost + valleyUpgradeCost + trimUpgradeCost;

		var firstChar = ME.UpgradeFieldShingleSelection[0];
		if(firstChar === "G"){
			ME.shingleManufacturer = "GAF";
		}else{
			ME.shingleManufacturer = "OC";
		}
	};

	ME.thumbClick = function(ndx){
		ME.selectedPhoto.path = ME.C.photoGallery[ndx].full;
		ME.selectedPhoto.cap = ME.C.photoGallery[ndx].cap;
		var myTemplate = "client/js/full.tpl.html";
		ngDialog.open({
            template: myTemplate,
            scope: $scope,
        	controller: $controller('DialogCtrl', {$scope: $scope,dataObj: ME.selectedPhoto})
        });
	};

	ME.getUpgradeOptions = function(){
		ME.shingleUpgrades = ME.C.getUpgrades("Field");
		ME.ridgeUpgrades = ME.C.getUpgrades("Ridge");
		ME.valleyUpgrades = ME.C.getUpgrades("Valley");
		ME.trimUpgrades = ME.C.getUpgrades("Edge");
	};
	
	
	$scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.C.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }else{
       		
       };

    });

    $scope.$on('on-proposal-data-complete', function() {
      ME.getUpgradeOptions();
    });

  
 }]);