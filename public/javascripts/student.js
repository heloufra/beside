var subArray = [];
var students = [];
var parents = [];
var substudent = [];
var absences = [];
var studentId = 0;
var absenceArray = ["Retard","Absence"];
var noteTypes = ["Positive","Negative"];
var subclasses = [];
$domChange = false;


getAllStudents();
function getAllStudents() {
 	$('.students_list').remove();
	$.ajax({
	    type: 'get',
	    url: '/student/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors)
	  	} else {
	  		students = res.students;
	  		subclasses = res.subscription;
	  		console.log(res.students);
	  		if (res.students.length > 0)
	  			displayStudent(res.students[res.students.length - 1].Student_ID);
	  		for (var i = res.students.length - 1; i >= 0; i--) {
	  			
	  			$('#list_classes').append('<div class="sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+res.students[i].Student_Image+'" alt="card-img"><input name="studentId" type="hidden" value="'+res.students[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+res.students[i].Student_FirstName+' '+res.students[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+res.students[i].Classe_Label+'</span></div></div>')
	  		}
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

document.getElementById("profile").addEventListener("change", readFile);

 $('#classes_list').find('input[name=classe]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('.students_list').remove();
$domChange = false;
	var filtred = students.filter(function (el) {
			  return el.Classe_Label === value ;
			});
	console.log("Filter",filtred);
	for (var i = filtred.length - 1; i >= 0; i--) {
		
		$('#list_classes').append('<div class="sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div></div>')
	}
  }
})

 $('#search-input').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('.students_list').remove();

	var filtred = students.filter(function (el) {
			  return el.Student_FirstName === value || el.Student_LastName === value;
			});
	console.log("Search",filtred);
	for (var i = filtred.length - 1; i >= 0; i--) {
		
		$('#list_classes').append('<div class="sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div></div>')
	}
  }
})

$(document).on("click",".sections-main-sub-container-left-card",function(event){
	studentId = $(this).find('input[name="studentId"]').val();
	displayStudent(studentId);
});

 function displayStudent(index) 
{
	studentId = parseInt(index);
	$domChange = false;
	var result = students.filter(function (el) {
			  return el.Student_ID === parseInt(index);
			});
	$('#Details').find('.input-parent').remove();
	$('#Details').removeClass("dom-change-watcher");
	$('#Absence').find('.row-absence').remove();
	$('#Details').find('.expense_col').remove();
	$('#Attitude').find('.row-note').remove();
	$.ajax({
    type: 'get',
    url: '/student/one',
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
  		var checked = '';
  		for (var i = res.attitudes.length - 1; i >= 0; i--) {
  			$('#Attitude').find('.note_container').append(' <tr class="row-note"> <td class="readonly" data-label="Interaction"> <div class="sections-main-sub-container-right-main-rows"> <div class="dynamic-form-input-dropdown-container dynamic-form-input-dropdown-container-icon"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="dynamic-form-input-float-adjust"> <div class="form-group group form-group-right"><img class="icon button-icon" src="assets/icons/caret.svg"> '+(res.attitudes[i].Attitude_Interaction === 0 ? ('<img class="interaction_icon" src="assets/icons/emoji_good.svg" alt="interaction_icon"> <span>Positive</span>'):('<img class="interaction_icon" src="assets/icons/emoji_bad.svg" alt="interaction_icon"> <span>Negative</span>'))+'</div> </div> </div> </div> </div> </div> </td> <td data-label="Note" class="td-label td-description">'+res.attitudes[i].Attitude_Note+'</td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+res.attitudes[i].Attitude_Addeddate+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit"> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete"> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
  		}
		for (var i = 0; i < subclasses.length; i++) {
			if (subclasses[i].Classe_Label === result[0].Classe_Label)
			{
				checked = ''
				for (var j = res.substudent.length - 1; j >= 0; j--) {
					if(subclasses[i].Expense_Label === res.substudent[j].Expense_Label)
						checked = 'checked';
				}
				$('#Details').find('.sub_list').append('<div class="expense_col col-md-6 sections-label-checkbox-main-container "> <div class="sections-label-checkbox-container"> <div class="form-group group "> <span class="expense_label">'+subclasses[i].Expense_Label+'</span> <span class="method_label"> <span class="method_label_price">'+subclasses[i].Expense_Cost+'</span> <span class="method_label_period">'+subclasses[i].Expense_PaymentMethod+'</span> </span> </div> </div> <div class="customCheck"> <input type="checkbox" value="" name="checkbox" id="ck" '+checked+'/> <label for="ck"></label> </div> </div> ');
			}
		}
	  	for (var i = res.parents.length - 1; i >= 0; i--) {
			$('#Details').find('.dynamic-form-input-parent').prepend('<div class="input-parent"><div class="col-md-6"> <div class="form-group group "> <input type="text" required="" name="parent_name" value="'+res.parents[i].Parent_Name+'"> <label class="input-label"> <span class="input-label-text">Parent full name</span><span class="input-label-bg-mask"></span> </label> </div> </div><div class="col-md-5"> <div class="form-group group "> <input type="text" required="" name="parent_phone" value="'+res.parents[i].Parent_Phone+'"> <label class="input-label"> <span class="input-label-text">Parent phone number</span><span class="input-label-bg-mask"></span> </label> </div> </div></div>');
		}

		for (var i = res.absences.length - 1; i >= 0; i--) {
			var fromto = JSON.parse(res.absences[i].AD_FromTo)
			if (res.absences[i].AD_Type === 2)
				$('#Absence').find('.table_reported').append('<tr class="row-absence"> <td data-label="Subject name" class="td-label">Absence</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit "> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete "> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
			else
				$('#Absence').find('.table_delay').append('<tr class="row-absence"> <td data-label="Subject name" class="td-label">'+absenceArray[res.absences[i].AD_Type]+'</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+res.absences[i].AD_Date+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit "> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete "> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
		}
		$('#Details').addClass("dom-change-watcher");
  	}
  });

	$('#AddAbsenceModal').find('input[name="ad_classe"]').val(result[0].Classe_Label);
	$('#AddAbsenceModal').find('input[name="ad_student"]').val(result[0].Student_FirstName + " " + result[0].Student_LastName);
	$('#student_info').find('.profile-full-name').text(result[0].Student_FirstName + " " + result[0].Student_LastName);
	$('#student_info').find('.profile-img').attr('src',result[0].Student_Image);
	$('#Details').find('input[name="f_name"]').val(result[0].Student_FirstName);
	$('#Details').find('input[name="student_address_detail"]').val(result[0].Student_Address);
	$('#Details').find('input[name="l_name"]').val(result[0].Student_LastName);
	$('#Details').find('input[name="phone_number_detail"]').val(result[0].Student_Phone);
	$('#Details').find('input[name="birthdate_detail"]').val(result[0].Student_birthdate);
	$('#Details').find('input[name="classe-detail"]').val(result[0].Classe_Label);
	$('#Details').find('input[name="level-detail"]').val(result[0].Level_Label);
	$('#AddAttitudeModal').find('input[name="at_classe"]').val(result[0].Classe_Label);
	$('#AddAttitudeModal').find('input[name="at_student"]').val(result[0].Student_FirstName + " " + result[0].Student_LastName);
}

 $('#student_form').find('input[name="level"]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('.sub_div').remove();
	  $.ajax({
		    type: 'get',
		    url: '/student/subscriptions',
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
		  	}
		  });
  }
})

function saveStudent() {
	var first_name = $('#student_form').find('input[name="first_name"]').val();
	var student_address = $('#student_form').find('input[name="student_address"]').val();
	var profile_image = $('#student_form').find('input[name="profile_image"]').val();
	var last_name = $('#student_form').find('input[name="last_name"]').val();
	var level = $('#student_form').find('input[name="level"]').val();
	var phone_number = $('#student_form').find('input[name="phone_number"]').val();
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
	var checkbox_sub = [];
	for (var i = subArray.length - 1; i >= 0; i--) {
		if ($('input[name=checkbox_sub_'+i+']:checked').length > 0)
			checkbox_sub.push(subArray[i]);
	}
	if (!first_name)
		$('#student_form').find('input[name="first_name"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="first_name"]').css("border-color", "#EFEFEF");
	if (!student_address)
		$('#student_form').find('input[name="student_address"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="student_address"]').css("border-color", "#EFEFEF");
	if (parent_name.length <= 0)
		$('#student_form').find('input[name="parent_name"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="parent_name"]').css("border-color", "#EFEFEF");
	if (parent_phone.length <= 0)
		$('#student_form').find('input[name="parent_phone"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="parent_name"]').css("border-color", "#EFEFEF");
	if (!profile_image)
		$('#student_form').find('.input-img-container').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('.input-img-container').css("border-color", "#EFEFEF");
	if (!last_name)
		$('#student_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="last_name"]').css("border-color", "#EFEFEF");
	if (!phone_number)
		$('#student_form').find('input[name="phone_number"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="phone_number"]').css("border-color", "#EFEFEF");
	if (!birthdate)
		$('#student_form').find('input[name="birthdate"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="birthdate"]').css("border-color", "#EFEFEF");
	if (!level)
		$('.input_level').css("border-color", "#f6b8c1");
	else
		$('.input_level').css("border-color", "#EFEFEF");
	if (!classe)
		$('.input_classe').css("border-color", "#f6b8c1");
	else
		$('.input_classe').css("border-color", "#EFEFEF");

	if (first_name && level && profile_image && classe && parent_phone.length > 0 && parent_name.length > 0 && student_address && phone_number && birthdate)
	{
		var data = {
			first_name,
			last_name,
			level,
			classe,
			profile_image:$('#output-img').attr("src"),
			parent_phone:parent_phone,
			parent_name:parent_name,
			phone_number,
			birthdate,
			student_address,
			checkbox_sub:checkbox_sub,
		}
		$.ajax({
		    type: 'post',
		    url: '/student/save',
		    data: data,
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddStudentModal').modal('hide');
		  		getAllStudents();
		  		$('#student_form').find('input[name="first_name"]').val("");
				$('#student_form').find('input[name="student_address"]').val("");
				$('#student_form').find('input[name="profile_image"]').val("");
				$('#student_form').find('input[name="last_name"]').val("");
				$('#student_form').find('input[name="level"]').val("");
				$('#student_form').find('input[name="phone_number"]').val("");
				$('#student_form').find('input[name="birthdate"]').val("");
				$('#student_form').find('input[name="classe"]').val("");

		  	} else {
		  		$('#student_form').find('input[name="first_name"]').css("border-color", "#f6b8c1");
		  		$('#student_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
		  	}
		  });
	}

}

function saveAbsence() {
var ad_classe = $('#AddAbsenceModal').find('input[name="ad_classe"]').val();
console.log(ad_classe);
var ad_fromto = {};
var ad_date = "";

var ad_student = $('#AddAbsenceModal').find('input[name="ad_student"]').val();

var ad_absence;

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

console.log(ad_absence,ad_fromto,ad_date);

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
		    url: '/student/absence',
		    data: {
		    	ad_fromto: JSON.stringify(ad_fromto),
		    	ad_type:parseInt(ad_absence),
		    	ad_date,
		    	ad_classe,
		    	ad_student,
		    	user_id:index
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddAbsenceModal').modal('hide');
		  		if (parseInt(ad_absence) === 2)
				$('#Absence').find('.table_reported').append('<tr class="row-absence"> <td data-label="Subject name" class="td-label">Absence</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ad_fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ad_fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit "> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete "> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
			else
				$('#Absence').find('.table_delay').append('<tr class="row-absence"> <td data-label="Subject name" class="td-label">'+absenceArray[parseInt(ad_absence)]+'</td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ad_fromto.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ad_fromto.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg"> </div> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ad_date+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit "> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete "> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
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

	console.log(at_classe,at_student,at_date,at_type,at_note);

	if (!at_date)
		$('#AddAttitudeModal').find('.at_date').css("border-color", "#f6b8c1");
	else
		$('#AddAttitudeModal').find('.at_date').css("border-color", "#EFEFEF");
	if (!at_classe)
		$('#AddAttitudeModal').find('.at_classe').css("border-color", "#f6b8c1");
	else
		$('#AddAttitudeModal').find('.at_classe').css("border-color", "#EFEFEF");

	if (!at_student)
		$('#AddAttitudeModal').find('.at_student').css("border-color", "#f6b8c1");
	else
		$('#AddAttitudeModal').find('.at_student').css("border-color", "#EFEFEF");
	if (!at_note)
		$('#AddAttitudeModal').find('#at_note').css("border-color", "#f6b8c1");
	else
		$('#AddAttitudeModal').find('#at_note').css("border-color", "#EFEFEF");

	if (at_type && at_note && at_date && at_student && at_classe)
	{
		$.ajax({
		    type: 'post',
		    url: '/student/attitude',
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
		  		$('#AddAttitudeModal').modal('hide');
				$('#Attitude').find('.note_container').append(' <tr class="row-note"> <td class="readonly" data-label="Interaction"> <div class="sections-main-sub-container-right-main-rows"> <div class="dynamic-form-input-dropdown-container dynamic-form-input-dropdown-container-icon"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="dynamic-form-input-float-adjust"> <div class="form-group group form-group-right"><img class="icon button-icon" src="assets/icons/caret.svg"> '+(parseInt(at_type) === 0 ? ('<img class="interaction_icon" src="assets/icons/emoji_good.svg" alt="interaction_icon"> <span>Positive</span>'):('<img class="interaction_icon" src="assets/icons/emoji_bad.svg" alt="interaction_icon"> <span>Negative</span>'))+'</div> </div> </div> </div> </div> </div> </td> <td data-label="Note" class="td-label td-description">'+at_note+'</td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+at_date+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> <!-- table-option-list --> <img class="table-option-icon" src="assets/icons/options.svg"> <div class="table-option-list"> <div class="table-option-list-li table-option-list-li-edit"> <img src="assets/icons/edit.svg" alt="edit"/> <span class="table-option-list-span">Edit</span> </div> <div class="table-option-list-li table-option-list-li-delete"> <img src="assets/icons/delete.svg" alt="delete"/> <span class="table-option-list-span">Delete</span> </div> <img class="table-option-icon-close" alt="close" src="assets/icons/close.svg"> </div> <!-- End table-option-list --> </td> </tr>');
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}