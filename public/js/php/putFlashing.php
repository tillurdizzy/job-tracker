<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
/*define( "DATABASE_USERNAME", "evo-danny");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");*/



$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$Manufacturer = mysqli_real_escape_string($con,$data->Manufacturer);
$Item = mysqli_real_escape_string($con,$data->Item);
$Description = mysqli_real_escape_string($con,$data->Description);
$Qty = mysqli_real_escape_string($con,$data->Qty);
$Unit = mysqli_real_escape_string($con,$data->Unit);
$Price = mysqli_real_escape_string($con,$data->Price);

$query = "INSERT INTO inv_flashing(Manufacturer,Item,Description,Qty,Unit,Price)
VALUES(
'" . $Manufacturer . "', " .
"'" . $Item . "', " .
"'" . $Description . "', " .
"'" . $Qty . "', " .
"'" . $Unit . "', " .
"'" . $Price . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$arr = array('msg' => "Successful", 'result' => $qry_res, 'params' => $Item);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'result' => $qry_res,'params' => $Item);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>