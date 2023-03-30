var subArray = [];
var students = [];
var parents = [];
var substudent = [];
var absences = [];
var studentId = 0;
var subclasses = [];
var subStudent = [];
var filtredClass = [];
var academicyear = "2020-2021";
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
$domChange = false;

let $detailsSelector = "#Details";
let $secionMainSelector =".sections-main-sub-container-right-main-body";

var removedFiles = [];


let inputFileAdd = $('#AddMessageModal').find('input[name="upload_file_modal"]');
let buttonAdd = $('#AddMessageModal .file-add-btn');
let buttonSubmitAdd = $('#mySubmitButton');
let filesContainerAdd = $('#AddMessageModal').find('.list-files');
let filesAdd = [];

/******* Remove this on Product *************************/

setTimeout(function(){
    $(".dashboard-chat-side-bar-body").removeClass("data-loading");
    $("#message_details").removeClass("data-loading");
},1000);

/******* End Remove this on Product *********************/

$(document).on("click",".card-multi-receivers-dropdown",function(){
    $(".card-multi-receivers-dropdown-items").slideToggle();
    $(".card-multi-receivers-dropdown-chevron").toggleClass("caret-rotate-reset");
});

$('#classes_list').find('input[name=classe]').on( "change", function() {

  var dynamicListRows = '';

  var value = $(this).attr("data-val");

  if (value.replace(/\s/g, '') !== ''){

  	remove_No_Result_FeedBack();
	addSideBarLoadingAnimation($sideSelector);

  	$('.students_list').remove();
	$domChange = false;
	var filtred = students.filter(function (el) {
			  return el.Classe_Label === value ;
			});
	SortStudentList(filtred);
	if (value === "All"){
		filtred = students;
	}
	console.log("Filter",filtred);
	var active = '';

	/*** serach input isset  ***/

	var inputValue = $("#search-input").val();

	if (inputValue.replace(/\s/g, '') !== ''){

  		var value = new RegExp(String(inputValue).toLowerCase().replace(/\s/g, ''));
		var filtred = filtred.filter(function (el) {
				var forname = el.Student_FirstName.toLowerCase() +  el.Student_LastName.toLowerCase();
				var backname = el.Student_LastName.toLowerCase()+el.Student_FirstName.toLowerCase();
			  return forname.match(value) || backname.match(value);
		});
		SortStudentList(filtred);
	}

	/*** end serach input isset  ***/

	for (var i = filtred.length - 1; i >= 0; i--) {

		if (i === filtred.length - 1){
			displayStudent(filtred[i].Student_ID);
			active = 'active';
		} else{
			active = '';
		}


		dynamicListRows +='<div ';

			if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
				dynamicListRows +='data-absence="1" ';
			}else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
				dynamicListRows +='data-retard="1" ';
			}

			dynamicListRows +='class="'+active+' sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div>';

			if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
				dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts red-color">Absence</span>';
			}else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
				dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts blue-color">Retard</span>';
			}

		dynamicListRows +='</div>';

	}


		if(filtred.length > 0 ){
			$($sideSelector).append(dynamicListRows);
		}else{
			$HeaderFeedBack = "No result found !";
			$SubHeaderFeedBack = "";
			$IconFeedBack = "404_students.png";
			no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
		}

		removeSideBarLoadingAnimation($sideSelector);

  }

})

if (document.getElementById("search-input")){

  	document.getElementById("search-input").addEventListener('input', function (evt) {
	  
	  dynamicListRows = '';
	  remove_No_Result_FeedBack();
	  addSideBarLoadingAnimation($sideSelector);

	  $('.students_list').remove();
	  var active = '';
	  if (this.value.replace(/\s/g, '') !== ''){

	  		var value = new RegExp(this.value.toLowerCase().replace(/\s/g, ''));
			var filtred = students.filter(function (el) {
					var forname = el.Student_FirstName.toLowerCase() +  el.Student_LastName.toLowerCase();
					var backname = el.Student_LastName.toLowerCase()+el.Student_FirstName.toLowerCase();
				  return forname.match(value) || backname.match(value);
			});

			SortStudentList(filtred);

			/** class dropdown isset ****/

			var dropDownvalue = $('#classes_list').find('input[name=classe]').attr("data-val");

			var classesfiltred = [];

  			if (dropDownvalue.replace(/\s/g, '') !== ''){

				var classesfiltred = filtred.filter(function (el) {
				  return el.Classe_Label === dropDownvalue ;
				});

				if (dropDownvalue === "All"){
					classesfiltred = filtred;
				}

				filtred = classesfiltred;
			}

			/** class dropdown isset ****/

			for (var i = filtred.length - 1; i >= 0; i--) {
				if (i === filtred.length - 1)
				{
					displayStudent(filtred[i].Student_ID);
					active = 'active';
				} else{
					active = '';
				}

				dynamicListRows +='<div ';

					if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
						dynamicListRows +='data-absence="1" ';
					}else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
						dynamicListRows +='data-retard="1" ';
					}

					dynamicListRows +='class="'+active+' sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div>';

					if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
						dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts red-color">Absence</span>';
					}else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
						dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts blue-color">Retard</span>';
					}

				dynamicListRows +='</div>';

			}

	 	} else {

	 		var filtred = students ;

	 		SortStudentList(filtred);

			/** class dropdown isset ****/

			var dropDownvalue = $('#classes_list').find('input[name=classe]').attr("data-val");

			var classesfiltred = [];

  			if (dropDownvalue.replace(/\s/g, '') !== ''){

				var classesfiltred = filtred.filter(function (el) {
				  return el.Classe_Label === dropDownvalue ;
				});

				if (dropDownvalue === "All"){
					classesfiltred = filtred;
				}

				filtred = classesfiltred;
			}

			/** class dropdown isset ****/

		  	for (var i = filtred.length - 1; i >= 0; i--) {

				if (i === filtred.length - 1)
				{
					displayStudent(filtred[i].Student_ID);
					active = 'active';
				} else{
					active = '';
				}

				dynamicListRows +='<div ';

					if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
						dynamicListRows +='data-absence="1" ';
					}else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
						dynamicListRows +='data-retard="1" ';
					}

					dynamicListRows +='class="'+active+' sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div>';

					if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
						dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts red-color">Absence</span>';
					}else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
						dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts blue-color">Retard</span>';
					}

				dynamicListRows +='</div>';

			}
	  }

	  if(filtred.length > 0 ){
			$($sideSelector).append(dynamicListRows);
	  }else{
			$HeaderFeedBack = "No result found !";
			$SubHeaderFeedBack = "";
			$IconFeedBack = "404_students.png";
			no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
	  }

	  removeSideBarLoadingAnimation($sideSelector);

	});
}

/* input-text-empty ________________________*/

$(document).on("click",".form-group-search-filter .caret-rotate-reset",function(event){

        $(this).attr("src","assets/icons/sidebar_icons/search.svg");

        $(this).siblings(".input-text").removeAttr("readonly");
        $(this).removeClass("input-text-empty");
        $(".dynamic-form-input-dropdown-options-search").css("display","none");
        $(this).siblings(".input-text").val("");

        $(document).trigger("click");
        

        /*************************************************************************/

            dynamicListRows = '';
            remove_No_Result_FeedBack();
            addSideBarLoadingAnimation($sideSelector);

            var filtred = students ;
            SortStudentList(filtred);

            /** class dropdown isset ****/

            var dropDownvalue = $('#classes_list').find('input[name=classe]').attr("data-val");

            if (dropDownvalue.replace(/\s/g, '') !== ''){

                var filtred = filtred.filter(function (el) {
                    return el.Classe_Label === dropDownvalue ;
                });

                if (dropDownvalue === "All"){
                    filtred = students;
                }
            }

            /** class dropdown isset ****/

            for (var i = filtred.length - 1; i >= 0; i--) {
                if (i === filtred.length - 1)
                {
                    displayStudent(filtred[i].Student_ID);
                    active = 'active';
                } else{
                    active = '';
                }

                dynamicListRows +='<div ';

                    if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
                        dynamicListRows +='data-absence="1" ';
                    }else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
                        dynamicListRows +='data-retard="1" ';
                    }

                    dynamicListRows +='class="'+active+' sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div>';

                    if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Absences)) {
                        dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts red-color">Absence</span>';
                    }else if(!jQuery.isEmptyObject(filtred[i].studentsAbsenceDelay.Retards)) {
                        dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts blue-color">Retard</span>';
                    }

                dynamicListRows +='</div>';

            }

            if(filtred.length > 0 ){
                    $($sideSelector).append(dynamicListRows);
            }else{
                    $HeaderFeedBack = "No result found !";
                    $SubHeaderFeedBack = "";
                    $IconFeedBack = "404_students.png";
                    no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
            }

            removeSideBarLoadingAnimation($sideSelector);

        /*************************************************************************/


        event.preventDefault();
        event.stopPropagation();

        return false;
});

/* End input-text-empty ________________________*/

$(document).on("click",".students_list",function(event){
	if (!$("#ChangesModal").hasClass('in'))
	{
		studentId = $(this).find('input[name="studentId"]').val();
		$('.sections-main-sub-container-left-card').removeClass('active');
		$(this).addClass('active');
		displayStudent(studentId);
	}
});

function displayStudent(index)
{
	return new Promise((resolve, reject) => {
		addLoadingAnimation($detailsSelector,$headerInfo);

		if(section_Main_Exist() == 0){
			addSecionMainFadeOutAnimation($secionMainSelector);
		}

		$.ajax({
			type: 'get',
			url: '/Students/one',
			data: {
				user_id:index
			},
			dataType: 'json'
		})
		.done(function(res){
			if(res.errors)
			{
				console.log(res.errors);
				removeLoadingAnimation($detailsSelector,$headerInfo);
				reject(res.errors);
			} else {
				removeLoadingAnimation($detailsSelector,$headerInfo);
			}

            if(section_Main_Exist() == 0){
                addSecionMainFadeOutAnimation($secionMainSelector);
                removeSecionMainFadeOutAnimation($secionMainSelector);
            }

            resolve();
			
		});
	});
}


function discardChange() {
 	$('#EditStudentModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditStudentModal .sub-container-form-footer').removeClass('show-footer');
 	$("#EditStudentModal").modal('hide');
}

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

	$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-edit",function(){
		$('#EditStudentModal').modal('show');
	});

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

$(document).on("click",".dynamic-form-input-dropdown-options-search li",function(event){

		$this = $(this);

		$text = $(this).attr("data-val");
		$ad_val = $(this).attr("data-ad-val");

		console.log("text",$text);

		$this_Parent =$this.parents(".sections-main-sub-container-left-search-bar");

		if($(this).attr("data-id") == "0"){
			$(this).parents(".dynamic-form-input-float-adjust").find(".interaction_icon_main").attr("src","assets/icons/emoji_good.svg");
		}else{
			$(this).parents(".dynamic-form-input-float-adjust").find(".interaction_icon_main").attr("src","assets/icons/emoji_bad.svg");
		}

		$this_Parent.find(".form-group-search-filter").find(".input-dropdown").val(" ");
		
		$this_Parent.find(".form-group-search-filter").find(".input-text-dropdown-search").attr("readonly","readonly");

		$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"0"});

		if($this_Parent.find(".dynamic-form-input-dropdown-container").find(".input-dropdown").val() =="" 
			|| $this_Parent.find(".dynamic-form-input-dropdown-container").find(".input-dropdown").val()  == null ){

			setTimeout(function(){

				$this_Parent.find(".form-group-search-filter").find(".input-text-dropdown-search").val(" ");

				setTimeout(function(){
					$this_Parent.find(".form-group-search-filter").find(".input-text-dropdown-search").val($text);
					$this_Parent.find(".form-group-search-filter").find(".input-text-dropdown-search").attr("data-ad-val",$ad_val);
					$this_Parent.find(".dynamic-form-input-dropdown-options-search").siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
					$this_Parent.find(".dynamic-form-input-dropdown-options-search").siblings(".icon").addClass("input-text-empty");
				},180);

			},5);
			
		}else{
				$this_Parent.find(".form-group-search-filter").find(".input-text-dropdown-search").val($text);
				$this_Parent.find(".form-group-search-filter").find(".input-text-dropdown-search").attr("data-ad-val",$ad_val);
				$this_Parent.find(".dynamic-form-input-dropdown-options-search").siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
				$this_Parent.find(".dynamic-form-input-dropdown-options-search").siblings(".icon").addClass("input-text-empty");
		}
		
		setTimeout(function(){
			$(".dynamic-form-input-dropdown-options").css("cssText","display:none");
		},1);

		/****************************************************/

		$(".students_list").addClass("hidden");

		if($(this).attr("data-ad-val") == 0 ){

			$(".students_list").each(function(ind,elem){
				if($(this).is("[data-retard]")){
					$(this).removeClass("hidden");
				}
			});

		}

		if($(this).attr("data-ad-val") == 1 ){

			$(".students_list").each(function(ind,elem){
				if($(this).is("[data-absence]")){
					$(this).removeClass("hidden");
				}
			});

		}

		/****************************************************/

		event.preventDefault();
		event.stopPropagation();
		return false;


});

$(document).on("click",".input-text-dropdown-search",function(event){

	var attr = $(this).attr('data-ad-val');

	if (typeof attr !== typeof undefined && attr !== false) {

		$(this).val("");
		$(this).removeAttr("readonly");
		$(this).siblings(".input-text-empty").removeClass("input-text-empty");
		$(".sections-main-sub-container-left-card").removeClass("hidden");

		event.preventDefault();
		event.stopPropagation();
		return false;
	}

});

/*************** #AddMessageModal File change *********************/

$('#AddMessageModal').find('input[name="upload_file_modal"]').on( "change", function() {
    alert("change");
	if ($(this).val().replace(/\s/g, '') !== '')
	{
		/**************************************/

			let newFiles = []; 

		    for(let index = 0; index < inputFileAdd[0].files.length; index++) {
		      let file = inputFileAdd[0].files[index];
		      newFiles.push(file);
		      filesAdd.push(file);
		    }
		    
		    newFiles.forEach(file => {

		      let fileElementAdd = $(`<div class="file-container file-upload"> <div class="file-icon-label"> <img class="file-icon" src="assets/icons/file.svg" alt="file"/> <span class="file-label">`+$(this).val().split("\\")[2]+`</span> </div> <img class="file-close" onclick="discardFileModal(this)" src="assets/icons/close-gray.svg" alt="close"/> <div class="progress"> <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"> </div> </div> </div>`);

		      fileElementAdd.attr('data-fileData', file);

		      filesContainerAdd.append(fileElementAdd);

		      setTimeout(function(){
				$('#AddMessageModal').find('.file-container .progress-bar').css('width', '100%').attr('aria-valuenow', 100); 
			  },500);
		      
		    });

		/**************************************/
	}
});
