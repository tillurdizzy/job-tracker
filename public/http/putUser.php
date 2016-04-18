<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$name_first = mysqli_real_escape_string($con,$data->$name_first);
$name_last = mysqli_real_escape_string($con,$data->name_last);
$name_user = mysqli_real_escape_string($con,$data->name_user);
$pin = mysqli_real_escape_string($con,$data->pin);
$userType = mysqli_real_escape_string($con,$data->userType);
$jobID = mysqli_real_escape_string($con,$data->jobID);

$query = "INSERT INTO login(name_first,name_last,name_user,pin,userType,jobID)
VALUES(
'" . $name_first . "', " .
"'" . $name_last . "', " .
"'" . $name_user . "', " .
"'" . $pin . "', " .
"'" . $userType . "', " .
"'" . $jobID . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'params' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error inserting record", 'result' => $qry_res,'params' => $name_first);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>