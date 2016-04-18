<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/materialOptionsVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$ID = mysqli_real_escape_string($con,$data->jobID);

$query = sprintf("SELECT * FROM material_options WHERE jobID = '".$ID."'");
$result = mysqli_query($con,$query)or die(mysqli_error($con));
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new materialOptionsVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->jobID = $row->jobID;
	$oneVO->FIELD = $row->FIELD;
	$oneVO->TOPRDG = $row->TOPRDG;
	$oneVO->RKERDG = $row->RKERDG;
	$oneVO->VALLEY = $row->VALLEY;
	$oneVO->DECKNG = $row->DECKNG;
	$oneVO->SHNGLS = $row->SHNGLS;
	$oneVO->NAILS = $row->NAILS;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>