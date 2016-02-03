<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('cannot reach database');
$job_id = mysqli_real_escape_string($con,$data->job_id);
$item_code = mysqli_real_escape_string($con,$data->item_code);
$qty = mysqli_real_escape_string($con,$data->qty);

$query = "UPDATE job_items SET 
qty='".$qty."'
WHERE item_code='".$item_code."' AND job_id='".$job_id."'";

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