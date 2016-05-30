<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/jobConfigVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$jobID = mysqli_real_escape_string($con,$data->jobID);
$query = sprintf("SELECT * FROM job_config WHERE jobID = '".$jobID."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new jobConfigVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->config = $row->config;
	$oneVO->labor = $row->labor;
	$oneVO->upgradesBase = $row->upgradesBase;
	$oneVO->materialsTotal = $row->materialsTotal;
	$oneVO->materialsFixed = $row->materialsFixed;
	$oneVO->profitMargin = $row->profitMargin;
	$oneVO->margin = $row->margin;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>