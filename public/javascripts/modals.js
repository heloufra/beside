var pathname = window.location.pathname.replace('/','');
var payStudent = [];
var subStudent =  [];
var start = "";
var end = "";
var academicyear = "";
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];



function savePayment() {
	var payments = $('#FinanceNewModal').find('.payment-select').map(function(){return {period:$(this).val(),ssid:$(this).data('ssid')};}).get();
	console.log("PAyments",payments);
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
		if ( checkbox_sub.length === 0)
			$('#student_form').find('.subscription-divider').css("background", "#f6b8c1");
		else
			$('#student_form').find('.subscription-divider').css("background", "#f0f0f6");
		if (first_name && level && classe && parent_phone.length > 0 && parent_name.length > 0 && student_address && phone_number && birthdate && checkbox_sub.length > 0)
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
					$('#student_form').find('input[name="parent_name"]').val("");
					$('#student_form').find('input[name="parent_phone"]').val("");
					$('#student_form').find('input[name="birthdate"]').val("");
					$('#output-img').attr("src",'assets/icons/Logo_placeholder.svg')
					$('#student_form').find('input[name="classe"]').val("");
					for (var i = subArray.length - 1; i >= 0; i--) {
						$('input[name=checkbox_sub_'+i+']:checked').prop("checked", false);
					}
					window.location.href = '/Students'
			  	} else {
			  		$('#student_form').find('input[name="first_name"]').css("border-color", "#f6b8c1");
			  		$('#student_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
			  	}
			  });
		}
	}
}

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

$('#FinanceNewModal').find('input[name="modal-student"]').on( "change", function() {
 	 var value = $(this).val();
	if (value.replace(/\s/g, '') !== '')
	{
		console.log("Student ID::",$('#FinanceNewModal').find('li[data-val='+value.replace(/\s/g, '')+']').data('id'));
	 	 displayStudentModal($('#FinanceNewModal').find('li[data-val='+value.replace(/\s/g, '')+']').data('id'))
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
		    	user_id:$('#AddAbsenceModal').find('li[data-val='+ad_student.replace(/\s/g, '')+']').data('id')
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
 	
 		console.log('Modal Teacher');
 		var first_name = $('#teacher_form').find('input[name="first_name"]').val();
		var email = $('#teacher_form').find('input[name="email"]').val();
		var teacher_address = $('#teacher_form').find('input[name="teacher_address"]').val();
		var profile_image = $('#teacher_form').find('input[name="profile_image"]').val();
		var teacher_gender = $('#teacher_form').find('input[name="teacher_gender"]').val();
		var last_name = $('#teacher_form').find('input[name="last_name"]').val();
		var phone_number = $('#teacher_form').find('input[name="phone_number"]').val();
		var birthdate = $('#teacher_form').find('input[name="birthdate"]').val();
		var subjects =  $('#teacher_form').find('input[name^=subject]').map(function(idx, elem) {
			if ($(elem).val())
		    	return {subject: $('#teacher_form').find('[data-val='+$(elem).val()+']').data('subjectid'),classes:$(this).closest('.dynamic-form-input-float-adjust').find('select').val()};
		  }).get();


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
				teacher_gender,
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
					$('#teacher_form').find('input[name="email"]').val("");
					$('#teacher_form').find('input[name="birthdate"]').val("");
					$('#teacher_form').find('input[name^=subject]').val("");
					$('#output-img-teacher').attr("src",'assets/icons/Logo_placeholder.svg');
					if (res.exist)
						location.reload();
					window.location.href = '/Teachers';
			  	} else {
			  		$('#teacher_form').find('input[name="email"]').css("border-color", "#f6b8c1");
			  	}
			  });
		}
 	}
}

$('#subjects-container').find('input[name="subjects"]').on( "change", function() {
  var value = $(this).val();
	console.log("Subject!!",value);
  if (value.replace(/\s/g, '') !== '' && pathname !== 'Teachers')
  {
  	$('#subjects-container').find('.row-classe').remove();
	  $.ajax({
		    type: 'get',
		    url: '/Teachers/classes',
		    data: {
		    	subject_id:$('#subjects-container').find('[data-val='+value+']').data('subjectid'),
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
		  				$('#subjects-container').find('.list-classes').append('<option class="option-level-label row-classe" disabled="disabled">'+res.classes[i].Level_Label+'</option>')
		  			}
		  			$('#subjects-container').find('.list-classes').append('<option class="row-classe" value="'+res.classes[i].Classe_ID+'">'+res.classes[i].Classe_Label+'</option>')
		  		}
		  	}
		  });
  }
})

if (pathname !== 'Exams')
	function saveExam() {
		var exam_classe = $('#AddExamModal').find('input[name="exam_classe"]').val();
		var exam_date = $('#AddExamModal').find('input[name="exam_date"]').val();

		var exam_subject = $('#AddExamModal').find('input[name="exam_subject"]').val();
		var exam_name = $('#AddExamModal').find('input[name="exam_name"]').val();
		var exam_description = $('#AddExamModal').find('#exam_description').val();
		var at_type = "";


		console.log(exam_classe,exam_subject,exam_date,exam_description,exam_name);

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
	console.log("PAyments",payments);
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
	  		window.location.href = '/Students';
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
			for (var j = indStart; j < months.length; j++) {
				MonthsFiltred.push(months[j]);
				if (j === indEnd)
					break;
				if (j === months.length - 1)
					j = -1;
			}
			var payFilter = payStudent.filter(function (el) {
		        	return el.SS_ID === subStudent[i].SS_ID;
		      	});
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
		}
		if (subStudent[i].Expense_PaymentMethod === "Annual")
		{
			payFilter = payStudent.filter(function (el) {
		        	return el.SS_ID === subStudent[i].SS_ID;
		      	});
			if (payFilter.length === 0)
			{
				$('#FinanceNewModal').find('.yearly').removeClass('hidden');
				$('#FinanceNewModal').find('.yearly').after('<div class="yearly-rows dynamic-form-input-container dynamic-form-input-container-extra-style input-text-subject-select2-one-option"> <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+subStudent[i].Expense_Label+'</span> <span class="input-label-bg-mask"></span></label> <div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="form-group group"> <select class="input-text-year-select2 payment-select" data-val="Annual" data-ssid="'+subStudent[i].SS_ID+'" multiple name="language"> <option seleted value="'+academicyear+'">'+academicyear+'</option> </select> <img class="icon button-icon" src="assets/icons/caret.svg"> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div> </div>');
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