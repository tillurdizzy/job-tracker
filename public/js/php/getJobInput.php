<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/jobItemsVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$job_id = mysqli_real_escape_string($con,$data->job_id);

$query = sprintf("SELECT * FROM job_items WHERE job_id = '".$job_id."'");
$result = mysqli_query($con,$query)or die(mysqli_error($con));
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new jobItemsVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->job_id = $row->job_id;
	$oneVO->item_code = $row->item_code;
	$oneVO->qty = $row->qty;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>