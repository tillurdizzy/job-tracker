<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

require_once ('vo/laborVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM labor");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new laborVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->square = $row->square;
	$oneVO->trim = $row->trim;
	$oneVO->deck = $row->deck;
	$oneVO->flat = $row->flat;
	$oneVO->other = $row->other;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>