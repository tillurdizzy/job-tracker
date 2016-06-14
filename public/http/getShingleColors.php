<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/colorsVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM shingle_colors");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new colorsVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->Manufacturer = $row->Manufacturer;
	$oneVO->Style = $row->Style;
	$oneVO->Name = $row->Name;
	$oneVO->Url = $row->Url;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>