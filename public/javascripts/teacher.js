var subArray = [];
var teachers = [];
var parents = [];
var subteacher = [];
var absences = [];
var teacherId = 0;
var absenceArray = ["Retard","Absence"];
var noteTypes = ["Positive","Negative"];
var subclasses = [];
var subteacher = [];
var homeworks = [];
var attitudes = [];
var exams = [];
var filtredClass = [];
$domChange = false;

getAllteachers();
function getAllteachers() {
 	$('.row-teacher').remove();
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
	  		filtredClass = res.teachers;
	  		console.log(res.teachers);
	  		if (res.teachers.length > 0)
	  		{
	  			displayteacher(res.teachers[res.teachers.length - 1].teacher.User_ID);
	  		}
	  		var active = '';
	  		for (var i = res.teachers.length - 1; i >= 0; i--) {
	  			if (i === res.teachers.length - 1)
	  				active = 'active';
	  			else
	  				active = '';
	  			var name = JSON.parse(res.teachers[i].teacher.User_Name);
	  			var html = '';
  				for (var j = res.teachers[i].classes.length - 1; j >= 0; j--) {
  					html += res.teachers[i].classes[j].Classe_Label + " ";
  				}
	  			$('#list_teachers').append('<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+res.teachers[i].teacher.User_Image+'" alt="card-img"><input name="teacherId" type="hidden" value="'+res.teachers[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>')
	  		}
	  	}
	  });
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

/*function readFileDetail() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      $(".profile-img").attr("src",e.target.result);
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("img-profile").addEventListener("change", readFileDetail);*/

 $('input[name=classe]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('.row-teacher').remove();
$domChange = false;
	var filtred = teachers.filter(function (el) {
			  return el.classes.some(classe => classe.Classe_Label === value);
			});
	if (value === "All")
		filtred = teachers;
	console.log("Filter",filtred);
	var active = '';
	filtredClass = filtred;
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
	  	$('#list_teachers').append('<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].teacher.User_Image+'" alt="card-img"><input name="teacherId" type="hidden" value="'+filtred[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>')
	}
  }
})


document.getElementById("search-teacher").addEventListener('input', function (evt) {
    
    $('.row-teacher').remove();
    var active = '';
  if (this.value.replace(/\s/g, '') !== '')
  {
  	var value = new RegExp('^'+this.value.toLowerCase());
	var filtred = teachers.filter(function (el) {
				var name = JSON.parse(el.teacher.User_Name)
			  return name.first_name.toLowerCase().match(value) || name.last_name.toLowerCase().match(value);
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
	  	$('#list_teachers').append('<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].teacher.User_Image+'" alt="card-img"><input name="teacherId" type="hidden" value="'+filtred[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>')
	}
  } else {
  	for (var i = filtredClass.length - 1; i >= 0; i--) {
		if (i === filtredClass.length - 1)
		{
			displayteacher(filtredClass[i].teacher.User_ID);
			active = 'active';
		} else
			active = '';
		var name = JSON.parse(filtredClass[i].teacher.User_Name);
		var html = '';
		for (var j = filtredClass[i].classes.length - 1; j >= 0; j--) {
			html += filtredClass[i].classes[j].Classe_Label + " ";
		}
	  	$('#list_teachers').append('<div class="'+active+' sections-main-sub-container-left-card row-teacher"><img class="sections-main-sub-container-left-card-main-img" src="'+filtredClass[i].teacher.User_Image+'" alt="card-img"><input name="teacherId" type="hidden" value="'+filtredClass[i].teacher.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+html+'</span></div></div>')
	}
  }
});

$(document).on("click",".row-teacher",function(event){
	teacherId = $(this).find('input[name="teacherId"]').val();
	$('.sections-main-sub-container-left-card').removeClass('active');
	$(this).addClass('active');
	displayteacher(teacherId);
	console.log(teacherId)
});

 function displayteacher(index) 
{
	teacherId = parseInt(index);
	$domChange = false;
	var result = teachers.filter(function (el) {
			  return el.teacher.User_ID === parseInt(index);
			});
	console.log("Result",result)
	$('#teacher_info').find('#Details').removeClass("dom-change-watcher");
	$('.subject-klon').remove();
	$('.class-subject').remove();
			/*
	$("#reported_table").addClass('hidden');
  	$("#reported_title").addClass('hidden');
	$("#absence_table").addClass('hidden');
  	$("#absence_title").addClass('hidden');
	$('#Details').find('.input-parent').remove();
	$('#Details').removeClass("dom-change-watcher");
	
	$('#Details').find('.expense_col').remove();
	$('#Attitude').find('.row-note').remove();
	$('#Homework').find('.row-homework').remove();
	$('#Exams').find('.row-exam').remove();*/
	$('#Absence').find('.row-absence').remove();
	$("#reported_table").addClass('hidden');
  	$("#reported_title").addClass('hidden');
	$("#absence_table").addClass('hidden');
  	$("#absence_title").addClass('hidden');
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
  		console.log(res.errors)
  	} else {
  		var $div = $('div[id^="subjects-container"]:last');
  		$div.find('input[name=subjects]').val(res.subjects[res.subjects.length - 1].Subject_Label);
  		var classes = res.classes.filter(function (el) {
			  return el.Subject_Label === res.subjects[res.subjects.length - 1].Subject_Label;
			});
		for (var j = classes.length - 1; j >= 0; j--) {
			console.log("Classes:",classes[j]);
			$div.find('.list-classes').append('<option class="class-subject" value="'+classes[j].Classe_Label+'" selected>'+classes[j].Classe_Label+'</option>');	
		}
		console.log("Div:",$div.html())
  		for (var i = res.subjects.length - 2; i >= 0; i--) {
  			$div = $('div[id^="subjects-container"]:last');
		  	var num = parseInt( $div.prop("id").match(/\d+/g), 10 ) +1;
		  	var $klon = $div.clone().prop('id', 'subjects-container'+num );
		  	$klon = $klon.addClass('subject-klon');
		  	$klon.find('input[name=subjects]').val(res.subjects[i].Subject_Label);
		  	$klon.find('.class-subject').remove();
		  	
  			classes = res.classes.filter(function (el) {
			  return el.Subject_Label === res.subjects[i].Subject_Label;
			});			
			for (var j = classes.length - 1; j >= 0; j--) {
				$klon.find('.list-classes').append('<option class="class-subject" value="'+classes[j].Classe_Label+'" selected>'+classes[j].Classe_Label+'</option>');	
			}
			console.log("Klon:",$klon.html())
		  	$div.append($klon);
  		}
  		$('.input-text-subject-classes-select2').parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");
  		absences = res.absences;
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
		$('#teacher_info').find('#Details').addClass("dom-change-watcher");
  	}
  });
	$('#teacher_info').removeClass('hidden');
	var name = JSON.parse(result[0].teacher.User_Name);
	$('#AddTeacherAbsenceModal').find('.absence-classe').remove();
	for (var i = result[0].classes.length - 1; i >= 0; i--) {
		$('#AddTeacherAbsenceModal').find('.classes-list').append('<li class="absence-classe" data-val="'+result[0].classes[i].Classe_Label+'">'+result[0].classes[i].Classe_Label+'</li>');
	}
	$('#teacher_info').find('.label-full-name').text(name.first_name + " " + name.last_name);
	$('#teacher_info').find('.input-img').attr('src',result[0].teacher.User_Image);
	$('#teacher_info').find('#Details').find('input[name="f_name"]').val(name.first_name);
	$('#teacher_info').find('#Details').find('input[name="teacher_address_detail"]').val(result[0].teacher.User_Address);
	$('#teacher_info').find('#Details').find('input[name="l_name"]').val(name.last_name);
	$('#teacher_info').find('#Details').find('input[name="phone_number_detail"]').val(result[0].teacher.User_Phone);
	$('#teacher_info').find('#Details').find('input[name="birthdate_detail"]').val(result[0].teacher.User_Birthdate)
	$('#teacher_info').find('#Details').find('input[name="email"]').val(result[0].teacher.User_Email);
	$('#AddTeacherAbsenceModal').find('input[name="ad_teacher"]').val(name.first_name + " " + name.last_name);
	//$('#EditAbsenceModal').find('input[name="edit-classe"]').val(result[0].Classe_Label);
	//$('#EditAbsenceModal').find('input[name="edit-teacher"]').val(result[0].teacher_FirstName + " " + result[0].teacher_LastName);
}

function displayAbsence(id) {
	console.log(absences[id]);
	var fromto = JSON.parse(absences[id].AD_FromTo);
	$('#EditAbsenceModal').find('input[data-val=Absence]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Retard]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Session]').prop('checked', false);
	$('#EditAbsenceModal').find('input[data-val=Period]').prop('checked', false);
	if (absences[id].AD_Type === 2)
	{
		$('#EditAbsenceModal').find('input[data-val=Absence]').prop('checked', true);
		$('#EditAbsenceModal').find('input[data-val=Period]').prop('checked', true);
		$('#EditAbsenceModal').find('input[name=start-period]').val(fromto.from);
		$('#EditAbsenceModal').find('input[name=end-period]').val(fromto.to);
	}
	else if (absences[id].AD_Type === 1)
	{
		$('#EditAbsenceModal').find('input[data-val=Absence]').prop('checked', true);
		$('#EditAbsenceModal').find('input[data-val=Session]').prop('checked', true);
		$('#EditAbsenceModal').find('input[name=start-time]').val(fromto.from);
		$('#EditAbsenceModal').find('input[name=endTime]').val(fromto.to);
		$('#EditAbsenceModal').find('input[name=editDate]').val(absences[id].AD_Date);
	} else
	{
		$('#EditAbsenceModal').find('input[data-val=Retard]').prop('checked', true);
		$('#EditAbsenceModal').find('input[name=start-time]').val(fromto.from);
		$('#EditAbsenceModal').find('input[name=endTime]').val(fromto.to);
		$('#EditAbsenceModal').find('input[name=editDate]').val(absences[id].AD_Date);
	}
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
		    	level_id:$('#teacher_form').find('[data-val='+value+']').data('levelid'),
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {
		  		console.log(res.classes);
		  		$('#teacher_form').find('.list-classes').append('<option class="option-level-label" disabled="disabled">'+res.classes[0].Level_Label+'</option>')
		  		for (var i = res.classes.length - 1; i >= 0; i--) {
		  			$('#teacher_form').find('.list-classes').append('<option class="row-classe" value="'+res.classes[i].Classe_ID+'">'+res.classes[i].Classe_Label+'</option>')
		  		}
		  	}
		  });
  }
})

function saveteacher() {
	var first_name = $('#teacher_form').find('input[name="first_name"]').val();
	var email = $('#teacher_form').find('input[name="email"]').val();
	var teacher_address = $('#teacher_form').find('input[name="teacher_address"]').val();
	var profile_image = $('#teacher_form').find('input[name="profile_image"]').val();
	var last_name = $('#teacher_form').find('input[name="last_name"]').val();
	var phone_number = $('#teacher_form').find('input[name="phone_number"]').val();
	var birthdate = $('#teacher_form').find('input[name="birthdate"]').val();
	var subject = $('#teacher_form').find('input[name="subject"]').val();
	var subjects = $('input[name^=subject]').map(function(idx, elem) {
	    return {subject: $('#teacher_form').find('[data-val='+$(elem).val()+']').data('subjectid'),classes:$(this).closest('.dynamic-form-input-float-adjust').find('select').val()};
	  }).get();

	console.log("Subjects::",subjects);
	if (!first_name)
		$('#teacher_form').find('input[name="first_name"]').css("border-color", "#f6b8c1");
	else
		$('#teacher_form').find('input[name="first_name"]').css("border-color", "#EFEFEF");
	if (!email)
		$('#teacher_form').find('input[name="email"]').css("border-color", "#f6b8c1");
	else
		$('#teacher_form').find('input[name="email"]').css("border-color", "#EFEFEF");
	if (!teacher_address)
		$('#teacher_form').find('input[name="teacher_address"]').css("border-color", "#f6b8c1");
	else
		$('#teacher_form').find('input[name="teacher_address"]').css("border-color", "#EFEFEF");
	if (!last_name)
		$('#teacher_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
	else
		$('#teacher_form').find('input[name="last_name"]').css("border-color", "#EFEFEF");
	if (!phone_number)
		$('#teacher_form').find('input[name="phone_number"]').css("border-color", "#f6b8c1");
	else
		$('#teacher_form').find('input[name="phone_number"]').css("border-color", "#EFEFEF");
	if (!birthdate)
		$('#teacher_form').find('input[name="birthdate"]').css("border-color", "#f6b8c1");
	else
		$('#teacher_form').find('input[name="birthdate"]').css("border-color", "#EFEFEF");

	if (first_name && last_name && teacher_address && phone_number && birthdate && email && (subjects.length > 0))
	{
		var data = {
			first_name,
			last_name,
			profile_image:$('#output-img-teacher').attr("src"),
			phone_number,
			birthdate,
			email,
			teacher_address,
			subjects:subjects
		}
		$.ajax({
		    type: 'post',
		    url: '/Teachers/save',
		    data: data,
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddTeacherModal').modal('hide');
		  		$('#teacher_form').find('input[name="first_name"]').val("");
				$('#teacher_form').find('input[name="teacher_address"]').val("");
				$('#teacher_form').find('input[name="profile_image"]').val("");
				$('#teacher_form').find('input[name="last_name"]').val("");
				$('#teacher_form').find('input[name="level"]').val("");
				$('#teacher_form').find('input[name="phone_number"]').val("");
				$('#output-img-teacher').attr("src",'assets/icons/Logo_placeholder.svg')
		  		getAllteachers();

		  	} else {
		  		$('#teacher_form').find('input[name="first_name"]').css("border-color", "#f6b8c1");
		  		$('#teacher_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
		  	}
		  });
	}

}

function saveChange() {
	$.ajax({
	    type: 'post',
	    url: '/Teachers/update',
	    data: {
	    	id:teacherId,
	    	teacher_img:$('#teacher_info').find('.profile-img').attr('src'),
			teacher_fname:$('#Details').find('input[name="f_name"]').val(),
			teacher_address:$('#Details').find('input[name="teacher_address_detail"]').val(),
			teacher_lname:$('#Details').find('input[name="l_name"]').val(),
			teacher_phone:$('#Details').find('input[name="phone_number_detail"]').val(),
			teacher_birthdat:$('#Details').find('input[name="birthdate_detail"]').val(),
			teacher_classe:$('#Details').find('input[name="classe-detail"]').val(),
			teacher_level:$('#Details').find('input[name="level-detail"]').val()
	    },
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.updated)
	  	{
	  		displayteacher(teacherId);
	  	} else {
	  		console.log(res);
	  	}
	  });
 	$('#Details .sub-container-form-footer').addClass('hide-footer');
 	$('#Details .sub-container-form-footer').removeClass('show-footer');
}

function discardChange() {
 	$('#Details .sub-container-form-footer').addClass('hide-footer');
 	$('#Details .sub-container-form-footer').removeClass('show-footer');
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
		  		$('#AddTeacherAbsenceModal').modal('hide');
			  	$('#AddTeacherAbsenceModal').find('input[name="ad_classe"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="ad_teacher"]').val("");
				$('#AddTeacherAbsenceModal').find('input[name="ad_date"]').val("");
		  		displayteacher(teacherId);
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}
