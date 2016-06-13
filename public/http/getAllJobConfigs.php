<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

require_once ('vo/jobConfigVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM job_config");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new jobConfigVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->jobID = $row->jobID;
	$oneVO->config = $row->config;
	$oneVO->labor = $row->labor;
	$oneVO->upgradesBase = $row->upgradesBase;
	$oneVO->upgradesSelected = $row->upgradesSelected;
	$oneVO->Fx = $row->Fx;
	$oneVO->Base = $row->Base;
	$oneVO->Upgrade = $row->Upgrade;
	$oneVO->MuU = $row->MuU;
	$oneVO->MuB = $row->MuB;
	$oneVO->Bc = $row->Bc;
	$oneVO->Uc = $row->Uc;
	$oneVO->muPercent = $row->muPercent;
	$oneVO->clientBase = $row->clientBase;
	$oneVO->clientTotal = $row->clientTotal;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>