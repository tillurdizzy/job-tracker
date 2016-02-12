<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/propertyVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$query = sprintf("SELECT * FROM property");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new propertyVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
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
	$oneVO->coveredLayer = $row->coveredLayer;
	$oneVO->layersCovering = $row->layersCovering;
	$oneVO->edgeDetail = $row->edgeDetail;
	$oneVO->valleyDetail = $row->valleyDetail;
	$oneVO->ridgeCap = $row->ridgeCap;
	$oneVO->roofVents = $row->roofVents;
	$oneVO->pitchAvg = $row->pitchAvg;
	
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>