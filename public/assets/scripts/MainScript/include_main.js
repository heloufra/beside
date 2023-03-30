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