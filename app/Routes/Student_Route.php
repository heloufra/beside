<?php

    /*********************************** default_Action **********************************/

    $app->get('/Students/',$AuthMdw,'Student_Controller::default_Action');

?>
