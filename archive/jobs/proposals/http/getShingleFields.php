<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/inputFieldVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM shingle_input_fields");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new inputFieldVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->Item = $row->item;
	$oneVO->Code = $row->code;
	$oneVO->Unit = $row->unit;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>