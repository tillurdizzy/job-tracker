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
$TOPRDG = mysqli_real_escape_string($con,$data->TOPRDG);
$RKERDG = mysqli_real_escape_string($con,$data->RKERDG);
$SHNGLS = mysqli_real_escape_string($con,$data->SHNGLS);
$NAILS = mysqli_real_escape_string($con,$data->NAILS);
$EDGTRM = mysqli_real_escape_string($con,$data->EDGTRM);
$VALLEY = mysqli_real_escape_string($con,$data->VALLEY);
$DECKNG = mysqli_real_escape_string($con,$data->DECKNG);

$query = "UPDATE material_options SET 
TOPRDG='".$TOPRDG."',
RKERDG='".$RKERDG."',
SHNGLS='".$SHNGLS."',
NAILS='".$NAILS."',
EDGTRM='".$EDGTRM."',
VALLEY='".$VALLEY."',
DECKNG='".$DECKNG."'
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