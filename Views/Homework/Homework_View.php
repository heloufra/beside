<!DOCTYPE html>
<html>
<head>

  <title><?php echo $params["title"] ; ?></title>
    <meta charset="UTF-8">

  <?php 

  $posIndex = strpos( $_SERVER['PHP_SELF'], '/index.php');

  $baseUrl = substr( $_SERVER['PHP_SELF'], 0, $posIndex);

  $includes_master = "./Views/Includes_master/";

  ?>
  
  <!-- base_url -->
    <?php include_once($includes_master."base_url.php"); ?>
  <!-- end base_url -->

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!--____________________________bootstrap______________________________-->

    <?php include_once("assets/includes/assets_bootstrap_jquery.php"); ?>


  <!--______________________________MainStyle Style____________________________-->

    <?php include_once("assets/includes/Main.php"); ?>


  <!--____________________________fastselect______________________________--> 

    <?php include_once("assets/includes/fastselect.php"); ?>

  <!--____________________________ select2 ______________________________--> 

    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">

  <!--____________________________owl carousel______________________________-->

    <?php include_once("assets/includes/owlcarousel.php"); ?>

    <link rel="stylesheet"  href="assets/includes/animated.css"/>

</head>

<!-- sections-main-container -->
<body class="sections-main-container">
  
    <!-- main-container -->
    <div class="main-container">

      <!-- setup-main-container -->
        <?php include_once("Views/Includes_master/side_bar.php"); ?>
      <!-- end setup-main-container -->

      <!-- sub-container -->
      <div class="sub-container">

        <div class="sub-container-nav-bar">
            <span class="sub-container-nav-bar-title">Homeworks</span>
            <img  class="sub-container-nav-bar-img" src="assets/images/profiles/Profile.jpg" alt="profile">
        </div>

        <!-- nav -->
          <?php include_once("Views/Includes_master/nav_bar.php"); ?>
        <!-- End nav -->

        <!--  sections-main-sub-container 100%  -->
        <div class="sections-main-sub-container">

                <!--  sections-main-sub-container-left 30%  -->
                <div class="sections-main-sub-container-left">

                  <!--  sections-main-sub-container-left-search-bar  -->
                  <div class="sections-main-sub-container-left-search-bar">

                      <div class="dynamic-form-input-dropdown "> <!-- dynamic-form-input-first for full width inputs -->
                        <div class="dynamic-form-input">

                          <div class="dynamic-form-input-float-adjust">

                            <div class="form-group group form-group-left dynamic-form-input-dropdown-container">
                              <input type="text" value="Classes" class="input-dropdown" required="">
                              <img class="icon button-icon" src="assets/icons/caret.svg">
                              <ul class="dynamic-form-input-dropdown-options">
                                  <li data-val="Class 1">Class 1</li>
                                  <li data-val="Class 2">Class 2</li>
                              </ul>
                            </div>

                            <div class="form-group group form-group-right dynamic-form-input-dropdown-container">
                              <input type="text" value="Subject" class="input-dropdown" required="">
                              <img class="icon button-icon" src="assets/icons/caret.svg">
                              <ul class="dynamic-form-input-dropdown-options">
                                  <li data-val="Subject 1">Subject 1</li>
                                  <li data-val="Subject 2">Subject 2</li>
                              </ul>
                            </div>

                          </div>

                          <div class="square-button square-button-minus">
                            <img class="icon" src="assets/icons/plus.svg">
                          </div>

                        </div>
                      </div>


                  </div>
                  <!--  sections-main-sub-container-left-search-bar  -->

                  <!--  sections-main-sub-container-left-card-container  -->
                  <div class="sections-main-sub-container-left-card-container">
                    <!--  sections-main-sub-container-left-cards  -->
                    <div class="sections-main-sub-container-left-card active">
                          <div class="sections-main-sub-container-left-card-main-img-text" style="background: #fceeca;" >Fr</div>
                          <div class="sections-main-sub-container-left-card-info">
                              <p class="sections-main-sub-container-left-card-main-info">Homework 1</p>
                              <span  class="sections-main-sub-container-left-card-sub-info">Subject - Class - Teacher Name </span>
                          </div>
                    </div>
                    <!--  End sections-main-sub-container-left-cards  -->
                    <!--  sections-main-sub-container-left-cards  -->
                    <div class="sections-main-sub-container-left-card">
                          <div class="sections-main-sub-container-left-card-main-img-text" style="background: #daf0bc;" >Ar</div>
                          <div class="sections-main-sub-container-left-card-info">
                              <p class="sections-main-sub-container-left-card-main-info">Homework 2</p>
                              <span  class="sections-main-sub-container-left-card-sub-info">Subject - Class - Teacher Name </span>
                          </div>
                    </div>
                    <!--  End sections-main-sub-container-left-cards  -->
                    <!--  sections-main-sub-container-left-cards  -->
                    <div class="sections-main-sub-container-left-card">
                          <div class="sections-main-sub-container-left-card-main-img-text" style="background: #f8d3ec;" >Ph</div>
                          <div class="sections-main-sub-container-left-card-info">
                              <p class="sections-main-sub-container-left-card-main-info">Homework 3</p>
                              <span  class="sections-main-sub-container-left-card-sub-info">Subject - Class - Teacher Name </span>
                          </div>
                    </div>
                    <!--  End sections-main-sub-container-left-cards  -->
                    <!--  sections-main-sub-container-left-cards  -->
                    <div class="sections-main-sub-container-left-card">
                          <div class="sections-main-sub-container-left-card-main-img-text" style="background: #fce3d5;" >MA</div>
                          <div class="sections-main-sub-container-left-card-info">
                              <p class="sections-main-sub-container-left-card-main-info">Homework 4</p>
                              <span  class="sections-main-sub-container-left-card-sub-info">Subject - Class - Teacher Name </span>
                          </div>
                    </div>
                    <!--  End sections-main-sub-container-left-cards  -->
                  </div>
                  <!--  End sections-main-sub-container-left-card-container  -->

                </div>

                <!--  sections-main-sub-container-right 70%  -->
                <div class="sections-main-sub-container-right">

                    <!-- sections-main-sub-container-right-main -->
                    <div class="sections-main-sub-container-right-main">

                        <div class="sub-container-form">
                            <!-- sections-main-sub-container-right-main-header -->
                            <div class="sections-main-sub-container-right-main-header">

                                <div class="sections-main-sub-container-right-main-header-info">

                                  <div class="form-group disabled">
                                    <div class="input-img-container input-img-text-container  input-rounded-img-container" style="background: #fceeca;">
                                      FR
                                    </div>
                                  </div>

                                  <p class="label-full-name">Homework 1</p>

                                  <p class="sub-label-full-name">Subject - Class - Teacher Name </p>

                                </div>

                            </div>

                            <!-- End sections-main-sub-container-right-main-header -->

                            <!-- tab-content -->
                            <div class="tab-content">

                              <!-- sections-main-sub-container-right-main-body : HomeworkDetails -->
                              <div id="HomeworkDetails" class="tab-pane fade in active  sections-main-sub-container-right-main-body">

                                  <div class="sections-main-sub-container-right-main-label-divider sections-main-sub-container-right-main-label-divider-extra-style">
                                        <p>Homework details</p>
                                  </div>

                                  <div class="row sections-main-sub-container-right-main-rows">

                                    <div class="col-md-6">
                                      <div class="form-group group disabled">
                                        <input type="text" required="" >
                                        <label class="input-label">
                                          <span class="input-label-text">Homework name</span><span class="input-label-bg-mask"></span>
                                        </label>
                                      </div>
                                    </div>

                                    <div class="col-md-6">
                                      <div class="form-group group dynamic-form-input-text-container-icon dynamic-form-input-text-container-icon-extra-style disabled ">
                                          <input type="text"  class="input-text" required="" placeholder="">
                                          <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg">
                                          <label class="input-label">
                                            <span class="input-label-text">Date</span><span class="input-label-bg-mask"></span>
                                          </label>
                                      </div>
                                    </div>

                                  </div>


                                  <div class="row sections-main-sub-container-right-main-rows">

                                    <div class="col-md-12">
                                      <div class="form-group group disabled">
                                        <textarea class="input-text input-text-area"></textarea>
                                        <label class="input-label">
                                          <span class="input-label-text">Homework description</span><span class="input-label-bg-mask"></span>
                                        </label>
                                      </div>
                                    </div>

                                  </div>

                                  <!-- sub-container-form-footer-container -->
                                  <div class="sub-container-form-footer-container">
                                        <!--  sub-container-form-footer -->
                                        <div class="sub-container-form-footer">
                                            <div class="rounded-button rounded-button-primary rounded-button-float-right default-button caret-disable-rotate ">
                                                  <span class="button-text" id="StudentBtnEdit">Edit details</span>
                                                  <img class="icon button-icon" src="assets/icons/edit.svg">
                                            </div>
                                        </div>
                                        <!--  End sub-container-form-footer -->

                                        <!--  sub-container-form-footer -->
                                        <div class="sub-container-form-footer visibility">
                                            <div class="rounded-button rounded-button-primary rounded-button-float-right">
                                                  <span class="button-text">Save changes</span>
                                                  <img class="icon button-icon" src="assets/icons/check_small.svg">
                                            </div>
                                            <div class="rounded-button rounded-button-primary rounded-button-float-right btn-secondary">
                                                  <span class="button-text" id="StudentBtnCancel" >Cancel</span>
                                            </div>
                                        </div>
                                        <!--  End sub-container-form-footer -->
                                  </div>
                                  <!-- End sub-container-form-footer-container -->

                              </div>
                              <!-- End sections-main-sub-container-right-main-body : HomeworkDetails -->

                            </div>
                            <!-- End tab-content -->

                        </div>
                       
                    </div>
                    <!-- End sections-main-sub-container-right-main -->

                </div>

        </div>
        <!--  End sections-main-sub-container -->

    </div>
    <!-- sub-container -->

</body>
<!-- end sections-main-container -->


</html>
