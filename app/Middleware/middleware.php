<?php

/****************  $AuthMdw ****************

  Possiblity to return a json 

********************************************/

/*****************************************/

$AuthMdw = function() use ($app) {

	$headers = $app->request->headers->get("Authorization");

	/*echo "Authorization : " . $headers ."<br/>";

	if($headers == "@123456789azerty+-"){

		echo "route is secured <br/>" ;

	}else{

		echo "route is not secured <br/>" ;
		exit();
	}*/
	
};

/****************  $SessionMdw ****************/

$SessionMdw = function() use ($app) {
    
};


?>
