<?php


Class Setup_Controller {

	    /***************** api v1 ***************/

		public static function default_Action(){

			$app = \Slim\Slim::getInstance();

			$cnx = new Connection();

			$cn = $cnx->connect();

			$params = array('title' => 'beside');

			$app->render('/Setup/Setup_View.php',array('params' => $params ));

		}
		
}

?>
