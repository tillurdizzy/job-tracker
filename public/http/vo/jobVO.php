<?php
class jobVO{
	var $PRIMARY_ID;// auto unique
	var $jobNumber;
	var $property;// ID
	var $roofID;// ID
	var $client;// ID
	var $manager;
	var $status;//proposal; contract; active; complete
	var $dateProspect;// prospect
	var $dateProposal;// proposal
	var $dateContract;// contract
	var $dateActive;// active
	var $dateComplete;// complete
	// Not from database - added in shared Service
	var $propertyName;
	var $clientName;
}
?>