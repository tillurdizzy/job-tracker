<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/ventsVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$propertyID = mysqli_real_escape_string($con,$data->ID);
$query = sprintf("SELECT * FROM multi_vents WHERE propertyID = '".$propertyID."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new ventsVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->TURBNS = $row->TURBNS;
	$oneVO->STATIC = $row->STATIC;
	$oneVO->PWRVNT = $row->PWRVNT;
	$oneVO->AIRHWK = $row->AIRHWK;
	$oneVO->SLRVNT = $row->SLRVNT;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>