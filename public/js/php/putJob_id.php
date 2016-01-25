<?php
//Just makes an entry into the jobs_details table using the ID auto-created from the jobs_list table.
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
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

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$id = mysqli_real_escape_string($con,$data->id);
$manager = mysqli_real_escape_string($con,$data->manager);

$query = "INSERT INTO jobs_details(job_list_id,manager)
VALUES(
'" . $id . "', " .
"'" . $manager . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'params' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error inserting record", 'result' => $qry_res,'params' => $manager);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>