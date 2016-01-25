<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/jobVO.php');
define( "DATABASE_SERVER", "localhost");
define( "DATABASE_USERNAME", "root");
define( "DATABASE_PASSWORD", "");
define( "DATABASE_NAME", "roofingtracker");
/*define( "DATABASE_USERNAME", "evo-danny");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");*/

/*
define( "DATABASE_SERVER", "tillurdizzy.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "tillurdizzy");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");*/
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$manager = mysqli_real_escape_string($con,$data->manager);
$query = sprintf("SELECT * FROM jobs_list WHERE manager = '".$manager."'");
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
	$oneVO->dateProposal = $row->dateProposal;
	$oneVO->dateContract = $row->dateContract;
	$oneVO->dateActive = $row->dateActive;
	$oneVO->dateComplete = $row->dateComplete;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>