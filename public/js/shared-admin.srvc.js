'use strict';

app.service('SharedAdmin',[function sharedAdminVars(){
	var self = this;
	
	self.myID = "SharedAdmin: ";

	self.invtCategories = [
		{label:"Membranes",val:0},
		{label:"Protection and Walkway Materials",val:1},
		{label:"Flashing and Stripping Materials",val:2},
		{label:"Edge Materials",val:3},
		{label:"Adhesives and Sealants",val:4},
		{label:"Fasteners",val:5},
		{label:"Insulation and Cover-Board",val:6}];

	self.invtUnits = [
		{label:"Each",val:"Each"},
		{label:"Roll",val:"Roll"},
		{label:"Box",val:"Box"},
		{label:"Case",val:"Case"},
		{label:"Pail",val:"Pail"},
		{label:"Gallon",val:"Gallon"},
		{label:"Tank",val:"Tank"},
		{label:"Skid",val:"Skid"},
		{label:"Sq.Ft.",val:"Sq.Ft."},
		{label:"Set",val:"Set"}];

	self.invtManufacturers = [
		{label:"FiberTite",val:"FiberTite"}];
}]);