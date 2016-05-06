<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

require_once ('vo/photoVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM photos");
$result = mysqli_query($con,$query)or die(mysqli_error($con));
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new photoVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->jobID = $row->jobID;
	$oneVO->category = $row->category;
	$oneVO->caption = $row->caption;
	$oneVO->url = $row->url;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>