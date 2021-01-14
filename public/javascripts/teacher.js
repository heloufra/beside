var subArray = [];
var teachers = [];
var parents = [];
var subteacher = [];
var absences = [];
var teacherId = 0;
var absenceArray = ["Retard","Absence"];
var noteTypes = ["Positive","Negative"];
var subclasses = [];
var homeworks = [];
var attitudes = [];
var exams = [];
var filtredClass = [];
$domChange = false;
var olddata = [];
var teacherSelectedSub = [];

var subject_list = [];

let $detailsSelector = "#Details";

getAllteachers();

function getAllteachers(id) {

	dynamicListRows = [];

 	$('.row-teacher').remove();

	$.ajax({
	    type: 'get',
	    url: '/Teachers/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors){
	  	  console.log(res.errors)
	  	} else {
	  		teachers = res.teachers;
	  		console.log('Teachers!!',teachers);
	  		filtredClass = res.teachers;
	  		if (id){
	  			displayteacher(id);
	  		}
	  		else if (res.teachers.length > 0){
	  			displayteacher(res.teachers[res.teachers.length - 1].teacher.User_ID);
	  		}
	  		var active = '';

	  		remove_No_Result_FeedBack();
	  		addSideBarLoadingAnimation($sideSelector);

	  		for (var i = res.teachers.length - 1; i >= 0; i--) {
	  			if (id){
	  				if(res.teachers[i].teacher.User_ID === id){
	  					active = 'active';
	  				}
	  				else{
	  					active = ''
	  				}
	  			}else{
		  			if (i === res.teachers.length - 1){
		  				active = 'active';
		  			}
		  			else{
		  				active = '';
		  			}
		  		}

	  			var name = JSON.parse(res.teachers[i].teacher.User_Name);
	  			var html = '';

  				for (var j = res.teachers[i].classes.length - 1; j >= 0; j--) {
  					html += res.teachers[i].classes[j].Classe_Label + " , ";
  				}

	  			dynamicListRows += '<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+res.teachers[i].teacher.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="teacherId" type="hidden" value="'+res.teachers[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>' ;
	  		}


	  		if(res.teachers.length > 0 ){
				$('#list_teachers').append(dynamicListRows);
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

function displayteacher(index) 
{

  addLoadingAnimation($detailsSelector,$headerInfo);
  teacherSelectedSub = [];
  $.ajax({
    type: 'get',
    url: '/Teachers/one',
    data: {
    	id:index
    },
    dataType: 'json'
  })
  .done(function(res){
  	if(res.errors)
  	{
  		console.log(res.errors);
  		removeLoadingAnimation($detailsSelector,$headerInfo);
  	} else {

  		removeLoadingAnimation($detailsSelector,$headerInfo);
  		$('#Absence').find('.row-absence').remove();
		$("#reported_table").addClass('hidden');
	  	$("#reported_title").addClass('hidden');
		$("#absence_table").addClass('hidden');
	  	$("#absence_title").addClass('hidden');
	  	$('.subjects-container').remove();
  		teacherId = parseInt(index);
		$domChange = false;
		var result = teachers.filter(function (el) {
				  return el.teacher.User_ID === parseInt(index);
				});
		$('#teacher_info').find('#Details').removeClass("dom-change-watcher");
		$('#EditTeacherModal').removeClass("dom-change-watcher");
		$('.subject-klon').remove();
		$('.class-subject').remove();
		olddata = [];
		console.log('Classes',res.allClasses);

		var addTeacherModalSubjects = "";
  		console.log("sub ",res.allsubjects);
  		subject_list = res.allsubjects;

  		for (var n = res.allsubjects.length - 1; n >= 0; n--) {
  			addTeacherModalSubjects += '<li data-subjectid="'+res.allsubjects[n].Subject_ID+'" data-levelid="'+res.allsubjects[n].Level_ID+'" data-val="'+res.allsubjects[n].Subject_Label+'">'+res.allsubjects[n].Subject_Label+'</li>';
  		}

  		$("#AddTeacherModalSubjects").html("");
  		$("#AddTeacherModalSubjects").html(addTeacherModalSubjects);

  		for (var i = res.subjects.length - 1; i >= 0; i--) {


	  		teacherSelectedSub.push(res.subjects[i].Subject_Label);

			teacherSelectedSub = teacherSelectedSub.filter(function(item, pos) {
				return teacherSelectedSub.indexOf(item) == pos;
			});

  			var selected    = "";
  			var visibility  = "visibility";
  			var exist 		= "";
  			
  			var allSubjects = "";
  			console.log("sub ",res.allsubjects);
  			subject_list = res.allsubjects;

  			for (var n = res.allsubjects.length - 1; n >= 0; n--) {

  				if(teacherSelectedSub.includes(res.allsubjects[n].Subject_Label)){
  					visibility  = "visibility";
  				}else{
  					visibility  = "";
  				}

  				allSubjects += '<li  class="'+visibility+'"  data-subjectid="'+res.allsubjects[n].Subject_ID+'" data-levelid="'+res.allsubjects[n].Level_ID+'" data-val="'+res.allsubjects[n].Subject_Label+'">'+res.allsubjects[n].Subject_Label+'</li>';
  			}

	  		var classes = res.classes.filter(function (el) {
				  return el.Subject_Label === res.subjects[i].Subject_Label;
			});

	  		$('#teacher_info .subjects-list').prepend('<div class="dynamic-form-input-dropdown-container sections-main-sub-container-right-main-rows-dropdown-tags-container subjects-container" > <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="dynamic-form-input-float-adjust"> <div class="form-group group form-group-left"> <input readonly type="text" class="input-text" value="'+res.subjects[i].Subject_Label+'" name="subjects" required> <label class="input-label input-label-move-to-top"><span class="input-label-text">Subjects</span> <span class="input-label-bg-mask"></span></label> </div> <div class="form-group group form-group-right"> <select data-select='+i+' class="input-text-subject-classes-select2 list-classes" multiple readonly> </select> <label class="input-label input-label-move-to-top"> <span class="input-label-text">Classes</span><span class="input-label-bg-mask"></span> </label> </div> </div> </div> </div> </div>');

	  		if(res.subjects.length > 1 ){
	  			$dynamic_form_input_first = " ";
	  		}else{
	  			$dynamic_form_input_first = " dynamic-form-input-first ";
	  		}

	  		$('#EditTeacherModal .subjects-list').prepend('<div class="dynamic-form-input-dropdown-container sections-main-sub-container-right-main-rows-dropdown-tags-container subjects-container" > <div class="dynamic-form-input-dropdown '+$dynamic_form_input_first +'"> <div class="dynamic-form-input"> <div class="dynamic-form-input-float-adjust"> <div class="form-group group form-group-left"> <input type="text" class="input-text input-dropdown" onchange="subjectsChange(this)" value="'+res.subjects[i].Subject_Label+'" name="subjects" required> <label class="input-label"><span class="input-label-text">Subjects</span> <span class="input-label-bg-mask"></span></label> <img class="icon button-icon" src="assets/icons/caret.svg"> <ul class="dynamic-form-input-dropdown-options">'+allSubjects+'</ul> </div> <div class="form-group group form-group-right"> <select data-select='+i+' class="input-text-subject-classes-select2 list-classes" multiple > </select> <img class="icon button-icon" src="assets/icons/caret.svg"> <label class="input-label"> <span class="input-label-text">Classes</span><span class="input-label-bg-mask"></span> </label> </div> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div>');

	  		if($('#EditTeacherModal [data-select='+i+']').length > 0){
				$('#EditTeacherModal [data-select='+i+']').select2({
				  tags: true,
				  dropdownPosition: 'below',
		  		  placeholder: "Classes",
		  		  minimumResultsForSearch: -1,
		  		  templateResult: hideSelected
				});
			}

			if($('#teacher_info [data-select='+i+']').length > 0){
				$('#teacher_info [data-select='+i+']').select2({
				  tags: true,
				  dropdownPosition: 'below',
		  		  placeholder: "Classes",
		  		  disabled: true,
		  		  minimumResultsForSearch: -1,
		  		  templateResult: hideSelected
				});
			}

	  		for (var k = res.classes.length - 1; k >= 0; k--) {
	  			if (classes.some( value => { return value.Subject_Label == res.classes[k].Subject_Label } ))
	  			{
	  				olddata.push({subject:res.subjects[i].Subject_ID,classe:res.classes[k].Classe_ID});
	  				var option = new Option(res.classes[k].Classe_Label,res.classes[k].Classe_ID, true, true);
    				$('.subjects-list').find('[data-select='+i+']').append(option).trigger('change');
	  			}
	  		}

	  		var uniqueClasses = [];

	  		for (var j = res.allClasses.length - 1; j >= 0; j--) {
	  			if(!uniqueClasses.some( value => { return value.Subject_ID == res.allClasses[j].Subject_ID } )) {
			    	uniqueClasses.push(res.allClasses[j]);
	  			}
	  		}

	  		for (var k = uniqueClasses.length - 1; k >= 0; k--) {
	  			if (uniqueClasses[k].Subject_ID === res.subjects[i].Subject_ID){
	  				var option = new Option(uniqueClasses[k].Classe_Label,uniqueClasses[k].Classe_ID, false, false);
    				$('.subjects-list').find('[data-select='+i+']').append(option).trigger('change');
    			}
	  		}

	  		$('[data-select='+i+']').parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");
	  		
  		}

  		/*********_______ filter unique subjects ________***********/
		
  		absences = res.absences;
  		if(res.absences.length > 0 ){
			for (var i = res.absences.length - 1; i >= 0; i--) {
				var fromto = JSON.parse(res.absences[i].AD_FromTo)
				if (res.absences[i].AD_Type === 2)
				{
					$("#reported_table").removeClass('hidden');
	  				$("#reported_title").removeClass('hidden');
					$('#Absence').find('.table_reported').append('<tr class="row-absence" id="absence-'+res.absences[i].AD_ID+'"> <td data-label="Subject name" class="td-label">Absence</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit " onClick="displayAbsence('+i+')" data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete " data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
				}
				else
				{
					$("#absence_table").removeClass('hidden');
	  				$("#absence_title").removeClass('hidden');
					$('#Absence').find('.table_delay').append('<tr class="row-absence" id="absence-'+res.absences[i].AD_ID+'"> <td data-label="Subject name" class="td-label">'+absenceArray[res.absences[i].AD_Type]+'</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+res.absences[i].AD_Date+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit " onClick="displayAbsence('+i+')" data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete " data-id="'+res.absences[i].AD_ID+'"> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
				}
			}
		}else{
			$("#reported_table").removeClass('hidden');
	  		$("#reported_title").removeClass('hidden');
		}

		$('#teacher_info').removeClass('hidden');
		var name = JSON.parse(result[0].teacher.User_Name);
		
		var classeHTML = '';
		for (var i = result[0].classes.length - 1; i >= 0; i--) {
			classeHTML += result[0].classes[i].Classe_Label + " ";
		}
		$('#teacher_info').find('.label-full-name').text(name.first_name + " " + name.last_name);
		$('#EditTeacherModal').find('.label-full-name').text(name.first_name + " " + name.last_name);
		$('#teacher_info').find('.input-img').attr('src',result[0].teacher.User_Image);
		$('#EditTeacherModal').find('.input-img').attr('src',result[0].teacher.User_Image);
		$('#teacher_info').find('#Details').find('input[name="f_name"]').val(name.first_name);
		$('#teacher_info').find('#Details').find('input[name="teacher_address_detail"]').val(result[0].teacher.User_Address);
		$('#teacher_info').find('#Details').find('input[name="teacher_gender_detail"]').val(result[0].teacher.User_Gender);
		$('#teacher_info').find('#Details').find('input[name="l_name"]').val(name.last_name);
		$('#teacher_info').find('#Details').find('input[name="phone_number_detail"]').val(result[0].teacher.User_Phone);
		$('#teacher_info').find('#Details').find('input[name="birthdate_detail"]').val(result[0].teacher.User_Birthdate)
		$('#teacher_info').find('#Details').find('input[name="email"]').val(result[0].teacher.User_Email);
		$('#EditTeacherModal').find('input[name="f_name"]').val(name.first_name);
		$('#EditTeacherModal').find('input[name="teacher_address_detail"]').val(result[0].teacher.User_Address);
		$('#EditTeacherModal').find('input[name="teacher_gender_detail"]').val(result[0].teacher.User_Gender);
		$('#EditTeacherModal').find('input[name="l_name"]').val(name.last_name);
		$('#EditTeacherModal').find('input[name="phone_number_detail"]').val(result[0].teacher.User_Phone);
		$('#EditTeacherModal').find('input[name="birthdate_detail"]').val(result[0].teacher.User_Birthdate)
		$('#EditTeacherModal').find('input[name="email"]').val(result[0].teacher.User_Email);
		$('#AddTeacherAbsenceModal').find('input[name="ad_teacher"]').val(name.first_name + " " + name.last_name);
		$('#EditAbsenceModal').find('input[name="ad_teacher"]').val(name.first_name + " " + name.last_name);
		$('#EditAbsenceModal').find('input[name="ad_classe"]').val(classeHTML);
		$('#AddTeacherAbsenceModal').find('input[name="ad_classe"]').val(classeHTML);
		$('#teacher_info').find('#Details').addClass("dom-change-watcher");
		$('#EditTeacherModal').addClass("dom-change-watcher");

		// Plus btn Toggle vivibility
		subject_list_len = res.allsubjects.length;
		dropdown = $("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container ").length;

		if( dropdown == subject_list_len ){
			$("#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input").addClass("visibility");
		}else{
			$("#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input").removeClass("visibility");
		}
		// End Plus btn Toggle vivibility
  	}
  });
	//$('#EditAbsenceModal').find('input[name="edit-classe"]').val(result[0].Classe_Label);
	//$('#EditAbsenceModal').find('input[name="edit-teacher"]').val(result[0].teacher_FirstName + " " + result[0].teacher_LastName);
}

function remove() {
 	var id;
 	if ($('#ConfirmDeleteModal').data('role') === 'attitude' || $('#ConfirmDeleteModal').data('role') === 'absence')
		id = $('#ConfirmDeleteModal').data('id');
	else
		id = teacherId;
	$.ajax({
		    type: 'post',
		    url: '/Teachers/'+$('#ConfirmDeleteModal').data('role')+'/remove',
		    data: {
		    	id:id
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
		  			$('#teacher_info').addClass('hidden');
		  			location.reload();
		  			getAllteachers();
		  		}
		  	} else {
		  		console.log(res);
		  	}
		  });
}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output-img-teacher").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("profile-teacher").addEventListener("change", readFile);

function readFileDetail() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      $("#EditTeacherModal .profile-img").attr("src",e.target.result);
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

$('.teacher-filters').on("change", function() {

		var subjectVal = $('#teacher-leftSide').find('input[name="filter-subject"]').attr("data-val");
	  	var classeVal  = $('#teacher-leftSide').find('input[name=classe]').attr("data-val");

	  	var dynamicListRows = '' ;

	  	var value = $(this).attr("data-val");

		if (value.replace(/\s/g, '') !== ''){

			remove_No_Result_FeedBack();
		  	addSideBarLoadingAnimation($sideSelector);

		  	console.log(teachers);

		  	if( classeVal == "All" && subjectVal == "All") {

		  		teacherPrev = teachers;

		  	}else{

		  		if( classeVal != "All" && subjectVal != "All"){

		  			teacherPrev = teachers.filter((t) => {
		  			  	return t.classes.some(c => c.Classe_Label == classeVal )
		  			});

		  			teacherPrev = teachers.filter((t) => {
		  			  	return t.subjects.some(s => s.Subject_Label == subjectVal ) 
		  			});
	
		  		}else if(classeVal != "All" ){
		  			teacherPrev = teachers.filter((t) => {
		  			  	return t.classes.some(c => c.Classe_Label == classeVal )
		  			});
		  		}else if(subjectVal != "All" ){
		  			teacherPrev = teachers.filter((t) => {
		  			  	return t.subjects.some(s => s.Subject_Label == subjectVal ) 
		  			});
		  		}

		  	}
		  	
			var active,name = '';

			for (var i = teacherPrev.length - 1; i >= 0; i--) {

				name = JSON.parse(teacherPrev[i].teacher.User_Name);

				if (i === teacherPrev.length - 1)
				{
					displayteacher(teacherPrev[i].teacher.User_ID);
					active = 'active';
				}
				else{
					active = '';
				}

				var html = '';
				for (var j = teacherPrev[i].classes.length - 1; j >= 0; j--) {
					html += teacherPrev[i].classes[j].Classe_Label + " , ";
				}

				html.trim(",");

				dynamicListRows += '<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+teacherPrev[i].teacher.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="teacherId" type="hidden" value="'+teacherPrev[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>';

				removeSideBarLoadingAnimation($sideSelector);
			}
		}

		if(teacherPrev.length > 0 ){
			$($sideSelector).append(dynamicListRows);
		}else{
			$HeaderFeedBack = "No result found !";
			$SubHeaderFeedBack = "";
			$IconFeedBack = "404_students.png";
			no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
		}

		removeSideBarLoadingAnimation($sideSelector);

});

document.getElementById("search-teacher").addEventListener('input', function (evt) {

  dynamicListRows = '';
  remove_No_Result_FeedBack();
  addSideBarLoadingAnimation($sideSelector);
    
  $('.row-teacher').remove();
  var active = '';

  if (this.value.replace(/\s/g, '') !== ''){

  	var value = new RegExp(this.value.toLowerCase().replace(/\s/g, ''));
	var filtred = teachers.filter(function (el) {
				var name = JSON.parse(el.teacher.User_Name)
				var forname = name.first_name.toLowerCase()+name.last_name.toLowerCase();
				var backname = name.last_name.toLowerCase()+name.first_name.toLowerCase();
			  return forname.match(value) || backname.match(value);
	});

	for (var i = filtred.length - 1; i >= 0; i--) {
		if (i === filtred.length - 1)
		{
			displayteacher(filtred[i].teacher.User_ID);
			active = 'active';
		} else
			active = '';
		var name = JSON.parse(filtred[i].teacher.User_Name);
		var html = '';
		for (var j = filtred[i].classes.length - 1; j >= 0; j--) {
			html += filtred[i].classes[j].Classe_Label + " ";
		}
	  	
	  	dynamicListRows +='<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].teacher.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="teacherId" type="hidden" value="'+filtred[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>';
	}

  } else {


  	var filtred = teachers;

	for (var i = filtred.length - 1; i >= 0; i--) {
		if (i === filtred.length - 1)
		{
			displayteacher(filtred[i].teacher.User_ID);
			active = 'active';
		} else
			active = '';
		var name = JSON.parse(filtred[i].teacher.User_Name);
		var html = '';
		for (var j = filtred[i].classes.length - 1; j >= 0; j--) {
			html += filtred[i].classes[j].Classe_Label + " ";
		}
	  	
	  	dynamicListRows +='<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].teacher.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="teacherId" type="hidden" value="'+filtred[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>';
	}

  }


	if(filtred.length > 0 ){
		$('#list_teachers').append(dynamicListRows);
	}else{
		$HeaderFeedBack = "No result found !";
		$SubHeaderFeedBack = "";
		$IconFeedBack = "404_students.png";
		no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
	}

	removeSideBarLoadingAnimation($sideSelector);

});

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

			  		var filtred = teachers;

					for (var i = filtred.length - 1; i >= 0; i--) {
						if (i === filtred.length - 1)
						{
							displayteacher(filtred[i].teacher.User_ID);
							active = 'active';
						} else
							active = '';
						var name = JSON.parse(filtred[i].teacher.User_Name);
						var html = '';
						for (var j = filtred[i].classes.length - 1; j >= 0; j--) {
							html += filtred[i].classes[j].Classe_Label + " ";
						}
					  	
					  	dynamicListRows +='<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].teacher.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="teacherId" type="hidden" value="'+filtred[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>';
					}


					if(filtred.length > 0 ){
						$('#list_teachers').append(dynamicListRows);
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

$(document).on("click",".row-teacher",function(event){
	if (!$("#ChangesModal").hasClass('in'))
	{
		teacherId = $(this).find('input[name="teacherId"]').val();
		$('.sections-main-sub-container-left-card').removeClass('active');
		$(this).addClass('active');
		displayteacher(teacherId);
	}
});
function hideSelected(value) {
	  if (value && !value.selected) {
	    return $('<span>' + value.text + '</span>');
	  }
	}


function displayAbsence(id) {
	var fromto = JSON.parse(absences[id].AD_FromTo);
	$('.input-time').timepicker('destroy');
	$('#EditAbsenceModal').find('input[data-val=Absence]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Retard]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Session]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Period]').prop('checked', false);
	$('#EditAbsenceModal').find('input[name="ad_teacher"]').data('id',id);
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

function updateAbsence() {
	var id = $('#EditAbsenceModal').find('input[name="ad_teacher"]').data('id');
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
	    url: '/Teachers/absence/update',
	    data: {
	    	id:absences[id].AD_ID,
	    	AD_FromTo:JSON.stringify(from),
			AD_Date:date,
	    },
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.updated)
	  	{
	  		$('#EditAbsenceModal').modal('hide');
	  		displayteacher(teacherId);
	  	} else {
	  		console.log(res);
	  	}
	  });
}

 $('#teacher_form').find('input[name="subject"]').on( "change", function() {
  var value = $(this).val();

  if (value.replace(/\s/g, '') !== '')
  {
  	$('#teacher_form').find('.row-classe').remove();
	  $.ajax({
		    type: 'get',
		    url: '/Teachers/classes',
		    data: {
		    	subject_id:$('#teacher_form').find('[data-val='+value+']').data('subjectid'),
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{

		  		console.log(res.errors)
		  	} else {
		  		var first_label = '';
		  		for (var i = res.classes.length - 1; i >= 0; i--) {
		  			if (first_label !== res.classes[i].Level_Label)
		  			{
		  				first_label = res.classes[i].Level_Label;
		  				$('#teacher_form').find('.list-classes').append('<option class="option-level-label row-classe" disabled="disabled">'+res.classes[i].Level_Label+'</option>')
		  			}
		  			$('#teacher_form').find('.list-classes').append('<option class="row-classe" value="'+res.classes[i].Classe_ID+'">'+res.classes[i].Classe_Label+'</option>')
		  		}
		  	}
		  });
  }
})

function subjectsChange(subject) {

  var value = subject.value;

  if($(subject).parents("#AddTeacherModal").length){

  	$("#AddTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
  		if(value == $(this).text()){
  			$(this).addClass("visibility");
  		}else{
  			$(this).removeClass("visibility");
  		}
  	});
  	
  }

  if($(subject).parents("#EditTeacherModal").length){

  	$("#EditTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
  		if(value == $(this).text()){
  			$(this).addClass("visibility");
  		}else{
  			$(this).removeClass("visibility");
  		}
  	});
  	
  }



  if (value.replace(/\s/g, '') !== '')
  {
  	$(subject).parents('.dynamic-form-input-dropdown').find('.list-classes').find('option').remove();

	  $.ajax({
		    type: 'get',
		    url: '/Teachers/classes',
		    data: {
		    	subject_id:$('.subjects-container').find('[data-val='+value+']').data('subjectid'),
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors){
		  		console.log(res.errors);
		  	} else {
		  		var first_label = '';
		  		for (var i = res.classes.length - 1; i >= 0; i--) {
		  			if (first_label !== res.classes[i].Level_Label)
		  			{
		  				first_label = res.classes[i].Level_Label;
		  				$(subject).parents('.dynamic-form-input-dropdown').find('.list-classes').append('<option class="option-level-label row-classe" disabled="disabled">'+res.classes[i].Level_Label+'</option>')
		  			}
		  			$(subject).parents('.dynamic-form-input-dropdown').find('.list-classes').append('<option class="row-classe" value="'+res.classes[i].Classe_ID+'">'+res.classes[i].Classe_Label+'</option>')
		  		}
		  	}
		  });
  }
}

$(document).on("click","#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container .input-dropdown",function(){

	$("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container .input-dropdown").each(function(ind,elm){

  		$("#AddTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
	  		if($(elm).val() == $(this).text()){
	  			$(this).addClass("visibility");
	  		}
  		});

  	});

});

$(document).on("click","#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container .input-dropdown",function(){

	$("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container .input-dropdown").each(function(ind,elm){

  		$("#EditTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
	  		if($(elm).val() == $(this).text()){
	  			$(this).addClass("visibility");
	  		}
  		});

  	});

});

function saveteacher() {

	var first_name = $('#AddTeacherModal').find('input[name="first_name"]').val();
	var email = $('#AddTeacherModal').find('input[name="email"]').val();
	var teacher_address = $('#AddTeacherModal').find('input[name="teacher_address"]').val();
	var teacher_gender = $('#AddTeacherModal').find('input[name="teacher_gender"]').val();
	var profile_image = $('#AddTeacherModal').find('input[name="profile_image"]').val();
	var last_name = $('#AddTeacherModal').find('input[name="last_name"]').val();
	var phone_number = $('#AddTeacherModal').find('input[name="phone_number"]').val();
	var birthdate = $('#AddTeacherModal').find('input[name="birthdate"]').val();

	var subjects =  $('#AddTeacherModal').find('input[name^=subject]').map(function(idx, elem) {

		if ($(elem).val()){

			subject_list_Prev = subject_list;

			subject = subject_list_Prev.filter(item=>{ return item.Subject_Label == $(elem).val()});

			subjectid = subject[0].Subject_ID ;

	    	return {subject: subjectid , classes:$(this).closest('.dynamic-form-input-float-adjust').find('select').val()};
	    }

	}).get();
	
	if (!first_name){
		$('#AddTeacherModal').find('input[name="first_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddTeacherModal').find('input[name="first_name"]').parent(".form-group").removeClass("form-input-error");
	}
	if (!email){
		$('#AddTeacherModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(email)){
			$('#AddTeacherModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#AddTeacherModal').find('input[name="email"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	
	if (!teacher_address){
		$('#AddTeacherModal').find('input[name="teacher_address"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddTeacherModal').find('input[name="teacher_address"]').parent(".form-group").removeClass("form-input-error");
	}
	if (!last_name){
		$('#AddTeacherModal').find('input[name="last_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddTeacherModal').find('input[name="last_name"]').parent(".form-group").removeClass("form-input-error");
	}
	
	if (!phone_number){
		$('#AddTeacherModal').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(phone_number)){
			$('#AddTeacherModal').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#AddTeacherModal').find('input[name="phone_number"]').parent(".form-group").removeClass("form-input-error");
		}
	}
	if (!birthdate){
		$('#AddTeacherModal').find('input[name="birthdate"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddTeacherModal').find('input[name="birthdate"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!teacher_gender){
		$('#AddTeacherModal').find('input[name="teacher_gender"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddTeacherModal').find('input[name="teacher_gender"]').parent(".form-group").removeClass("form-input-error");
	}

	$("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").each(function(ind,elm){

		$subj = $(elm).find(".input-dropdown");
		$cls  = $(elm).find(".input-text-subject-classes-select2");

		if($subj.val() == "" ){
			$subj.parent(".form-group").addClass("form-input-error");
		}else{
			$subj.parent(".form-group").removeClass("form-input-error");
		}

		if($cls.val().length == 0 ){
			$cls.parent(".form-group").addClass("form-input-error");
		}else{
			$cls.parent(".form-group").removeClass("form-input-error");
		}

	});


	var data = {
			first_name,
			last_name,
			profile_image:$('#output-img-teacher').attr("src"),
			phone_number,
			birthdate,
			email,
			teacher_address,
			teacher_gender,
			subjects:subjects
	}

	if (first_name && last_name && teacher_address && phone_number && internationalPhoneValidator(phone_number) && birthdate && email && emailValidator(email) && (subjects.length > 0))
	{
		$('#AddTeacherModal').modal('hide');
		$.ajax({
		    type: 'post',
		    url: '/Teachers/save',
		    data: data,
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddTeacherModalAddTeacherModal').find('input[name="first_name"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name="teacher_address"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name="profile_image"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name="last_name"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name="level"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name="phone_number"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name="email"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name="birthdate"]').val("");
				$('#AddTeacherModalAddTeacherModal').find('input[name^=subject]').val("");
				$('#output-img-teacher').attr("src",'assets/icons/Logo_placeholder.svg');

				//if (res.exist){

					location.reload();
			  		/****************______getAllteachers()_____________**************/

				  	 	$('.row-teacher').remove();

						$.ajax({
						    type: 'get',
						    url: '/Teachers/all',
						    dataType: 'json'
						  })
						  .done(function(res){
						  	if(res.errors){
						  	  console.log(res.errors)
						  	} else {
						  		teachers = res.teachers;
						  		console.log('Teachers!!',teachers);
						  		filtredClass = res.teachers;
						  		teacherId = teachers[teachers.length];
						  		if (teacherId){
						  			displayteacher(teacherId);
						  		}
						  		else if (res.teachers.length > 0){
						  			displayteacher(res.teachers[res.teachers.length - 1].teacher.User_ID);
						  		}
						  		var active = '';
						  		for (var i = res.teachers.length - 1; i >= 0; i--) {
						  			if (teacherId){
						  				if(res.teachers[i].teacher.User_ID === teacherId){
						  					active = 'active';
						  				}
						  				else{
						  					active = ''
						  				}
						  			}else{
							  			if (i === res.teachers.length - 1){
							  				active = 'active';
							  			}
							  			else{
							  				active = '';
							  			}
							  		}

						  			var name = JSON.parse(res.teachers[i].teacher.User_Name);
						  			var html = '';

					  				for (var j = res.teachers[i].classes.length - 1; j >= 0; j--) {
					  					html += res.teachers[i].classes[j].Classe_Label + " ";
					  				}

						  			$('#list_teachers').append('<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+res.teachers[i].teacher.User_Image+'" alt="card-img"><input name="teacherId" type="hidden" value="'+res.teachers[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>')
						  		}
						  	}
						  });

					/****************______getAllteachers()_____________**************/
				//}
				

		  	} else {
		  		$('#AddTeacherModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
		  	}

		  });
	}

}

function saveChange() {

	var first_name = $('#EditTeacherModal').find('input[name="f_name"]').val();
	var email = $('#EditTeacherModal').find('input[name="email"]').val();
	var teacher_address = $('#EditTeacherModal').find('input[name="teacher_address_detail"]').val();
	var teacher_gender = $('#EditTeacherModal').find('input[name="teacher_gender_detail"]').val();
	var profile_image = $('#EditTeacherModal').find('.profile-img').attr('src');
	var last_name = $('#EditTeacherModal').find('input[name="l_name"]').val();
	var phone_number = $('#EditTeacherModal').find('input[name="phone_number_detail"]').val();
	var birthdate = $('#EditTeacherModal').find('input[name="birthdate_detail"]').val();

	var subjects =  $('#EditTeacherModal').find('input[name^=subject]').map(function(idx, elem) {

		if ($(elem).val()){

			subject_list_Prev = subject_list;

			subject = subject_list_Prev.filter(item=>{ return item.Subject_Label == $(elem).val()});

			subjectid = subject[0].Subject_ID ;

	    	return {subject: subjectid , classes:$(this).closest('.dynamic-form-input-float-adjust').find('select').val()};
	    }

	}).get();
	
	if (!first_name){
		$('#EditTeacherModal').find('input[name="f_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditTeacherModal').find('input[name="f_name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!email){
		$('#EditTeacherModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(email)){
			$('#EditTeacherModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#EditTeacherModal').find('input[name="email"]').parent(".form-group").removeClass("form-input-error");
		}
	}
	
	if (!teacher_address){
		$('#EditTeacherModal').find('input[name="teacher_address_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditTeacherModal').find('input[name="teacher_address_detail"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!last_name){
		$('#EditTeacherModal').find('input[name="l_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditTeacherModal').find('input[name="l_name"]').parent(".form-group").removeClass("form-input-error");
	}
	
	if (!phone_number){
		$('#EditTeacherModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(phone_number)){
			$('#EditTeacherModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#EditTeacherModal').find('input[name="phone_number_detail"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!birthdate){
		$('#EditTeacherModal').find('input[name="birthdate_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditTeacherModal').find('input[name="birthdate_detail"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!teacher_gender){
		$('#EditTeacherModal').find('input[name="teacher_gender_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditTeacherModal').find('input[name="teacher_gender_detail"]').parent(".form-group").removeClass("form-input-error");
	}

	$("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").each(function(ind,elm){

		$subj = $(elm).find(".input-dropdown");
		$cls  = $(elm).find(".input-text-subject-classes-select2");

		if($subj.val() == "" ){
			$subj.parent(".form-group").addClass("form-input-error");
		}else{
			$subj.parent(".form-group").removeClass("form-input-error");
		}

		if($cls.val().length == 0 ){
			$cls.parent(".form-group").addClass("form-input-error");
		}else{
			$cls.parent(".form-group").removeClass("form-input-error");
		}

	});

	var data =  {
    	id:teacherId,
    	profile_image:$('#EditTeacherModal').find('.profile-img').attr('src'),
		first_name:$('#EditTeacherModal').find('input[name="f_name"]').val(),
		teacher_address:$('#EditTeacherModal').find('input[name="teacher_address_detail"]').val(),
		teacher_gender:$('#EditTeacherModal').find('input[name="teacher_gender_detail"]').val(),
		last_name:$('#EditTeacherModal').find('input[name="l_name"]').val(),
		email:$('#EditTeacherModal').find('input[name="email"]').val(),
		phone_number:$('#EditTeacherModal').find('input[name="phone_number_detail"]').val(),
		birthdate:$('#EditTeacherModal').find('input[name="birthdate_detail"]').val(),
		subjects:subjects,
		olddata:olddata
    };

	if (first_name && last_name && teacher_address && phone_number && internationalPhoneValidator(phone_number) && birthdate && email && emailValidator(email) && (subjects.length > 0)) {

	console.log("processing ...");

	var subjects =  $('#EditTeacherModal').find('.subjects-container').find('input[name^=subjects]').map(function(idx, elem) {
	    return {subject: $('#EditTeacherModal').find('.subjects-container').find('[data-val='+$(elem).val()+']').data('subjectid'),classes:$(this).closest('.dynamic-form-input-float-adjust').find('select').val()};
	}).get();



    console.log(data);

	$.ajax({
	    type: 'post',
	    url: '/Teachers/update',
	    data: data ,
	    dataType: 'json'
	  })
	  .done(function(res){

	  	if(res.updated){

	  		$("#EditTeacherModal").modal('hide');

		  				/****************______getAllteachers()_____________**************/

					  	 	$('.row-teacher').remove();

							$.ajax({
							    type: 'get',
							    url: '/Teachers/all',
							    dataType: 'json'
							  })
							  .done(function(res){
							  	if(res.errors){
							  	  console.log(res.errors)
							  	} else {
							  		teachers = res.teachers;
							  		console.log('Teachers!!',teachers);
							  		filtredClass = res.teachers;
							  		if (teacherId){
							  			displayteacher(teacherId);
							  		}
							  		else if (res.teachers.length > 0){
							  			displayteacher(res.teachers[res.teachers.length - 1].teacher.User_ID);
							  		}
							  		var active = '';
							  		for (var i = res.teachers.length - 1; i >= 0; i--) {
							  			if (teacherId){
							  				if(res.teachers[i].teacher.User_ID === teacherId){
							  					active = 'active';
							  				}
							  				else{
							  					active = ''
							  				}
							  			}else{
								  			if (i === res.teachers.length - 1){
								  				active = 'active';
								  			}
								  			else{
								  				active = '';
								  			}
								  		}

							  			var name = JSON.parse(res.teachers[i].teacher.User_Name);
							  			var html = '';

						  				for (var j = res.teachers[i].classes.length - 1; j >= 0; j--) {
						  					html += res.teachers[i].classes[j].Classe_Label + " ";
						  				}

							  			$('#list_teachers').append('<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+res.teachers[i].teacher.User_Image+'" alt="card-img"><input name="teacherId" type="hidden" value="'+res.teachers[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>')
							  		}
							  	}
							  });

					  	/****************______getAllteachers()_____________**************/

				  	}else {
				  		console.log(res);
				  	}

				  });

			 	$('#EditTeacherModal .sub-container-form-footer').addClass('hide-footer');
			 	$('#EditTeacherModal .sub-container-form-footer').removeClass('show-footer');
	}
}

function discardChange() {
 	$('#EditTeacherModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditTeacherModal .sub-container-form-footer').removeClass('show-footer');
 	$("#EditTeacherModal").modal('hide');
 	displayteacher(teacherId);
 }

function saveAbsence() {
var ad_classe = $('#AddTeacherAbsenceModal').find('input[name="ad_classe"]').val();
var ad_fromto = {};
var ad_date = "";

var ad_teacher = $('#AddTeacherAbsenceModal').find('input[name="ad_teacher"]').val();

var ad_absence;

if ($('#AddTeacherAbsenceModal').find('input[data-val="Absence"]:checked').val())
{
	if($('#AddTeacherAbsenceModal').find('input[data-val="Session"]:checked').val())
	{
		ad_absence = $('#AddTeacherAbsenceModal').find('input[data-val="Session"]:checked').val();
		ad_fromto = {
			from: $('#AddTeacherAbsenceModal').find('input[name="time_start"]').val(),
			to: $('#AddTeacherAbsenceModal').find('input[name="time_end"]').val(),
		};
		ad_date = $('#AddTeacherAbsenceModal').find('input[name="ad_date"]').val();
	} else 
	{
		ad_absence = $('#AddTeacherAbsenceModal').find('input[data-val="Period"]:checked').val();
		ad_fromto = {
			from: $('#AddTeacherAbsenceModal').find('input[name="period_start"]').val(),
			to: $('#AddTeacherAbsenceModal').find('input[name="period_end"]').val(),
		}
		ad_date = "null";
	}
} else 
{
	ad_absence = $('#AddTeacherAbsenceModal').find('input[data-val="Retard"]:checked').val();
	ad_fromto = {
			from: $('#AddTeacherAbsenceModal').find('input[name="time_start"]').val(),
			to: $('#AddTeacherAbsenceModal').find('input[name="time_end"]').val(),
		};
	ad_date = $('#AddTeacherAbsenceModal').find('input[name="ad_date"]').val();
}

	if (!ad_date && ad_absence !== "2")
		$('#AddTeacherAbsenceModal').find('.dynamic-form-input-container-one-date').css("border-color", "#f6b8c1");
	else
		$('#AddTeacherAbsenceModal').find('.dynamic-form-input-container-one-date').css("border-color", "#EFEFEF");
	if (!ad_classe)
		$('#AddTeacherAbsenceModal').find('.ad_classe').css("border-color", "#f6b8c1");
	else
		$('#AddTeacherAbsenceModal').find('.ad_classe').css("border-color", "#EFEFEF");

	if (!ad_teacher)
		$('#AddTeacherAbsenceModal').find('.ad_teacher').css("border-color", "#f6b8c1");
	else
		$('#AddTeacherAbsenceModal').find('.ad_teacher').css("border-color", "#EFEFEF");

	if (!ad_fromto.from && ad_absence !== "2")
	{
		$('#AddTeacherAbsenceModal').find('input[name="time_start"]').css("border-color", "#f6b8c1");
		$('#AddTeacherAbsenceModal').find('input[name="time_end"]').css("border-color", "#f6b8c1");
	}
	else
	{
		$('#AddTeacherAbsenceModal').find('input[name="time_start"]').css("border-color", "#EFEFEF");
		$('#AddTeacherAbsenceModal').find('input[name="time_end"]').css("border-color", "#EFEFEF");
	}

	if (!ad_fromto.to && ad_absence !== "2")
	{
		$('#AddTeacherAbsenceModal').find('input[name="time_end"]').css("border-color", "#f6b8c1");
	}
	else
	{
		$('#AddTeacherAbsenceModal').find('input[name="time_end"]').css("border-color", "#EFEFEF");
	}

	if (ad_absence && ad_date && ad_fromto.to && ad_fromto.from && ad_teacher && ad_classe)
	{
		$.ajax({
		    type: 'post',
		    url: '/Teachers/absence',
		    data: {
		    	ad_fromto: JSON.stringify(ad_fromto),
		    	ad_type:parseInt(ad_absence),
		    	ad_date,
		    	ad_classe,
		    	ad_teacher,
		    	user_id:teacherId
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('.input-time').timepicker('destroy');
		  		$('#AddTeacherAbsenceModal').modal('hide');
			  	$('#AddTeacherAbsenceModal').find('input[name="ad_classe"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="ad_teacher"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="ad_date"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="period_start"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="period_end"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="time_start"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="time_end"]').val("");
				 $('#teacher_form').find('input[name^=subject]').val('');
				 $('.input-time').timepicker({
					timeFormat: 'HH:mm',
				    interval: 60,
				    dynamic: false,
				    dropdown: true,
				    scrollbar: true

				});
		  		displayteacher(teacherId);
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-teacher-edit",function(){
	$('#EditTeacherModal').modal('show');
});	

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

/* #AddTeacherModal #Subject_Class_New_Dynamic_Form_Input _______________________*/

	$(document).on("click","#AddTeacherModal #Subject_Class_New_Dynamic_Form_Input",function(){

			console.log("subject_list ",subject_list);

			$("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

			$dynamic_form_input = $("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown-container").first().clone();

			$dynamic_form_input.find(".form-group").removeClass("form-input-error");

			$dynamic_form_input.find("input").val("");

			$dynamic_form_input.find(".input-text-subject-classes-select2 option").remove();

			$dynamic_form_input.find(".input-text-subject-classes-select2").select2("destroy");

			$dynamic_form_input.find(".select2").remove();

			$dynamic_form_input.find(".input-label").removeClass("input-label-move-to-top");

			$(this).parent().find(".sections-main-sub-container-right-main-rows-dropdown-tags-container").last().after($dynamic_form_input);

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").select2({
			  tags: true,
			  dropdownPosition: 'below',
	  		  placeholder: "Classes",
	  		  minimumResultsForSearch: -1,
	  		  templateResult: hideSelected
			});


			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:selecting', function (e) {

				$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

			});

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:unselecting', function (e) {

				if($(this).select2('data').length <= 1 ){
					$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
				}

			});

			subject_list_len = subject_list.length;
			dropdown = $("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container ").length;

			if( dropdown == subject_list_len ){
				$("#AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").addClass("visibility");
			}else{
				$("#AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").removeClass("visibility");
			}

	});

	$(document).on("click","#AddTeacherModal .square-button",function(){

			$(this).parents(".dynamic-form-input-dropdown-container").remove();

			// Subject toggle visibility
			var value = $(this).parents(".dynamic-form-input-dropdown").find(".input-dropdown").val();
			$("#AddTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
		  		if(value == $(this).text()){
		  			$(this).removeClass("visibility");
		  		}
		  	});

			// Plus btn Toggle vivibility
		  	subject_list_len = subject_list.length;
			dropdown = $("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container ").length;

			if( dropdown == subject_list_len ){
				$("#AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").addClass("visibility");
			}else{
				$("#AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").removeClass("visibility");
			}

			// Minus btn Toggle vivibility
			if($("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container").length == 1 ){
				$("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container .dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
			}
		
	});

/* End #AddTeacherModal #Subject_Class_New_Dynamic_Form_Input _______________________*/

/* #EditTeacherModal #Subject_Class_New_Dynamic_Form_Input _______________________*/

	$(document).on("click","#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input",function(){

			$("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

			$dynamic_form_input = $("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown-container").first().clone();

			$dynamic_form_input.find(".form-group").removeClass("form-input-error");

			$dynamic_form_input.find("input").val("");

			$dynamic_form_input.find(".input-text-subject-classes-select2 option").remove();

			$dynamic_form_input.find(".input-text-subject-classes-select2").select2("destroy");

			$dynamic_form_input.find(".select2").remove();

			$dynamic_form_input.find(".input-label").removeClass("input-label-move-to-top");

			$(this).parent().find(".sections-main-sub-container-right-main-rows-dropdown-tags-container").last().after($dynamic_form_input);

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").select2({
			  tags: true,
			  dropdownPosition: 'below',
	  		  placeholder: "Classes",
	  		  minimumResultsForSearch: -1,
	  		  templateResult: hideSelected
			});


			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:selecting', function (e) {

				$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

			});

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:unselecting', function (e) {

				if($(this).select2('data').length <= 1 ){
					$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
				}

			});

			// Plus btn Toggle vivibility
		  	subject_list_len = subject_list.length;
			dropdown = $("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container ").length;

			if( dropdown == subject_list_len ){
				$("#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input").addClass("visibility");
			}else{
				$("#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input").removeClass("visibility");
			}
			// End Plus btn Toggle vivibility

	  		setTimeout(function(){
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  		},25);

	  		setTimeout(function(){
	  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
				$(".modal.in .sub-container-form-footer").addClass("show-footer");
	  		},50);

	});

	$(document).on("click","#EditTeacherModal .square-button",function(){



			$(this).parents(".dynamic-form-input-dropdown-container").remove();

			// Minus btn Toggle vivibility
			if($("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container").length == 1 ){
				$("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container .dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
			}  	

			// Subject toggle visibility
			var value = $(this).parents(".dynamic-form-input-dropdown").find(".input-dropdown").val();
			$("#EditTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
		  		if(value == $(this).text()){
		  			$(this).removeClass("visibility");
		  		}
		  	});	

		  	// Plus btn Toggle vivibility
		  	subject_list_len = subject_list.length;
			dropdown = $("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container ").length;

			if( dropdown == subject_list_len ){
				$("#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input").addClass("visibility");
			}else{
				$("#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input").removeClass("visibility");
			}
			// End Plus btn Toggle vivibility

			setTimeout(function(){
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  		},25);

	  		setTimeout(function(){
	  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
				$(".modal.in .sub-container-form-footer").addClass("show-footer");
	  		},50);
		
	});

/* End #Details #Parents_New_Dynamic_Form_Input _______________________*/

