<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/jobVO.php');
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$propID = mysqli_real_escape_string($con,$data->propID);
$clientID = mysqli_real_escape_string($con,$data->clientID);
$query = sprintf("SELECT * FROM jobs_list WHERE property='".$propID."' AND client ='".$clientID."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new jobVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->jobNumber = $row->jobNumber;
	$oneVO->property = $row->property;
	$oneVO->client = $row->client;
	$oneVO->manager = $row->manager;
	$oneVO->status = $row->status;
	$oneVO->dateProspect = $row->dateProspect;
	$oneVO->dateProposal = $row->dateProposal;
	$oneVO->dateContract = $row->dateContract;
	$oneVO->dateActive = $row->dateActive;
	$oneVO->dateComplete = $row->dateComplete;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>