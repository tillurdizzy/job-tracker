<?php
//Just makes an entry into the jobs_details table using the ID auto-created from the jobs_list table.
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$jobID = mysqli_real_escape_string($con,$data->jobID);
$upgradesSelected = mysqli_real_escape_string($con,$data->upgradesSelected);
$config = mysqli_real_escape_string($con,$data->config);
$Upgrade = mysqli_real_escape_string($con,$data->Upgrade);
$MuU = mysqli_real_escape_string($con,$data->MuU);
$clientTotal = mysqli_real_escape_string($con,$data->clientTotal);

$query = "UPDATE job_config SET 
upgradesSelected='".$upgradesSelected."',
config='".$config."',
Upgrade='".$Upgrade."',
MuU='".$MuU."',
clientTotal='".$clientTotal."'
WHERE jobID='".$jobID."'";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'insertID' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'result' => $qry_res,'params' => $jobID);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>