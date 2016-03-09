<?php
class jobVO{
	var $PRIMARY_ID;
	var $jobNumber;
	var $property;// ID
	var $client;// ID
	var $manager;
	var $status;//Proposal; Contract; Active; Complete
	var $dateProspect;
	var $dateProposal;
	var $dateContract;
	var $dateActive;
	var $dateComplete;
	// Not from database - added in shared Service
	var $propertyName;
	var $clientName;
}
?>