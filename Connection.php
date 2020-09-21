<?php

class  Connection
{
	/*** Local params ***

	private $user = "root";
	
	private $pass = "";
	
	private $dbname ="social_media_app"; 

	/*** Server params ***/
	
	private $user = "root";
	
	private $pass = "";
	
	private $dbname ="social_media_app"; 
	
	/***************/
	
	function connect()
	{
			try
			{
				//$cnx = new PDO("mysql:host=localhost;charset=utf8;dbname=".$this->dbname,$this->user,$this->pass);
				//$cnx->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

				$cnx = null ;
					
				return $cnx;
							
			}
			catch(PDOEXCEPTION $e)
			{
				echo $e->getMessage();
			}
	}

}

?>