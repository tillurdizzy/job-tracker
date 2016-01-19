<?php
class jobVO{
	var $PRIMARY_ID;// auto unique
	var $jobNumber;
	var $property;// residential or commercial
	var $roof;// pitched or flat
	var $manager;
	var $status;//prospect; proposal; contract; active; complete
	var $name;// ex. Parkview Townhomes or Smith Residecse
	var $address;
	var $city;
	var $state;
	var $zip;
	var $contact;
	var $phone;
	var $email;
	var $date1;// prospect 
	var $date2;// proposal
	var $date3;// contract
	var $date4;// active
	var $date5;// complete
	var $date0;// the last time status was changed; this will always match one of the above
}
?>