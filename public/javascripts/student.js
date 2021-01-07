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

function hideSelected(value) {
  if (value && !value.selected) {
    return $('<span>' + value.text + '</span>');
  }
}

getAllStudents();

function getAllStudents(id) {
 	$('.students_list').remove();
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
	  		console.log('Students!!',students);
	  		filtredClass = res.students;
	  		subclasses = res.subscription;
	  		if (id)
	  			displayStudent(id);
	  		else if (res.students.length > 0)
	  			displayStudent(res.students[res.students.length - 1].Student_ID);
	  			
	  		var active = '';
	  		for (var i = res.students.length - 1; i >= 0; i--) {
	  			if (id)
	  				if(res.students[i].Student_ID === id)
	  					active = 'active';
	  				else
	  					active = ''
	  			else	
		  			if (i === res.students.length - 1)
		  				active = 'active';
		  			else
		  				active = '';
	  			$('#list_classes').append('<div class="'+active+' sections-main-sub-container-left-card students_list"><img class="sections-main-sub-container-left-card-main-img" src="'+res.students[i].Student_Image+'" alt="card-img"><input name="studentId" type="hidden" value="'+res.students[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+res.students[i].Student_FirstName+' '+res.students[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+res.students[i].Classe_Label+'</span></div></div>')
	  		}
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
if (document.getElementById("img-profile"))
document.getElementById("img-profile").addEventListener("change", readFileDetail);

 $('#classes_list').find('input[name=classe]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('.students_list').remove();
$domChange = false;
	var filtred = students.filter(function (el) {
			  return el.Classe_Label === value ;
			});
	if (value === "All")
		filtred = students;
	console.log("Filter",filtred);
	var active = '';
	filtredClass = filtred;
	for (var i = filtred.length - 1; i >= 0; i--) {
		if (i === filtred.length - 1)
		{
			displayStudent(filtred[i].Student_ID);
			active = 'active';
		} else
			active = '';
		$('#list_classes').append('<div class="sections-main-sub-container-left-card students_list '+active+'"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div></div>')
	}
  }
})

if (document.getElementById("search-input"))
document.getElementById("search-input").addEventListener('input', function (evt) {
    $('.students_list').remove();
    var active = '';
  if (this.value.replace(/\s/g, '') !== '')
  {
  	var value = new RegExp(this.value.toLowerCase().replace(/\s/g, ''));
	var filtred = students.filter(function (el) {
				var forname = el.Student_FirstName.toLowerCase() +  el.Student_LastName.toLowerCase();
				var backname = el.Student_LastName.toLowerCase()+el.Student_FirstName.toLowerCase();
			  return forname.match(value) || backname.match(value);
			});
	for (var i = filtred.length - 1; i >= 0; i--) {
		if (i === filtred.length - 1)
		{
			displayStudent(filtred[i].Student_ID);
			active = 'active';
		} else
			active = '';
		$('#list_classes').append('<div class="sections-main-sub-container-left-card students_list '+active+'"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"><input name="studentId" type="hidden" value="'+filtred[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName+' '+filtred[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span></div></div>')
	}
  } else {
  	for (var i = filtredClass.length - 1; i >= 0; i--) {
		if (i === filtredClass.length - 1)
		{
			displayStudent(filtredClass[i].Student_ID);
			active = 'active';
		} else
			active = '';
		$('#list_classes').append('<div class="sections-main-sub-container-left-card students_list '+active+'"><img class="sections-main-sub-container-left-card-main-img" src="'+filtredClass[i].Student_Image+'" alt="card-img"><input name="studentId" type="hidden" value="'+filtredClass[i].Student_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+filtredClass[i].Student_FirstName+' '+filtredClass[i].Student_LastName+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+filtredClass[i].Classe_Label+'</span></div></div>')
	}
  }
});

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
	  		else
	  			$('#Grades').addClass('hidden');
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

			$('#EditStudentModal').find('.sections-main-sub-container-right-main-rows-parents').prepend('<div class="row-payment dynamic-form-input-parent '+inputFirst+' row-parent"> <div class="input-parent "><div class="col-md-12"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_name" value="'+res.parents[i].Parent_Name+'"> <label class="input-label "> <span class="input-label-text">Full name</span><span class="input-label-bg-mask"></span> </label> </div> </div> <div class="col-md-6"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_phone" value="'+res.parents[i].Parent_Phone+'"> <label class="input-label"> <span class="input-label-text">Phone number</span><span class="input-label-bg-mask"></span> </label> </div> </div> <div class="col-md-5"> <div class="form-group group "> <input type="text" required="" data-id="'+res.parents[i].Parent_ID+'" name="parent_email" value="'+res.parents[i].Parent_Email+'"> <label class="input-label"> <span class="input-label-text">Email</span><span class="input-label-bg-mask"></span> </label> </div> </div> <div class="col-md-1"> <div class="square-button"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div>');
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
  		}
  	}
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

			for (var k = 0; k < MonthsFiltred.length; k++) {
				htmlmonths += "<option selected value="+MonthsFiltred[k]+">"+MonthsFiltred[k]+"</option> ";				
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
	  		displayStudent(studentId);
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
		$('#student_form').find('input[name="parent_phone"]').css("border-color", "#EFEFEF");
	if (parent_email.length <= 0)
		$('#student_form').find('input[name="parent_email"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="parent_email"]').css("border-color", "#EFEFEF");
	if (!last_name)
		$('#student_form').find('input[name="last_name"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="last_name"]').css("border-color", "#EFEFEF");
	if (!phone_number)
		$('#student_form').find('input[name="phone_number"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="phone_number"]').css("border-color", "#EFEFEF");
	if (!student_email)
		$('#student_form').find('input[name="student_email"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="student_email"]').css("border-color", "#EFEFEF");
	if (!birthdate)
		$('#student_form').find('input[name="birthdate"]').css("border-color", "#f6b8c1");
	else
		$('#student_form').find('input[name="birthdate"]').css("border-color", "#EFEFEF");
	if (!level)
		$('.input_level').css("border-color", "#f6b8c1");
	else
		$('.input_level').css("border-color", "#EFEFEF");
	if (!student_gender)
		$('.input_gender').css("border-color", "#f6b8c1");
	else
		$('.input_gender').css("border-color", "#EFEFEF");
	if (!classe)
		$('.input_classe').css("border-color", "#f6b8c1");
	else
		$('.input_classe').css("border-color", "#EFEFEF");
	if ( checkbox_sub.length <= 0)
	{
		$('#student_form').find('.subscription-divider').css("background", "#f6b8c1");
		 $("#student_form").animate({ scrollTop: $('#student_form').find('.subscription-divider').prop("scrollHeight")}, 1000);
	}
	else
		$('#student_form').find('.subscription-divider').css("background", "#f0f0f6");

	if (first_name && level && classe && parent_phone.length > 0 && parent_email.length > 0  && parent_name.length > 0 && student_address && phone_number && student_email && student_gender && birthdate && checkbox_sub.length > 0)
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
	  	if(res.updated)
	  	{
	  		$("#EditStudentModal").modal('hide');
	  		getAllStudents(studentId);
	  	} else {
	  		discardChange();
	  	}
	  });
 	$('#EditStudentModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditStudentModal .sub-container-form-footer').removeClass('show-footer');
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
	  		displayStudent(studentId);
	  	} else {
	  		console.log(res);
	  		$('#EditAbsenceModal').modal('hide');
	  	}
	  });
}

function updateAttitude() {
	var id = $('#EditAttitudeModal').find('input[name="edit-student"]').data('id');
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
	  		displayStudent(studentId);
	  	} else {
	  		console.log(res);
	  		$('#EditAttitudeModal').modal('hide');
	  	}
	  });
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
	} else 
	{
		ad_absence = $('#AddStudentAbsenceModal').find('input[data-val="Period"]:checked').val();
		ad_fromto = {
			from: $('#AddStudentAbsenceModal').find('input[name="period_start"]').val(),
			to: $('#AddStudentAbsenceModal').find('input[name="period_end"]').val(),
		}
		ad_date = "null";
	}
} else 
{
	ad_absence = $('#AddStudentAbsenceModal').find('input[data-val="Retard"]:checked').val();
	ad_fromto = {
			from: $('#AddStudentAbsenceModal').find('input[name="time_start"]').val(),
			to: $('#AddStudentAbsenceModal').find('input[name="time_end"]').val(),
		};
	ad_date = $('#AddStudentAbsenceModal').find('input[name="ad_date"]').val();
}


	if (!ad_date && ad_absence !== "2")
		$('#AddStudentAbsenceModal').find('.dynamic-form-input-container-one-date').css("border-color", "#f6b8c1");
	else
		$('#AddStudentAbsenceModal').find('.dynamic-form-input-container-one-date').css("border-color", "#EFEFEF");
	if (!ad_classe)
		$('#AddStudentAbsenceModal').find('.ad_classe').css("border-color", "#f6b8c1");
	else
		$('#AddStudentAbsenceModal').find('.ad_classe').css("border-color", "#EFEFEF");

	if (!ad_student)
		$('#AddStudentAbsenceModal').find('.ad_student').css("border-color", "#f6b8c1");
	else
		$('#AddStudentAbsenceModal').find('.ad_student').css("border-color", "#EFEFEF");

	if (!ad_fromto.from && ad_absence !== "2")
	{
		$('#AddStudentAbsenceModal').find('input[name="time_start"]').css("border-color", "#f6b8c1");
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').css("border-color", "#f6b8c1");
	}
	else
	{
		$('#AddStudentAbsenceModal').find('input[name="time_start"]').css("border-color", "#EFEFEF");
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').css("border-color", "#EFEFEF");
	}

	if (!ad_fromto.to && ad_absence !== "2")
	{
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').css("border-color", "#f6b8c1");
	}
	else
	{
		$('#AddStudentAbsenceModal').find('input[name="time_end"]').css("border-color", "#EFEFEF");
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
		  		displayStudent(studentId);
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
		  		displayStudent(studentId);
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