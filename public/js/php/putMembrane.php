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
$Type = mysqli_real_escape_string($con,$data->Type);
$Width = mysqli_real_escape_string($con,$data->Width);
$Length = mysqli_real_escape_string($con,$data->Length);
$SqFtRoll = mysqli_real_escape_string($con,$data->SqFtRoll);
$RollsPallet = mysqli_real_escape_string($con,$data->RollsPallet);
$WeightRoll = mysqli_real_escape_string($con,$data->WeightRoll);
$Price = mysqli_real_escape_string($con,$data->Price);

$query = "INSERT INTO inv_membranes(Manufacturer,Type,Width,Length,SqFtRoll,RollsPallet,WeightRoll,Price)
VALUES(
'" . $Manufacturer . "', " .
"'" . $Type . "', " .
"'" . $Width . "', " .
"'" . $Length . "', " .
"'" . $SqFtRoll . "', " .
"'" . $RollsPallet . "', " .
"'" . $WeightRoll . "', " .
"'" . $Price . "')";

$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$arr = array('msg' => "Successful", 'result' => $qry_res, 'params' => $Type);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'result' => $qry_res,'params' => $Type);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>