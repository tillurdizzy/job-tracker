<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/jobParamsVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$ID = mysqli_real_escape_string($con,$data->ID);

$query = sprintf("SELECT * FROM job_parameters WHERE jobID = '".$ID."'");
$result = mysqli_query($con,$query)or die(mysqli_error($con));
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new jobParamsVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->jobID = $row->jobID;
	$oneVO->FIELD = $row->FIELD;
	$oneVO->TOPRDG = $row->TOPRDG;
	$oneVO->RKERDG = $row->RKERDG;
	$oneVO->PRMITR = $row->PRMITR;
	$oneVO->VALLEY = $row->VALLEY;
	$oneVO->LPIPE1 = $row->LPIPE1;
	$oneVO->LPIPE2 = $row->LPIPE2;
	$oneVO->LPIPE3 = $row->LPIPE3;
	$oneVO->LPIPE4 = $row->LPIPE4;
	$oneVO->JKVNT8 = $row->JKVNT8;
	$oneVO->FLHSH8 = $row->FLHSH8;
	$oneVO->TURBNS = $row->TURBNS;
	$oneVO->PWRVNT = $row->PWRVNT;
	$oneVO->AIRHWK = $row->AIRHWK;
	$oneVO->SLRVNT = $row->AIRHWK;
	$oneVO->LOWSLP = $row->LOWSLP;
	$oneVO->DECKNG = $row->SLRVNT;
	$oneVO->PAINT = $row->PAINT;
	$oneVO->CAULK = $row->CAULK;
	$oneVO->SATDSH = $row->SATDSH;
	$oneVO->CARPRT = $row->CARPRT;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>