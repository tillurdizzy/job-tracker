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
$id = mysqli_real_escape_string($con,$data->ID);
$code = mysqli_real_escape_string($con,$data->Code);
$qty = mysqli_real_escape_string($con,$data->Qty);

$query = "INSERT INTO job_items(job_id,item_code,qty)
VALUES(
'" . $id . "', " .
"'" . $code . "', " .
"'" . $qty . "')";

$qry_res = mysqli_query($con,$query);

if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'params' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error inserting record", 'result' => $qry_res,'params' => $query);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>