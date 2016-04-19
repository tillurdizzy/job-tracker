<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/roofVO.php');
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$query = sprintf("SELECT * FROM roof");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new roofVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->propertyID = $row->propertyID;
	$oneVO->name = $row->name;
	$oneVO->numLevels = $row->numLevels;
	$oneVO->shingleGrade = $row->shingleGrade;
	$oneVO->roofDeck = $row->roofDeck;
	$oneVO->layers = $row->layers;
	$oneVO->edgeDetail = $row->edgeDetail;
	$oneVO->edgeTrim = $row->edgeTrim;
	$oneVO->valleyDetail = $row->valleyDetail;
	$oneVO->ridgeCap = $row->ridgeCap;
	$oneVO->roofVents = $row->roofVents;
	$oneVO->pitch = $row->pitch;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>