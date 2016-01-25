<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/invtVO.php');
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
$query = sprintf("SELECT * FROM inv_edging");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new invtVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->Manufacturer = $row->Manufacturer;
	$oneVO->Item = $row->Item;
	$oneVO->Description = $row->Description;
	$oneVO->Qty = $row->Qty;
	$oneVO->Unit = $row->Unit;
	$oneVO->Price = $row->Price;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>