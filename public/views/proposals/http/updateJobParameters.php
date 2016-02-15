<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('cannot reach database');
$jobID = mysqli_real_escape_string($con,$data->jobID);
$FIELD = mysqli_real_escape_string($con,$data->FIELD);
$TOPRDG = mysqli_real_escape_string($con,$data->TOPRDG);
$RKERDG = mysqli_real_escape_string($con,$data->RKERDG);
$PRMITR = mysqli_real_escape_string($con,$data->PRMITR);
$VALLEY = mysqli_real_escape_string($con,$data->VALLEY);
$LBF1 = mysqli_real_escape_string($con,$data->LBF1);
$LBF2 = mysqli_real_escape_string($con,$data->LBF2);
$LBF3 = mysqli_real_escape_string($con,$data->LBF3);
$LBF4 = mysqli_real_escape_string($con,$data->LBF4);
$JKVNT8 = mysqli_real_escape_string($con,$data->JKVNT8);
$FLHSH8 = mysqli_real_escape_string($con,$data->FLHSH8);
$TURBNS = mysqli_real_escape_string($con,$data->TURBNS);
$PWRVNT = mysqli_real_escape_string($con,$data->PWRVNT);
$AIRHWK = mysqli_real_escape_string($con,$data->AIRHWK);
$DECKNG = mysqli_real_escape_string($con,$data->DECKNG);
$PAINT = mysqli_real_escape_string($con,$data->PAINT);
$CAULK = mysqli_real_escape_string($con,$data->CAULK);
$CARPRT = mysqli_real_escape_string($con,$data->CARPRT);
$SATDSH = mysqli_real_escape_string($con,$data->SATDSH);

$query = "UPDATE job_parameters SET 
FIELD='".$FIELD."',
TOPRDG='".$TOPRDG."',
RKERDG='".$RKERDG."',
PRMITR='".$PRMITR."',
VALLEY='".$VALLEY."',
LBF1='".$LBF1."',
LBF2='".$LBF2."',
LBF3='".$LBF3."',
LBF4='".$LBF4."',
JKVNT8='".$JKVNT8."',
FLHSH8='".$FLHSH8."',
TURBNS='".$TURBNS."',
PWRVNT='".$PWRVNT."',
AIRHWK='".$AIRHWK."',
DECKNG='".$DECKNG."',
PAINT='".$PAINT."',
CAULK='".$CAULK."',
CARPRT='".$CARPRT."',
SATDSH='".$SATDSH."'
WHERE jobID='".$jobID."'";

$qry_res = mysqli_query($con,$query);

if ($qry_res) {
	$arr = array('msg' => "Success", 'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>