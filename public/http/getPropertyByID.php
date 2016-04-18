<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/propertyVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$ID = mysqli_real_escape_string($con,$data->ID);
$query = sprintf("SELECT * FROM properties WHERE PRIMARY_ID = '".$ID."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new propertyVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->manager = $row->manager;
	$oneVO->client = $row->client;
	$oneVO->multiUnit = $row->multiUnit;
	$oneVO->name = $row->name;
	$oneVO->street = $row->street;
	$oneVO->city = $row->city;
	$oneVO->state = $row->state;
	$oneVO->zip = $row->zip;
	
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>