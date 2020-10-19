$(document).on("change","#img-profile",function(e) {
		$(".tab-pane:visible .sub-container-form-footer").addClass("show-footer");
  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");

  		$domChange=true;

  		setTimeout(function(){
			$(".tab-pane:visible .sub-container-form-footer").removeClass("hide-footer");
  		},25);
	});

/* Tabs dom-change-watcher ___________________________________________________________________________________*/

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.dom-change-watcher input', function() {

		if(!$(this).parents(".modal").length == 1){
	  		$('#ChangesModal').data('id',$('.homework-row').data('id'));

		}

	});

	/* End input-text-empty ________________________*/


	/* input-text-empty ____________________________*/

	$(document).on('change','.dom-change-watcher input', function() {

		if(!$(this).parents(".modal").length == 1){
			$('#ChangesModal').data('id',$('.homework-row').data('id'));

		}

	});

	/* End input-text-empty ________________________*/

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.dom-change-watcher textarea', function() {

		if(!$(this).parents(".modal").length == 1){
			$('#ChangesModal').data('id',$('.homework-row').data('id'));
  		}

	});

	/* End input-text-empty ________________________*/

	/* End Tabs dom-change-watcher ____________________________________________________________________________________*/


/* #Details #Parents_New_Dynamic_Form_Input _______________________*/

	$(document).on("click",".dom-change-watcher #Parents_New_Dynamic_Form_Input",function(){

		if(!$(this).parents(".modal").length == 1){
			$dynamic_form_input.find("input").data('id','null');
	  	}


	});

	/* #Absence .table-option-list-li-delete __________________________*/

	$(document).on("click","#Absence .table-option-list-li-delete",function(){
		$('#ConfirmDeleteModal').data('role',"absence");
		$('#ConfirmDeleteModal').data('id',$(this).data('id'));
	});

	/* End #Absence .table-option-list-li-delete _______________________*/

	/* #Absence .table-option-list-li-delete __________________________*/

	$(document).on("click","#Attitude .table-option-list-li-delete",function(){
		$('#ConfirmDeleteModal').data('role',"attitude");
		$('#ConfirmDeleteModal').data('id',$(this).data('id'));
	});

	/* End #Attitude .table-option-list-li-delete _______________________*/

	/* Login_Section_Btn _________________*/


	$(document).on("click","#Login_Section_Btn",function(event){

		// test if phone or email exist 
		 $.ajax({
            type: 'post',
            url: '/verify',
            data: {
            	email:$('input[name=email]').val(),
            },
            dataType: 'json'
          })
          .done(function(res){

              if (res.exist)
              {
              		$(".sub-container-form-footer").removeClass("show-footer");
					$(".sub-container-form-footer").addClass("hide-footer");
					$(".sections-main-sub-container-right-main").css("height",":calc(100%)");
                 	owl.trigger('owl.next');
              } else {
               	$("#Login_Section .sections-main-sub-container-right-main-note").removeClass("input-validation-error-feedback-hide");
				$("#Login_Section .sections-main-sub-container-right-main-note").addClass("input-validation-error-feedback-show");
              }
          });

		// On success 
		
		event.preventDefault();
		event.stopPropagation();

	});


	/* End Login_Section_Btn ________________*/


	/* Code_Section_Btn ________________*/

		$(document).on("click","#Code_Section_Btn",function(event){

		
		// disable btn click and change arrow by spin while check login   => 

		$svg =` <svg class="icon button-icon button-icon-extra-style" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				   width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
				  <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
				    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
				    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
				  <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
				    C22.32,8.481,24.301,9.057,26.013,10.047z">
				    <animateTransform attributeType="xml"
				      attributeName="transform"
				      type="rotate"
				      from="0 20 20"
				      to="360 20 20"
				      dur="0.5s"
				      repeatCount="indefinite"/>
				    </path>
				</svg>`;

		 $(this).find("img").replaceWith($svg);

		$.ajax({
            type: 'post',
            url: '/login',
            data: {
            	code:$('input[name=code]').val(),
            	email:$('input[name=email]').val()
            },
            dataType: 'json'
          })
          .done(function(res){

              if (res.login)
              {
              		window.location.href = '/Students';
              } else {
              	// login failed : enable btn  => 
               		$img =`<img class="icon button-icon" src="assets/icons/right_arrow.svg"> `;
					$(this).find("svg").replaceWith($img);
					$('.input-user-code').addClass("input-validation-error");
					$("#Code_Section .sections-main-sub-container-right-main-note").removeClass("input-validation-error-feedback-hide");
					$("#Code_Section .sections-main-sub-container-right-main-note").addClass("input-validation-error-feedback-show");
              }
          });
	});

	/* End Code_Section_Btn ________________*/