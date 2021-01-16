var pathname = window.location.pathname.replace('/','');
var payStudent = [];
var subStudent =  [];
var subArray =[];
var start = "";
var end = "";
var academicyear = "";
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];

var subject_list = [];

function getAllSubjects(){

	console.log("getAllSubjects");

	addTeacherModalSubjects = '';

	$.ajax({
	    type: 'post',
	    url: '/Select/subjects',
	    data: {},
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.subjects)
	  	{
	  		subject_list = res.subjects ;
	  		for (var n = res.subjects.length - 1; n >= 0; n--) {
				addTeacherModalSubjects += '<li data-subjectid="'+res.subjects[n].Subject_ID+'" data-levelid="'+res.subjects[n].Level_ID+'" data-val="'+res.subjects[n].Subject_Label+'">'+res.subjects[n].Subject_Label+'</li>';
			}

			$("#AddTeacherModalSubjects").html("");
			$("#AddTeacherModalSubjects").html(addTeacherModalSubjects);

	  	} else {
	  		console.log(res);
	  	}
	  });

}

getAllSubjects();

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

  if(value != ""){

		  subject_list_Prev = subject_list;

		  unique_subject = subject_list_Prev.filter(item=>{ return item.Subject_Label == value });

		  subjectid = -1 ; 

		  if(unique_subject.length > 0 ){
		  	 subjectid = unique_subject[0].Subject_ID ;
		  }

		  if (value.replace(/\s/g, '') !== '')
		  {
		  	$(subject).parents('.dynamic-form-input-dropdown').find('.list-classes').find('option').remove();

			  $.ajax({
				    type: 'get',
				    url: '/Teachers/classes',
				    data: {
				    	subject_id : subjectid ,
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
}



/* .AddTeacherModal #Subject_Class_New_Dynamic_Form_Input _______________________*/

	$(document).on("click",".AddTeacherModal #Subject_Class_New_Dynamic_Form_Input",function(){

			console.log("subject_list ",subject_list);

			$(".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

			$dynamic_form_input = $(".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown-container").first().clone();

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
			dropdown = $(".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container ").length;

			if( dropdown == subject_list_len ){
				$(".AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").addClass("visibility");
			}else{
				$(".AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").removeClass("visibility");
			}

	});

	$(document).on("click",".AddTeacherModal .square-button",function(){

			$(this).parents(".dynamic-form-input-dropdown-container").remove();

			// Subject toggle visibility
			var value = $(this).parents(".dynamic-form-input-dropdown").find(".input-dropdown").val();
			$(".AddTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
		  		if(value == $(this).text()){
		  			$(this).removeClass("visibility");
		  		}
		  	});

			// Plus btn Toggle vivibility
		  	subject_list_len = subject_list.length;
			dropdown = $(".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container ").length;

			if( dropdown == subject_list_len ){
				$(".AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").addClass("visibility");
			}else{
				$(".AddTeacherModal #Subject_Class_New_Dynamic_Form_Input").removeClass("visibility");
			}

			// Minus btn Toggle vivibility
			if($(".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container").length == 1 ){
				$(".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container .dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
			}
		
	});

	$(document).on("click",".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container .input-dropdown",function(){

		$(".AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags-container .input-dropdown").each(function(ind,elm){

	  		$(".AddTeacherModal .dynamic-form-input-dropdown-options li").each(function(){
		  		if($(elm).val() == $(this).text()){
		  			$(this).addClass("visibility");
		  		}
	  		});

	  	});

	});

/* End .AddTeacherModal #Subject_Class_New_Dynamic_Form_Input _______________________*/


function hideSelected(value) {
	  if (value && !value.selected) {
	    return $('<span>' + value.text + '</span>');
	  }
}

/* Teacher _________________________________________________________________________*/

function savePaymentModal() {
	var payments = $('#FinanceNewModal').find('.payment-select').map(function(){return {period:$(this).val(),ssid:$(this).data('ssid')};}).get();
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
	  		$("#FinanceNewModal").modal('hide');
	  		displayStudent(studentId);
	  	} else {
	  		console.log(res);
	  	}
	  });
}

if (pathname !== 'Students')
{

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
		  		$('#student_form').find('input[name="first_name"]').css("border-color", "#f6b8c1");
		  		$('#student_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
		  	}
		  });
	}

}
}

var students,teachers = [];
getAllteachers();
function getAllteachers(id) {
	$.ajax({
	    type: 'get',
	    url: '/Teachers/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors)
	  	} else {
	  		teachers = res.teachers;
	  	}
	  });
 }
getAllStudents();
function getAllStudents(id) {
	$.ajax({
	    type: 'get',
	    url: '/Students/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors)
	  	} else {
	  		students = res.students;
	  		 console.log('Students Modal',students);
	  	}
	  });
 }
/* .dynamic-form-input-dropdown-search-container .input-dropdown-search _________________________________________________________________________________________*/

	$(document).on("keyup blur","#AddAbsenceModal .dynamic-form-input-dropdown-search-container .input-dropdown-search",function(event){

		$this = $(this);
		if($(this).val().length == 0 ){
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/search.svg");
			$(this).siblings(".icon").removeClass("input-text-empty");
			$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"none"});
		}else{
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
			$(this).siblings(".icon").addClass("input-text-empty");
				var value = new RegExp(this.value.toLowerCase().replace(/\s/g, ''));
				$this.parent().find(".dynamic-form-input-dropdown-options .search-output").remove();
				if($('#AddAbsenceModal').find('input[data-val=Teacher]').is(':checked'))
			 		searchTeacher($this,value);
			 	else
			 		searchStudents($this,value);
			$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"inline-block"});

			setTimeout(function(){
				$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"1"});
			},50);

			event.stopPropagation();
			event.preventDefault();
		}

	});

	$(document).on("keyup blur","#AddNewAttitudeModal .dynamic-form-input-dropdown-search-container .input-dropdown-search",function(event){

		$this = $(this);
		if($(this).val().length == 0 ){
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/search.svg");
			$(this).siblings(".icon").removeClass("input-text-empty");
			$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"none"});
		}else{
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
			$(this).siblings(".icon").addClass("input-text-empty");
				var value = new RegExp(this.value.toLowerCase().replace(/\s/g, ''));
				$this.parent().find(".dynamic-form-input-dropdown-options .search-output").remove();
			 	searchStudents($this,value);
			$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"inline-block"});

			setTimeout(function(){
				$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"1"});
			},50);

			event.stopPropagation();
			event.preventDefault();
		}

	});

	$(document).on("keyup blur","#FinanceNewModal .dynamic-form-input-dropdown-search-container .input-dropdown-search",function(event){

		$this = $(this);
		if($(this).val().length == 0 ){
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/search.svg");
			$(this).siblings(".icon").removeClass("input-text-empty");
			$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"none"});
		}else{
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
			$(this).siblings(".icon").addClass("input-text-empty");
				var value = new RegExp(this.value.toLowerCase().replace(/\s/g, ''));
				$this.parent().find(".dynamic-form-input-dropdown-options .search-output").remove();
			 	searchStudents($this,value);
			$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"inline-block"});

			setTimeout(function(){
				$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"1"});
			},50);

			event.stopPropagation();
			event.preventDefault();
		}

	});

	function searchStudents($this,value) {
		var filtred = students.filter(function (el) {
							var forname = el.Student_FirstName.toLowerCase() +  el.Student_LastName.toLowerCase();
							var backname = el.Student_LastName.toLowerCase()+el.Student_FirstName.toLowerCase();
						  return forname.match(value) || backname.match(value);
						});	
			for (var i = filtred.length - 1; i >= 0; i--) {
				$this.parent().find(".dynamic-form-input-dropdown-options").append('<li class="search-output" data-val="'+filtred[i].Student_FirstName + ' ' + filtred[i].Student_LastName+'" data-class="'+filtred[i].Classe_Label+'" data-student="'+filtred[i].Student_FirstName + ' ' + filtred[i].Student_LastName+'" data-student-id="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"/> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName + ' ' + filtred[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span> </div> </div> </li>');
			}
	}

	function searchTeacher($this,value) {
		var filtred = teachers.filter(function (el) {
				var name = JSON.parse(el.teacher.User_Name)
				var forname = name.first_name.toLowerCase()+name.last_name.toLowerCase();
				var backname = name.last_name.toLowerCase()+name.first_name.toLowerCase();
			  return forname.match(value) || backname.match(value);
			});
			for (var i = filtred.length - 1; i >= 0; i--) {
				var name = JSON.parse(filtred[i].teacher.User_Name);
	  			var html = '';
  				for (var j = filtred[i].classes.length - 1; j >= 0; j--) {
  					html += filtred[i].classes[j].Classe_Label + " ";
  				}
				$this.parent().find(".dynamic-form-input-dropdown-options").append('<li class="search-output" data-val="'+name.first_name + ' ' + name.last_name+'" data-class="'+html+'" data-student="'+name.first_name + ' ' + name.last_name+'" data-student-id="'+filtred[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].teacher.User_Image+'" alt="card-img"/> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+name.first_name + ' ' + name.last_name+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+html+'</span> </div> </div> </li>');
			}

	}

	$(document).on("click","#AddAbsenceModal .search-output",function(event){
			if($('#AddAbsenceModal').find('input[data-val=Teacher]').is(':checked'))
			{
				var filtred = teachers.filter(teacher => teacher.teacher.User_ID === parseInt($(this).attr("data-student-id")));
				var name = JSON.parse(filtred[0].teacher.User_Name);
				var html = '';
  				for (var j = filtred[0].classes.length - 1; j >= 0; j--) {
  					html += filtred[0].classes[j].Classe_Label + " ";
  				}
				$('#AddAbsenceModal').find('input[name=modal-classe]').val(html);
	 	 		$('#AddAbsenceModal').find('input[name=modal-student]').val(name.first_name + ' ' + name.last_name);
	 	 		$('#AddAbsenceModal').find('input[name=modal-student]').attr('data-id',filtred[0].teacher.User_ID);
			} else {
				var filtred = students.filter(student => student.Student_ID === parseInt($(this).attr("data-student-id")));
				$('#AddAbsenceModal').find('input[name=modal-classe]').val(filtred[0].Classe_Label);
				$('#AddAbsenceModal').find('input[name=modal-student]').attr('data-id',filtred[0].Student_ID);
	 	 		$('#AddAbsenceModal').find('input[name=modal-student]').val(filtred[0].Student_FirstName + ' ' + filtred[0].Student_LastName);
			}
			$('#AddAbsenceModal').find('.dynamic-form-input-dropdown-search-container .input-dropdown-search').val($(this).attr("data-val"))
	});
	$(document).on("click","#AddNewAttitudeModal .search-output",function(event){
		var filtred = students.filter(student => student.Student_ID === parseInt($(this).attr("data-student-id")));
		$('#AddNewAttitudeModal').find('input[name=modal-classe]').val(filtred[0].Classe_Label);
		$('#AddNewAttitudeModal').find('input[name=modal-student]').attr('data-id',filtred[0].Student_ID);
 		$('#AddNewAttitudeModal').find('input[name=modal-student]').val(filtred[0].Student_FirstName + ' ' + filtred[0].Student_LastName);
		$('#AddNewAttitudeModal').find('.dynamic-form-input-dropdown-search-container .input-dropdown-search').val($(this).attr("data-val"))
	});

	$(document).on("click","#FinanceNewModal .search-output",function(event){
		var filtred = students.filter(student => student.Student_ID === parseInt($(this).attr("data-student-id")));
		$('#FinanceNewModal').find('input[name=modal-classe]').val(filtred[0].Classe_Label);
		$('#FinanceNewModal').find('input[name=modal-student]').attr('data-id',filtred[0].Student_ID);
 		$('#FinanceNewModal').find('input[name=modal-student]').val(filtred[0].Student_FirstName + ' ' + filtred[0].Student_LastName);
		$('#FinanceNewModal').find('.dynamic-form-input-dropdown-search-container .input-dropdown-search').val($(this).attr("data-val"))
	});
	/* .dynamic-form-input-dropdown-search-container .input-text-empty ________________________*/

	$(document).on("click",".dynamic-form-input-dropdown-search-container .input-text-empty",function(event){
			$(this).attr("src","assets/icons/sidebar_icons/search.svg");
			$(this).siblings(".input-dropdown-search").val("");
			$(this).removeClass("input-text-empty");
	});

	/* End input-text-empty ________________________*/

 $('#student_form').find('input[name="level"]').on( "change", function() {
  var value = $(this).val();
  
  if (value.replace(/\s/g, '') !== '' && pathname !== 'Students')
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
		  		$('#student_form').find('input[name="classe"]').val("");
			  	 $('#student_form').find('.sub_div').remove();
			  	 $('#student_form').find('.row-classe').remove();
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


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function checkChange() {
 	 $('#AddAbsenceModal').find('input[name=modal-classe]').val("");
 	 $('#AddAbsenceModal').find('input[name=modal-student]').val("");
 }

 $('#AddAbsenceModal').find('input[name="modal-classe"]').on( "change", function() {
 	 var value = $(this).val();
 	 var name,fname,id;

	if (value.replace(/\s/g, '') !== '')
	{
		$('#AddAbsenceModal').find('input[name=modal-student]').val("");
		$('#AddAbsenceModal').find('.input-dropdown-search').val("");
	 	if($('input[data-val=Teacher]').is(':checked'))
	 		name = "Teachers";
	 	else
	 		name = "Students";
	 	 $.ajax({
		    type: 'get',
		    url: '/'+name+'/list',
		    data: {
		    	class_label:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {
		  		$('#AddAbsenceModal').find('.modal-name').find('.row-name').remove();
		  		for (var i = res.names.length - 1; i >= 0; i--) {
		  			if (name === 'Teachers')
		  			{
		  				fname = JSON.parse(res.names[i].User_Name);
		  				fname = fname.first_name + ' ' + fname.last_name;
		  				id = res.names[i].User_ID;
		  			} else
		  			{
		  				id = res.names[i].Student_ID;
		  				fname = res.names[i].Student_FirstName + ' ' + res.names[i].Student_LastName;
		  			}
		  			$('#AddAbsenceModal').find('.modal-name').append('<li class="row-name" data-id="'+id+'" data-val="'+fname.replace(/\s/g, '')+'">'+fname+'</li>')
		  		}
		  	}
		  });
	}
 })

 $('#AddNewAttitudeModal').find('input[name="modal-classe"]').on( "change", function() {
 	 var value = $(this).val();
 	 var fname,id;

	if (value.replace(/\s/g, '') !== '')
	{
		$('#AddNewAttitudeModal').find('input[name=modal-student]').val("");
		$('#AddNewAttitudeModal').find('.input-dropdown-search').val("");
	 	 $.ajax({
		    type: 'get',
		    url: '/Students/list',
		    data: {
		    	class_label:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {
		  		$('#AddNewAttitudeModal').find('.modal-name').find('.row-name').remove();
		  		for (var i = res.names.length - 1; i >= 0; i--) {
	  				id = res.names[i].Student_ID;
	  				fname = res.names[i].Student_FirstName + ' ' + res.names[i].Student_LastName;
		  			$('#AddNewAttitudeModal').find('.modal-name').append('<li class="row-name" data-id="'+id+'" data-val="'+fname.replace(/\s/g, '')+'">'+fname+'</li>')
		  		}
		  	}
		  });
	}
 })

  $('#FinanceNewModal').find('input[name="modal-classe"]').on( "change", function() {
 	 var value = $(this).val();
 	 var fname,id;

	if (value.replace(/\s/g, '') !== '')
	{
		$('#FinanceNewModal').find('input[name=modal-student]').val("");
		$('#FinanceNewModal').find('.input-dropdown-search').val("");
	 	 $.ajax({
		    type: 'get',
		    url: '/Students/list',
		    data: {
		    	class_label:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {
		  		$('#FinanceNewModal').find('.modal-name').find('.row-name').remove();
		  		for (var i = res.names.length - 1; i >= 0; i--) {
	  				id = res.names[i].Student_ID;
	  				fname = res.names[i].Student_FirstName + ' ' + res.names[i].Student_LastName;
		  			$('#FinanceNewModal').find('.modal-name').append('<li class="row-name" data-id="'+id+'" data-val="'+fname.replace(/\s/g, '')+'">'+fname+'</li>')
		  		}
		  	}
		  });
	}
 })

$('input[name="modal-student"]').on( "change", function() {
	var value = $(this).val();
	if (value.replace(/\s/g, '') !== '')
	{
		$('.input-dropdown-search').val("");
	}
 })

$('#FinanceNewModal').find('input[name="modal-student"]').on( "change", function() {
 	 var value = $(this).val();
 	 var id;
	if (value.replace(/\s/g, '') !== '')
	{
		if ($('#FinanceNewModal').find('li[data-val='+value.replace(/\s/g, '')+']').data('id'))
	 		id = $('#FinanceNewModal').find('li[data-val='+value.replace(/\s/g, '')+']').data('id');
	 	else
	 		id = $(this).attr('data-id');
	 	displayStudentModal(id)
	}
 })

function saveAbsenceModal() {
var ad_classe = $('#AddAbsenceModal').find('input[name="modal-classe"]').val();
var ad_fromto = {};
var ad_date = "";

var ad_student = $('#AddAbsenceModal').find('input[name="modal-student"]').val();

var ad_absence,name;

if($('input[data-val=Teacher]').is(':checked'))
	name = "Teachers";
else
	name = "Students";
if ($('#AddAbsenceModal').find('input[data-val="Absence"]:checked').val())
{
	if($('#AddAbsenceModal').find('input[data-val="Session"]:checked').val())
	{
		ad_absence = $('#AddAbsenceModal').find('input[data-val="Session"]:checked').val();
		ad_fromto = {
			from: $('#AddAbsenceModal').find('input[name="time_start"]').val(),
			to: $('#AddAbsenceModal').find('input[name="time_end"]').val(),
		};
		ad_date = $('#AddAbsenceModal').find('input[name="ad_date"]').val();
	} else 
	{
		ad_absence = $('#AddAbsenceModal').find('input[data-val="Period"]:checked').val();
		ad_fromto = {
			from: $('#AddAbsenceModal').find('input[name="period_start"]').val(),
			to: $('#AddAbsenceModal').find('input[name="period_end"]').val(),
		}
		ad_date = "null";
	}
} else 
{
	ad_absence = $('#AddAbsenceModal').find('input[data-val="Retard"]:checked').val();
	ad_fromto = {
			from: $('#AddAbsenceModal').find('input[name="time_start"]').val(),
			to: $('#AddAbsenceModal').find('input[name="time_end"]').val(),
		};
	ad_date = $('#AddAbsenceModal').find('input[name="ad_date"]').val();
}

	if (!ad_date && ad_absence !== "2")
		$('#AddAbsenceModal').find('.dynamic-form-input-container-one-date').css("border-color", "#f6b8c1");
	else
		$('#AddAbsenceModal').find('.dynamic-form-input-container-one-date').css("border-color", "#EFEFEF");
	if (!ad_classe)
		$('#AddAbsenceModal').find('.ad_classe').css("border-color", "#f6b8c1");
	else
		$('#AddAbsenceModal').find('.ad_classe').css("border-color", "#EFEFEF");

	if (!ad_student)
		$('#AddAbsenceModal').find('.ad_student').css("border-color", "#f6b8c1");
	else
		$('#AddAbsenceModal').find('.ad_student').css("border-color", "#EFEFEF");

	if (!ad_fromto.from && ad_absence !== "2")
	{
		$('#AddAbsenceModal').find('input[name="time_start"]').css("border-color", "#f6b8c1");
		$('#AddAbsenceModal').find('input[name="time_end"]').css("border-color", "#f6b8c1");
	}
	else
	{
		$('#AddAbsenceModal').find('input[name="time_start"]').css("border-color", "#EFEFEF");
		$('#AddAbsenceModal').find('input[name="time_end"]').css("border-color", "#EFEFEF");
	}

	if (!ad_fromto.to && ad_absence !== "2")
	{
		$('#AddAbsenceModal').find('input[name="time_end"]').css("border-color", "#f6b8c1");
	}
	else
	{
		$('#AddAbsenceModal').find('input[name="time_end"]').css("border-color", "#EFEFEF");
	}

	if (ad_absence && ad_date && ad_fromto.to && ad_fromto.from && ad_student && ad_classe)
	{
		$.ajax({
		    type: 'post',
		    url: '/'+name+'/absence',
		    data: {
		    	ad_fromto: JSON.stringify(ad_fromto),
		    	ad_type:parseInt(ad_absence),
		    	ad_date,
		    	ad_classe,
		    	ad_student,
		    	user_id:$('#AddAbsenceModal').find('input[name=modal-student]').attr('data-id')
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('.input-time').timepicker('destroy');
		  		$('#AddAbsenceModal').modal('hide');
			  	$('#AddAbsenceModal').find('input[name="modal-classe"]').val("");
				$('#AddAbsenceModal').find('input[name="modal-student"]').val("");
				$('#AddAbsenceModal').find('input[name="ad_date"]').val("");
	 			$('#AddAbsenceModal').find('input[name="period_start"]').val("");
				$('#AddAbsenceModal').find('input[name="period_end"]').val("");
				$('#AddAbsenceModal').find('input[name="time_start"]').val("");
				$('#AddAbsenceModal').find('input[name="time_end"]').val("");
				$('.input-time').timepicker({
					timeFormat: 'HH:mm',
				    interval: 60,
				    dynamic: false,
				    dropdown: true,
				    scrollbar: true

				});
				window.location.href = '/' + name;
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}

function saveAttitudeModal() {
	var at_classe = $('#AddNewAttitudeModal').find('input[name="modal-classe"]').val();
	var at_date = $('#AddNewAttitudeModal').find('input[name="at_date"]').val();

	var at_student = $('#AddNewAttitudeModal').find('input[name="modal-student"]').val();
	var at_note = $('#AddNewAttitudeModal').find('#at_note').val();
	var at_type = "";

	if ($('#AddNewAttitudeModal').find('input[data-val="Positive"]:checked').val())
		at_type = $('#AddNewAttitudeModal').find('input[data-val="Positive"]:checked').val();
	else
		at_type = $('#AddNewAttitudeModal').find('input[data-val="Negative"]:checked').val();


	if (!at_date)
		$('#AddNewAttitudeModal').find('.at_date').css("border-color", "#f6b8c1");
	else
		$('#AddNewAttitudeModal').find('.at_date').css("border-color", "#EFEFEF");
	if (!at_classe)
		$('#AddNewAttitudeModal').find('.at_classe').css("border-color", "#f6b8c1");
	else
		$('#AddNewAttitudeModal').find('.at_classe').css("border-color", "#EFEFEF");

	if (!at_student)
		$('#AddNewAttitudeModal').find('.at_student').css("border-color", "#f6b8c1");
	else
		$('#AddNewAttitudeModal').find('.at_student').css("border-color", "#EFEFEF");
	if (!at_note)
		$('#AddNewAttitudeModal').find('#at_note').css("border-color", "#f6b8c1");
	else
		$('#AddNewAttitudeModal').find('#at_note').css("border-color", "#EFEFEF");

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
		    	user_id:$('#AddNewAttitudeModal').find('li[data-val='+at_student.replace(/\s/g, '')+']').data('id')
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddNewAttitudeModal').find('input[name="modal-classe"]').val("");
				$('#AddNewAttitudeModal').find('input[name="at_date"]').val("");
				$('#AddNewAttitudeModal').find('input[name="modal-student"]').val("");
				$('#AddNewAttitudeModal').find('#at_note').val("");
				window.location.href = '/Students';

		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}


function readFileSettings() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output-settings").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

if (document.getElementById("profile_settings"))
document.getElementById("profile_settings").addEventListener("change", readFileSettings);



if (pathname !== 'Teachers')
{

	function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output-img-teacher").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

if (document.getElementById("profile-teacher"))
document.getElementById("profile-teacher").addEventListener("change", readFile);

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

}


if (pathname !== 'Exams')
	function saveExam() {
		var exam_classe = $('#AddExamModal').find('input[name="exam_classe"]').val();
		var exam_date = $('#AddExamModal').find('input[name="exam_date"]').val();

		var exam_subject = $('#AddExamModal').find('input[name="exam_subject"]').val();
		var exam_name = $('#AddExamModal').find('input[name="exam_name"]').val();
		var exam_description = $('#AddExamModal').find('#exam_description').val();
		var at_type = "";

		if (!exam_date)
			$('#AddExamModal').find('.exam_date').css("border-color", "#f6b8c1");
		else
			$('#AddExamModal').find('.exam_date').css("border-color", "#EFEFEF");
		if (!exam_classe)
			$('#AddExamModal').find('.exam_classe').css("border-color", "#f6b8c1");
		else
			$('#AddExamModal').find('.exam_classe').css("border-color", "#EFEFEF");
		if (!exam_name)
			$('#AddExamModal').find('.exam_name').css("border-color", "#f6b8c1");
		else
			$('#AddExamModal').find('.exam_name').css("border-color", "#EFEFEF");

		if (!exam_subject)
			$('#AddExamModal').find('.exam_subject').css("border-color", "#f6b8c1");
		else
			$('#AddExamModal').find('.exam_subject').css("border-color", "#EFEFEF");
		if (!exam_description)
			$('#AddExamModal').find('#exam_description').css("border-color", "#f6b8c1");
		else
			$('#AddExamModal').find('#exam_description').css("border-color", "#EFEFEF");

		if (exam_name && exam_description && exam_date && exam_subject && exam_classe)
		{
			$.ajax({
			    type: 'post',
			    url: '/Exams/save',
			    data: {
			    	exam_name,
			    	exam_date,
			    	exam_description,
			    	exam_classe,
			    	exam_subject
			    },
			    dataType: 'json'
			  })
			  .done(function(res){
			  	if(res.saved)
			  	{
					$('#AddExamModal').find('input[name="exam_classe"]').val("");
					$('#AddExamModal').find('input[name="exam_date"]').val("");
					$('#AddExamModal').find('input[name="exam_subject"]').val("");
					$('#AddExamModal').find('input[name="exam_name"]').val("");
					$('#AddExamModal').find('#exam_description').val("");
			  		$('#AddExamModal').modal('hide');
					window.location.href = '/Exams';
			  	} else {
			  		console.log("not saved");
			  	}
			  });
		}
	}

$('.select-classe').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '' && pathname !== 'Exams'  && pathname !== 'Homeworks')
  {
  	 $('.select-subject').find('.row-subject').remove();
	  $.ajax({
		    type: 'get',
		    url: '/Select/subjects',
		    data: {
		    	classe:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {

		  		for (var i = res.subjects.length - 1; i >= 0; i--) {
		  			
		  			$('.select-subject').append(' <li class="row-subject" data-val="'+res.subjects[i].Subject_Label+'">'+res.subjects[i].Subject_Label+'</li>')
		  		}
		  	}
		  });
  }
})


if (pathname !== 'Homeworks')
{
	var filePdf = "";
function readFilePdf() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      filePdf = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

if (document.getElementById("uploaded_file"))
	document.getElementById("uploaded_file").addEventListener("change", readFilePdf);
function saveHomework() {
		var homework_classe = $('#AddHomeworkModal').find('input[name="homework_classe"]').val();
		var homework_deliverydate = $('#AddHomeworkModal').find('input[name="homework_deliverydate"]').val();
		var homework_subject = $('#AddHomeworkModal').find('input[name="homework_subject"]').val();
		var homework_name = $('#AddHomeworkModal').find('input[name="homework_name"]').val();
		var homework_description = $('#AddHomeworkModal').find('#homework_description').val();
		var at_type = "";

		if (!homework_deliverydate)
			$('#AddHomeworkModal').find('.homework_deliverydate').css("border-color", "#f6b8c1");
		else
			$('#AddHomeworkModal').find('.homework_deliverydate').css("border-color", "#EFEFEF");
		if (!homework_classe)
			$('#AddHomeworkModal').find('.homework_classe').css("border-color", "#f6b8c1");
		else
			$('#AddHomeworkModal').find('.homework_classe').css("border-color", "#EFEFEF");
		if (!homework_name)
			$('#AddHomeworkModal').find('.homework_name').css("border-color", "#f6b8c1");
		else
			$('#AddHomeworkModal').find('.homework_name').css("border-color", "#EFEFEF");

		if (!homework_subject)
			$('#AddHomeworkModal').find('.homework_subject').css("border-color", "#f6b8c1");
		else
			$('#AddHomeworkModal').find('.homework_subject').css("border-color", "#EFEFEF");
		if (!homework_description)
			$('#AddHomeworkModal').find('#homework_description').css("border-color", "#f6b8c1");
		else
			$('#AddHomeworkModal').find('#homework_description').css("border-color", "#EFEFEF");

		if (homework_name && homework_description && homework_deliverydate && homework_subject && homework_classe)
		{
			$.ajax({
			    type: 'post',
			    url: '/Homeworks/save',
			    data: {
			    	homework_name,
			    	homework_deliverydate,
			    	homework_description,
			    	homework_classe,
			    	homework_subject,
			    	file:filePdf
			    },
			    dataType: 'json'
			  })
			  .done(function(res){
			  	if(res.saved)
			  	{
					$('#AddHomeworkModal').find('input[name="homework_classe"]').val("");
					$('#AddHomeworkModal').find('input[name="homework_deliverydate"]').val("");
					$('#AddHomeworkModal').find('input[name="homework_subject"]').val("");
					$('#AddHomeworkModal').find('input[name="homework_name"]').val("");
					$('#AddHomeworkModal').find('#homework_description').val("");
			  		$('#AddHomeworkModal').modal('hide');
					console.log('Saved');
					window.location.href = '/Homeworks';
			  	} else {
			  		console.log("not saved");
			  	}
			  });
		}
	}
}

function savePaymentModal() {
var payments = $('#FinanceNewModal').find('.payment-select').map(function(){return {period:$(this).val(),ssid:$(this).data('ssid')};}).get();
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
	  		$("#FinanceNewModal").modal('hide');
	  		$('.input-dropdown-search').val("");
	  		$('input[name="modal-student"]').val("");
	  		$('input[name="modal-classe"]').val("");
	  		$('#FinanceNewModal').find('.payment-select').val("");
	  		$('#FinanceNewModal').find('.yearly').addClass('hidden');
			$('#FinanceNewModal').find('.monthly').addClass('hidden');
			$('#FinanceNewModal').find('.monthly-rows').remove();
			$('#FinanceNewModal').find('.yearly-rows').remove();
	  		displayStudent(studentId);
	  	} else {
	  		console.log(res);
	  	}
	  });
}

function displayStudentModal(index) 
{
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
  		console.log(res.errors)
  	} else {
  		payStudent = res.payStudent;
  		subStudent =  res.substudent;
		start = res.start;
		end = res.end;
		academicyear = res.academicyear;
		executePaymentModal();
  	}
  });
}

function executePaymentModal() {
	$('#FinanceNewModal').find('.monthly-rows').remove();
	$('#FinanceNewModal').find('.yearly-rows').remove();
	$('#FinanceNewModal').find('.yearly').addClass('hidden');
	$('#FinanceNewModal').find('.monthly').addClass('hidden');
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
			for (var k = 0; k < MonthsFiltred.length; k++) {
				htmlmonths += "<option value="+MonthsFiltred[k]+">"+MonthsFiltred[k]+" </option> ";
			}
			$('#FinanceNewModal').find('.monthly').removeClass('hidden');
			$('#FinanceNewModal').find('.monthly').after('<div class="monthly-rows dynamic-form-input-container dynamic-form-input-container-extra-style"> <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+subStudent[i].Expense_Label+'</span> <span class="input-label-bg-mask"></span></label> <div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="form-group group"> <select class="input-text-month-select2 payment-select" data-val="Monthly" data-ssid="'+subStudent[i].SS_ID+'" multiple name="language"> '+htmlmonths+'</select> <img class="icon button-icon" src="assets/icons/caret.svg"> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div> </div>');
			for (var j = payFilter.length - 1; j >= 0; j--) {
		      	var option = new Option(payFilter[j].SP_PaidPeriod,payFilter[j].SP_PaidPeriod, true, true);
    			$('#FinanceNewModal').find('[data-ssid="'+subStudent[i].SS_ID+'"]').append(option).trigger('change');
			}
		}
		if (subStudent[i].Expense_PaymentMethod === "Annual")
		{
			payFilter = payStudent.filter(function (el) {
		        	return el.SS_ID === subStudent[i].SS_ID;
		      	});
			var htmlYearly = '';
				if (payFilter.length === 0)
					htmlYearly = '<option value="'+academicyear+'">'+academicyear+'</option> ';
				$('#FinanceNewModal').find('.yearly').removeClass('hidden');
				$('#FinanceNewModal').find('.yearly').after('<div class="yearly-rows dynamic-form-input-container dynamic-form-input-container-extra-style input-text-subject-select2-one-option"> <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+subStudent[i].Expense_Label+'</span> <span class="input-label-bg-mask"></span></label> <div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="form-group group"> <select class="input-text-year-select2 payment-select" data-val="Annual" data-ssid="'+subStudent[i].SS_ID+'" multiple name="language"> '+htmlYearly+'</select> <img class="icon button-icon" src="assets/icons/caret.svg"> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div> </div>');
		      	if (payFilter.length > 0)
		      	{
		      		var option = new Option(payFilter[0].SP_PaidPeriod,payFilter[0].SP_PaidPeriod, true, true);
	    			$('#FinanceNewModal').find('[data-ssid="'+subStudent[i].SS_ID+'"]').append(option).trigger('change');
		      	}
		}
	}
	if($(".input-text-month-select2").length > 0){
		$(".input-text-month-select2").select2({
		  tags: true,
		  dropdownPosition: 'below'
		});
	}

	if($(".input-text-year-select2").length > 0){
		$(".input-text-year-select2").select2({
		  tags: true,
		  dropdownPosition: 'below'
		});
	}

}

/* #ImportUsersModal .modal-btn _________________*/

$(document).on("change","#Import_File",function(){
	if ($(this).prop('files')[0])
	{
		$("#ImportUsersModal .import-users-Modal-label").text($(this).prop('files')[0].name);
	$(this).parent().find('label').text("Replace file");
	$('#ImportUsersModal .progress-bar').css('width', '100%').attr('aria-valuenow', 100); 
	}
});

function saveImportFile() {
	if ($('#ImportUsersModal').find('input[data-val=Student]').is(':checked'))
	{
		var formData = new FormData();
	   	formData.append('file', $('#ImportUsersModal').find('input[name="Import_File"]').prop('files')[0]);
		$.ajax({
		    type: 'post',
		    url: '/Students/upload/file',
		    data: formData,
		    processData: false,
	    	contentType: false
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
				$('#ImportUsersModal').modal('hide');
				$('#ImportUsersModal').find('input[name="Import_File"]').val('');
				if (pathname === 'Students')
					window.location.reload();
				console.log('Saved');
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	} else
	{
		var formData = new FormData();
	   	formData.append('file', $('#ImportUsersModal').find('input[name="Import_File"]').prop('files')[0]);
		$.ajax({
		    type: 'post',
		    url: '/Teachers/upload/file',
		    data: formData,
		    processData: false,
	    	contentType: false
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
				$('#ImportUsersModal').modal('hide');
				$('#ImportUsersModal').find('input[name="Import_File"]').val('');
				if (pathname === 'Teachers')
					window.location.reload();
				console.log('Saved');
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}