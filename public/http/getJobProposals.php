<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/propertyVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM properties 
WHERE PRIMARY_ID IN (
SELECT property FROM jobs_list 
WHERE dateProposal > 0 AND dateContract = 0)");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new propertyVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->createdDate = $row->createdDate;
	$oneVO->manager = $row->manager;
	$oneVO->client = $row->client;
	$oneVO->name = $row->name;
	$oneVO->street = $row->street;
	$oneVO->city = $row->city;
	$oneVO->state = $row->state;
	$oneVO->zip = $row->zip;
	$oneVO->numLevels = $row->numLevels;
	$oneVO->shingleGrade = $row->shingleGrade;
	$oneVO->roofDeck = $row->roofDeck;
	$oneVO->layers = $row->layers;
	$oneVO->edgeDetail = $row->edgeDetail;
	$oneVO->valleyDetail = $row->valleyDetail;
	$oneVO->ridgeCap = $row->ridgeCap;
	$oneVO->roofVents = $row->roofVents;
	$oneVO->pitch = $row->pitch;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>