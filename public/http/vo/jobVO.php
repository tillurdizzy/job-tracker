<?php
class jobVO{
	var $PRIMARY_ID;
	var $jobNumber;
	var $property;
	var $roofID;
	var $client;
	var $manager;
	var $status;
	var $dateProspect;
	var $dateProposal;
	var $dateContract;
	var $dateActive;
	var $dateComplete;
	// Not from database - added in shared Service
	var $propertyDisplayName;
	var $clientDisplayName;
	var $jobLabel;
	var $bldgName="";
}
?>