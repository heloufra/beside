var subArray = [];
var employees = [];
var parents = [];
var subemployee = [];
var employeeId = 0;
var employeeRole= '';
var absenceArray = ["Retard","Absence"];
var noteTypes = ["Positive","Negative"];
var subclasses = [];
var homeworks = [];
var attitudes = [];
var exams = [];
var filtredClass = [];
$domChange = false;
var olddata = [];
var employeeselectedSub = [];
var functionalities = [];

let $detailsSelector = "#Details";

$(document).ready(()=>{
	select2Call();
})

//getAllEmployees();

function getAllEmployees_old(id) {

	console.log("getAllEmployees");

	dynamicListRows = "" ;

 	$('.row-employee').remove();

	$.ajax({
	    type: 'get',
	    url: '/Employees/all',
	    dataType: 'json'
	  })
	  .done(function(res){



			employees = res.employees;

			functionalities = [];

			res.functionalities.map((fn)=>{
				let val =Capitalized(fn);
				if(!functionalities.includes(val)){
					functionalities.push(val);
				}
			})
			
	  		SortEmployeeList(employees);
			  
	  		filtredClass = res.employees;
	  		if (id){
	  			displayEmployee(id);
	  		}
	  		else if (res.employees.length > 0){
	  			displayEmployee(res.employees[res.employees.length - 1].employee.User_ID);
	  		}
	  		var active = '';

	  		remove_No_Result_FeedBack();
	  		addSideBarLoadingAnimation($sideSelector);

	  		for (var i = res.employees.length - 1; i >= 0; i--) {
	  			if (id){
	  				if(res.employees[i].employee.User_ID === id){
	  					active = 'active';
	  				}
	  				else{
	  					active = ''
	  				}
	  			}else{
		  			if (i === res.employees.length - 1){
		  				active = 'active';
		  			}
		  			else{
		  				active = '';
		  			}
		  		}

	  			var name = JSON.parse(res.employees[i].employee.User_Name);
	  			var html = '';

  				dynamicListRows +='<div data-val="'+Capitalized(String(res.employees[i].employee.User_Role).replace(' ',""))+'" ' ;

				dynamicListRows += 'class="'+active+' sections-main-sub-container-left-card row-employee"><img class="sections-main-sub-container-left-card-main-img" src="'+res.employees[i].employee.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="employeeId" type="hidden" value="'+res.employees[i].employee.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+Capitalized(res.employees[i].employee.User_Role)+'</span></div>' ;

  				dynamicListRows +='</div>';
			
	  		}

			functionalities.sort();

			functionalitiesHtml =`<li data-val="All" data-lang="All" placeholder="Tous" style="opacity: 1;">Tous</li>`;

			functionalities.map((func,i) =>{
	
				functionalitiesHtml += `<li data-val="${func}" data-lang="${func}" style="opacity: 1;">${func}</li>`;
	
			});

			$('.dynamic-form-input-dropdown-options-functionalities-filter').html("");
			$('.dynamic-form-input-dropdown-options-functionalities-filter').prepend(functionalitiesHtml);

	  		if(res.employees.length > 0 ){
				$('#list_employees').append(dynamicListRows);
			}else{
				$HeaderFeedBack = "No result found !";
				$SubHeaderFeedBack = "";
				$IconFeedBack = "404_students.png";
				no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
			}

	  		removeSideBarLoadingAnimation($sideSelector);

	  	
	  });
}

function displayEmployee(index) 
{

  addLoadingAnimation($detailsSelector,$headerInfo);
  employeeselectedSub = [];
  $.ajax({
    type: 'get',
    url: '/Employees/one',
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
  		employeeId = parseInt(index);
		employeeRole = res.employee[0].User_Role;
		$domChange = false;

		var result = employees.filter(function (el) {
				  return el.employee.User_ID === parseInt(index);
		});

		$('#employee_info').find('#Details').removeClass("dom-change-watcher");
		$('#EditEmployeeModal').removeClass("dom-change-watcher");
		
		$('#employee_info').removeClass('hidden');
		var name = JSON.parse(res.employee[0].User_Name);
		
		$('#employee_info').find('.label-full-name').text(name.first_name + " " + name.last_name);
		$('#employee_info').find('#employee_role').text(Capitalized(res.employee[0].User_Role));
		
		$('#EditEmployeeModal').find('.label-full-name').text(name.first_name + " " + name.last_name);
		$('#employee_info').find('.input-img').attr('src',res.employee[0].User_Image);
		$('#EditEmployeeModal').find('.input-img').attr('src',res.employee[0].User_Image);
		$('#employee_info').find('#Details').find('input[name="f_name"]').val(name.first_name);
		$('#employee_info').find('#Details').find('input[name="employee_address_detail"]').val(res.employee[0].User_Address);
		$('#employee_info').find('#Details').find('input[name="employee_gender_detail"]').val(arrLang[$lang][res.employee[0].User_Gender]);
		$('#employee_info').find('#Details').find('input[name="employee_gender_detail"]').attr("data-val",res.employee[0].User_Gender);
		$('#employee_info').find('#Details').find('input[name="employee_functionality_detail"]').val(Capitalized(res.employee[0].User_Role));
		$('#employee_info').find('#Details').find('input[name="employee_functionality_detail"]').attr("data-val",res.employee[0].User_Role);
		$('#employee_info').find('#Details').find('input[name="employee_salary_detail"]').val(res.employee[0].User_Salary);
		$('#employee_info').find('#Details').find('input[name="l_name"]').val(name.last_name);
		$('#employee_info').find('#Details').find('input[name="phone_number_detail"]').val(res.employee[0].User_Phone);
		$('#employee_info').find('#Details').find('input[name="birthdate_detail"]').val(res.employee[0].User_Birthdate)
		$('#employee_info').find('#Details').find('input[name="email"]').val(res.employee[0].User_Email);
		$('#EditEmployeeModal').find('input[name="f_name"]').val(name.first_name);
		$('#EditEmployeeModal').find('input[name="employee_address"]').val(res.employee[0].User_Address);
		$('#EditEmployeeModal').find('input[name="employee_gender"]').val(arrLang[$lang][res.employee[0].User_Gender]);
		$('#EditEmployeeModal').find('input[name="employee_gender"]').attr("data-val",res.employee[0].User_Gender);
		$('#EditEmployeeModal').find('input[name="l_name"]').val(name.last_name);
		$('#EditEmployeeModal').find('input[name="phone_number_detail"]').val(res.employee[0].User_Phone);
		$('#EditEmployeeModal').find('input[name="birthdate_detail"]').val(res.employee[0].User_Birthdate);
		$('#EditEmployeeModal').find('input[name="email"]').val(res.employee[0].User_Email);
		$('#EditEmployeeModal').find('input[name="employee_salary"]').val(res.employee[0].User_Salary);
		$('#EditEmployeeModal').find('input[name="employee_salary"]').attr("data-id",res.employee[0].User_Salary_EEC_ID);
		$('#employee_info').find('#Details').addClass("dom-change-watcher");
		$('#EditEmployeeModal').addClass("dom-change-watcher");

		functionalitiesHtml ='';

		functionalities.map((func,i) =>{

			functionalitiesHtml += '<li data-val="'+func+'" data-lang="'+func+'" style="opacity: 1;">'+func+'</li>';

			$('#EditEmployeeModal .input-text-functionalities-select2').prepend(`<option ${ 
				 String(Capitalized(res.employee[0].User_Role).replace(" ",'')) ==  Capitalized(String(func).replace(" ",'')) ?
			"selected" 
			: 
			"" } 
			value="${func}">${func}</option>`);

			$('#AddEmployeeModal .input-text-functionalities-select2').prepend(`<option value="`+func+`">`+func+`</option>`);

		});

		$("#EditEmployeeModal .input-text-functionalities-select2").parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

		select2Call();

  	}
  	$("body").trigger("domChanged");
  });
}

function remove() {

	var id = employeeId;
	var role = employeeRole
	
	$.ajax({
		    type: 'post',
		    url: '/Employees/one/remove',
		    data: {
		    	id,
				role
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.removed)
		  	{
				getAllEmployees().then(()=>{
					$('#ConfirmDeleteModal').modal('hide');
		  			$('#employee_info').addClass('hidden');
				});

		  	} else {
		  		console.log(res);
		  	}
		  });
}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output-img-employee").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

if (document.getElementById("profile-employee")){
	document.getElementById("profile-employee").addEventListener("change", readFile);
}


function readFileEmployee() {
  
	if (this.files && this.files[0]) {
	  
	  var FR= new FileReader();
	  
	  FR.addEventListener("load", function(e) {
		document.getElementById("edit_employee_image").src = e.target.result;
	  }); 
	  
	  FR.readAsDataURL( this.files[0] );
	}
	
}
  
if (document.getElementById("employee_image")){
	document.getElementById("employee_image").addEventListener("change", readFileEmployee);
}


/* input-text-empty ________________________*/

	$(document).on("click",".form-group-search-filter .caret-rotate-reset",function(event){

			$(this).attr("src","assets/icons/sidebar_icons/search.svg");

			$(this).siblings(".input-text").removeAttr("readonly");
			$(this).removeClass("input-text-empty");
			$(".dynamic-form-input-dropdown-options-search").css("display","none");
			$(this).siblings(".input-text").val("");

			$(document).trigger("click");

			filterEmployees();

			event.preventDefault();
			event.stopPropagation();

			return false;
	});

/* End input-text-empty ________________________*/

$(document).on("click",".row-employee",function(event){
	if (!$("#ChangesModal").hasClass('in'))
	{
		employeeId = $(this).find('input[name="employeeId"]').val();
		$('.sections-main-sub-container-left-card').removeClass('active');
		$(this).addClass('active');
		displayEmployee(employeeId);
	}
});

function hideSelected(value) {
	  if (value && !value.selected) {
	    return $('<span>' + value.text + '</span>');
	  }
}

function saveEmployee() {

	var first_name = $('#AddEmployeeModal').find('input[name="first_name"]').val();
	var email = $('#AddEmployeeModal').find('input[name="email"]').val();
	var employee_address = $('#AddEmployeeModal').find('input[name="employee_address"]').val();
	var employee_gender = $('#AddEmployeeModal').find('input[name="employee_gender"]').attr("data-val");
	var profile_image = $('#AddEmployeeModal').find('input[name="profile_image"]').val();
	var last_name = $('#AddEmployeeModal').find('input[name="last_name"]').val();
	var phone_number = $('#AddEmployeeModal').find('input[name="phone_number"]').val();
	var birthdate = $('#AddEmployeeModal').find('input[name="birthdate"]').val();
	var employee_functionality = ($('#AddEmployeeModal').find('.input-text-functionalities-select2').select2('data') . length > 0  ) ? $('#AddEmployeeModal').find('.input-text-functionalities-select2').select2('data')[0].text : '';

	var employee_salary = $('#AddEmployeeModal').find('input[name="employee_salary"]').val();

	if (!first_name){
		$('#AddEmployeeModal').find('input[name="first_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddEmployeeModal').find('input[name="first_name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!email){
		email = String(first_name+'.'+last_name+"@beside.ma").replace(" ",'');
		//$('#AddEmployeeModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(email)){
			$('#AddEmployeeModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#AddEmployeeModal').find('input[name="email"]').parent(".form-group").removeClass("form-input-error");
		}
	}
	
	if (!employee_address){
		$('#AddEmployeeModal').find('input[name="employee_address"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddEmployeeModal').find('input[name="employee_address"]').parent(".form-group").removeClass("form-input-error");
	}
	if (!last_name){
		$('#AddEmployeeModal').find('input[name="last_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddEmployeeModal').find('input[name="last_name"]').parent(".form-group").removeClass("form-input-error");
	}
	
	if (!phone_number){
		$('#AddEmployeeModal').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(phone_number)){
			$('#AddEmployeeModal').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#AddEmployeeModal').find('input[name="phone_number"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!birthdate){
		$('#AddEmployeeModal').find('input[name="birthdate"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddEmployeeModal').find('input[name="birthdate"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!employee_gender){
		$('#AddEmployeeModal').find('input[name="employee_gender"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddEmployeeModal').find('input[name="employee_gender"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!employee_functionality || employee_functionality == '' ){
		$('#AddEmployeeModal').find('.input-text-functionalities-select2').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddEmployeeModal').find('.input-text-functionalities-select2').parent(".form-group").removeClass("form-input-error");
	}

	if (!employee_salary){
		$('#AddEmployeeModal').find('input[name="employee_salary"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#AddEmployeeModal').find('input[name="employee_salary"]').parent(".form-group").removeClass("form-input-error");
	}

	var data = {
			first_name,
			last_name,
			profile_image:$('#output-img-employee').attr("src"),
			phone_number,
			birthdate,
			email,
			employee_address,
			employee_gender,
			employee_functionality,
			employee_salary
	}

	/*if (first_name && last_name && employee_address && phone_number && internationalPhoneValidator(phone_number) && birthdate && email && emailValidator(email))*/
	if (first_name && last_name && employee_address && phone_number && internationalPhoneValidator(phone_number) && birthdate && email && emailValidator(email) && (employee_functionality && employee_functionality != '') && employee_gender  )
	{
		console.log("start saving =>",res.saved);

		return false;

		startSpinner("#AddEmployeeModal .sub-container-form-footer");
		$.ajax({
		    type: 'post',
		    url: '/Employees/save',
		    data: data,
		    dataType: 'json'
		  })
		  .done(function(res){

		  	

		  	if(res.saved)
		  	{
				
					stopSpinner("#AddEmployeeModal .sub-container-form-footer");
					$('#AddEmployeeModal').modal('hide');
					$('#AddEmployeeModal').find('input[name="first_name"]').val("");
					$('#AddEmployeeModal').find('input[name="employee_address"]').val("");
					$('#AddEmployeeModal').find('input[name="employee_gender"]').val("");
					$('#AddEmployeeModal').find('input[name="profile_image"]').val("");
					$('#AddEmployeeModal').find('input[name="last_name"]').val("");
					$('#AddEmployeeModal').find('input[name="level"]').val("");
					$('#AddEmployeeModal').find('input[name="phone_number"]').val("");
					$('#AddEmployeeModal').find('input[name="email"]').val("");
					$('#AddEmployeeModal').find('input[name="birthdate"]').val("");
					$('#output-img-employee').attr("src",'assets/icons/Logo_placeholder.svg');
					employee_functionality = '';
					getAllEmployees();
					console.log("res.saved =>",res.saved);


		  	} else {

				stopSpinner("#AddEmployeeModal .sub-container-form-footer");
				
				if (phone_number == res.form_errors.User.Tel ){
					$('#AddEmployeeModal').find('input[name="phone_number"]').parent(".form-group").addClass("form-input-error");
				}
				else{
					$('#AddEmployeeModal').find('input[name="phone_number"]').parent(".form-group").removeClass("form-input-error");
				}

				if (email == res.form_errors.User.Email ){
					$('#AddEmployeeModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
				}
				else{
					$('#AddEmployeeModal').find('input[name="email"]').parent(".form-group").removeClass("form-input-error");
				}
		  	}

		  });

	}else{
		console.log("test :",first_name && last_name && employee_address && phone_number && internationalPhoneValidator(phone_number) && birthdate && email && emailValidator(email) && (employee_functionality && employee_functionality != '') && employee_gender);
	}

}

function saveChange() {

	var first_name = $('#EditEmployeeModal').find('input[name="f_name"]').val();
	var email = $('#EditEmployeeModal').find('input[name="email"]').val();
	var employee_address = $('#EditEmployeeModal').find('input[name="employee_address"]').val();
	var employee_gender = $('#EditEmployeeModal').find('input[name="employee_gender"]').attr("data-val");
	var profile_image = $('#EditEmployeeModal').find('.profile-img').attr('src');
	var last_name = $('#EditEmployeeModal').find('input[name="l_name"]').val();
	var phone_number = $('#EditEmployeeModal').find('input[name="phone_number_detail"]').val();
	var birthdate = $('#EditEmployeeModal').find('input[name="birthdate_detail"]').val();
	var employee_functionality = ($('#EditEmployeeModal').find('.input-text-functionalities-select2').select2('data').length > 0  ) ? $('#EditEmployeeModal').find('.input-text-functionalities-select2').select2('data')[0].text : '';
	var employee_salary = $('#EditEmployeeModal').find('input[name="employee_salary"]').val();

	if (!first_name){
		$('#EditEmployeeModal').find('input[name="f_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditEmployeeModal').find('input[name="f_name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!email){
		$('#EditEmployeeModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(email)){
			$('#EditEmployeeModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#EditEmployeeModal').find('input[name="email"]').parent(".form-group").removeClass("form-input-error");
		}
	}
	
	if (!employee_address){
		$('#EditEmployeeModal').find('input[name="employee_address_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditEmployeeModal').find('input[name="employee_address_detail"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!last_name){
		$('#EditEmployeeModal').find('input[name="l_name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditEmployeeModal').find('input[name="l_name"]').parent(".form-group").removeClass("form-input-error");
	}
	
	if (!phone_number){
		$('#EditEmployeeModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(phone_number)){
			$('#EditEmployeeModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#EditEmployeeModal').find('input[name="phone_number_detail"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!birthdate){
		$('#EditEmployeeModal').find('input[name="birthdate_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditEmployeeModal').find('input[name="birthdate_detail"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!employee_gender){
		$('#EditEmployeeModal').find('input[name="employee_gender_detail"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditEmployeeModal').find('input[name="employee_gender_detail"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!employee_functionality || employee_functionality == '' ){
		$('#EditEmployeeModal').find('.input-text-functionalities-select2').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditEmployeeModal').find('.input-text-functionalities-select2').parent(".form-group").removeClass("form-input-error");
	}

	if (!employee_salary){
		$('#EditEmployeeModal').find('input[name="employee_salary"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#EditEmployeeModal').find('input[name="employee_salary"]').parent(".form-group").removeClass("form-input-error");
	}

	var data =  {
    	id:employeeId,
    	profile_image:$('#EditEmployeeModal').find('.profile-img').attr('src'),
		first_name:$('#EditEmployeeModal').find('input[name="f_name"]').val(),
		employee_address:$('#EditEmployeeModal').find('input[name="employee_address"]').val(),
		employee_gender:$('#EditEmployeeModal').find('input[name="employee_gender"]').attr("data-val"),
		last_name:$('#EditEmployeeModal').find('input[name="l_name"]').val(),
		email:$('#EditEmployeeModal').find('input[name="email"]').val(),
		phone_number:$('#EditEmployeeModal').find('input[name="phone_number_detail"]').val(),
		birthdate:$('#EditEmployeeModal').find('input[name="birthdate_detail"]').val(),
		employee_functionality,
		employee_salary:$('#EditEmployeeModal').find('input[name="employee_salary"]').val(),
		employee_salary_eec_id:$('#EditEmployeeModal').find('input[name="employee_salary"]').attr("data-id")
    };


	if (first_name && last_name && employee_address && phone_number && internationalPhoneValidator(phone_number) && birthdate && email && emailValidator(email) && (employee_functionality && employee_functionality != '') && employee_gender && employee_salary ){

	startSpinner("#EditEmployeeModal .sub-container-form-footer");
	//addAnimation();

	$.ajax({
	    type: 'post',
	    url: '/Employees/update',
	    data: data ,
	    dataType: 'json'
	  })
	  .done(function(res){

				if(res.updated){

							getAllEmployees().then(()=>{
								stopSpinner("#EditEmployeeModal .sub-container-form-footer");
								$("#EditEmployeeModal").modal('hide');
								$('#EditEmployeeModal .sub-container-form-footer').addClass('hide-footer');
								$('#EditEmployeeModal .sub-container-form-footer').removeClass('show-footer');
							});


				}else {

							if (phone_number == res.form_errors.User.Tel ){
								$('#EditEmployeeModal').find('input[name="phone_number_detail"]').parent(".form-group").addClass("form-input-error");
							}
							else{
								$('#EditEmployeeModal').find('input[name="phone_number_detail"]').parent(".form-group").removeClass("form-input-error");
							}

							if (email == res.form_errors.User.Email ){
								$('#EditEmployeeModal').find('input[name="email"]').parent(".form-group").addClass("form-input-error");
							}
							else{
								$('#EditEmployeeModal').find('input[name="email"]').parent(".form-group").removeClass("form-input-error");
							}
					}

				removeAnimation();

	});
			 	
	}
}

function discardChange() {
 	$('#EditEmployeeModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditEmployeeModal .sub-container-form-footer').removeClass('show-footer');
 	$("#EditEmployeeModal").modal('hide');
 	displayEmployee(employeeId);
 }


/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-employee-edit",function(){

	/***** reset select2 options  */

	functionalitiesHtml ='';

	$("#EditEmployeeModal .input-text-functionalities-select2").html("");

	functionalities.map((func,i) =>{

		functionalitiesHtml += '<li data-val="'+func+'" data-lang="'+func+'" style="opacity: 1;">'+func+'</li>';

		$("#EditEmployeeModal .input-text-functionalities-select2").prepend(`<option ${ 
			Capitalized(String(employeeRole).replace(" ",'')) ==  Capitalized(String(func).replace(" ",'')) ?
		"selected" 
		: 
		"" } 
		value="${func}">${func}</option>`);

	});

	$("#EditEmployeeModal .input-text-functionalities-select2").trigger('change');

	console.log("EditEmployeeModal $that.trigger('change')");	

	$('#EditEmployeeModal').modal('show');
});	

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

	$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-employee-edit",function(){
		$('#EditEmployeeModal').modal('show');
	});

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

$("#functionalities-filter").on("change",function(e){
	filterEmployees();
});

if (document.getElementById("search-input")){
	document.getElementById("search-input").addEventListener('input', function (evt) {
		filterEmployees();
	});
}

function filterEmployees() {

	$functionality_value = $("#functionalities-filter").attr('data-val');
	$search_value = $("#search-input").val();

	console.log("filterEmployees => ",$functionality_value , " ", $search_value);

	dynamicListRows = '';
	remove_No_Result_FeedBack();
	addSideBarLoadingAnimation($sideSelector);
	  
	$('.row-employee').remove();
	var active = '';
  
	if ($search_value.replace(/\s/g, '') !== ''){
  
	  var value = new RegExp(String($search_value).toLowerCase().replace(/\s/g, ''));
	  var filtred = employees.filter(function (el) {
					var name = JSON.parse(el.employee.User_Name)
					var forname = name.first_name.toLowerCase()+name.last_name.toLowerCase();
					var backname = name.last_name.toLowerCase()+name.first_name.toLowerCase();
				    return forname.match(value) || backname.match(value);
	  });
	  
	  if($functionality_value != 'All'){
		filtred = filtred.filter(item=>{ 
			console.log("Role =>",item.employee.User_Role);
			return Capitalized(String(item.employee.User_Role).replace(" ",'')) == Capitalized(String($functionality_value).replace(" ",''))
		});
	  }
  
	  SortEmployeeList(filtred);
  
	  for (var i = filtred.length - 1; i >= 0; i--) {
		  if (i === filtred.length - 1)
		  {
			  displayEmployee(filtred[i].employee.User_ID);
			  active = 'active';
		  } else
			  active = '';
		  var name = JSON.parse(filtred[i].employee.User_Name);
  
		  dynamicListRows +='<div data-val="'+Capitalized(String(filtred[i].employee.User_Role).replace(' ',""))+'" ' ;
  
		  dynamicListRows += 'class="'+active+' sections-main-sub-container-left-card row-employee"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].employee.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="employeeId" type="hidden" value="'+filtred[i].employee.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+Capitalized(filtred[i].employee.User_Role)+'</span></div>' ;
  
		  dynamicListRows +='</div>';
  
	  }
  
	} else {
  
  
		var filtred = employees;

		if($functionality_value != 'All'){
			filtred = filtred.filter(item=>{ 
				return Capitalized(String(item.employee.User_Role).replace(" ",'')) == Capitalized(String($functionality_value).replace(" ",''))
			});
		}

		SortEmployeeList(filtred);
  
		for (var i = filtred.length - 1; i >= 0; i--) {
			if (i === filtred.length - 1)
			{
				displayEmployee(filtred[i].employee.User_ID);
				active = 'active';
			} else
				active = '';
			var name = JSON.parse(filtred[i].employee.User_Name);

			dynamicListRows +='<div ';
	
			dynamicListRows += 'class="'+active+' sections-main-sub-container-left-card row-employee"><img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].employee.User_Image+'" alt="card-img"><span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper"></span><input name="employeeId" type="hidden" value="'+filtred[i].employee.User_ID+'"> <div class="sections-main-sub-container-left-card-info"><p class="sections-main-sub-container-left-card-main-info">'+name.first_name+' '+name.last_name+'</p><span  class="sections-main-sub-container-left-card-sub-info">'+Capitalized(filtred[i].employee.User_Role)+'</span></div>' ;
	
			dynamicListRows +='</div>';
			
		}
  
	}
  
  
	  if(filtred.length > 0 ){
		  $('#list_employees').append(dynamicListRows);
	  }else{
		  $HeaderFeedBack = "No result found !";
		  $SubHeaderFeedBack = "";
		  $IconFeedBack = "404_students.png";
		  no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
	  }
  
	  removeSideBarLoadingAnimation($sideSelector);
  
}

function addAnimation(){
	$(".sections-main-sub-container-left-card-main-img-text").removeClass("hide-loading-helper");
	addLoadingAnimation($detailsSelector,$headerInfo);
  	addSideBarLoadingAnimation($sideSelector);
}

function removeAnimation(){
	removeSideBarLoadingAnimation($sideSelector);		
	removeLoadingAnimation($detailsSelector,$headerInfo);
}

function select2Call() {

	$tag_data = "";

	$alreadySelected = [];

	$(".input-text-functionalities-select2").each(function(ind,elem){

			$this = $(this) ;
			
			/****** prepend new options to all dropdown *********/

				$this.select2({
					  tokenSeparators: [','],
					  tags: true,
					  dropdownPosition: 'below',
			  		  minimumResultsForSearch: -1,
			  		  templateResult: hideSelected,
			  		  placeholder: "",
			  		  templateSelection: function (data, container){

						  var $option = $this.find('option[value="'+data.id+'"]');

						  if ($option.attr('locked')){
						  	$(container).addClass('locked-tag');
							data.locked = true; 
							$alreadySelected.push(data.id+"_"+$this.attr("data-level"));
						  }

					      $(container).attr("style","background-color:"+$option.attr("data-bg")+"!important;");
					      data.selected=true;
					      data.ls_id = $option.attr("data-ls-id");
						  $tag_data = data;
					      return data.text;

					  },
				      processResults: function(data, params) {
				          var data = $.map(data, function(item) {
				            if (item.text.match(params.term) || params.term === "") return item;
				          });
				          return { results: data }
				      },

				}).on("select2:unselecting", function(e) {
					    var self = $(this);
					    setTimeout(function() {
					        self.select2('close');
					    }, 0);
				});

				$this.trigger("change");

			/****** trigger changes on select **************/

			$(this).on('select2:select', function (e) {

				$that = $(this);

				$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

				$(this).parents(".form-group-right").find(".select2-search__field").css({"cssText":"display:none !important"});

				$dataSelect2Id = $(this).attr("data-select2-id");

				$dataSelect2Data = $that.select2('data');

				$dataSelect2DataText = $dataSelect2Data[$dataSelect2Data.length - 1 ].text;

				if(!functionalities.includes($dataSelect2DataText)){
					functionalities.push($dataSelect2DataText);
				}

				/***** reset select2 options  */
				
				functionalitiesHtml ='';

				$that.html("");

				functionalities.map((func,i) =>{
		
					functionalitiesHtml += '<li data-val="'+func+'" data-lang="'+func+'" style="opacity: 1;">'+func+'</li>';
		
					$that.prepend(`<option ${ 
						 Capitalized(String(e.params.data.text).replace(" ",'')) ==  Capitalized(String(func).replace(" ",'')) ?
					"selected" 
					: 
					"" } 
					value="${func}">${func}</option>`);
		
				});

				$that.trigger('change');

				console.log("$that.trigger('change')");				

			});

			$tag_data_unselect ="";

			$(this).on("select2:unselect", (e) => {

				$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
				$(this).parents(".form-group-right").find(".select2-search__field").css({"cssText":"display:inline-block !important"});

				$tag_data_unselect = e.params.data;

			});

			$(this).on('select2:open', function (e) {

				var a = new Array();

			    $(this).children("option").each(function(x){

					$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

			        test = false;
			        b = a[x] = $(this).val();

			        for(i=0;i<a.length-1;i++){
			            if(b ==a[i]){
			            	test =true;
			            }
			        }

			        if(test){
			        	$(this).remove();
			        }

			    })

				if( $tag_data_unselect != "" ) {
					var newOption = new Option($tag_data_unselect.text, $tag_data_unselect.id, false, false);
					$(this).prepend(newOption).trigger('change');
				}

				$tag_data_unselect = "" ;

				$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

			});


			/****** End prepend new options to all dropdown *********/

			$(this).on('select2:close', function (e) {

				$dataSelect2Data = $(this).select2('data') ;

				if($dataSelect2Data.length <=0 ){
					$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
				};

			});

			$tag_data = "";

			$dataSelect2Data = $this.select2('data');

			if($dataSelect2Data.length > 0){
				$(this).parents(".form-group-right").find(".select2-search__field").css({"cssText":"display:none !important"});
			}

	});

}

