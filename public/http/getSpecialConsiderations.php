<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/specialVO.php');
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$ID = mysqli_real_escape_string($con,$data->jobID);
$query = sprintf("SELECT * FROM special_considerations WHERE jobID = '".$ID."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new specialVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->body = $row->body;
	$oneVO->cost = $row->cost;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>