<?php


Class Homework_Controller {

	    /***************** api v1 ***************/

		public static function default_Action(){

			$app = \Slim\Slim::getInstance();

			$cnx = new Connection();

			$cn = $cnx->connect();

			$params = array('title' => 'beside');

			$app->render('/Homework/Homework_View.php',array('params' => $params ));

		}

}

?>
