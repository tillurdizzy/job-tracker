<?php
class jobVO{
	var $PRIMARY_ID;// auto unique
	var $jobNumber;
	var $property;// ID
	var $client;// ID
	var $manager;
	var $status;//prospect; proposal; contract; active; complete
	var $dateProposal;// proposal
	var $dateContract;// contract
	var $dateActive;// active
	var $dateComplete;// complete
	// Not from database - added in shared Service
	var $propertyName;
	var $clientName;
}
?>