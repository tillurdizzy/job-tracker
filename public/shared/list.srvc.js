'use strict';

app.service('ListSrvc',[function sharedLists(){
	var self = this;

	self.shingleManufacturers = [
		{label:"GAF",id:1,Code:"GAF"},
		{label:"Owens Corning",id:2,Code:"OC"}];


	self.upgradeCategories = ["Field","Ridge","Valley","Edge"];
	self.upgradeDefaultSelection = {Field:"STDFIELD",Ridge:"STDRDG",Valley:"GLVVAL",Edge:"DRPEDG15G"};

	self.jobStatusOptions = [
		{label:"Prospect",id:1},
		{label:"Proposal",id:2},
		{label:"Contract",id:3},
		{label:"Active",id:4},
		{label:"Complete",id:5}];
	
	self.propertyParams = [
		{label:"FIELD",id:10},
		{label:"TOPRDG",id:20},
		{label:"RKERDG",id:21},
		{label:"RKEWALL",id:22},
		{label:"RIDGETOTAL",id:23},
		{label:"EAVE",id:24},
		{label:"PRMITR",id:25},
		{label:"VALLEY",id:30},
		{label:"DECKNG",id:40},
		{label:"LOWSLP",id:50},
		{label:"LPIPE1",id:60},
		{label:"LPIPE2",id:61},
		{label:"LPIPE3",id:62},
		{label:"LPIPE4",id:63},
		{label:"VENT8",id:64},
		{label:"TURBNS",id:65},
		{label:"PWRVNT",id:16},
		{label:"AIRHWK",id:17},
		{label:"SLRVNT",id:18},
		{label:"PAINT",id:19},
		{label:"CAULK",id:20},
		{label:"CARPRT",id:21},
		{label:"SATDSH",id:22}];

	
	self.levelOptions = [
		{label:"One",id:1},
		{label:"Two",id:2},
		{label:"Three",id:3},
		{label:"Other",id:4}];

	self.shingleGradeOptions = [
		{label:"Standard (Three-Tab, Strip)",id:1},
		{label:"Dimensional / Architectural",id:2},
		{label:"Premium / Specialty / Designer)",id:3},
		{label:"Other",id:4}];

	self.roofDeckOptions = [
		{label:"Plywood",id:1},
		{label:"Tongue and Groove",id:2},
		{label:"Wood Shingles",id:3}];

	self.shingleTypeOptions = [
		{label:"Composition",id:1},
		{label:"Asphalt",id:2},
		{label:"Ceramic",id:3},
		{label:"Wood",id:4}];

		// Do not change {label:"Multi-level",id:6} without revising references to it 
	self.pitchOptions = [
		{label:"Flat (0-2)",id:1},
		{label:"Low (3-4)",id:2},
		{label:"Medium (5-8)",id:3},
		{label:"Steep (9-12)",id:4},
		{label:"Mansard",id:5},
		{label:"Multi-level",id:6}];

	self.multiLevelOptions = [
		{label:"NA",id:0},
		{label:"Flat (0-2)",id:1},
		{label:"Low (3-6)",id:2},
		{label:"Medium (7-9)",id:3},
		{label:"Steep (8+)",id:4}];

	self.percentOptions = [
		{label:"NA",id:0},
		{label:"10%",id:1},
		{label:"20%",id:2},
		{label:"30%",id:3},
		{label:"40%",id:4},
		{label:"50%",id:5},
		{label:"60%",id:6},
		{label:"70%",id:7},
		{label:"80%",id:8},
		{label:"90%",id:9}];

	self.coveredLayerOptions = [
		{label:"None (Deck)",id:1},
		{label:"Composition Shingles",id:2},
		{label:"Wood Shingles",id:3},
		{label:"Other",id:4}];

	self.numbersToTwelve = [
		{label:"One",id:1},{label:"Two",id:2},{label:"Three",id:3},{label:"Four",id:4},{label:"Five",id:5},
		{label:"Six",id:6},{label:"Seven",id:7},{label:"Eight",id:8},{label:"Nine",id:9},{label:"Ten",id:10},
		{label:"Eleven",id:11},{label:"Twelve+",id:12}];

	self.numbersToFive = [
		{label:"One",id:1},{label:"Two",id:2},{label:"Three",id:3},{label:"Four",id:4},{label:"Five",id:5}];

	self.numbersToTen = [
		{label:"Zero",id:0},{label:"One",id:1},{label:"Two",id:2},{label:"Three",id:3},{label:"Four",id:4},{label:"Five",id:5},
		{label:"Six",id:6},{label:"Seven",id:7},{label:"Eight",id:8},{label:"Nine",id:9},{label:"Ten",id:10}];
	
	self.edgeDetail = [
		{label:"None",id:0},
		{label:"Galvanized",id:1},
		{label:"Pre-painted",id:2}];

	self.valleyOptions = [
		{label:"Shingle-laced",id:1},
		{label:"Closed, with metal subflashing",id:2},
		{label:"Open metal",id:3}];

	self.ridgeCapShingles = [
		{label:"Standard Three-Tab",id:1},
		{label:"Z-Ridge / 9 in.",id:2},
		{label:"Premium / 12 in.",id:3}];

	self.ventOptions = [
		{label:"Ridge Vents",id:1},
		{label:"Various Other",id:2}];

	self.ventConfig = [
		{label:"Static / RV151",id:1},
		{label:"Turbine",id:2},
		{label:"Power",id:3},
		{label:"Solar",id:4}];

	self.trueFalse = [
		{label:"False",id:0},
		{label:"True",id:1}];

	self.yesNo = [
		{label:"No",id:0},
		{label:"Yes",id:1}];

	self.packageOptions = [
		{label:"Each",id:0},
		{label:"Bdl",id:1},
		{label:"Box",id:2},
		{label:"Roll",id:3},
		{label:"Pail",id:4},
		{ label: "Section", id: 5 }];

	self.unitOptions = [
		{label:"Each",id:0},
		{label:"Sq",id:1},
		{label:"Ft",id:2},
		{label:"SqFt",id:3},
		{label:"Lbs",id:4}];

	self.photoCats = [
		{label:"-- Select --"},
	    {label:"Street View"},
	    {label:"Shingles"},
	    {label:"Deck"},
	    {label:"Edge Detail"},
	    {label:"Valley Detail"},
	    {label:"Ridge Detail"},
	    {label:"Ventilation"},
	    {label:"Other"}];

	self.clientType = [
		{label:"-- Select --",id:-1},
		{label:"Individual",id:1},
		{label:"Business",id:2}];

	self.roofCode = [
		{label:"-- Select --",id:-1},
		{label:"Single Pitched Roof",id:0},
		{label:"Multiple Pitched Roofs",id:2},
		{label:"Single Flat Roof",id:5},
		{label:"Multiple Flat Roofs",id:6}];

	self.returnIdValue = function(set,id){
		var rtnObj = {};
		for (var i = 0; i < set.length; i++) {
			if (set[i].id == id) {
				rtnObj = set[i];
			}
		}
		return rtnObj;
	};

	self.returnObjById = function(set,id){
		var rtnObj = {};
		for (var i = 0; i < set.length; i++) {
			if (set[i].id == id) {
				rtnObj = set[i];
			}
		}
		return rtnObj;
	};

	self.returnObjByLabel = function(set,lbl){
		var rtnObj = {};
		for (var i = 0; i < set.length; i++) {
			if (set[i].label == lbl) {
				rtnObj = set[i];
				break;
			}
		}
		return rtnObj;
	};

}]);