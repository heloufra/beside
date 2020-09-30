var subArray = [];

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
	  $.ajax({
		    type: 'get',
		    url: '/student/list',
		    data: {
		    	classe_label:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {
		  		console.log(res.students);
		  		for (var i = res.students.length - 1; i >= 0; i--) {
		  			
		  			$('#list_classes').append('<div class="sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+res.students[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+res.students[i].Student_FirstName+' '+res.students[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+$('input[name=classe]').val()+'</span></div></div>')
		  		}
		  	}
		  });
  }
})

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
		  	} else {
		  		$('#student_form').find('input[name="first_name"]').css("border-color", "#f6b8c1");
		  		$('#student_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
		  	}
		  });
	}

}