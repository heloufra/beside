var subArray = [];
var students = [];
var parents = [];
var substudent = [];
var absences = [];
var studentId = 0;
var absenceArray = ["Retard","Absence"];
var noteTypes = ["Positive","Negative"];
var subclasses = [];
var subStudent = [];
var homeworks = [];
var attitudes = [];
var payStudent = [];
var exams = [];
var filtredClass = [];
var academicyear = "2020-2021";
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];
$domChange = false;
var start,end;
var alreadyPay = [];
var studentlevelchanged = 0 ;

let $detailsSelector = "#Details";
let $secionMainSelector =".sections-main-sub-container-right-main-body";

function hideSelected(value) {
  if (value && !value.selected) {
    return $('<span>' + value.text + '</span>');
  }
}

getAllStudents();

function getAllStudents(id) {
	dynamicListRows = [];
 	$('.students_list').remove();
	$.ajax({
	    type: 'get',
	    url: '/Students/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors){
	  		console.log(res.errors)
	  	} else {
	  		students = res.students;
	  		SortStudentList(students);
	  		console.log('Students!!',students);
	  		filtredClass = res.students;
	  		subclasses = res.subscription;
	  		if (id){
	  			displayStudent(id);
	  		}
	  		else if (res.students.length > 0){
	  			displayStudent(res.students[res.students.length - 1].Student_ID);
	  		}
	  			
	  		var active = '';

	  		remove_No_Result_FeedBack();
	  		addSideBarLoadingAnimation($sideSelector);

	  		console.log("res std " ,res.students);

	  		for (var i = res.students.length - 1; i >= 0; i--) {
	  			if (id){
	  				if(res.students[i].Student_ID === id){
	  					active = 'active';
	  				}
	  				else{
	  					active = ''
	  				}
	  			}else{	
		  			if (i === res.students.length - 1){
		  				active = 'active';
		  			}
		  			else{
		  				active = '';
		  			}
		  		}

		  		dynamicListRows +='<div ';

	  			if(!jQuery.isEmptyObject(res.students[i].studentsAbsenceDelay.Absences)) {
  					dynamicListRows +='data-absence="1" ';
  				}else if(!jQuery.isEmptyObject(res.students[i].studentsAbsenceDelay.Retards)) {
  					dynamicListRows +='data-retard="1" ';
  				}

	  			dynamicListRows +='class="'+active+' sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+res.students[i].Student_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="studentId" type="hidden" value="'+res.students[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+res.students[i].Student_FirstName+' '+res.students[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+res.students[i].Classe_Label+'</span></div>';

	  				if(!jQuery.isEmptyObject(res.students[i].studentsAbsenceDelay.Absences)) {
	  					dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts red-color">Absence</span>';
	  				}else if(!jQuery.isEmptyObject(res.students[i].studentsAbsenceDelay.Retards)) {
	  					dynamicListRows +='<span class="sections-main-sub-container-left-card-satuts blue-color">Retard</span>';
	  				}
	  			
	  			dynamicListRows +='</div>';
	  		}

	  		if(res.students.length > 0 ){
				$('#list_classes').append(dynamicListRows);
			}else{
				$HeaderFeedBack = "No result found !";
				$SubHeaderFeedBack = "";
				$IconFeedBack = "404_students.png";
				no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
			}

	  		removeSideBarLoadingAnimation($sideSelector);
	  	}
	  });
 }

function remove() {
 	var id,declaredBy;
 	var temp = [];
 	if ($('#ConfirmDeleteModal').data('role') === 'attitude' || $('#ConfirmDeleteModal').data('role') === 'absence')
		id = $('#ConfirmDeleteModal').data('id');
	else
		id = studentId;
	if ($('#ConfirmDeleteModal').data('role') === 'attitude')
	{
		temp = attitudes.filter((el) => el.Attitude_ID === id)
		console.log("Temp::",temp)
		declaredBy = temp[0].Declaredby_ID;
	}
	if ($('#ConfirmDeleteModal').data('role') === 'absence')
	{
		temp = absences.filter((el) => el.AD_ID === id)
		console.log("Temp::",temp)
		declaredBy = temp[0].Declaredby_ID;
	}

	$.ajax({
		    type: 'post',
		    url: '/Students/'+$('#ConfirmDeleteModal').data('role')+'/remove',
		    data: {
		    	id:id,
		    	declaredBy:declaredBy
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.removed)
		  	{
		  		$('#ConfirmDeleteModal').modal('hide');
		  		if ($('#ConfirmDeleteModal').data('role') === 'attitude' || $('#ConfirmDeleteModal').data('role') === 'absence')
		  			$('#'+$('#ConfirmDeleteModal').data('role')+'-'+$('#ConfirmDeleteModal').data('id')).remove();
		  		else
		  		{
		  			$('#student_info').addClass('hidden');
		  			getAllStudents();
		  		}
		  	} else {
		  		console.log(res);
		  		$('#ConfirmDeleteModal').modal('hide');
		  	}
		  });
}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output-img").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

if (document.getElementById("profile"))
document.getElementById("profile").addEventListener("change", readFile);

function readFileDetail() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      $("#EditStudentModal .profile-img").attr("src",e.target.result);
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

if (document.getElementById("img-profile")){
	document.getElementById("img-profile").addEventListener("change", readFileDetail);
}

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
				var checked = '';
				studentId = parseInt(index);
			$domChange = false;
			var result = students.filter(function (el) {
						return el.Student_ID === parseInt(index);
					});
			$("#reported_table").addClass('hidden');
				$("#reported_title").addClass('hidden');
			$("#absence_table").addClass('hidden');
				$("#absence_title").addClass('hidden');
				$('#Grades').removeClass('hidden');
			$('#Details').find('.input-parent').remove();
			$('#Details').removeClass("dom-change-watcher");
			$('#EditStudentModal').find('.input-parent').remove();
			$('#EditStudentModal').removeClass("dom-change-watcher");
			$('#Absence').find('.row-absence').remove();
			$('#Details').find('.expense_col').remove();
			$('#Attitude').find('.row-note').remove();
			$('#Homework').find('.row-homework').remove();
			$('#Exams').find('.row-exam').remove();
			$('#Grades').find('.row-score').remove();
				$('#Details').find('.expense_col').remove();
				$('#Details').find('.row-parent').remove();
				$('#EditStudentModal').find('.expense_col').remove();
				$('#EditStudentModal').find('.row-parent').remove();
				$("#Finance").find('.month-row').remove();
				$("#Finance").find('.row-payment').remove();
				$('#student_info').removeClass('hidden');
				$("#attitude_table").removeClass('hidden');
				$("#attitude_title").removeClass('hidden');
				if (res.attitudes.length === 0)
				{
					$("#attitude_table").addClass('hidden');
					$("#attitude_title").addClass('hidden');
				}

				
				if (res.homeworks.length > 0)
					$("#Homework").removeClass('hidden');
				else
					$("#Homework").addClass('hidden')
				if (res.exams.length > 0)
					$("#Exams").removeClass('hidden');
				else
					$("#Exams").addClass('hidden');
				attitudes = res.attitudes;
				for (var i = res.attitudes.length - 1; i >= 0; i--) {
					$('#Attitude').find('.note_container').append(' <tr class="row-note"  id="attitude-'+res.attitudes[i].Attitude_ID+'"> <td class="readonly" data-label="Interaction"> <div class="sections-main-sub-container-right-main-rows"> <div class="dynamic-form-input-dropdown-container dynamic-form-input-dropdown-container-icon"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="dynamic-form-input-float-adjust"> <div class="form-group group form-group-right"><img class="icon button-icon" src="assets/icons/caret.svg"> '+(res.attitudes[i].Attitude_Interaction === 0 ? ('<img class="interaction_icon" src="assets/icons/emoji_good.svg" alt="interaction_icon"> <span>Positive</span>'):('<img class="interaction_icon" src="assets/icons/emoji_bad.svg" alt="interaction_icon"> <span>Negative</span>'))+'</div> </div> </div> </div> </div> </div> </td> <td data-label="Note" class="td-label td-description">'+res.attitudes[i].Attitude_Note+'</td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+res.attitudes[i].Attitude_Addeddate+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list -->' +(parseInt(res.attitudes[i].Declaredby_ID) === res.declaredBy ?('<img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"><div class="table-option-list-li table-option-list-li-edit" onClick="displayAttitude('+i+')" data-id="'+res.attitudes[i].Attitude_ID+'"> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span" " data-id="'+res.attitudes[i].Attitude_ID+'">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete" data-id="'+res.attitudes[i].Attitude_ID+'"> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div>'): ' ')+' <!-- End table-option-list --> </td> </tr>');
				}
				payStudent = res.payStudent;
				homeworks = res.homeworks;
				for (var i = res.homeworks.length - 1; i >= 0; i--) {
					$('#Homework').find('.homework-container').append('<tr class="row-homework" onClick="displayHomework('+i+')"> <td data-label="Homework Title"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <span class="sections-main-sub-container-left-card-main-img-text"  style="background: '+res.homeworks[i].Subject_Color+';">'+res.homeworks[i].Subject_Label.slice(0,2)+'</span> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.homeworks[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.homeworks[i].Classe_Label+'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+res.homeworks[i].Homework_DeliveryDate+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> </tr>');
				}

				exams = res.exams;
				for (var i = res.exams.length - 1; i >= 0; i--) {
					$('#Exams').find('.exams-container').append('<tr class="row-exam" onClick="displayExam('+i+')"> <td data-label="Exam Title"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <span class="sections-main-sub-container-left-card-main-img-text" style="background: '+res.exams[i].Subject_Color+';">'+res.exams[i].Subject_Label.slice(0,2)+'</span> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.exams[i].Exam_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.exams[i].Classe_Label+'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+res.exams[i].Exam_Date+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Scores"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+(res.exams[i].Exam_Score === null || res.exams[i].Exam_Score === "" ? "0.00" : parseFloat(res.exams[i].Exam_Score).toFixed(2))+'" class="input-text" required="" placeholder="Scores"> </div> </td></tr>');
				}
				if (res.exams.length === 0)
					$('#Grades').addClass('hidden');
				else
				{
					if (res.average)
					{
						$('#Grades').removeClass('hidden');
						$('#Grades').find('.result-score').html(res.average.toFixed(2))
					}
					else {
						$('#Grades').addClass('hidden');
					}
					for (var i = res.exams.length - 1; i >= 0; i--) {
						if (res.exams[i].Exam_Score !== null && res.exams[i].Exam_Score !== "")
							$('#Grades').find('.scores-container').append('<tr class="row-score"> <td data-label="'+res.exams[i].Subject_Label+'" class="td-label">'+res.exams[i].Subject_Label+'</td> <td class="readonly" data-label="Scores"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+(res.exams[i].Exam_Score === null || res.exams[i].Exam_Score === "" ? "0.00" : parseFloat(res.exams[i].Exam_Score).toFixed(2))+'" class="input-text" required="" placeholder="Scores"> </div> </td> </tr>');
					}
				}
				subStudent =  res.substudent;
			start = res.start;
			end = res.end;
			academicyear = res.academicyear;
			var indStart = months.indexOf(start);
			var indEnd = months.indexOf(end);
			var htmlmonths = '';
			var date = new Date();
			var unpaid = 0;
			$("#Finance").find('.yearly-expense').addClass('hidden');
			for (var i = res.substudentpay.length - 1; i >= 0; i--) {
				if (res.substudentpay[i].Expense_PaymentMethod === "Monthly")
					$("#Finance").find('.list-expenses').append('<tr class="row-payment" data-val="'+res.substudentpay[i].Expense_Label+'"> <td data-label="'+res.substudentpay[i].Expense_Label+'" class="td-label"> <span class="expense_label">'+res.substudentpay[i].Expense_Label+'<span class="expense_label_method">'+res.substudentpay[i].Expense_Cost+'</span></span> </td> </tr>');
				else
				{
					$("#Finance").find('.yearly-expense').removeClass('hidden');
					unpaid += parseInt(res.substudentpay[i].Expense_Cost);
					$("#Finance").find('.yearly-expense').after(' <div data-val="'+res.substudentpay[i].Expense_Label+'" class="month-row sections-main-sub-container-right-main-result sections-main-sub-container-right-main-result-extra-style"><span class="sections-main-sub-container-right-main-result-label sections-main-sub-container-right-main-result-label-extra-info"> <span class="expense_label">'+res.substudentpay[i].Expense_Label+'</span> <span class="expense_label_method">'+res.substudentpay[i].Expense_Cost+'</span> </span> <span class="sections-main-sub-container-right-main-result-value img-yearly"><img src="assets/icons/red_check.svg" alt="states" /></span></div>');
				}
			}
			var style = "";
			for (var i = indStart; i < months.length; i++) {

				if (date.getMonth() === i){
					style = 'style="background: #f9f9f9"';
				}
				else{
					style = "";
				}

				htmlmonths += '<th scope="col" class="col-text-align month-row" '+style+'>'+months[i].slice(0,3)+'</th>';

				for (var k = res.substudentpay.length - 1; k >= 0; k--) {
					if (res.substudentpay[k].Expense_PaymentMethod === "Monthly"){
						var endDate = new Date(res.substudentpay[k].Subscription_EndDate);
						if (isNaN(endDate.getMonth())){
							endDate = i;
						}
						else{
							endDate = endDate.getMonth();
						}
						if (date.getMonth() >= i && i >=  months.indexOf(res.substudentpay[k].Subscription_StartDate) && endDate >= i){
							unpaid += parseInt(res.substudentpay[k].Expense_Cost);
							$("#Finance").find('[data-val="'+res.substudentpay[k].Expense_Label+'"]').append('<td data-id="'+res.substudentpay[k].SS_ID +"-"+months[i]+'" '+style+' scope="col" class="row-payment col-text-align "><img  src="assets/icons/check_red.svg" alt="states"/></td>');
						}
						else{
							$("#Finance").find('[data-val="'+res.substudentpay[k].Expense_Label+'"]').append('<td data-id="'+res.substudentpay[k].SS_ID +"-"+months[i]+'" scope="col" class="row-payment col-text-align"><img  src="assets/icons/check_gray.svg" alt="states"/></td>');
						}
					}
				}

				for (var j = res.payStudent.length - 1; j >= 0; j--) {

					if(res.payStudent[j].Expense_PaymentMethod === "Monthly"){

						if (res.payStudent[j].SP_PaidPeriod === months[i]){
							unpaid -= parseInt(res.payStudent[j].Expense_Cost);
							$("#Finance").find('[data-val="'+res.payStudent[j].Expense_Label+'"]').find('[data-id="'+res.payStudent[j].SS_ID+"-"+months[i]+'"]').html('<img src="assets/icons/check_green.svg" alt="states"/>');
						}
					}
				}

				if (i === indEnd){
					break;
				}
				if (i === months.length - 1){
					i = -1;
				}
			}

			var yearlyExpense = res.payStudent.filter(function (el) {
						return el.Expense_PaymentMethod === "Annual";
				});

			for (var i = yearlyExpense.length - 1; i >= 0; i--) {
				unpaid -= yearlyExpense[i].Expense_Cost;
				$("#Finance").find('[data-val="'+yearlyExpense[i].Expense_Label+'"]').find('.img-yearly').html('<img src="assets/icons/green_check.svg" alt="states" />');
			}

			if(unpaid < 0){
				$("#Finance").find(".sub-container-form-footer").addClass("hide-footer");
			}

			if (unpaid < 0)
			unpaid = "0.00";
			$('#Finance').find('.unpaid-expense').html(unpaid);
			
			$("#Finance").find('.list-months').append(htmlmonths);
			var inputFirst,readOnly,inputLabel = '';
			parents = res.parents;
			inputLabel = "input-label-move-to-top"
			readOnly = 'readonly';
				for (var i = res.parents.length - 1; i >= 0; i--) {

					if (res.parents.length > 1 )
						inputFirst = '';
					else
						inputFirst = 'dynamic-form-input-first';

				$('#Details').find('.sections-main-sub-container-right-main-rows-parents').prepend('<div class="row-payment dynamic-form-input-parent '+inputFirst+' row-parent"> <div class="input-parent "><div class="col-md-4"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_name" value="'+res.parents[i].Parent_Name+'"  '+readOnly+'> <label class="input-label '+inputLabel+'"> <span class="input-label-text">Full name</span><span class="input-label-bg-mask"></span> </label> </div> </div><div class="col-md-4"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_phone" value="'+res.parents[i].Parent_Phone+'"  '+readOnly+'> <label class="input-label '+inputLabel+'"> <span class="input-label-text">Phone number</span><span class="input-label-bg-mask"></span> </label> </div> </div> <div class="col-md-4"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_email" value="'+res.parents[i].Parent_Email+'"  '+readOnly+'> <label class="input-label '+inputLabel+'"> <span class="input-label-text">Email</span><span class="input-label-bg-mask"></span> </label> </div> </div> </div>');

				$('#EditStudentModal').find('.sections-main-sub-container-right-main-rows-parents').prepend('<div class="row-payment dynamic-form-input-parent '+inputFirst+' row-parent"> <div class="input-parent "><div class="col-md-12"><div class="dynamic-form-input-dropdown-container dynamic-form-input-dropdown-search-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first"><div class="dynamic-form-input"><div class="dynamic-form-input-float-adjust"><div class="form-group group form-group-right" style="margin-bottom: 0 !important;"><input type="text" class="input-dropdown-search" placeholder="Search parents" name="parent_name" value="'+res.parents[i].Parent_Name+'" data-id="'+res.parents[i].Parent_ID+'" /><img class="icon button-icon caret-rotate" src="assets/icons/sidebar_icons/search.svg"><ul class="dynamic-form-input-dropdown-options"></ul></div></div></div></div></div></div><div class="col-md-6"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_phone" value="'+res.parents[i].Parent_Phone+'"> <label class="input-label"> <span class="input-label-text">Phone number</span><span class="input-label-bg-mask"></span> </label> </div> </div> <div class="col-md-5"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_email" value="'+res.parents[i].Parent_Email+'"> <label class="input-label"> <span class="input-label-text">Email</span><span class="input-label-bg-mask"></span> </label> </div> </div> <div class="col-md-1"> <div class="square-button"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div>');
			}

			absences = res.absences;
			for (var i = res.absences.length - 1; i >= 0; i--) {
				var fromto = JSON.parse(res.absences[i].AD_FromTo)
				if (res.absences[i].AD_Type === 2)
				{
					$("#reported_table").removeClass('hidden');
						$("#reported_title").removeClass('hidden');
					$('#Absence').find('.table_reported').append('<tr class="row-absence" id="absence-'+res.absences[i].AD_ID+'"> <td data-label="Subject name" class="td-label">Absence</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> '+(parseInt(res.absences[i].Declaredby_ID) === res.declaredBy ?(' <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit " onClick="displayAbsence('+i+')" data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete " data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div>'): ' ')+' <!-- End table-option-list --> </td> </tr>');
				}
				else
				{
					$("#absence_table").removeClass('hidden');
						$("#absence_title").removeClass('hidden');
					$('#Absence').find('.table_delay').append('<tr class="row-absence" id="absence-'+res.absences[i].AD_ID+'"> <td data-label="Subject name" class="td-label">'+absenceArray[res.absences[i].AD_Type]+'</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+res.absences[i].AD_Date+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list -->'+(parseInt(res.absences[i].Declaredby_ID) === res.declaredBy ?(' <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit " onClick="displayAbsence('+i+')" data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete " data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div>'): ' ')+' <!-- End table-option-list --> </td> </tr>');
				}
			}

			if (result[0])
				{
					for (var i = 0; i < subclasses.length; i++) {
					if (subclasses[i].Classe_Label === result[0].Classe_Label)
					{
						checked = '';
						for (var j = res.substudent.length - 1; j >= 0; j--) {
							if(subclasses[i].Expense_Label === res.substudent[j].Expense_Label)
								checked = 'checked';
						}
						$('#Details').find('.sub_list').append('<div class="expense_col col-md-6 sections-label-checkbox-main-container "> <div class="sections-label-checkbox-container"> <div class="form-group group "> <span class="expense_label">'+subclasses[i].Expense_Label+'</span> <span class="method_label"> <span class="method_label_price">'+subclasses[i].Expense_Cost+'</span> <span class="method_label_period">'+subclasses[i].Expense_PaymentMethod+'</span> </span> </div> </div> <div class="customCheck readonly"> <input type="checkbox"  value="'+subclasses[i].LE_ID+'" name="checkbox" id="ck" '+checked+'/> <label for="ck"></label> </div> </div> ');
						$('#EditStudentModal').find('.sub_list').append('<div class="expense_col col-md-6 sections-label-checkbox-main-container "> <div class="sections-label-checkbox-container"> <div class="form-group group "> <span class="expense_label">'+subclasses[i].Expense_Label+'</span> <span class="method_label"> <span class="method_label_price">'+subclasses[i].Expense_Cost+'</span> <span class="method_label_period">'+subclasses[i].Expense_PaymentMethod+'</span> </span> </div> </div> <div class="customCheck "> <input type="checkbox"  value="'+subclasses[i].LE_ID+'" name="checkbox" id="ck" '+checked+'/> <label for="ck"></label> </div> </div> ');
					}
				}
					$('#AddStudentAbsenceModal').find('input[name="ad_classe"]').val(result[0].Classe_Label);
				$('#AddStudentAbsenceModal').find('input[name="ad_student"]').val(result[0].Student_FirstName + " " + result[0].Student_LastName);
				$('#student_info').find('.profile-full-name').text(result[0].Student_FirstName + " " + result[0].Student_LastName);
				$('#student_info').find('.profile-img').attr('src',result[0].Student_Image);
				$('#EditStudentModal').find('.profile-img').attr('src',result[0].Student_Image);
				$('#Details').find('input[name="f_name"]').val(result[0].Student_FirstName);
				$('#Details').find('input[name="student_address_detail"]').val(result[0].Student_Address);
				$('#Details').find('input[name="l_name"]').val(result[0].Student_LastName);
				$('#Details').find('input[name="phone_number_detail"]').val(result[0].Student_Phone);
				$('#Details').find('input[name="student_email_detail"]').val(result[0].Student_Email);
				$('#Details').find('input[name="birthdate_detail"]').val(result[0].Student_birthdate);
				$('#Details').find('input[name="student_gender_detail"]').val(result[0].Student_Gender);
				$('#Details').find('input[name="classe-detail"]').val(result[0].Classe_Label);
				$('#Details').find('input[name="level-detail"]').val(result[0].Level_Label);
				$('#EditStudentModal').find('input[name="f_name"]').val(result[0].Student_FirstName);
				$('#EditStudentModal').find('input[name="student_address_detail"]').val(result[0].Student_Address);
				$('#EditStudentModal').find('input[name="l_name"]').val(result[0].Student_LastName);
				$('#EditStudentModal').find('input[name="phone_number_detail"]').val(result[0].Student_Phone);
				$('#EditStudentModal').find('input[name="student_email_detail"]').val(result[0].Student_Email);
				$('#EditStudentModal').find('input[name="birthdate_detail"]').val(result[0].Student_birthdate);
				$('#EditStudentModal').find('input[name="student_gender_detail"]').val(result[0].Student_Gender);
				$('#EditStudentModal').find('input[name="classe-detail"]').val(result[0].Classe_Label);
				$('#EditStudentModal').find('input[name="level-detail"]').val(result[0].Level_Label);
				$('#AddAttitudeModal').find('input[name="at_classe"]').val(result[0].Classe_Label);
				$('#AddAttitudeModal').find('input[name="at_student"]').val(result[0].Student_FirstName + " " + result[0].Student_LastName);
				$('#EditAttitudeModal').find('input[name="edit-classe"]').val(result[0].Classe_Label);
				$('#EditAttitudeModal').find('input[name="edit-student"]').val(result[0].Student_FirstName + " " + result[0].Student_LastName);
				$('#FinanceModal').find('input[name="payment-classe"]').val(result[0].Classe_Label);
				$('#FinanceModal').find('input[name="payment-student"]').val(result[0].Student_FirstName + " " + result[0].Student_LastName);
				$('#EditAbsenceModal').find('input[name="edit-classe"]').val(result[0].Classe_Label);
				$('#EditAbsenceModal').find('input[name="edit-student"]').val(result[0].Student_FirstName + " " + result[0].Student_LastName);

				/***___ Student Empty Tables _______*****/

				if(res.absences.length == 0 ){
					$("#reported_table").removeClass('hidden');
						$("#reported_title").removeClass('hidden');
					$("#absence_table").removeClass('hidden');
						$("#absence_title").removeClass('hidden');
				}

				if (res.exams.length == 0){
					$('#Exams').removeClass('hidden');
				}

					$('#Grades').removeClass('hidden');

				if (res.homeworks.length == 0){
					$('#Homework').removeClass('hidden');
				}

				if (res.attitudes.length == 0){
					$('#attitude_title').removeClass('hidden');
					$('#attitude_table').removeClass('hidden');
				}
				/***___ End Student Empty Tables ___*****/
				}

				if(section_Main_Exist() == 0){
					addSecionMainFadeOutAnimation($secionMainSelector);
					removeSecionMainFadeOutAnimation($secionMainSelector);
				}

				resolve();
			}
		});
	});
}

function executePayment() {
	$('#FinanceModal').find('.monthly-rows').remove();
	$('#FinanceModal').find('.yearly-rows').remove();
	$('#FinanceModal').find('.yearly').addClass('hidden');
	$('#FinanceModal').find('.monthly').addClass('hidden');
	var indStart = months.indexOf(start);
	var indEnd = months.indexOf(end);
	var MonthsFiltred = [];
	for (var i = subStudent.length - 1; i >= 0; i--) {
		if (subStudent[i].Expense_PaymentMethod === "Monthly")
		{
			MonthsFiltred = [];

			for (var j = months.indexOf(subStudent[i].Subscription_StartDate); j < months.length; j++) {
				MonthsFiltred.push(months[j]);
				if (j === indEnd)
					break;
				if (j === months.length - 1)
					j = -1;
			}

			var payFilter = payStudent.filter(function (el) {
		        	return el.SS_ID === subStudent[i].SS_ID;
		      	});

			alreadyPay = payFilter;
			var htmlmonths = '';

			for (var j = payFilter.length - 1; j >= 0; j--) {
				MonthsFiltred = MonthsFiltred.filter(function (el) {
		        	return el != payFilter[j].SP_PaidPeriod;
		      	});
			}

			date = new Date();
			currentMonth = date.getMonth();
			passByMonth = false;

			for (var k = 0; k < MonthsFiltred.length; k++) {

				selected = 'selected';
				
				if(!passByMonth){
					selected = 'selected';
				}else{
					selected = '';
				}

				if(MonthsFiltred[k] == months[currentMonth]){
					passByMonth = true;
				}

				htmlmonths += "<option "+selected+" value="+MonthsFiltred[k]+">"+MonthsFiltred[k]+"</option> ";				
			}

			if(htmlmonths != ""){
				$('#FinanceModal').find('.monthly').removeClass('hidden');
				$('#FinanceModal').find('.monthly').after('<div class="monthly-rows dynamic-form-input-container dynamic-form-input-container-extra-style"> <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+subStudent[i].Expense_Label+'</span> <span class="input-label-bg-mask"></span></label> <div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="form-group group"> <select class="input-text-month-select2 payment-select" data-val="Monthly" data-ssid="'+subStudent[i].SS_ID+'" multiple name="language"> '+htmlmonths+'</select> <img class="icon button-icon" src="assets/icons/caret.svg"> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div> </div>');
			}

		}
		if (subStudent[i].Expense_PaymentMethod === "Annual")
		{
			payFilter = payStudent.filter(function (el) {
		        	return el.SS_ID === subStudent[i].SS_ID;
		    });

			var htmlYearly = '';

			if (payFilter.length === 0){
				htmlYearly = '<option selected value="'+academicyear+'">'+academicyear+'</option> ';
				$('#FinanceModal').find('.yearly').removeClass('hidden');
				$('#FinanceModal').find('.yearly').after('<div class="yearly-rows dynamic-form-input-container dynamic-form-input-container-extra-style input-text-subject-select2-one-option"> <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+subStudent[i].Expense_Label+'</span> <span class="input-label-bg-mask"></span></label> <div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="form-group group"> <select class="input-text-year-select2 payment-select" data-val="Annual" data-ssid="'+subStudent[i].SS_ID+'" multiple name="language"> '+htmlYearly+'</select> <img class="icon button-icon" src="assets/icons/caret.svg"> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div> </div>');
			}
		}
	}
	if($(".input-text-month-select2").length > 0){
		$(".input-text-month-select2").select2({
		  tags: true,
		  dropdownPosition: 'below',
		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected

		});
	}

	if($(".input-text-year-select2").length > 0){
		$(".input-text-year-select2").select2({
		  tags: true,
		  dropdownPosition: 'below',
		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected

		});
	}

}

function savePayment() {
	var payments = $('#FinanceModal').find('.payment-select').map(function(){return {period:$(this).val(),ssid:$(this).data('ssid')};}).get();
	var filtred;
	for (var i = payments.length - 1; i >= 0; i--) {
		filtred = payStudent.filter(paystu => paystu.SS_ID === payments[i].ssid)
		for (var j = filtred.length - 1; j >= 0; j--) {
			payments[i].period = payments[i].period.filter(pay => pay !== filtred[j].SP_PaidPeriod)
		}
	}
	$.ajax({
	    type: 'post',
	    url: '/Students/payment',
	    data: {
	    	payments:payments
	    },
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.saved)
	  	{
	  		$("#FinanceModal").modal('hide');
	  		getAllStudents(studentId);
	  	} else {
	  		console.log(res);
	  	}
	  });
}

function displayHomework(id) {
	console.log("Filess!!",homeworks[id].files)
	$('#HomeworkDetailModal').find('.list_files .row-file').remove();
	for (var i = homeworks[id].files.length - 1; i >= 0; i--) {
		
		$('#HomeworkDetailModal').find('.list_files').append('<a style="text-decoration: none; color: inherit;" download href="'+homeworks[id].files[i].Homework_Link+'"><div class="file-container file-loaded row-file"> <div class="file-icon-label"> <img class="file-icon" src="assets/icons/file.svg" alt="file"/> <span class="file-label">'+homeworks[id].files[i].Homework_Title+'</span> </div> </div></a>')
	}
	$('#HomeworkDetailModal').find('.sub-container-main-header').html(homeworks[id].Homework_Title);
	$('#HomeworkDetailModal').find('.sub-container-sub-header').html(''+homeworks[id].Subject_Label+' - '+homeworks[id].Classe_Label+' - Teacher Name');
	$('#HomeworkDetailModal').find('input').val(homeworks[id].Homework_DeliveryDate);
	$('#HomeworkDetailModal').find('textarea').val(homeworks[id].Homework_Deatils);
}

function displayAttitude(id) {
	$('#EditAttitudeModal').find('input[name=date]').val(attitudes[id].Attitude_Addeddate);
	$('#EditAttitudeModal').find('textarea').val(attitudes[id].Attitude_Note);
	$('#EditAttitudeModal').find('input[data-val=Positive]').prop('checked', false);
	$('#EditAttitudeModal').find('input[data-val=Negative]').prop('checked', false);
	$('#EditAttitudeModal').find('input[name="edit-student"]').data('id',id);
	if (attitudes[id].Attitude_Interaction === 0)
		$('#EditAttitudeModal').find('input[data-val=Positive]').prop('checked', true);
	else
		$('#EditAttitudeModal').find('input[data-val=Negative]').prop('checked', true);
}

function displayAbsence(id) {
	$('.input-time').timepicker('destroy');
	var fromto = JSON.parse(absences[id].AD_FromTo);
	$('#EditAbsenceModal').find('input[data-val=Absence]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Retard]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Session]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Period]').prop('checked', false);
	$('#EditAbsenceModal').find('input[name="edit-student"]').data('id',id);
	$('#EditAbsenceModal').removeClass('modal-dom-change-watcher');
	if (absences[id].AD_Type === 2)
	{
		$('#EditAbsenceModal').find('input[data-val=Absence]').prop('checked', true);
		$('#EditAbsenceModal').find('input[data-val=Period]').prop('checked', true);
		$('#EditAbsenceModal').find('input[name=start-period]').val(fromto.from);
		$('#EditAbsenceModal').find('input[name=end-period]').val(fromto.to);
		$(".dynamic-form-input-container-session").fadeIn().slideDown();
		$(".dynamic-form-input-container-multi-date").fadeIn().slideDown();
		$(".dynamic-form-input-container-one-date").fadeOut().slideUp();
		$(".dynamic-form-input-container-multi-time").fadeOut().slideUp();
	}
	else if (absences[id].AD_Type === 1)
	{
		$('#EditAbsenceModal').find('input[data-val=Absence]').prop('checked', true);
		$('#EditAbsenceModal').find('input[data-val=Session]').prop('checked', true);
		$(".dynamic-form-input-container-session").fadeIn().slideDown();
		$(".dynamic-form-input-container-multi-date").fadeOut().slideUp();
		$(".dynamic-form-input-container-one-date").fadeIn().slideDown();
		$(".dynamic-form-input-container-multi-time").fadeIn().slideDown();
		$('#EditAbsenceModal').find('input[name=starTime]').val(fromto.from);
		$('#EditAbsenceModal').find('input[name=endTime]').val(fromto.to);
		$('#EditAbsenceModal').find('input[name=editDate]').val(absences[id].AD_Date);
	} else
	{
		$('#EditAbsenceModal').find('input[data-val=Retard]').prop('checked', true);
		$('#EditAbsenceModal').find('input[name=starTime]').val(fromto.from);
		$('#EditAbsenceModal').find('input[name=endTime]').val(fromto.to);
		$('#EditAbsenceModal').find('input[name=editDate]').val(absences[id].AD_Date);
		$(".dynamic-form-input-container-session").fadeOut().slideUp();
		$(".dynamic-form-input-container-multi-date").fadeOut().slideUp();
		$(".dynamic-form-input-container-one-date").slideDown();
		$(".dynamic-form-input-container-multi-time").slideDown();
	}
	$('.input-time').timepicker({

		timeFormat: 'HH:mm',
	    interval: 60,
	    dynamic: false,
	    dropdown: true,
	    scrollbar: true

	});
	$('#EditAbsenceModal').addClass('modal-dom-change-watcher');
}

function displayExam(id) {
	console.log(id);
	$('#ExamDetailModal').find('.sub-container-main-header').html(exams[id].Exam_Title);
	$('#ExamDetailModal').find('.sub-container-sub-header').html(''+exams[id].Subject_Label+' - '+exams[id].Classe_Label+' - Teacher Name');
	$('#ExamDetailModal').find('input').val(exams[id].Exam_Date);
	$('#ExamDetailModal').find('textarea').val(exams[id].Exam_Deatils);
}

$('#student_form').find('input[name="level"]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('#student_form').find('input[name="classe"]').val("");
  	 $('#student_form').find('.sub_div').remove();
  	 $('#student_form').find('.row-classe').remove();
	  $.ajax({
		    type: 'get',
		    url: '/Students/subscriptions',
		    data: {
		    	level_label:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {
		  		subArray = res.subscriptions;
		  		for (var i = res.subscriptions.length - 1; i >= 0; i--) {
		  			
		  			$('#list_sub').append('<div class="col-md-6 sections-label-checkbox-main-container sub_div"> <div class="sections-label-checkbox-container"> <div class="form-group group "> <span class="expense_label">'+res.subscriptions[i].Expense_Label+'</span> <span class="method_label"> <span class="method_label_price">'+res.subscriptions[i].Expense_Cost+'</span> <span class="method_label_period">'+res.subscriptions[i].Expense_PaymentMethod+'</span> </span> </div> </div> <div class="customCheck"> <input type="checkbox" value="" name="checkbox_sub_'+i+'" id="ck'+i+'" /> <label for="ck'+i+'"></label> </div> </div>')
		  		}

		  		for (var i = res.classes.length - 1; i >= 0; i--) {
		  			
		  			$('.list-classe').append(' <li class="row-classe" data-id="'+res.classes[i].Classe_ID+'" data-val="'+res.classes[i].Classe_Label+'">'+res.classes[i].Classe_Label+'</li>')
		  		}
		  	}
		  });
  }
})

$('#EditStudentModal input[name="level-detail"]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	 $('#EditStudentModal').find('.row-classe').remove();
	  $.ajax({
		    type: 'get',
		    url: '/Students/subscriptions',
		    data: {
		    	level_label:value,
		    	student_id:studentId,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {

		  		$('#EditStudentModal').find('.expense_col').remove();
		  		console.log("Level Sub",res.subscriptions);
		  		console.log("Student Sub",subStudent);
		  		console.log("Student res ",res.studentLevel);

		  		// Level Expenses  
			  	for (var i = 0; i < res.subscriptions.length; i++) {
					var checked = '';
					studentlevelchanged = (value == res.studentLevel[0].Level_Label) ? 0 : 1 ;
					if(value == res.studentLevel[0].Level_Label){ 
						for (var j = subStudent.length - 1; j >= 0; j--) {
							if(res.subscriptions[i].Expense_Label === subStudent[j].Expense_Label ){
								checked = 'checked';
							}
						}
					}
					$('#EditStudentModal').find('.sub_list').append('<div class="expense_col col-md-6 sections-label-checkbox-main-container "> <div class="sections-label-checkbox-container"> <div class="form-group group "> <span class="expense_label">'+res.subscriptions[i].Expense_Label+'</span> <span class="method_label"> <span class="method_label_price">'+res.subscriptions[i].Expense_Cost+'</span> <span class="method_label_period">'+res.subscriptions[i].Expense_PaymentMethod+'</span> </span> </div> </div> <div class="customCheck"> <input type="checkbox" value="'+res.subscriptions[i].LE_ID+'" name="checkbox" id="ck" '+checked+'/> <label for="ck"></label> </div> </div> ');
				}
			
				// Level Classes 
				for (var i = res.classes.length - 1; i >= 0; i--) {
		  			$('#EditStudentModal').find('.list-classe').append(' <li class="row-classe" data-id="'+res.classes[i].Classe_ID+'" data-val="'+res.classes[i].Classe_Label+'">'+res.classes[i].Classe_Label+'</li>')
		  		}

		  	}
		  });
  }
})

function saveStudent() {

	var first_name = $('#student_form').find('input[name="first_name"]').val();
	var student_address = $('#student_form').find('input[name="student_address"]').val();
	var student_gender = $('#student_form').find('input[name="student_gender"]').val();
	var profile_image = $('#student_form').find('input[name="profile_image"]').val();
	var last_name = $('#student_form').find('input[name="last_name"]').val();
	var level = $('#student_form').find('input[name="level"]').val();
	var phone_number = $('#student_form').find('input[name="phone_number"]').val();
	var student_email = $('#student_form').find('input[name="student_email"]').val();
	var birthdate = $('#student_form').find('input[name="birthdate"]').val();
	var classe = $('#student_form').find('input[name="classe"]').val();

	var parent_name = $('#student_form').find('input[name=parent_name]').map(function(){return $(this).val();}).get();
		parent_name = parent_name.filter(function (el) {
        return el != "";
    });

	var parent_phone = $('#student_form').find('input[name=parent_phone]').map(function(){return $(this).val();}).get();
		parent_phone = parent_phone.filter(function (el) {
        return el != "";
    });

    var parent_email = $('#student_form').find('input[name=parent_email]').map(function(){return $(this).val();}).get();
		parent_email = parent_email.filter(function (el) {
        return el != "";
    });

	var checkbox_sub = [];

	for (var i = subArray.length - 1; i >= 0; i--) {
		if ($('input[name=checkbox_sub_'+i+']:checked').length > 0)
			checkbox_sub.push(subArray[i]);
	}

	if (!first_name){
		$('#student_form').find('input[name="first_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#student_form').find('input[name="first_name"]').parent(".form-group").removeClass("form-input-error");
	}
	if (!student_address){
		$('#student_form').find('input[name="student_address"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#student_form').find('input[name="student_address"]').parent(".form-group").removeClass("form-input-error");
	}
	if (!last_name){
		$('#student_form').find('input[name="last_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#student_form').find('input[name="last_name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!phone_number){
		$('#student_form').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(phone_number)){
			$('#student_form').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#student_form').find('input[name="phone_number"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!student_email){
		$('#student_form').find('input[name="student_email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(student_email)){
			$('#student_form').find('input[name="student_email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#student_form').find('input[name="student_email"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!birthdate){
		$('#student_form').find('input[name="birthdate"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#student_form').find('input[name="birthdate"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!level){
		$('.input_level').addClass("form-input-error");
	}
	else{
		$('.input_level').removeClass("form-input-error");
	}

	if (!student_gender){
		$('.input_gender').addClass("form-input-error");
	}
	else{
		$('.input_gender').removeClass("form-input-error");
	}

	if (!classe){
		$('.input_classe').addClass("form-input-error");
	}
	else{
		$('.input_classe').removeClass("form-input-error");
	}

	if ( checkbox_sub.length <= 0){
		$('#student_form').find('.subscription-divider').css("background", "#f6b8c1");
		 $("#student_form").animate({ scrollTop: $('#student_form').find('.subscription-divider').prop("scrollHeight")}, 1000);
	}
	else{
		$('#student_form').find('.subscription-divider').css("background", "#f0f0f6");
	}

	/***___ Parent Details ___***/

	parent_errors = [];

	$("#student_form .dynamic-form-input-parent input").each(function(ind,elem){
		if ($(elem).val() == ""){
			$(elem).parent(".form-group").addClass("form-input-error");
			parent_errors.push(ind);
		}
		else{

			if($(elem).attr("name") == "parent_email" || $(elem).attr("name") == "parent_phone"){

				if($(elem).attr("name") == "parent_email"){

					if (!emailValidator($(elem).val())){
						$(elem).parent(".form-group").addClass("form-input-error");
						parent_errors.push(ind);
						console.log("parent_email");
					}
					else{
						$(elem).parent(".form-group").removeClass("form-input-error");
					}
				}

			 	if($(elem).attr("name") == "parent_phone"){

					if (!internationalPhoneValidator($(elem).val())){
						$(elem).parent(".form-group").addClass("form-input-error");
						parent_errors.push(ind);
						console.log("parent_phone");
					}
					else{
						$(elem).parent(".form-group").removeClass("form-input-error");
					}
				}

			}else{
				$(elem).parent(".form-group").removeClass("form-input-error");
			}
			
		}

	});
	
	/***___ End Parent Details ___***/

	if (first_name && level && classe && parent_phone.length > 0 && parent_email.length > 0  && parent_name.length > 0 && parent_errors.length == 0 && student_address && phone_number && internationalPhoneValidator(phone_number) && student_email && emailValidator(student_email) && student_gender && birthdate && checkbox_sub.length > 0)
	{
		var data = {
			first_name,
			last_name,
			level,
			classe,
			student_gender,
			profile_image:$('#output-img').attr("src"),
			parent_phone:parent_phone,
			parent_name:parent_name,
			parent_email:parent_email,
			phone_number,
			student_email,
			birthdate,
			student_address,
			checkbox_sub:checkbox_sub,
		}

		console.log(data);

		$.ajax({
		    type: 'post',
		    url: '/Students/save',
		    data: data,
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddStudentModal').modal('hide');
		  		$('#student_form').find('input[name="first_name"]').val("");
				$('#student_form').find('input[name="student_address"]').val("");
				$('#student_form').find('input[name="profile_image"]').val("");
				$('#student_form').find('input[name="last_name"]').val("");
				$('#student_form').find('input[name="level"]').val("");
				$('#student_form').find('input[name="phone_number"]').val("");
				$('#student_form').find('input[name="email"]').val("");
				$('#student_form').find('input[name="student_email"]').val("");
				$('#student_form').find('input[name="student_gender"]').val("");
				$('#student_form').find('input[name="parent_name"]').val("");
				$('#student_form').find('input[name="parent_phone"]').val("");
				$('#student_form').find('input[name="parent_email"]').val("");
				$('#student_form').find('input[name="birthdate"]').val("");
				$('#output-img').attr("src",'assets/icons/Logo_placeholder.svg')
				$('#student_form').find('input[name="classe"]').val("");
				for (var i = subArray.length - 1; i >= 0; i--) {
					$('input[name=checkbox_sub_'+i+']:checked').prop("checked", false);
				}
		  		getAllStudents();

		  	} else {

		  		
		  			// Parent Email , Phone Exist 

					$("#student_form .dynamic-form-input-parent input").each(function(ind,elem){

						if($(elem).attr("name") == "parent_email" || $(elem).attr("name") == "parent_phone"){

							if($(elem).attr("name") == "parent_email") {

									for(var em = 0 ; em < res.form_errors.Parents.Email.length ; em++) {

										if ($(elem).val() == res.form_errors.Parents.Email[em]){
											$(elem).parent(".form-group").addClass("form-input-error");
										}
										else{
											$(elem).parent(".form-group").removeClass("form-input-error");
										}
									}

							}

							if($(elem).attr("name") == "parent_phone") {

									for(var t = 0 ; t < res.form_errors.Parents.Tel.length ; t++) {

										if ($(elem).val() == res.form_errors.Parents.Tel[t]){
											$(elem).parent(".form-group").addClass("form-input-error");
										}
										else{
											$(elem).parent(".form-group").removeClass("form-input-error");
										}
									}

							}
						}	

					});

					
					if (phone_number == res.form_errors.Student.Tel ){
						$('#student_form').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
					}
					else{
						$('#student_form').find('input[name="phone_number"]').parent(".form-group").removeClass("form-input-error");
					}

					if (student_email == res.form_errors.Student.Email ){
						$('#student_form').find('input[name="student_email"]').parent(".form-group").addClass("form-input-error");
					}
					else{
						$('#student_form').find('input[name="student_email"]').parent(".form-group").removeClass("form-input-error");
					}
					

		  	}

		  });
	}

}

function saveChange() {

	var parent_name = $('#EditStudentModal').find('input[name=parent_name]').map(function(){return {name:$(this).val(),id:$(this).data('id')};}).get();
	parent_name = parent_name.filter(function (el) {
        return el.name != "";
    });
	
	var parent_phone = $('#EditStudentModal').find('input[name=parent_phone]').map(function(){return {phone:$(this).val(),id:$(this).data('id')}}).get();
	parent_phone = parent_phone.filter(function (el) {
        return el.phone != "";
    });	

	var parent_email = $('#EditStudentModal').find('input[name=parent_email]').map(function(){return {email:$(this).val(),id:$(this).data('id')}}).get();
	parent_email = parent_email.filter(function (el) {
        return el.email != "";
    });

	var subscriptions = $('#EditStudentModal').find('input[name=checkbox]:not(:checked)').map(function(){return $(this).val()}).get();
	var checkedSub = $('#EditStudentModal').find('input[name=checkbox]:checked').map(function(){return $(this).val()}).get();


	/******************************************************************************************/

	var first_name = $('#EditStudentModal').find('input[name="f_name"]').val();
	var student_address = $('#EditStudentModal').find('input[name="student_address_detail"]').val();
	var student_gender = $('#EditStudentModal').find('input[name="student_gender_detail"]').val();
	var profile_image = $('#EditStudentModal').find('.profile-img').attr('src');
	var last_name = $('#EditStudentModal').find('input[name="l_name"]').val();
	var level = $('#EditStudentModal').find('input[name="level-detail"]').val();
	var phone_number = $('#EditStudentModal').find('input[name="phone_number_detail"]').val();
	var student_email = $('#EditStudentModal').find('input[name="student_email_detail"]').val();
	var birthdate = $('#EditStudentModal').find('input[name="birthdate_detail"]').val();
	var classe = $('#EditStudentModal').find('input[name="classe-detail"]').val();

	var checkbox_sub = [];

	console.log("subArray _ "+subArray);

	$('#EditStudentModal input[name="checkbox"]').each(function(ind,elem){
		if($(elem).is(":checked")){
			checkbox_sub.push(ind);
		}
	});	

	if (!first_name){
		$('#EditStudentModal').find('input[name="f_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditStudentModal').find('input[name="f_name"]').parent(".form-group").removeClass("form-input-error");
	}
	if (!student_address){
		$('#EditStudentModal').find('input[name="student_address_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditStudentModal').find('input[name="student_address_detail"]').parent(".form-group").removeClass("form-input-error");
	}
	if (!last_name){
		$('#EditStudentModal').find('input[name="l_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditStudentModal').find('input[name="l_name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!phone_number){
		$('#EditStudentModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(phone_number)){
			$('#EditStudentModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#EditStudentModal').find('input[name="phone_number_detail"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!student_email){
		$('#EditStudentModal').find('input[name="student_email_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(student_email)){
			$('#EditStudentModal').find('input[name="student_email_detail"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#EditStudentModal').find('input[name="student_email_detail"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!birthdate){
		$('#EditStudentModal').find('input[name="birthdate_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditStudentModal').find('input[name="birthdate_detail"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!level){
		$('.input_level').addClass("form-input-error");
	}
	else{
		$('.input_level').removeClass("form-input-error");
	}

	if (!student_gender){
		$('.input_gender').addClass("form-input-error");
	}
	else{
		$('.input_gender').removeClass("form-input-error");
	}

	if (!classe){
		$('.input_classe').addClass("form-input-error");
	}
	else{
		$('.input_classe').removeClass("form-input-error");
	}

	if (checkbox_sub.length <= 0){
		$('#EditStudentModal').find('.subscription-label-devider').css("background", "#f6b8c1");
		$("#EditStudentModal").animate({ scrollTop: $('#EditStudentModal').find('.subscription-label-devider').prop("scrollHeight")}, 1000);
	}
	else{
		$('#EditStudentModal').find('.subscription-label-devider').css("background", "#f0f0f6");
	}


	/***___ Parent Details ___***/

	parent_errors = [];

	$("#EditStudentModal .dynamic-form-input-parent input").each(function(ind,elem){
		if ($(elem).val() == ""){
			$(elem).parent(".form-group").addClass("form-input-error");
			parent_errors.push(ind);
		}
		else{

			if($(elem).attr("name") == "parent_email" || $(elem).attr("name") == "parent_phone"){

				if($(elem).attr("name") == "parent_email"){

					if (!emailValidator($(elem).val())){
						$(elem).parent(".form-group").addClass("form-input-error");
						parent_errors.push(ind);
						console.log("parent_email");
					}
					else{
						$(elem).parent(".form-group").removeClass("form-input-error");
					}
				}

			 	if($(elem).attr("name") == "parent_phone"){

					if (!internationalPhoneValidator($(elem).val())){
						$(elem).parent(".form-group").addClass("form-input-error");
						parent_errors.push(ind);
						console.log("parent_phone");
					}
					else{
						$(elem).parent(".form-group").removeClass("form-input-error");
					}
				}

			}else{
				$(elem).parent(".form-group").removeClass("form-input-error");
			}
			
		}

	});
	
	/***___ End Parent Details ___***/

	/******************************************************************************************/

	if ( checkbox_sub.length <= 0){
		$('#EditStudentModal').find('.subscription-divider').css("background", "#f6b8c1");
		 $("#EditStudentModal").animate({ scrollTop: $('#EditStudentModal').find('.subscription-divider').prop("scrollHeight")}, 1000);
	}
	else{
		$('#EditStudentModal').find('.subscription-divider').css("background", "#f0f0f6");
	}

	if (first_name && level && classe && parent_phone.length > 0 && parent_email.length > 0  && parent_name.length > 0 && parent_errors.length == 0 && student_address && phone_number && internationalPhoneValidator(phone_number) && student_email && emailValidator(student_email) && student_gender && birthdate && checkbox_sub.length > 0)
	{

	$.ajax({
	    type: 'post',
	    url: '/Students/update',
	    data: {
	    	id:studentId,
	    	student_img:$('#EditStudentModal').find('.profile-img').attr('src'),
			student_fname:$('#EditStudentModal').find('input[name="f_name"]').val(),
			student_gender:$('#EditStudentModal').find('input[name="student_gender_detail"]').val(),
			student_address:$('#EditStudentModal').find('input[name="student_address_detail"]').val(),
			student_lname:$('#EditStudentModal').find('input[name="l_name"]').val(),
			student_phone:$('#EditStudentModal').find('input[name="phone_number_detail"]').val(),
			student_email:$('#EditStudentModal').find('input[name="student_email_detail"]').val(),
			student_birthdat:$('#EditStudentModal').find('input[name="birthdate_detail"]').val(),
			student_classe:$('#EditStudentModal').find('li[data-val="'+$('#EditStudentModal').find('input[name="classe-detail"]').val()+'"]').data('id'),
			student_level:$('#EditStudentModal').find('input[name="level-detail"]').val(),
			student_level_changed : studentlevelchanged,
			parent_name:parent_name,
			parent_phone:parent_phone,
			parent_email:parent_email,
			parents:parents,
			checked:checkedSub,
			unchecked:subscriptions
	    },
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  		discardChange();
	  	if(res.updated) {

	  		$("#EditStudentModal").modal('hide');
	  		getAllStudents(studentId);
	  		
	  		$('#EditStudentModal .sub-container-form-footer').addClass('hide-footer');
 			$('#EditStudentModal .sub-container-form-footer').removeClass('show-footer');

	  	} else {

	  		//discardChange();

			// Parent Email , Phone Exist 

			$("#EditStudentModal .dynamic-form-input-parent input").each(function(ind,elem){

				if($(elem).attr("name") == "parent_email" || $(elem).attr("name") == "parent_phone"){

					if($(elem).attr("name") == "parent_email") {

							for(var em = 0 ; em < res.form_errors.Parents.Email.length ; em++) {

								if ($(elem).val() == res.form_errors.Parents.Email[em]){
									$(elem).parent(".form-group").addClass("form-input-error");
								}
								else{
									$(elem).parent(".form-group").removeClass("form-input-error");
								}
							}

					}

					if($(elem).attr("name") == "parent_phone") {

							for(var t = 0 ; t < res.form_errors.Parents.Tel.length ; t++) {

								if ($(elem).val() == res.form_errors.Parents.Tel[t]){
									$(elem).parent(".form-group").addClass("form-input-error");
								}
								else{
									$(elem).parent(".form-group").removeClass("form-input-error");
								}
							}

					}
				}	

			});
			
			if (phone_number == res.form_errors.Student.Tel ){
				$('#EditStudentModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
			}
			else{
				$('#EditStudentModal').find('input[name="phone_number_detail"]').parent(".form-group").removeClass("form-input-error");
			}

			if (student_email == res.form_errors.Student.Email ){
				$('#EditStudentModal').find('input[name="student_email_detail"]').parent(".form-group").addClass("form-input-error");
			}
			else{
				$('#EditStudentModal').find('input[name="student_email_detail"]').parent(".form-group").removeClass("form-input-error");
			}
	  	}

	  });
 		
 	}
}



function updateAbsence() {
	var id = $('#EditAbsenceModal').find('input[name="edit-student"]').data('id');
	var from = {};
	var date = 'null';
	if (absences[id].AD_Type === 2)
	{
		from.from = $('#EditAbsenceModal').find('input[name=start-period]').val();
		from.to = $('#EditAbsenceModal').find('input[name=end-period]').val();
	}
	else if (absences[id].AD_Type === 1)
	{

		from.from = $('#EditAbsenceModal').find('input[name=starTime]').val();
		from.to = $('#EditAbsenceModal').find('input[name=endTime]').val();
		date = $('#EditAbsenceModal').find('input[name=editDate]').val();
	} else
	{
		from.from = $('#EditAbsenceModal').find('input[name=starTime]').val();
		from.to = $('#EditAbsenceModal').find('input[name=endTime]').val();
		date = $('#EditAbsenceModal').find('input[name=editDate]').val();
	}
	$.ajax({
	    type: 'post',
	    url: '/Students/absence/update',
	    data: {
	    	id:absences[id].AD_ID,
	    	declaredBy:absences[id].Declaredby_ID,
	    	AD_FromTo:JSON.stringify(from),
			AD_Date:date,
	    },
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.updated)
	  	{
	  		$('#EditAbsenceModal').modal('hide');
	  		getAllStudents(studentId);
	  	} else {
	  		console.log(res);
	  		$('#EditAbsenceModal').modal('hide');
	  	}
	  });
}

function updateAttitude() {

	var at_date = $('#EditAttitudeModal').find('input[name=date]').val();
	var at_note = $('#EditAttitudeModal').find('textarea').val();

	if (!at_date){
		$('#EditAttitudeModal').find('input[name=date]').addClass("form-input-error");
	}
	else{
		$('#EditAttitudeModal').find('input[name=date]').removeClass("form-input-error");
	}

	if (!at_note){
		$('#EditAttitudeModal').find('textarea').addClass("form-input-error");
	}
	else{
		$('#EditAttitudeModal').find('textarea').removeClass("form-input-error");
	}

	var id = $('#EditAttitudeModal').find('input[name="edit-student"]').data('id');

	if(at_note && at_date){

		$.ajax({
	    	type: 'post',
		    url: '/Students/attitude/update',
		    data: {
		    	id:attitudes[id].Attitude_ID,
		    	declaredBy:attitudes[id].Declaredby_ID,
		    	Attitude_Note:$('#EditAttitudeModal').find('textarea').val(),
				Attitude_Addeddate:$('#EditAttitudeModal').find('input[name=date]').val(),
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.updated)
		  	{
		  		$('#EditAttitudeModal').modal('hide');
		  		getAllStudents(studentId);
		  	} else {
		  		console.log(res);
		  		$('#EditAttitudeModal').modal('hide');
		  	}
		  });

	}


}

function discardChange() {
 	$('#EditStudentModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditStudentModal .sub-container-form-footer').removeClass('show-footer');
 	$("#EditStudentModal").modal('hide');
 	displayStudent(studentId);
 }

function saveAbsence() {

	var ad_classe = $('#AddStudentAbsenceModal').find('input[name="ad_classe"]').val();
	var ad_fromto = {};
	var ad_date = "";

	var ad_student = $('#AddStudentAbsenceModal').find('input[name="ad_student"]').val();

	var ad_absence;

	if ($('#AddStudentAbsenceModal').find('input[data-val="Absence"]:checked').val())
	{
		if($('#AddStudentAbsenceModal').find('input[data-val="Session"]:checked').val())
		{
			ad_absence = $('#AddStudentAbsenceModal').find('input[data-val="Session"]:checked').val();
			ad_fromto = {
				from: $('#AddStudentAbsenceModal').find('input[name="time_start"]').val(),
				to: $('#AddStudentAbsenceModal').find('input[name="time_end"]').val(),
			};
			ad_date = $('#AddStudentAbsenceModal').find('input[name="ad_date"]').val();
		} 
		else 
		{
			ad_absence = $('#AddStudentAbsenceModal').find('input[data-val="Period"]:checked').val();
			ad_fromto = {
				from: $('#AddStudentAbsenceModal').find('input[name="period_start"]').val(),
				to: $('#AddStudentAbsenceModal').find('input[name="period_end"]').val(),
			}
			ad_date = "null";
		}
	} 
	else 
	{
		ad_absence = $('#AddStudentAbsenceModal').find('input[data-val="Retard"]:checked').val();
		ad_fromto = {
				from: $('#AddStudentAbsenceModal').find('input[name="time_start"]').val(),
				to: $('#AddStudentAbsenceModal').find('input[name="time_end"]').val(),
			};
		ad_date = $('#AddStudentAbsenceModal').find('input[name="ad_date"]').val();
	}


	if (!ad_date && ad_absence !== "2"){
		$('#AddStudentAbsenceModal').find('.dynamic-form-input-container-one-date').addClass("form-input-error");
	}
	else{
		$('#AddStudentAbsenceModal').find('.dynamic-form-input-container-one-date').removeClass("form-input-error");
	}

	if (!ad_classe){
		$('#AddStudentAbsenceModal').find('.ad_classe').addClass("form-input-error");
	}
	else{
		$('#AddStudentAbsenceModal').find('.ad_classe').removeClass("form-input-error");
	}

	if (!ad_student){
		$('#AddStudentAbsenceModal').find('.ad_student').addClass("form-input-error");
	}
	else{
		$('#AddStudentAbsenceModal').find('.ad_student').removeClass("form-input-error");
	}

	if (!ad_fromto.from && ad_absence !== "2")
	{
		$('#AddStudentAbsenceModal').find('input[name="time_start"]').addClass("form-input-error");
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').addClass("form-input-error");
	}
	else
	{
		$('#AddStudentAbsenceModal').find('input[name="time_start"]').removeClass("form-input-error");
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').removeClass("form-input-error");
	}

	if (!ad_fromto.to && ad_absence !== "2")
	{
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').addClass("form-input-error");
	}
	else
	{
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').removeClass("form-input-error");
	}

	if($('#AddStudentAbsenceModal').find('input[data-val="Period"]').is(":checked")){
		$("#AddStudentAbsenceModal .dynamic-form-input-container-multi-date input").each(function(ind,elem){
			if($(elem).val()==""){
				$(elem).addClass("form-input-error");
			}else{
				$(elem).removeClass("form-input-error");
			}
		});
	}

	if (ad_absence && ad_date && ad_fromto.to && ad_fromto.from && ad_student && ad_classe)
	{
		$.ajax({
		    type: 'post',
		    url: '/Students/absence',
		    data: {
		    	ad_fromto: JSON.stringify(ad_fromto),
		    	ad_type:parseInt(ad_absence),
		    	ad_date,
		    	ad_classe,
		    	ad_student,
		    	user_id:studentId
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('.input-time').timepicker('destroy');
		  		$('#AddStudentAbsenceModal').modal('hide');
			  	$('#AddStudentAbsenceModal').find('input[name="ad_classe"]').val("");
				$('#AddStudentAbsenceModal').find('input[name="ad_student"]').val("");
				$('#AddStudentAbsenceModal').find('input[name="ad_date"]').val("");
	 			$('#AddStudentAbsenceModal').find('input[name="period_start"]').val("");
				$('#AddStudentAbsenceModal').find('input[name="period_end"]').val("");
				$('#AddStudentAbsenceModal').find('input[name="time_start"]').val("");
				$('#AddStudentAbsenceModal').find('input[name="time_end"]').val("");
				$('.input-time').timepicker({
					timeFormat: 'HH:mm',
				    interval: 60,
				    dynamic: false,
				    dropdown: true,
				    scrollbar: true

				});
		  		getAllStudents(studentId);
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}

function saveAttitude() {

	var at_classe = $('#AddAttitudeModal').find('input[name="at_classe"]').val();
	var at_date = $('#AddAttitudeModal').find('input[name="at_date"]').val();

	var at_student = $('#AddAttitudeModal').find('input[name="at_student"]').val();
	var at_note = $('#AddAttitudeModal').find('#at_note').val();
	var at_type = "";

	if ($('#AddAttitudeModal').find('input[data-val="Positive"]:checked').val())
		at_type = $('#AddAttitudeModal').find('input[data-val="Positive"]:checked').val();
	else
		at_type = $('#AddAttitudeModal').find('input[data-val="Negative"]:checked').val();


	if (!at_date){
		$('#AddAttitudeModal').find('.at_date').addClass("form-input-error");
	}
	else{
		$('#AddAttitudeModal').find('.at_date').removeClass("form-input-error");
	}
	if (!at_classe){
		$('#AddAttitudeModal').find('.at_classe').addClass("form-input-error");
	}
	else{
		$('#AddAttitudeModal').find('.at_classe').removeClass("form-input-error");
	}

	if (!at_student){
		$('#AddAttitudeModal').find('.at_student').addClass("form-input-error");
	}
	else{
		$('#AddAttitudeModal').find('.at_student').removeClass("form-input-error");
	}
	if (!at_note){
		$('#AddAttitudeModal').find('#at_note').addClass("form-input-error");
	}
	else{
		$('#AddAttitudeModal').find('#at_note').removeClass("form-input-error");
	}

	if (at_type && at_note && at_date && at_student && at_classe)
	{
		$.ajax({
		    type: 'post',
		    url: '/Students/attitude',
		    data: {
		    	at_type:parseInt(at_type),
		    	at_date,
		    	at_note,
		    	at_classe,
		    	at_student,
		    	user_id:studentId
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddAttitudeModal').find('input[name="at_classe"]').val("");
				$('#AddAttitudeModal').find('input[name="at_date"]').val("");
				$('#AddAttitudeModal').find('input[name="at_student"]').val("");
				$('#AddAttitudeModal').find('#at_note').val("");
		  		$("#attitude_table").removeClass('hidden');
		  		$("#attitude_title").removeClass('hidden');
		  		$('#AddAttitudeModal').modal('hide');
		  		getAllStudents(studentId);
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
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
