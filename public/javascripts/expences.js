$expences = [];
$domChange = false;
$employees = [];
$initla_selected_input = ["Fix","Monthly","Institution"];
$filtredExpences=[];
$currentExpence = [];
$monthsRangeList = [];
$functionalities = [];

$monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
d = new Date();

$currentMonth = $monthNames[d.getMonth()];

let $detailsSelectorExp = "#Details";
let $tabContentExp = '.tab-content'

$(document).ready(function (e) {
	
	var href = location.href;

	$initla_selected_input = ["Fix","Monthly","Institution"];

	$(".sections-label-checkbox-main-container").each((ind,elm)=>{
		if($initla_selected_input.includes($(elm).attr("data-val"))){
			$(elm).find(".expense_label").css("color","var(--black--color)");
		}
	});

	$(".expences-extra-input-employees").css("cssText","opacity : 1 !important;");

	$(".expences-extra-input-cost").fadeIn();
	$(".expences-extra-input-employees").fadeOut();

	if (href.includes("Expenses")) {
		getAllExpences();
	} else {
		getAllExpencesModal();
	}	

	setTimeout(() => {
		resetExtraInputs();
	}, 10);	
	
	$(".sections-main-sub-container-right-main").css("cssText","height: calc(100vh - 120px );overflow: hidden ;overflow-y: scroll ;");

});

function getAllExpences(id) {

	dynamicListRows = [];
 	$('.expences_list').remove();
	$.ajax({
	    type: 'get',
	    url: '/Expenses/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors){
	  		console.log(res.errors)
	  	} else {
			  
	  		$expences = res.expences.expences;
	  		$filtredExpences = res.expences;
			$employees = res.employees;
			$monthsRangeList = res.expences.monthsRangeList;
			$functionalities = res.functionalities;

			$dynamicModalTableRows ='';
			$employeesProv = $employees ;
		
			$employeesProv.map((employee) =>{
				$selected = false ;
				$dynamicModalTableRows += employeesModalTableRows(employee,expence=[],$selected,"Add");
			});
			$(".cost-container").html("");
			$(".cost-container").append($dynamicModalTableRows);

			$dynamicListRows ='';

			$("#list_expences").html("");

			if($expences.length > 0 ){
				$expences.map((expence,ind) =>{
					$active = false ;
					if(ind == 0 ){
						$active = true ;
					}
					$dynamicListRows += sidebarExpencesRows(expence,$active);
				});
				remove_No_Result_FeedBack();
				addSideBarLoadingAnimation($sideSelector);
				$("#list_expences").append($dynamicListRows);
			}else{
				$HeaderFeedBack = "No result found !";
				$SubHeaderFeedBack = "";
				$IconFeedBack = "404_students.png";
				no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
			}

			$ul_li = `<li data-val="All" >${arrLang[$lang]["All"]}</li>`;

			$functionalities.map((functionality)=>{
				$ul_li  += `<li data-val="${functionality}" >${functionality}</li>`;
			});

			$(".dynamic-form-input-dropdown-employee-functionality-options").html($ul_li);

			//if ($expences.length > 0) {
				if (id){
					displayExpence(id);
				}
				else {
					displayExpence($expences[0].Expence_ID);
				}
			//}

			removeSideBarLoadingAnimation($sideSelector);
	  		
			setTimeout(() => {
				resetExtraInputs();
			}, 10);
				
	  	}
	  });
}

function getAllExpencesModal(id) {

	dynamicListRows = [];
 	$('.expences_list').remove();
	$.ajax({
	    type: 'get',
	    url: '/Expenses/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors){
	  		console.log(res.errors)
	  	} else {
			  
	  		$expences = res.expences.expences;
	  		$filtredExpences = res.expences;
			$employees = res.employees;
			$monthsRangeList = res.expences.monthsRangeList;
			$functionalities = res.functionalities;

			$dynamicModalTableRows ='';
			$employeesProv = $employees ;
		
			$employeesProv.map((employee) =>{
				$selected = false ;
				$dynamicModalTableRows += employeesModalTableRows(employee,expence=[],$selected,"Add");
			});
				
			$(".cost-container").html("");
			$(".cost-container").append($dynamicModalTableRows);

			$dynamicListRows ='';

			$("#list_expences").html("");

			if($expences.length > 0 ){
				$expences.map((expence,ind) =>{
					$active = false ;
					if(ind == 0 ){
						$active = true ;
					}
					$dynamicListRows += sidebarExpencesRows(expence,$active);
				});
			}
				
			$ul_li = `<li data-val="All" >${arrLang[$lang]["All"]}</li>`;

			$functionalities.map((functionality)=>{
				$ul_li  += `<li data-val="${functionality}" >${functionality}</li>`;
			});

			$(".dynamic-form-input-dropdown-employee-functionality-options").html($ul_li);
	  		
			setTimeout(() => {
				resetExtraInputs();
			}, 10);
				
	  	}
	  });
}

function remove() {
	
	$.ajax({
		    type: 'post',
		    url: '/Expenses/one/remove',
		    data: {
		    	id:$currentExpence.Expence_ID
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.removed)
		  	{
		  		$('#ConfirmDeleteModal').modal('hide');
				getAllExpences();
		  	} else {
		  		console.log(res);
		  	}
		  });
}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("add_expence_image").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

if (document.getElementById("add_expence_image_file")){
	document.getElementById("add_expence_image_file").addEventListener("change", readFile);
}

function readFileExpence() {
  
	if (this.files && this.files[0]) {
	  
	  var FR= new FileReader();
	  
	  FR.addEventListener("load", function(e) {
		document.getElementById("edit_expence_image").src = e.target.result;
	  }); 
	  
	  FR.readAsDataURL( this.files[0] );
	}
	
  }
  
if (document.getElementById("edit_expence_image_file")){
	document.getElementById("edit_expence_image_file").addEventListener("change", readFileExpence);
}


/* input-text-empty ________________________*/

	$(document).on("click",".form-group-search-filter .caret-rotate-reset",function(event){

			$(this).attr("src","assets/icons/sidebar_icons/search.svg");

			$(this).siblings(".input-text").removeAttr("readonly");
			$(this).removeClass("input-text-empty");
			$(".dynamic-form-input-dropdown-options-search").css("display","none");
			$(this).siblings(".input-text").val("");

			$(document).trigger("click");

			filterExpences();

			event.preventDefault();
			event.stopPropagation();

			return false;
	});

/* .dynamic-form-input-dropdown-employee-functionality-options li ________________________*/

$(document).on("click",".dynamic-form-input-dropdown-employee-functionality-options li",function(event){

	$parent = $(this).parents(".modal.in").attr("id");
	$search = $(this).attr("data-val");

	// Remove to use for all modals 
	if($parent == "AddExpenceModal"){

		if($search != "All" ){

			$(".cost-container .row-cost").addClass("visibility");

			$(`#${$parent}`).find('input[name="employee_functionality"]').css("opacity","0");

			$(`#${$parent}`).find(".cost-container .row-cost .sections-main-sub-container-left-card-sub-info").each((ind,elm)=>{
				if(String($(elm).text()).toLowerCase() == String($(this).attr("data-val")).toLowerCase()){
					$(elm).parents(".row-cost").removeClass("visibility");
				}
			});

			setTimeout(()=>{
				$(`#${$parent}`).find('input[name="employee_functionality"]').val($(this).text());
				$(`#${$parent}`).find('input[name="employee_functionality"]').css("opacity","1");
			},50);

		}else{
			$(`#${$parent}`).find('input[name="employee_functionality"]').val(arrLang[$lang]["All"]);
			$(".cost-container .row-cost").removeClass("visibility");
		}

	}

});

/* .expence-row ________________________*/

$(document).on("click",".expence-row",function(event){
	if (!$("#ChangesModal").hasClass('in'))
	{
		expenceId = $(this).find('input[name="expenceId"]').val();
		$('.sections-main-sub-container-left-card').removeClass('active');
		$(this).addClass('active');
		displayExpence(expenceId);
	}
});

function displayExpence(index){

	addLoadingAnimation($detailsSelectorExp, $headerInfo , $tabContentExp);

	var $expence = $expences.filter(function (el) {
		return el.Expence_ID === parseInt(index);
	});

	$initla_selected_upd_input = [];

	//set variables 
	$initla_selected_upd_input.push($expence[0].Expence_For);
	$initla_selected_upd_input.push($expence[0].Expence_Periode);
	$initla_selected_upd_input.push($expence[0].Expence_Type);

	$(".sections-label-checkbox-main-container").each((ind,elm)=>{
		if($initla_selected_upd_input.includes($(elm).attr("data-val"))){
			$(elm).find(".employee-ck").trigger("click");
		}
	});

	//End set variables 
	$currentExpence = $expence[0];

	if($currentExpence.Expence_For == "Employees"){

		$dynamicModalTableRows ='';

		$employeesProv = $employees ;
		
		$employeesProv.map((employee) =>{

			$selected = false;
			employee.employee.User_Salary = "" ;
			employee.employee.User_Salary_EEC_ID = -1 ;

			if($currentExpence.Employees.length > 0){

				$currentExpence.Employees.map((emp) => {
					if(emp.employee.Employe_ID == employee.employee.User_ID  ){
						$selected = true;
						employee.employee.User_Salary = emp.employee.User_Salary ;
						employee.employee.User_Salary_EEC_ID = emp.employee.User_Salary_EEC_ID ;
					}
				});

			}else{
				$selected = false;
				employee.employee.User_Salary = "" ;
				employee.employee.User_Salary_EEC_ID = -1 ;
			}

			$dynamicModalTableRows += employeesModalTableRows(employee,$currentExpence,$selected,"Edit");

		});

		$("#EditExpenceModal .cost-container").html("");
		$("#EditExpenceModal .cost-container").append($dynamicModalTableRows);
			
		
		if($currentExpence.Expence_Type != "Fix"){
			$("#EditExpenceModal").find(".expences-extra-input-employees tr th:last-child").fadeOut();
			$("#EditExpenceModal").find(".expences-extra-input-employees tr td:last-child").fadeOut();
		}

	}
	
	$("#EditExpenceModal").find('input[name="expence_label"]').val($currentExpence.Expence_Name);

	if($currentExpence.Expence_For_Functionalities == "" || $currentExpence.Expence_For_Functionalities == "All"){
		$("#EditExpenceModal").find('input[name="employee_functionality"]').val(arrLang[$lang]["All"]);
	}else{
		$("#EditExpenceModal").find('input[name="employee_functionality"]').val($currentExpence.Expence_For_Functionalities);
	}

	$("#EditExpenceModal .dynamic-form-input-container").css("pointer-events","none");

	$("#ExpencesDetails .sub-container-form-footer").css("display","inline-block");

	$(".sub-label-full-name").removeClass("green-color").addClass("red-color");

	$totalCost = 0;

	if($currentExpence.Expence_For == "Employees"){

		$totalCost = 0 ;

		if($currentExpence.Expence_Periode == "Monthly"){

			unpaidCount = 0 ;

			$currentExpence.Employees.map((emp)=>{

				$fixCost = emp.employee.EEC_Cost ;

				emp.employee.Expence_Payement.map((paidEmp)=>{

					if(paidEmp.Expence_Paid_Status == 0 ){
						unpaidCount++;
					}
						
					if(paidEmp.PE_Ammount !== null){
						$totalCost += (paidEmp.PE_Ammount*1);
					}else{
						$totalCost += (emp.employee.EEC_Cost * 1);
					}

				});
			});

			if(unpaidCount == 0 ){
				/* Footer visibility ****/
				 $("#ExpencesDetails .sub-container-form-footer").css("display","none");
				 $(".sub-label-full-name").fadeIn();
				 $(".sub-label-full-name").removeClass("red-color").addClass("green-color");
				/* End Footer visibility ****/
			}

			if($currentExpence.Expence_Type == "Fix"){
				$(".sub-label-full-name").fadeIn();
				$("#expence_cost").html($totalCost);
			}

		}else{

			$totalCost = 0;

			var paidEmployees = $currentExpence.Employees.filter((emp)=>{
				return emp.employee.Expence_Payement.Expence_Paid_Status == 1;
			});

			$currentExpence.Employees.map((emp)=>{

				if(emp.employee.Expence_Payement.PE_Ammount !== null){
					$totalCost += (emp.employee.Expence_Payement.PE_Ammount*1);
				}else{
					$totalCost += (emp.employee.EEC_Cost * 1);
				}
				
			});

			if( paidEmployees.length >= $currentExpence.Employees.length){
				/* Footer visibility ****/
					$("#ExpencesDetails .sub-container-form-footer").css("display","none");
					$(".sub-label-full-name").removeClass("red-color").addClass("green-color");
					$(".sub-label-full-name").fadeIn();
					$("#expence_cost").html($totalCost);
				/* End Footer visibility ****/
			}else{
				$(".sub-label-full-name").css("display","none");
			}

			if($currentExpence.Expence_Type == "Fix"){
				$(".sub-label-full-name").fadeIn();
				$("#expence_cost").html($totalCost);
			}

		}


	}else{

		$totalCost = 0 ;

		if($currentExpence.Institution.length > 0){

			if($currentExpence.Institution[0].IEC_Cost != "" ){

				$totalCost =  $currentExpence.Institution[0].IEC_Cost ;

			}else{
				$totalCost = 0 ;
			}
		}

		if($currentExpence.Expence_Periode == "Annual"){

			if($currentExpence.Institution.length > 0){
				/* Footer visibility ****/
				if($currentExpence.Institution[0].Expence_Payement.Expence_Paid_Status == 1 ){
					$("#ExpencesDetails .sub-container-form-footer").css("display","none");
					$(".sub-label-full-name").fadeIn();
					$(".sub-label-full-name").removeClass("red-color").addClass("green-color");
					$("#expence_cost").html(($currentExpence.Institution[0].Expence_Payement.PE_Ammount*1));
				}
				/* End Footer visibility ****/
			}else{
				$("#expence_cost").html($totalCost);
				$(".sub-label-full-name").fadeIn();
			}

		}else{

			if($currentExpence.Expence_Type == "Fix"  || $currentExpence.Expence_Type == "Variable" ){

				if($currentExpence.Institution.length > 0){

					$fixCost = $currentExpence.Institution[0].IEC_Cost;

					$totalCost = 0;
					$paidInstitution = 0;
	
					$currentExpence.Institution[0].Expence_Payement.map((Inst)=>{
						if(Inst.Expence_Paid_Status == 0 ){
							$paidInstitution++;
						}
					});
	
					$currentExpence.Institution[0].Expence_Payement.map((Inst)=>{
						if(Inst.PE_Ammount){
							$totalCost += (Inst.PE_Ammount*1);
						}else{
							$totalCost += ($currentExpence.Institution[0].IEC_Cost*1);
						}
					});
	
					if( $paidInstitution == 0 ){
						/* Footer visibility ****/
							$("#ExpencesDetails .sub-container-form-footer").css("display","none");
							$(".sub-label-full-name").fadeIn();
							$(".sub-label-full-name").removeClass("red-color").addClass("green-color");
						/* End Footer visibility ****/
					}else{
						
						if($currentExpence.Expence_Type == "Fix" ){
							$(".sub-label-full-name").fadeIn();
							$("#expence_cost").html($totalCost);
						}else{
							$(".sub-label-full-name").fadeOut();
						}
					}

					
	
				}
			}
			
		}
		
	}

	if($totalCost != 0 ){
		$(".expense_label_method").fadeIn();
		$("#expence_cost").html($totalCost);
		$("#EditExpenceModal").find('input[name="expence_cost"]').val($totalCost);

	}else{
		$(".expense_label_method").fadeOut();
		$(".sub-label-full-name").fadeOut();
	}

	$expence_image = '';
	if($currentExpence.Expence_Image == "assets/icons/Logo_placeholder.svg" || $currentExpence.Expence_Image == "") {
		$expence_image =`<div class="input-img-container input-img-text-container  input-rounded-img-container input-rounded-img-container-extra-style exam_img" style="background-color: ${$currentExpence.Expence_Color};">${String($currentExpence.Expence_Name).substr(0,2)}</div>`;
	}else{
		$expence_image =`<img class="input-img profile-img" id="expences_image" src="${$currentExpence.Expence_Image}" alt="profile">`;
	}
	
	if($expence.length > 0 ){
		$("#expences_image_container").html($expence_image);
		$("#expences_label").html($currentExpence.Expence_Name);
		$("#expences_info .tab-content #expences_info_list").html(mainSectionExtraInfoRows($currentExpence,$totalCost));
		$("#expences_info").removeClass("hidden");
	}else{
		$("#expences_image_container").html($expence_image);
		$("#expences_label").html($currentExpence.Expence_Name);
		$("#expences_info").removeClass("hidden");
	}
	
	$(".sections-main-sub-container-left-card.expence-row").removeClass("active");

	$(".sections-main-sub-container-left-card.expence-row").each((index_,elem)=>{

		if($(elem).find('input[name="expenceId"]').val() == index){
			$(elem).addClass("active");
		}
	});

	removeLoadingAnimation($detailsSelectorExp, $headerInfo , $tabContentExp);
	
}

function saveExpence() {

	var href = location.href;

	$parent = $("#AddExpenceModal");
	var $expence_modal_type = $parent.find(".expence-modal-type").find(".employee-ck:checked").attr("data-val");
	var $expence_modal_period =  $expence_modal_type == "Occasional" ? "Annual" : $parent.find(".expence-modal-period").find(".employee-ck:checked").attr("data-val");
	var $expence_modal_for =$parent.find(".expence-modal-for").find(".employee-ck:checked").attr("data-val");
	var $expence_label = $parent.find('input[name="expence_label"]').val();
	var $expence_cost = $parent.find('input[name="expence_cost"]').val();
	var $expence_for_functionality = $parent.find('input[name="employee_functionality"]').attr("data-val");
	var $valid_form = true;
	var $ck_selected_count = 0;
	var $selected_employees = [];

	if (!$expence_label){
		$parent.find('input[name="expence_label"]').parent(".form-group").addClass("form-input-error");
		$valid_form =false;
	}
	else{
		$parent.find('input[name="expence_label"]').parent(".form-group").removeClass("form-input-error");
	}

	if($expence_modal_type == "Fix"){

		if($expence_modal_for == "Employees"){

			$parent.find(".expence-employes-ck").each((ind,elem)=>{
				
				if($(elem).is(":checked")){

					$ck_selected_count++;

					if($(elem).parents(".row-cost").find(".input-text").val() == ""){
						$(elem).parents(".row-cost").find(".input-text").addClass("form-input-error");
						$valid_form =false;
					}else{
						$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
						$selected_employees.push({
							"employee_id":$(elem).parents(".row-cost").find(".input-text").attr("data-employeeId"),
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),						
							"checked":$(elem).is(":checked")
						});
					}
					
				}else{
					$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
				}

			});

			if($ck_selected_count == 0 ){
				$(".modal.in .employees_list").css("background","var(--input--error-border--color)");
				$valid_form =false;
			}else{
				$(".modal.in .employees_list").css("background","var(--input-border--color)");
			}

		}else{
			if (!$expence_cost){
				$parent.find('input[name="expence_cost"]').parent(".form-group").addClass("form-input-error");
				$valid_form =false;
			}
			else{
				$parent.find('input[name="expence_cost"]').parent(".form-group").removeClass("form-input-error");
			}
		}
		
	}else{

		if($expence_modal_for == "Employees"){

			$parent.find(".expence-employes-ck").each((ind,elem)=>{
				
				if($(elem).is(":checked")){
					$ck_selected_count++;
					if($(elem).parents(".row-cost").find(".input-text").val() == ""){
						$(elem).parents(".row-cost").find(".input-text").addClass("form-input-error");
						//$valid_form =false;
						$selected_employees.push({
							"employee_id":$(elem).parents(".row-cost").find(".input-text").attr("data-employeeId"),
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),						
							"checked":$(elem).is(":checked")
						});
					}else{
						$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
						$selected_employees.push({
							"employee_id":$(elem).parents(".row-cost").find(".input-text").attr("data-employeeId"),
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),						
							"checked":$(elem).is(":checked")
						});
					}
					
				}else{
					$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
				}
				
			});

			if($ck_selected_count == 0 ){
				$(".modal.in .employees_list").css("background","var(--input--error-border--color)");
				$valid_form =false;
			}else{
				$(".modal.in .employees_list").css("background","var(--input-border--color)");
			}

		}
	}

	var $data = {
		"expence_label":$expence_label,
		"expence_image":$('#add_expence_image').attr("src"),
		"expence_type":$expence_modal_type,
		"expence_period":$expence_modal_period,
		"expence_for":$expence_modal_for,
		"expence_cost":$expence_cost,
		"employees_list":$selected_employees,
		"expence_for_functionality":$expence_for_functionality
	}

	console.log("data =>",$data);

	if($valid_form){

		startSpinner("#AddExpenceModal .sub-container-form-footer");

		$.ajax({
			type: 'post',
			url: '/Expenses/save',
			data: $data ,
			dataType: 'json'
		  })
		  .done(function(res){

			setTimeout(()=>{
				stopSpinner("#AddExpenceModal .sub-container-form-footer");
				$parent.find('input[name="expence_label"]').val("");
				$parent.find('input[name="expence_cost"]').val("");
				$("#AddExpenceModal").modal('hide');
				resetExtraInputs();
				if (href.includes("Expenses")) {
					getAllExpences();
				} else {
					getAllExpencesModal();
				}	
			},$spinningTime);
	
		});


	}else{
		console.log("Error :",$valid_form);
	}
	
}

function saveChange() {

	$parent = $("#EditExpenceModal");
	var $expence_modal_type = $parent.find(".expence-modal-type").find(".employee-ck:checked").attr("data-val");
	var $expence_modal_period = $parent.find(".expence-modal-period").find(".employee-ck:checked").attr("data-val");
	var $expence_modal_for =$parent.find(".expence-modal-for").find(".employee-ck:checked").attr("data-val");
	var $expence_label = $parent.find('input[name="expence_label"]').val();
	var $expence_cost = $parent.find('input[name="expence_cost"]').val();
	var $valid_form = true;
	var $ck_selected_count = 0;
	var $selected_employees = [];

	if (!$expence_label){
		$parent.find('input[name="expence_label"]').parent(".form-group").addClass("form-input-error");
		$valid_form =false;
	}
	else{
		$parent.find('input[name="expence_label"]').parent(".form-group").removeClass("form-input-error");
	}

	if($expence_modal_type == "Fix"){

		if($expence_modal_for == "Employees"){

			$parent.find(".cost-container .expence-employes-ck").each((ind,elem)=>{
				
				if($(elem).is(":checked")){

					$ck_selected_count++;

					if($(elem).parents(".row-cost").find(".input-text").val() == ""){
						$(elem).parents(".row-cost").find(".input-text").addClass("form-input-error");
						$valid_form =false;
					}else{
						$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
						$selected_employees.push({
							"employee_id":$(elem).attr("data-employeeId"),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"checked":$(elem).is(":checked")
						});
					}
					
				}else{

					if($(elem).attr("data-eecid") != -1){
						$selected_employees.push({
							"employee_id":$(elem).attr("data-employeeId"),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),							
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"checked":$(elem).is(":checked")
						});
					}

					$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
				}

			});

			if($ck_selected_count == 0 ){
				$(".modal.in .employees_list").css("background","var(--input--error-border--color)");
				$valid_form =false;
			}else{
				$(".modal.in .employees_list").css("background","var(--input-border--color)");
			}

		}else{
			if (!$expence_cost){
				$parent.find('input[name="expence_cost"]').parent(".form-group").addClass("form-input-error");
				$valid_form =false;
			}
			else{
				$parent.find('input[name="expence_cost"]').parent(".form-group").removeClass("form-input-error");
			}
		}
		
	}else{

		if($expence_modal_for == "Employees"){

			$parent.find(".cost-container .expence-employes-ck").each((ind,elem)=>{
				
				if($(elem).is(":checked")){
					$ck_selected_count++;

					if($(elem).parents(".row-cost").find(".input-text").val() == ""){
						$(elem).parents(".row-cost").find(".input-text").addClass("form-input-error");
						//$valid_form =false;
						$selected_employees.push({
							"employee_id":$(elem).parents(".row-cost").find(".input-text").attr("data-employeeId"),
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),						
							"checked":$(elem).is(":checked")
						});
					}else{
						$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
						$selected_employees.push({
							"employee_id":$(elem).attr("data-employeeId"),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),							
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"checked":$(elem).is(":checked")
						});
					}
					
				}else{

					if($(elem).attr("data-eecid") != -1){
						$selected_employees.push({
							"employee_id":$(elem).attr("data-employeeId"),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),							
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"checked":$(elem).is(":checked")
						});
					}

					$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
				}

			});

			if($ck_selected_count == 0 ){
				$(".modal.in .employees_list").css("background","var(--input--error-border--color)");
				$valid_form =false;
			}else{
				$(".modal.in .employees_list").css("background","var(--input-border--color)");
			}
		}
	}

	var $data = {
		"expence_label":$expence_label,
		"expence_image":$('#edit_expence_image').attr("src"),
		"expence_type":$expence_modal_type,
		"expence_period":$expence_modal_period,
		"expence_for":$expence_modal_for,
		"expence_cost":$expence_cost,
		"employees_list":$selected_employees,
		"expence_id":$currentExpence.Expence_ID
	}

	if($valid_form){

		startSpinner("#EditExpenceModal .sub-container-form-footer");

		$.ajax({
			type: 'post',
			url: '/Expenses/update',
			data: $data ,
			dataType: 'json'
		  })
		  .done(function(res){

			setTimeout(()=>{
				stopSpinner("#EditExpenceModal .sub-container-form-footer");
				$parent.find('input[name="expence_label"]').val("");
				$parent.find('input[name="expence_cost"]').val("");
				$parent.modal('hide');
				resetExtraInputs();
				getAllExpences($currentExpence.Expence_ID);
			},$spinningTime);

		});


	}else{
		console.log("Error :",$valid_form);
	}
	
}

function savePayment() {

	$parent = $("#ExpencesModal");
	var $expence_modal_type = $currentExpence.Expence_Type;
	var $expence_modal_period = $currentExpence.Expence_Periode;
	var $expence_modal_for = $currentExpence.Expence_For;
	var $expence_cost = $parent.find('input[name="expence_cost"]').val();
	var $valid_form = true;
	var $ck_selected_count = 0;
	var $selected_employees = [];
	var $paid_month =  [] ;
	var $data = {};

	if($expence_modal_type == "Fix"){

		if($expence_modal_for == "Employees"){

			$paid_month.push({
				"month_string" :$parent.find('input[name="expence_months_employes"]').attr("data-val"),
				"month_id": ($monthNames.indexOf(($parent.find('input[name="expence_months_employes"]').attr("data-val")))+1)
			});

			$parent.find(".cost-container .expence-employes-ck").each((ind,elem)=>{
				
				if($(elem).is(":checked")){

					$ck_selected_count++;

					if($(elem).parents(".row-cost").find(".input-text").val() == ""){
						$(elem).parents(".row-cost").find(".input-text").addClass("form-input-error");
						$valid_form =false;
					}else{
						$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
						$selected_employees.push({
							"employee_id":$(elem).attr("data-employeeId"),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"checked":$(elem).is(":checked")
						});
					}
					
				}else{

					if($(elem).attr("data-eecid") != -1){
						$selected_employees.push({
							"employee_id":$(elem).attr("data-employeeId"),
							"expence_id":$(elem).attr("data-expenceId"),
							"eec_id":$(elem).attr("data-eecid"),							
							"cost":$(elem).parents(".row-cost").find(".input-text").val(),
							"checked":$(elem).is(":checked")
						});
					}

					$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
				}

			});

			if($ck_selected_count == 0 ){
				$(".modal.in .employees_list").css("background","var(--input--error-border--color)");
				$valid_form =false;
			}else{
				$(".modal.in .employees_list").css("background","var(--input-border--color)");
			}

		}else{

			$parent.find(".expence-employess-months-container").fadeOut();

			if($expence_modal_period == "Monthly"){

				$parent.find('.payment-select').select2('data').map((month) =>{
					$paid_month.push({
						"month_string" : month.title,
						"month_id": month.id
					});
				});

				if($parent.find('.payment-select').select2('data').length == 0){
					$parent.find('.monthly-rows').addClass("form-input-error");
					$valid_form =false;
				}else{
					$parent.find('.monthly-rows').removeClass("form-input-error");
				}

			}else{

				$paid_month.push({
					"month_string" :$parent.find('input[name="expence_months_employes"]').attr("data-val"),
					"month_id": ($monthNames.indexOf(($parent.find('input[name="expence_months_employes"]').attr("data-val")))+1)
				});
				
			}

			if (!$expence_cost){
				$parent.find('input[name="expence_cost"]').parent(".form-group").addClass("form-input-error");
				$valid_form =false;
			}
			else{
				$parent.find('input[name="expence_cost"]').parent(".form-group").removeClass("form-input-error");
			}
		}
		
	}else{

			if($expence_modal_for == "Employees"){

				$paid_month.push({
					"month_string" :$parent.find('input[name="expence_months_employes"]').attr("data-val"),
					"month_id": ($monthNames.indexOf(($parent.find('input[name="expence_months_employes"]').attr("data-val")))+1)
				});

				$parent.find(".cost-container .expence-employes-ck").each((ind,elem)=>{
					
					if($(elem).is(":checked")){
						$ck_selected_count++;

						if($(elem).parents(".row-cost").find(".input-text").val() == ""){
							$(elem).parents(".row-cost").find(".input-text").addClass("form-input-error");
							//$valid_form =false;
							$selected_employees.push({
								"employee_id":$(elem).parents(".row-cost").find(".input-text").attr("data-employeeId"),
								"cost":$(elem).parents(".row-cost").find(".input-text").val(),
								"expence_id":$(elem).attr("data-expenceId"),
								"eec_id":$(elem).attr("data-eecid"),						
								"checked":$(elem).is(":checked")
							});
						}else{
							$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
							$selected_employees.push({
								"employee_id":$(elem).attr("data-employeeId"),
								"expence_id":$(elem).attr("data-expenceId"),
								"eec_id":$(elem).attr("data-eecid"),							
								"cost":$(elem).parents(".row-cost").find(".input-text").val(),
								"checked":$(elem).is(":checked")
							});
						}
						
					}else{

						if($(elem).attr("data-eecid") != -1){
							$selected_employees.push({
								"employee_id":$(elem).attr("data-employeeId"),
								"expence_id":$(elem).attr("data-expenceId"),
								"eec_id":$(elem).attr("data-eecid"),							
								"cost":$(elem).parents(".row-cost").find(".input-text").val(),
								"checked":$(elem).is(":checked")
							});
						}

						$(elem).parents(".row-cost").find(".input-text").removeClass("form-input-error");
					}

				});

				if($ck_selected_count == 0 ){
					$(".modal.in .employees_list").css("background","var(--input--error-border--color)");
					$valid_form =false;
				}else{
					$(".modal.in .employees_list").css("background","var(--input-border--color)");
				}

			}else{

				$parent.find(".expence-employess-months-container").fadeOut();

				if($expence_modal_period == "Monthly"){

					$parent.find('.payment-select').select2('data').map((month) =>{
						$paid_month.push({
							"month_string" : month.title,
							"month_id": month.id
						});
					});

					if($parent.find('.payment-select').select2('data').length == 0){
						$parent.find('.monthly-rows').addClass("form-input-error");
						$valid_form =false;
					}else{
						$parent.find('.monthly-rows').removeClass("form-input-error");
					}
				}else{

					$paid_month.push({
						"month_string" :$parent.find('input[name="expence_months_employes"]').attr("data-val"),
						"month_id": ($monthNames.indexOf(($parent.find('input[name="expence_months_employes"]').attr("data-val")))+1)
					});
				}



				if (!$expence_cost){
					$parent.find('input[name="expence_cost"]').parent(".form-group").addClass("form-input-error");
					$valid_form =false;
				}
				else{
					$parent.find('input[name="expence_cost"]').parent(".form-group").removeClass("form-input-error");
				}

			}

	}

	/***********************************************/

	$employeesFormErrors = 0 ;

	$parent.find(".expence-employes-ck").each((ind,elm)=>{
			
			if($(elm).is(":checked")){
				if($(elm).parents(".row-cost").find(".input-text").val() == ""){
					$(elm).parents(".row-cost").find(".input-text").addClass("form-input-error");
					$employeesFormErrors++;
					$(elm).parents(".row-cost").find(".input-text").prop("readonly", false); 
				}
			}
		
	});

	if($currentExpence.Expence_For == "Employees"){
		if($employeesFormErrors  > 0 ){
			$valid_form =false;
		}
	}

	/***********************************************/

	

	$data["expence_label"] = $currentExpence.Expence_Name;
	$data["expence_type"] = $expence_modal_type;
	$data["expence_period"] = $expence_modal_period;
	$data["expence_for"]=$expence_modal_for;
	$data["expence_cost"] = $expence_cost;
	$data["employees_list"] = $selected_employees;
	$data["expence_id"] = $currentExpence.Expence_ID;
	$data["paid_month"] = $paid_month;

	if($valid_form){

		console.log($data);

		startSpinner("#ExpencesModal .sub-container-form-footer");

		$.ajax({
			type: 'post',
			url: '/Expenses/executePayement',
			data: $data ,
			dataType: 'json'
		  })
		  .done(function(res){

			setTimeout(()=>{
				stopSpinner("#ExpencesModal .sub-container-form-footer");
				$parent.find('input[name="expence_label"]').val("");
				$parent.find('input[name="expence_cost"]').val("");
				$parent.find('.row-cost input[type="number"]').val(0);
				$parent.modal('hide');
				resetExtraInputs();
				getAllExpences($currentExpence.Expence_ID);
			},$spinningTime);

		});


	}else{
		console.log("Error :",$valid_form);
	}
	
}

function discardChange() {
 	$('#EditExpenceModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditExpenceModal .sub-container-form-footer').removeClass('show-footer');
 	$("#EditExpenceModal").modal('hide');
 	displayExpence(expenceId);
 }


/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-expence-edit",function(){
	$('#EditExpenceModal').modal('show');
	displayExpence($currentExpence.Expence_ID);
});	

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

	$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-expence-edit",function(){
		$('#EditExpenceModal').modal('show');
	});

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/


if (document.getElementById("search-input")){
	document.getElementById("search-input").addEventListener('input', function (evt) {
		filterExpences();
	});
}

function addAnimation(){
	$(".sections-main-sub-container-left-card-main-img-text").removeClass("hide-loading-helper");
	addLoadingAnimation($detailsSelectorExp,$headerInfo);
  	addSideBarLoadingAnimation($sideSelector);
}

function removeAnimation(){
	removeSideBarLoadingAnimation($sideSelector);		
	removeLoadingAnimation($detailsSelectorExp,$headerInfo);
}

/* Modal Checked option extra inputs visibility  __________________________*/



$(document).on("click","#showAddExpenceModalBtn",function(e){

	$initla_selected_input = ["Fix","Monthly","Institution"];

	resetExtraInputs();

});

/* Modal Checked option extra inputs visibility  __________________________*/

$(document).on("click",".modal.in .sections-label-checkbox-main-container",function(e){

	$parent = $(this).parents(".modal.in");

	$expence_modal_type = $parent.find(".expence-modal-type").find(".employee-ck:checked").attr("data-val");
	$expence_modal_period = $parent.find(".expence-modal-period").find(".employee-ck:checked").attr("data-val");
	$expence_modal_for =$parent.find(".expence-modal-for").find(".employee-ck:checked").attr("data-val");

	if( $parent.attr("id") == "ExpencesModal"){
		$expence_modal_type = $currentExpence.Expence_Type;
		$expence_modal_period = $currentExpence.Expence_Periode;
		$expence_modal_for =  $currentExpence.Expence_For;
	}
	
	if( $(this).parents().hasClass("expence-modal-type")){
		$expence_modal_type = $(this).attr("data-val");
	}

	if($(this).parents().hasClass("expence-modal-period")){
		$expence_modal_period = $(this).attr("data-val");
	}

	if($(this).parents().hasClass("expence-modal-for")){
		$expence_modal_for = $(this).attr("data-val");
	}

	if($expence_modal_type == "Occasional"){
		
		if($expence_modal_for == "Employees"){
			$parent.find(".expences-extra-input-employees").fadeIn();
			$parent.find(".expence-modal-period").fadeOut();
			if($parent.attr("id") != "ExpencesModal"){
				$parent.find(".expences-extra-input-employees tr th:last-child").fadeOut();
				$parent.find(".expences-extra-input-employees tr td:last-child").fadeOut();
			}
		}else{
			$parent.find(".expences-extra-input-cost").fadeOut();
			$parent.find(".expence-modal-period").fadeOut();
			$parent.find(".expences-extra-input-employees").fadeOut();
		}

	}else if($expence_modal_type == "Variable"){

		$parent.find(".expence-modal-period").fadeIn();
		$parent.find(".expences-extra-input-cost").fadeOut();

		if($expence_modal_for == "Employees"){
			$parent.find(".expences-extra-input-employees").fadeIn();
			if($parent.attr("id") != "ExpencesModal"){
				$parent.find(".expences-extra-input-employees tr th:last-child").fadeOut();
				$parent.find(".expences-extra-input-employees tr td:last-child").fadeOut();
			}
		}else{
			$parent.find(".expences-extra-input-employees").fadeOut();
		}

	}else{

		$parent.find(".expence-modal-period").fadeIn();

		if($expence_modal_for == "Employees"){
			$parent.find(".expences-extra-input-cost").fadeOut();
			$parent.find(".expences-extra-input-employees").fadeIn();
			$parent.find(".expences-extra-input-employees tr th:last-child").fadeIn();
			$parent.find(".expences-extra-input-employees tr td:last-child").fadeIn();
			
		}else{
			$parent.find(".expences-extra-input-cost").fadeIn();
			$parent.find(".expences-extra-input-employees").fadeOut();
		}
	}

});

/* Modal table Checkboxes all toggle __________________________*/

$(document).on("change",".modal.in th .expence-employes-ck",function(e){

	$(".modal.in .cost-container").find(".expence-employes-ck").each((ind,elm)=>{

		if($(elm).parents(".row-cost").find(".input-text").val() == ""){
			
			if(!$(elm).is(":checked")){
				$(elm).parents(".row-cost").find(".input-text").addClass("form-input-error");
				$(elm).parents(".row-cost").find(".input-text").prop("readonly", false); 
			}else{
				$(elm).parents(".row-cost").find(".input-text").removeClass("form-input-error");
				$(elm).parents(".row-cost").find(".input-text").prop("readonly", true); 
			}
			
		}else{
			$(elm).parents(".row-cost").find(".input-text").prop("readonly", false); 
			$(elm).parents(".row-cost").find(".input-text").removeClass("form-input-error");
		}

		$(elm).prop('checked',this.checked);
		
	});

	e.preventDefault();
	e.stopPropagation();

});

/* Modal table Checkboxes all toggle __________________________*/

$(document).on("keyup focus change",".modal.in .cost-container .input-text",function(e){

	if(!$(this).parents(".row-cost").find(".expence-employes-ck").is(":checked")){
		$(this).parents(".row-cost").find(".input-text").prop("readonly", true);
	}else{
		$(this).parents(".row-cost").find(".input-text").prop("readonly", false);
	}

	if($(this).val() == "" && $(this).parents(".row-cost").find(".expence-employes-ck").is(":checked")){
		$(this).addClass("form-input-error");
	}else{
		$(this).removeClass("form-input-error");
	}

});

/* Modal table rows Checkboxes toggle header checkbox __________________________*/
$(document).on("change",".modal.in .cost-container .expence-employes-ck",function(e){
	
	$ck_count = ($(".modal.in .cost-container").find(".expence-employes-ck").length);
	$ck_selected_count = ($(".modal.in .cost-container").find(".expence-employes-ck:checked").length);
	
	$(".modal.in .cost-container").find(".expence-employes-ck").each((ind,elm)=>{
		if($(elm).parents(".row-cost").find(".input-text").val() == "" && $(elm).is(":checked") ){
			$(elm).parents(".row-cost").find(".input-text").addClass("form-input-error");
			$(elm).parents(".row-cost").find(".input-text").prop("readonly", false); 
		}else{
			$(elm).parents(".row-cost").find(".input-text").removeClass("form-input-error");
			$(elm).parents(".row-cost").find(".input-text").prop("readonly", true); 
		}
	})

	if($ck_count == $ck_selected_count  ){
		$(".modal.in th .expence-employes-ck").prop('checked',true);
	}else{
		$(".modal.in th .expence-employes-ck").prop('checked',false);
	}

});

/* resetExtraInputs __________________________*/

function resetExtraInputs(){
	$(".sections-label-checkbox-main-container").each((ind,elm)=>{
		if($initla_selected_input.includes($(elm).attr("data-val"))){
			$(elm).find(".employee-ck").trigger("click");
		}
	});
}

/* employees execute payement modal table rows __________________________*/

function employeesExecutePayementModalTableRows(employee,expence,selected,type){

	  var User_Name = JSON.parse(employee.employee.User_Name);

	  var User_Full_Name = User_Name.first_name+" "+User_Name.last_name;

		return `<tr class="row-cost ${employee.employee.User_Paid_Status == 1 ? 'row-cost-disabled' : '' } ">
					<td data-label="Employee" class="expense_label"> 
					<!-- sections-main-sub-container-left-cards --> 
						<div class="sections-label-checkbox-main-container sections-label-checkbox-container-left container-background-style"      
							data-val="Employees">
							<div class="sections-label-checkbox-container ">
							<div class="sections-main-sub-container-left-card"> 
								<img class="sections-main-sub-container-left-card-main-img" src="${employee.employee.User_Image}" alt="card-img"/>
								<div class="sections-main-sub-container-left-card-info"> 
									<p class="sections-main-sub-container-left-card-main-info">${User_Full_Name}</p> 
									<span class="sections-main-sub-container-left-card-sub-info">${employee.employee.User_Role}</span> 
									${employee.employee.User_Paid_Status == 1 ?
									`<span class="sections-main-sub-container-left-card-sub-sub-info green-color" >Paid</span>`
									:
									''
									}
								</div> 
							</div> 
							</div>
							<div class="customCheck">

							${employee.employee.User_Paid_Status == 1 ?

								`<img src="/assets/icons/gray_check.svg" />`
								:

								`<input type="checkbox" value=""
										data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
										data-employeeId="${employee.employee.User_ID}" 
										data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
										${ selected ?  'checked' : '' }
										data-val="Employees" class="expence-employes-ck" name="checkbox" id="" />
								<label for="ck"></label>`
								}
							</div>
						</div>
					<!-- End sections-main-sub-container-left-cards --> 
					</td> 
					<td data-label="Cost"> 
						${employee.employee.User_Paid_Status == 1 ?
							`<span>${employee.employee.User_Salary}</span>`
							:
							`<div class="form-group group dynamic-form-input-text-container-icon"> 
							<input  type="number" data-gradid="null" 
										data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
										data-employeeId="${employee.employee.User_ID}" 
										data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
										${ selected ?  'checked' : '' }
										name="" 
										value="${ type == "Edit" ? employee.employee.User_Salary : ""}"
										class="input-text"
										placeholder="${arrLang[$lang]["Add_Cost"]}" data-lang="Add_Cost" style="opacity: 1;"> 
							</div>`
						}

					</td> 
			</tr>`;

}

/* employees modal table rows __________________________*/

function employeesModalTableRows(employee,expence,selected,type){

	var User_Name = JSON.parse(employee.employee.User_Name);

	var User_Full_Name = User_Name.first_name+" "+User_Name.last_name ;

	if(type == "Edit" ){

		if(expence.Expence_For_Functionalities != "" && expence.Expence_For_Functionalities != "All" ){

			if(String(employee.employee.User_Role).toLowerCase() == String(expence.Expence_For_Functionalities).toLowerCase() ){

				return `<tr class="row-cost">
						<td data-label="Employee" class="expense_label"> 
						<!-- sections-main-sub-container-left-cards --> 
							<div class="sections-label-checkbox-main-container sections-label-checkbox-container-left container-background-style"      
								data-val="Employees">
								<div class="sections-label-checkbox-container ">
								<div class="sections-main-sub-container-left-card"> 
									<img class="sections-main-sub-container-left-card-main-img" src="${employee.employee.User_Image}" alt="card-img"/>
									<div class="sections-main-sub-container-left-card-info"> 
									<p class="sections-main-sub-container-left-card-main-info">${User_Full_Name}</p> 
									<span class="sections-main-sub-container-left-card-sub-info">${employee.employee.User_Role}</span> 
									</div> 
								</div> 
								</div>
								<div class="customCheck">
								<input type="checkbox" value=""
										data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
										data-employeeId="${employee.employee.User_ID}" 
										data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
										${ selected ?  'checked' : '' }
										data-val="Employees" class="expence-employes-ck" name="checkbox" id="" />
								<label for="ck"></label>
								</div>
							</div>
						<!-- End sections-main-sub-container-left-cards --> 
						</td> 
						<td data-label="Cost"> 
							<div class="form-group group dynamic-form-input-text-container-icon"> 
							<input  type="number" data-gradid="null" 
										data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
										data-employeeId="${employee.employee.User_ID}" 
										data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
										${ selected ?  'checked' : '' }
										name="" 
										value="${ type == "Edit" ? employee.employee.User_Salary : ""}"
										class="input-text"
										placeholder="${arrLang[$lang]["Add_Cost"]}" data-lang="Add_Cost" style="opacity: 1;"> 
							</div> 
						</td> 
					</tr>`;
			}

		}else{

			return `<tr class="row-cost">
					<td data-label="Employee" class="expense_label"> 
					<!-- sections-main-sub-container-left-cards --> 
						<div class="sections-label-checkbox-main-container sections-label-checkbox-container-left container-background-style"      
							data-val="Employees">
							<div class="sections-label-checkbox-container ">
							<div class="sections-main-sub-container-left-card"> 
								<img class="sections-main-sub-container-left-card-main-img" src="${employee.employee.User_Image}" alt="card-img"/>
								<div class="sections-main-sub-container-left-card-info"> 
								<p class="sections-main-sub-container-left-card-main-info">${User_Full_Name}</p> 
								<span class="sections-main-sub-container-left-card-sub-info">${employee.employee.User_Role}</span> 
								</div> 
							</div> 
							</div>
							<div class="customCheck">
							<input type="checkbox" value=""
									data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
									data-employeeId="${employee.employee.User_ID}" 
									data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
									${ selected ?  'checked' : '' }
									data-val="Employees" class="expence-employes-ck" name="checkbox" id="" />
							<label for="ck"></label>
							</div>
						</div>
					<!-- End sections-main-sub-container-left-cards --> 
					</td> 
					<td data-label="Cost"> 
						<div class="form-group group dynamic-form-input-text-container-icon"> 
						<input  type="number" data-gradid="null" 
									data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
									data-employeeId="${employee.employee.User_ID}" 
									data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
									${ selected ?  'checked' : '' }
									name="" 
									value="${ type == "Edit" ? employee.employee.User_Salary : ""}"
									class="input-text"
									placeholder="${arrLang[$lang]["Add_Cost"]}" data-lang="Add_Cost" style="opacity: 1;"> 
						</div> 
					</td> 
				</tr>`;

		}

	}else{
				
			return `<tr class="row-cost">
			<td data-label="Employee" class="expense_label"> 
				<!-- sections-main-sub-container-left-cards --> 
				<div class="sections-label-checkbox-main-container sections-label-checkbox-container-left container-background-style"      
					data-val="Employees">
					<div class="sections-label-checkbox-container ">
						<div class="sections-main-sub-container-left-card"> 
						<img class="sections-main-sub-container-left-card-main-img" src="${employee.employee.User_Image}" alt="card-img"/>
						<div class="sections-main-sub-container-left-card-info"> 
							<p class="sections-main-sub-container-left-card-main-info">${User_Full_Name}</p> 
							<span class="sections-main-sub-container-left-card-sub-info">${employee.employee.User_Role}</span> 
						</div> 
						</div> 
					</div>
					<div class="customCheck">
						<input type="checkbox" value=""
								data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
								data-employeeId="${employee.employee.User_ID}" 
							data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
								${ selected ?  'checked' : '' }
								data-val="Employees" class="expence-employes-ck" name="checkbox" id="" />
						<label for="ck"></label>
					</div>
				</div>
				<!-- End sections-main-sub-container-left-cards --> 
			</td> 
			<td data-label="Cost"> 
				<div class="form-group group dynamic-form-input-text-container-icon"> 
					<input  type="number" data-gradid="null" 
							data-expenceId= ${ type == "Edit" ? '"'+expence.Expence_ID+'"' : "-1" }
							data-employeeId="${employee.employee.User_ID}" 
							data-eecId= ${ type == "Edit" ? '"'+employee.employee.User_Salary_EEC_ID+'"' : "-1" }
							${ selected ?  'checked' : '' }
								name="" 
							value="${ type == "Edit" ? employee.employee.User_Salary : ""}"
							class="input-text"
								placeholder="${arrLang[$lang]["Add_Cost"]}" data-lang="Add_Cost" style="opacity: 1;"> 
				</div> 
			</td> 
			</tr>`;
	}
	 
}

/* sidebar expences rows __________________________*/
function sidebarExpencesRows (expence , active ){

	  $totalCost = 0;
	  $row =``;

	  if(expence.Expence_For == "Employees"){

		$cost = 0 ;
		expence.Employees.map((employee) => { $cost += (employee.employee.User_Salary * 1) });
		$totalCost = expence.Employees.length > 0 ? $cost : 0;

	  }else{
		if(expence.Institution.length > 0){
			if(expence.Institution[0].IEC_Cost != "" ){
				$totalCost =  expence.Institution[0].IEC_Cost ;
			}else{
				$totalCost = 0 ;
			}
		}
	  }
	  	
	  $row +=`<div class="sections-main-sub-container-left-card expence-row ${active? 'active' : '' }">`;

	if(expence.Expence_Image == "assets/icons/Logo_placeholder.svg" || expence.Expence_Image == "") {
		$row +=`<div class="sections-main-sub-container-left-card-main-img-text" data-style="background: ${expence.Expence_Color};">${String(expence.Expence_Name).substr(0,2)}</div>`;
	}else{
		$row +=`<img class="sections-main-sub-container-left-card-main-img" src="${expence.Expence_Image}" alt="card-img">
				<div class="sections-main-sub-container-left-card-main-img-text" data-style="background: #ececf5;"></div>
			`;
	}

	$row +=`<input name="expenceId" type="hidden" value="${expence.Expence_ID}"> 
	 		<div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">${expence.Expence_Name}</p>`;

			if(expence.Expence_For == "Employees"){

				if(expence.Expence_Periode == "Monthly"){

					unpaidCount = 0 ;
					expence.Employees.map((emp)=>{
						emp.employee.Expence_Payement.map((unPaidEmp)=>{
							if(unPaidEmp.Expence_Paid_Status == 0 ){
								unpaidCount++;
							}
						});
					});

					if(unpaidCount == 0 ){
						$row +=`<span class="sections-main-sub-container-left-card-sub-info green-color" data-lang="${arrLang[$lang]["Paid"]}">${arrLang[$lang]["Paid"]}</span>`;
					}else{
						$row +=`<span class="sections-main-sub-container-left-card-sub-info red-color" data-lang="${arrLang[$lang]["Unpaid"]}">${arrLang[$lang]["Unpaid"]}</span>`;
					}

				}else{

					var paidEmployees = expence.Employees.filter((emp)=>{
						return emp.employee.Expence_Payement.Expence_Paid_Status == 1;
					});

					if( paidEmployees.length >= expence.Employees.length){
						$row +=`<span class="sections-main-sub-container-left-card-sub-info green-color" data-lang="${arrLang[$lang]["Paid"]}">${arrLang[$lang]["Paid"]}</span>`;
					}else{
						$row +=`<span class="sections-main-sub-container-left-card-sub-info red-color" data-lang="${arrLang[$lang]["Unpaid"]}">${arrLang[$lang]["Unpaid"]}</span>`;
					}
				}
			}else{

				if(expence.Expence_Periode == "Annual" ){
					if(expence.Institution[0].Expence_Payement.Expence_Paid_Status == 1 ){
						$row +=`<span class="sections-main-sub-container-left-card-sub-info green-color" data-lang="${arrLang[$lang]["Paid"]}">${arrLang[$lang]["Paid"]}</span>`;
					}else{
						$row +=`<span class="sections-main-sub-container-left-card-sub-info red-color" data-lang="${arrLang[$lang]["Unpaid"]}">${arrLang[$lang]["Unpaid"]}</span>`;
					}
				}else{

						if(expence.Institution.length > 0){

							$fixCost = expence.Institution[0].IEC_Cost;

							$totalCost = 0;
							$paidInstitution = 0;
			
							expence.Institution[0].Expence_Payement.map((Inst)=>{
								if(Inst.Expence_Paid_Status == 0 ){
									$paidInstitution++;
								}
							});
			
							expence.Institution[0].Expence_Payement.map((Inst)=>{
								if(Inst.PE_Ammount){
									$totalCost += (Inst.PE_Ammount*1);
								}else{
									$totalCost += (expence.Institution[0].IEC_Cost*1);
								}
							});
			
							if( $paidInstitution == 0 ){
								$row +=`<span class="sections-main-sub-container-left-card-sub-info green-color" data-lang="${arrLang[$lang]["Paid"]}">${arrLang[$lang]["Paid"]}</span>`;
							}else{
								$row +=`<span class="sections-main-sub-container-left-card-sub-info red-color" data-lang="${arrLang[$lang]["Unpaid"]}">${arrLang[$lang]["Unpaid"]}</span>`;
							}
			
						}
				}

			}
				   
			$row+=`</div> 
			 </div>`;

	return $row;

}

/* main Section Extra Info Rows__________________________*/
function mainSectionExtraInfoRows (expence,totalCost){
	$paid = true;
	switch(expence.Expence_For){
		case "Employees":
		{
			if(expence.Expence_Periode == "Monthly"){

				$row =` <div class="sections-main-sub-container-right-main-label-divider sections-main-sub-container-right-main-label-divider-extra-style">
							<p data-lang="${arrLang[$lang][expence.Expence_For]}" placeholder="Frais annuelles" style="opacity: 1;">${arrLang[$lang][expence.Expence_For]}</p>
						</div>`;
		
				$row +=`<div id="Finance" class="tab-pane fade sections-main-sub-container-right-main-body active in">
				<div class="row sections-main-sub-container-right-main-rows">
				<div class="col-xs-12">
					<table>
					<thead>
					<tr class="list-months">
						<th class="col-extra-style" scope="col" data-lang="Employees" placeholder="Frais" style="opacity: 1;">${arrLang[$lang]["Employees"]}</th>`;
						$monthsRangeList.map((month)=>{
							$row +=`<th scope="col" class="col-text-align month-row" data-lang="${String(arrLang[$lang][month]).slice(0,3)}" style="opacity: 1;">${String(arrLang[$lang][month]).slice(0,3)}</th>`;
						})
					$row +=`</tr>
					</thead>
			
					<tbody class="list-expenses">`;

						expence.Employees.map((employee)=>{

							$employee = employee.employee;
					
							var User_Name = JSON.parse($employee.User_Name);
		
							var User_Full_Name = User_Name.first_name+" "+User_Name.last_name ;

							$row +=`<tr class="row-payment" data-val="">

							<td data-label="" class="td-label"> 
								<span class="expense_label"> 
									<div class=" sections-main-sub-container-left-card">
										<img class="sections-main-sub-container-left-card-main-img" src="${$employee.User_Image}" alt="card-img">
										<span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper hide-loading-helper"></span>
										<input name="employeeId" type="hidden" value="${$employee.Employe_ID}"> 
										<div class="sections-main-sub-container-left-card-info">
											<p class="sections-main-sub-container-left-card-main-info">${User_Full_Name}</p>
											<span class="sections-main-sub-container-left-card-sub-info">${$employee.User_Role}</span>
										</div>
									</div>
								</span> 
							</td>`;

							$employee.Expence_Payement.map((paid_expence)=>{

								$row +=`<td scope="col" class="row-finance col-text-align col-text-align-extra-style col-text-align-extra-style-center">

								${
									paid_expence.Expence_Paid_Status == 1 ? 
										`<img src="assets/icons/check_green.svg" class="action-img" alt="states" data-payment="paid" data-exist="true" data-type="monthly" 
											  data-expense="${expence.Expence_ID}"
											  data-obj={"Amount":"${paid_expence.PE_Ammount}","Status":"Paid","BoolStatus":"1","Date":"${dateConverter(paid_expence.PE_Addeddate)}","Expence_Type":"${expence.Expence_Type}"}/>`
									:

										`<img src="assets/icons/check_red.svg" class="action-img" alt="states" data-payment="paid" data-exist="true" data-type="monthly" 
										data-expense="${expence.Expence_ID}"
										data-obj={"Amount":"${($employee.EEC_Cost*1)}","Status":"Unpaid","BoolStatus":"0","Expence_Type":"${expence.Expence_Type}"}/>`
										
								}

								</td>`;

							});

							$row +=`</tr>`;

						});


					$row +=`</tbody>
					</table>

					</div>
					</div>
					<!-- End sub-container-form-footer-container -->
				</div>`;

				return $row;

			}else{
				
				$row =` <div class="sections-main-sub-container-right-main-label-divider sections-main-sub-container-right-main-label-divider-extra-style">
							<p data-lang="${arrLang[$lang][expence.Expence_For]}" placeholder="Frais annuelles" style="opacity: 1;">${arrLang[$lang][expence.Expence_For]}</p>
						</div>`;
		
				$row +=`<div id="Finance" class="tab-pane fade sections-main-sub-container-right-main-body sections-main-sub-container-right-main-body-extra active in">
				<div class="row sections-main-sub-container-right-main-rows">
				<div class="col-xs-12">
					<table>

					<tbody class="list-expenses">`;

					expence.Employees.map((employee) =>{

						$employee = employee.employee;
						
						var User_Name = JSON.parse($employee.User_Name);

						var User_Full_Name = User_Name.first_name+" "+User_Name.last_name ;

						$row +=`<tr class="row-payment" > 

						<td data-label="" class="td-label"> 
							<span class="expense_label"> 
								<div class=" sections-main-sub-container-left-card">
									<img class="sections-main-sub-container-left-card-main-img" src="${$employee.User_Image}" alt="card-img">
									<span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper hide-loading-helper"></span>
									<input name="employeeId" type="hidden" value=""> 
									<div class="sections-main-sub-container-left-card-info">
										<p class="sections-main-sub-container-left-card-main-info">${User_Full_Name}</p>
										<span class="sections-main-sub-container-left-card-sub-info">${$employee.User_Role}</span>
									</div>
								</div>
							</span> 
						</td> 

						<td data-label="" class="td-label "> 
							<span class="expense_label"> 
								<div class=" sections-main-sub-container-left-card">
									<div class="sections-main-sub-container-left-card-info">
										<p class="sections-main-sub-container-left-card-main-info">
											${ $employee.Expence_Payement.Expence_Paid_Status == 1 ? 
													
													`<span> ${$employee.Expence_Payement.PE_Ammount } <span class="currency">Dhs</span> </span>`
												:
													'-' 
											}
										</p>
										<span class="sections-main-sub-container-left-card-sub-info">
											${ $employee.Expence_Payement.Expence_Paid_Status == 1 ? 
												`<span>
													${arrLang[$lang]["Paid_on"]} :
													${String(dateConverter($employee.Expence_Payement.PE_Addeddate)).replace(/-/g,'/')}
												</span>`
												
											:
												` - `
											}
										</span>
									</div>
								</div>
							</span> 
						</td> 

						<td data-id="27-November" scope="col" class="row-payment col-text-align ">
							${ $employee.Expence_Payement.Expence_Paid_Status == 1 ?  
									'<img src="assets/icons/green_check.svg" class="action-img" alt="states">' 
								:
									'<img src="assets/icons/red_check.svg" class="action-img" alt="states">' 
							}
						</td>

					</tr>`;

					});

					$row +=`</tbody>

				</table>

				</div>
				</div>
				<!-- End sub-container-form-footer-container -->
				</div>`;


				return $row;
			}
		}
		default :
		{
			if(expence.Expence_Periode == "Monthly"){

				$row =` <div class="sections-main-sub-container-right-main-label-divider sections-main-sub-container-right-main-label-divider-extra-style">
							<p data-lang="${arrLang[$lang][expence.Expence_For]}" placeholder="Frais annuelles" style="opacity: 1;">${arrLang[$lang][expence.Expence_For]}</p>
						</div>`;

				$row +=`<div id="Finance" class="tab-pane fade sections-main-sub-container-right-main-body sections-main-sub-container-right-main-body-extra-padding active in">
						<div class="row sections-main-sub-container-right-main-rows">
						<div class="col-xs-12">
						<table>
							<thead>
								<tr class="list-months">

									<th scope="col" class="col-extra-style" data-lang="Expence" style="opacity: 1;">Expence</th>`;

									$monthsRangeList.map((month)=>{
										$row +=`<th scope="col" class="col-text-align month-row" data-lang="${String(arrLang[$lang][month]).slice(0,3)}" style="opacity: 1;">${String(arrLang[$lang][month]).slice(0,3)}</th>`
									})
								$row +=`</tr>
							</thead>`;
			
				$row +=`<tbody class="list-expenses">`;

				$row +=`<tr class="row-payment" data-val="">`;

				$row +=`<td data-label="" class="td-label"> 
					<span class="expense_label"> 
						<div class=" sections-main-sub-container-left-card">`;
						if(expence.Expence_Image == "assets/icons/Logo_placeholder.svg" || expence.Expence_Image == "") {
							$row +=`<div class="input-img-container input-img-text-container  input-rounded-img-container input-rounded-img-container-extra-style exam_img" style="background-color: ${expence.Expence_Color};">${String(expence.Expence_Name).substr(0,2)}</div>`;
						}else{
							$row +=`<img class="sections-main-sub-container-left-card-main-img" src="${expence.Expence_Image}" alt="card-img">`;
						}
				$row +=`<span class="sections-main-sub-container-left-card-main-img-text loading-bg-helper hide-loading-helper"></span>
							<input name="employeeId" type="hidden" value=""> 
							<div class="sections-main-sub-container-left-card-info">
								<p class="sections-main-sub-container-left-card-main-info">${expence.Expence_Name}</p>
							</div>
						</div>
					</span> 
				</td> `;

				/*$row +=`<td class="row-payment" data-val="">

						<span class="expense_label"> 
						<div class=" sections-main-sub-container-left-card">`;
						if(expence.Expence_Image == "assets/icons/Logo_placeholder.svg" || expence.Expence_Image == "") {
							$row +=`<div class="input-img-container input-img-text-container  input-rounded-img-container input-rounded-img-container-extra-style exam_img" style="background-color: ${expence.Expence_Color};">${String(expence.Expence_Name).substr(0,2)}</div>`;
						}else{
							$row +=`<img class="sections-main-sub-container-left-card-main-img" src="${expence.Expence_Image}" alt="card-img">`;
						}

						$row +=`<div class="sections-main-sub-container-left-card-info">
										<p class="sections-main-sub-container-left-card-main-info">${expence.Expence_Name}</p>
									</div>
								</div>
						</span> `;

				$row +=`</td>`;*/

				expence.Institution[0].Expence_Payement.map((paid_expence) => {
					$row +=`<td data-id="${paid_expence.PE_ID}" scope="col" class="row-payment col-text-align" >
								${
									paid_expence.Expence_Paid_Status == 1 ? 
										`<img src="assets/icons/check_green.svg" class="action-img" alt="states"  data-expense="${expence.Expence_ID}"
										data-obj={"Amount":"${paid_expence.PE_Ammount}","Status":"Paid","BoolStatus":"1","Date":"${dateConverter(paid_expence.PE_Addeddate)}","Expence_Type":"${expence.Expence_Type}"}/>`
									:
										`<img src="assets/icons/check_red.svg" class="action-img" alt="states" data-expense="${expence.Institution[0].Expence_ID}"
										data-obj={"Amount":"${expence.Institution[0].IEC_Cost}","Status":"Unpaid","BoolStatus":"0","Expence_Type":"${expence.Expence_Type}"}/>`
								}
							</td>`
				});

				$row +=`</tr>`;

				$row +=`</tbody>
						</table>
						</div>
						</div>
						<!-- End sub-container-form-footer-container -->
						</div>`;

			}else{

				$row =` <div class="sections-main-sub-container-right-main-label-divider sections-main-sub-container-right-main-label-divider-extra-style">
							<p data-lang="${arrLang[$lang][expence.Expence_For]}" placeholder="Frais annuelles" style="opacity: 1;">${arrLang[$lang][expence.Expence_For]}</p>
						</div>`;

				$row +=`<div data-val="Insurance fees" class="month-row sections-main-sub-container-right-main-result 
							sections-main-sub-container-right-main-result-extra-style">
							<span class="sections-main-sub-container-right-main-result-label sections-main-sub-container-right-main-result-label-extra-info"> 
								<span class="expense_label">${expence.Expence_Name}</span>
								${  expence.Institution[0].Expence_Payement.Expence_Paid_Status == 1 ?
									`<span class="expense_label_method">${totalCost} <span class="currency">Dhs</span> </span>`
									:
									`<span class="expense_label_method"> </span>`
								}
								
							</span>
							
							<span class="sections-main-sub-container-right-main-result-value img-yearly">
								<img src=${ expence.Institution[0].Expence_Payement.Expence_Paid_Status == 1 ? 
									 "assets/icons/green_check.svg"  
									 :
									 "assets/icons/red_check.svg"  
								}
								class="action-img" alt="states">
							</span>
						</div>`;
	
				$row += `<div> 
							${ expence.Institution[0].Expence_Payement.Expence_Paid_Status == 1 ? 
								`<span class="sections-main-sub-container-right-main-result-value-executed-date">${arrLang[$lang]["Paid_on"]} : ${String(dateConverter(expence.Institution[0].Expence_Payement.PE_Addeddate)).replace(/-/g,'/')} </span>` 
							:
								`<span></span>`
						    } 
						</div>`;
			}

			return $row;

		}
	}
}


/* .finance-page-extra-style .col-text-align img _______________________*/

	$(document).on("mouseenter","#expences_info .col-text-align img",function(e){

		$this = $(this);

		if (!$this.attr('data-obj')) {
			return false;	
		}

		$obj = JSON.parse($(this).data("obj").replace(/\\|\//g,''));

		$(".custmized-tooltip").css({
			display:"inline-block"
		});

		$(".custmized-tooltip-container-cost").addClass('visibility');

		$(".custmized-tooltip-amount-value").text($obj.Amount);
		$(".custmized-tooltip-status-value").text(arrLang[$lang][$obj.Status]);

		if($obj.BoolStatus == "1"){
			$(".custmized-tooltip-container-cost").removeClass('visibility');
			$(".custmized-tooltip-status-value").addClass("custmized-tooltip-value-color-green");
			$(".custmized-tooltip-status-value").removeClass("custmized-tooltip-value-color-red");
			$(".custmized-tooltip-container-date").removeClass('visibility');
			$(".custmized-tooltip-date-value").text(String($obj.Date).replace(/-/g,'/'));
		}else{
			if($obj.Expence_Type != "Fix"){
				$(".custmized-tooltip-container-cost").addClass('visibility');
			}else{
				$(".custmized-tooltip-container-cost").removeClass('visibility');
			}
			$(".custmized-tooltip-status-value").removeClass("custmized-tooltip-value-color-green");
			$(".custmized-tooltip-status-value").addClass("custmized-tooltip-value-color-red");
			$(".custmized-tooltip-container-date").addClass('visibility');
		}

		

		setTimeout(function(){

			// left : - 133.5
			// top - 150 

			offset_ = 0.5;

			if($(".custmized-tooltip").outerWidth() <= 160 ){
				offset_ = 25;
			}else if($(".custmized-tooltip").outerWidth() <= 190 ){
				offset_ = 12;
			}

			$(".custmized-tooltip").css({
				opacity:1,
				left:(35+$this.offset().left - 133 + offset_  )+"px",
				top:($this.offset().top + 35 )+"px"
			});


		},5);

		setTimeout(function(){

			// left : - 133.5
			// top - 150 

			offset_ = 0.5;

			if($(".custmized-tooltip").outerWidth() <= 160 ){
				offset_ = 25;
			}else if($(".custmized-tooltip").outerWidth() <= 190 ){
				offset_ = 12;
			}

			$(".custmized-tooltip").css({
				opacity:1,
				left:(35+$this.offset().left - 133 + offset_  )+"px",
				top:($this.offset().top + 35 )+"px"
			});


		},25);


});

/* #expences_info .col-text-align img ______________________________________*/

$(document).on("mouseleave","#expences_info .col-text-align img",function(e){
	$(".custmized-tooltip").css({
		display:"none",
		opacity:0
	});
});

/* executePayment _________________________________________________________*/

$(document).on("keyup blur",".form-group-modal-search-filter .input-text-dropdown-search",function(e){

	$(".row-cost").addClass("visibility");

	parent = $(this).attr("data-parent");

	if($(this).val().length == 0 ){

		$(this).siblings(".icon").attr("src","/assets/icons/sidebar_icons/search.svg");
		$(this).siblings(".icon").removeClass("input-text-empty");
		$(".row-cost").removeClass("visibility");

	}else{

		$(this).siblings(".icon").attr("src","/assets/icons/sidebar_icons/close.svg");
		$(this).siblings(".icon").addClass("input-text-empty");

		$(`#${parent} .row-cost`).each((ind,elm)=>{

			full_name = String($(elm).find(".sections-main-sub-container-left-card-main-info").html()).toLowerCase().replace(" ","");
			if(full_name.includes(String($(this).val()).toLowerCase().replace(" ",""))){
				$(elm).removeClass("visibility");
			}

		});
	}

});

/* .form-group-modal-search-filter .input-text-empty _________________________________________________________*/


$(document).on("click",".form-group-modal-search-filter .input-text-empty",function(e){
	$(".row-cost").removeClass("visibility");
});

/* #ExpencesModal #expence_months_list _________________________________________________________*/

$(document).on("click","#ExpencesModal #expence_months_list li",function(e){
	employeeByMonth($(this).attr("data-val"));
});

/* executePayment _________________________________________________________*/

function executePayment() {

	$('#ExpencesModal').find('.row-cost').remove();
	$('#ExpencesModal').find('.monthly-rows').remove();
	$('#ExpencesModal').find('.yearly-rows').remove();
	$('#ExpencesModal').find('.monthly').addClass('hidden');
	$('#ExpencesModal').find('.expence-employes-container').addClass('hidden');
	$('#ExpencesModal').find('.expence-date-container').removeClass('col-md-12').addClass("col-md-6");
	$('#ExpencesModal').find('.expence-cost-container').addClass('hidden');
	$('#ExpencesModal').find('.expence-date-container').addClass('hidden');
	$("#ExpencesModal .expences-extra-input-employees").css("cssText","display : none !important");

	$('#ExpencesModal').find('input[name="expence_label"]').val($currentExpence.Expence_Name).css("cursor-pointers","none");
	if($currentExpence.Expence_For_Functionalities == "" || $currentExpence.Expence_For_Functionalities == "All"){
		$("#ExpencesModal").find('input[name="employee_functionality"]').val(arrLang[$lang]["All"]);
	}else{
		$("#ExpencesModal").find('input[name="employee_functionality"]').val($currentExpence.Expence_For_Functionalities);
	}

	$("#expence_months_list").html("");

	$monthsRangeList.map((month) =>{
		$selected = ''
		if($currentMonth  == month ){
			$selected = 'selected'
		}
		$("#expence_months_list").append(`<li ${$selected} data-monthId="${month}" data-val="${month}" >${arrLang[$lang][month]}</li>`);
		$('#ExpencesModal input[name="expence_months_employes"]').val(arrLang[$lang][$currentMonth]);
		$('#ExpencesModal input[name="expence_months_employes"]').attr("data-val",$currentMonth);
	});

    if($currentExpence.Expence_Periode == "Monthly"){

		if($currentExpence.Expence_For == "Employees"){

			$('#ExpencesModal').find('.expence-employes-container').removeClass('hidden');
			$('#ExpencesModal').find('.row-cost').remove();
			$('#ExpencesModal').find('.expence-date-container').removeClass('col-md-6').addClass("col-md-12");
			$('#ExpencesModal').find('.expence-date-container').removeClass('hidden');

			/* Employees By Month **********************************/

				$dynamicModalTableRows ='';

				$employeesProv = $employees ;
		
				$employeesProv.map((employee) =>{

					$selected = false;
					employee.employee.User_Salary = "" ;
					employee.employee.User_Salary_EEC_ID = -1 ;
					employee.employee.User_Paid_Status = 0 ;
		
					if($currentExpence.Employees.length > 0){

						$currentExpence.Employees.map((emp) => {

							if(emp.employee.Employe_ID == employee.employee.User_ID  ){
								$selected = true;
								employee.employee.User_Salary = emp.employee.User_Salary ;
								employee.employee.User_Salary_EEC_ID = emp.employee.User_Salary_EEC_ID ;
								for(e = 0 ; e < emp.employee.Expence_Payement.length ; e++){
									currentEmployee = emp.employee.Expence_Payement[e];
									if(currentEmployee.MonthString == $currentMonth )
									{
									  employee.employee.User_Paid_Status = currentEmployee.Expence_Paid_Status ;
									  break
									}
								}
							}
						});

					}else{
						$selected = false;
						employee.employee.User_Salary = "" ;
						employee.employee.User_Salary_EEC_ID = -1 ;
						employee.employee.User_Paid_Status = 0 ;
					}

					/**** Show only Selected  */
					if($selected){
						$dynamicModalTableRows += employeesExecutePayementModalTableRows(employee,$currentExpence,$selected,"Edit");
					}
					
					employee.employee.User_Paid_Status = 0 ;
		
				});

				$("#ExpencesModal .row-cost").remove();
				$("#ExpencesModal .cost-container").html("");
				$("#ExpencesModal .cost-container").html($dynamicModalTableRows);
				$("#ExpencesModal .expences-extra-input-employees").css("cssText","display : inline-block !important");

			/* End Employees By Month ******************************/

			$(".expence-employess-months-container").fadeIn();

		}else{

			$('#ExpencesModal').find(".expence-employess-months-container").fadeOut();

			if($currentExpence.Expence_Type == "Fix" ){
				$('#ExpencesModal').find('input[name="expence_cost"]').val(($currentExpence.Institution[0].IEC_Cost*1));
			}else{
				$('#ExpencesModal').find('input[name="expence_cost"]').val("");
			}
			
			$('#ExpencesModal').find('.expence-cost-container').removeClass('hidden');
			$('#ExpencesModal').find('.expence-date-container').removeClass('hidden');

			/* Institution Monthly _________________________________________________________*/

			    var htmlmonths = '';
				var unpaidMonths = [];

				$currentExpence.Institution[0].Expence_Payement.map((paid)=>{
					if(paid.Expence_Paid_Status == 0 ){
						unpaidMonths.push(paid.MonthString);
					}
				});

				unpaidMonths.map((month) => {

					selected = '';

					if(month == $currentMonth){
						selected = 'selected';
					}else if($monthsRangeList.indexOf(month) <= $monthsRangeList.indexOf($currentMonth)){
						selected = 'selected';
					}else{
						selected = '';
					}

					htmlmonths += `<option ${selected} title="${month}" data-val="${month}" value="${(($monthNames.indexOf(month)* 1) +1)}" data-lang="${arrLang[$lang][month]}">${arrLang[$lang][month]}</option>`;

				});
				
				$('#ExpencesModal').find('.expence-institution-months-container').after(`
				<div class="monthly-rows dynamic-form-input-container dynamic-form-input-container-extra-style"> 
					<label class="input-label dynamic-form-input-container-label"><span class="input-label-text" >${arrLang[$lang]["Months"]}</span> 
						<span class="input-label-bg-mask"></span>
					</label> 
					<div class="dynamic-form-input-dropdown-container">
						<div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input">
								<div class="form-group group">
									<select class="input-text-month-select2 payment-select" data-val="Monthly" data-ssid="-1" multiple name="month"> 
										${htmlmonths}
									</select> 
									<img class="icon button-icon" src="assets/icons/caret.svg"> 
								</div>
								<div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"></div> 
							</div> 
						</div>
					</div>
				</div>`);

				if($(".input-text-month-select2").length > 0){
					$(".input-text-month-select2").select2({
					tags: true,
					dropdownPosition: 'below',
					minimumResultsForSearch: -1,
					templateResult: hideSelected
					});
				}

			/* Institution Monthly _________________________________________________________*/

			$('#ExpencesModal').find('.expence-institution-months-container').removeClass('hidden');
		}

	
	}else{

		$(".expence-employess-months-container").fadeOut();		

		if($currentExpence.Expence_For == "Employees"){

			$('#ExpencesModal').find('.row-cost').remove();
			$('#ExpencesModal').find('.expence-employes-container').removeClass('hidden');
			$('#ExpencesModal').find('.expence-date-container').removeClass('col-md-6').addClass("col-md-12");
			$('#ExpencesModal').find('.expence-date-container').removeClass('hidden');

			/* Employees By Month **********************************/

				$dynamicModalTableRows ='';
		
				$employeesProv = $employees ;
		
				$employeesProv.map((employee) =>{
		
					$selected = false;
					employee.employee.User_Salary = "" ;
					employee.employee.User_Salary_EEC_ID = -1 ;
		
					if($currentExpence.Employees.length > 0){
		
						$currentExpence.Employees.map((emp) => {

							if(emp.employee.Employe_ID == employee.employee.User_ID  ){
								$selected = true;
								employee.employee.User_Salary = emp.employee.User_Salary ;
								employee.employee.User_Salary_EEC_ID = emp.employee.User_Salary_EEC_ID ;
								employee.employee.User_Paid_Status = emp.employee.Expence_Payement.Expence_Paid_Status;
							}
						});
		
					}else{
						$selected = false;
						employee.employee.User_Salary = "" ;
						employee.employee.User_Salary_EEC_ID = -1 ;
						employee.employee.User_Paid_Status = 0 ;
					}

					/**** Show only Selected  */
					if($selected){
						$dynamicModalTableRows += employeesExecutePayementModalTableRows(employee,$currentExpence,$selected,"Edit");
					}
		
				});

				$("#ExpencesModal .row-cost").remove();
				$("#ExpencesModal .cost-container").html("");
				$("#ExpencesModal .cost-container").html($dynamicModalTableRows);
				$("#ExpencesModal .expences-extra-input-employees").css("cssText","display : inline-block !important");

			/* End Employees By Month ******************************/

		}else{

			$('#ExpencesModal').find('.expence-cost-container').removeClass('hidden');
			$('#ExpencesModal').find('.expence-date-container').removeClass('hidden');

			console.log("cost =>",$currentExpence.Institution[0].IEC_Cost*1);

			if($currentExpence.Expence_Type == "Fix"){
				$('#ExpencesModal').find('input[name="expence_cost"]').val(($currentExpence.Institution[0].IEC_Cost*1));
			}else{
				$('#ExpencesModal').find('input[name="expence_cost"]').val("");
			}

		}
	}
	
}

/* executePayment _________________________________________________________*/

/* Date Convertor  _______________________*/

function dateConverter(date){

	var dt = new Date();
	year  = dt.getFullYear();
	month = (dt.getMonth() + 1).toString().padStart(2, "0");
	day   = dt.getDate().toString().padStart(2, "0");

	var todayString = `${year}-${month}-${day}`;
	if($lang == 'fr'){
		todayString = `${day}-${month}-${year}`;
	}
	return todayString;
}

/* End Date Convertor  _______________________*/

$(document).on("onmouseover",".list-expenses .row-payment",()=>{
	//alert($(this).attr("class"));
})


$(document).on("keyup",".sections-main-sub-container-left-search-bar .input-text-dropdown-search",function(e){
	filterExpences();
});


$(document).on("click","#expences_info , .sections-main-sub-container-right-main-header-option-icon , #showAddExpenceModalBtn ",function(e){
	$(".dynamic-form-input-dropdown-options-filter-extra-style").css("display","none");
});

/* hideSelected  _______________________________________*/

function hideSelected(value) {
	if (value && !value.selected) {
	  return $('<span>' + value.text + '</span>');
	}
}

/* End hideSelected  __________________________________*/

/* applyFilter  __________________________________*/

function applyFilter(){
	filterExpences();
}

/* filterExpences  __________________________________*/

function filterExpences(){

	var expence_type = [];
	var expence_for = [];
	var expence_period = [];
	var expences_prov = [];
	var expences_type_prov = [];
	var expences_period_prov = [];
	var expences_for_prov = [];
	var expences_search_prov = [];
	var passByExpence = [];

	/**** Get checked options ******** */
   
	$(".filter-checkbox-main-container-type").find('input[type="checkbox"]').each((ind,elm)=>{
	   if($(elm).is(":checked")){
		   expence_type.push($(elm).val());
	   }
	});
   
	$(".filter-checkbox-main-container-period").find('input[type="checkbox"]').each((ind,elm)=>{
	   if($(elm).is(":checked")){
		   expence_period.push($(elm).val());
	   }
	});
   
	$(".filter-checkbox-main-container-for").find('input[type="checkbox"]').each((ind,elm)=>{
	   if($(elm).is(":checked")){
		   expence_for.push($(elm).val());
	   }
	});
   
	/******* filter By checked type **************/
   
		passByExpence = [];
   
	   if(expence_type.length == 0){
		   //expence_type = ['Fix', 'Variable', 'Occasional'];
	   }
   
	   $expences.map((expence)=>{
		   if( expence_type.includes(expence.Expence_Type)){
			   if(!passByExpence.includes(expence.Expence_ID)){
				   expences_type_prov.push(expence);
				   passByExpence.push(expence.Expence_ID);
			   }
		   }
	   });
   
	/******* filter By checked period ***********/
   
	   passByExpence = [];	
	   
	   if(expence_period.length == 0){
		   //expence_period = ['Monthly', 'Annual'];
	   }
   
	   expences_type_prov.map((expence)=>{
		   if( expence_period.includes(expence.Expence_Periode)){
			   if(!passByExpence.includes(expence.Expence_ID)){
				   expences_period_prov.push(expence);
				   passByExpence.push(expence.Expence_ID);
			   }
		   }
	   });
   
	/******* filter By checked for *************/
   
		passByExpence = [];
   
	   if(expence_for.length == 0){
		   //expence_for =  ['Institution', 'Employees'];
	   }
   
	   expences_period_prov.map((expence)=>{
		   if( expence_for.includes(expence.Expence_For)){
			   if(!passByExpence.includes(expence.Expence_ID)){
				   expences_for_prov.push(expence);
				   passByExpence.push(expence.Expence_ID);
			   }
		   }
	   });
   
	/******* filter by search  text  *************/
   
	if( $(".input-text-dropdown-search").val() != "" ){
   
	   passByExpence = [];
   
	   expences_for_prov.map((expence)=>{
		   if( String(expence.Expence_Name).toLowerCase().replace(" ","").includes(String($(".input-text-dropdown-search").val()).toLowerCase().replace(" ","")) ){
			   if(!passByExpence.includes(expence.Expence_ID)){
				   expences_search_prov.push(expence);
				   passByExpence.push(expence.Expence_ID);
			   }
		   }
	   });
   
	   expences_prov = expences_search_prov;
   
	}else{
   
	   expences_prov = expences_for_prov;
   
	}
   
	/******* display expences after filter *************/

			$dynamicModalTableRows ='';
			$employeesProv = $employees ;
		
			$employeesProv.map((employee) =>{
				$selected = false ;
				$dynamicModalTableRows += employeesModalTableRows(employee,expence=[],$selected,"Add");
			});
			
			$(".cost-container").html("");
			$(".cost-container").append($dynamicModalTableRows);

			$dynamicListRows ='';

			$("#list_expences").html("");

			if(expences_prov.length > 0 ){
				expences_prov.map((expence,ind) =>{
					$active = false ;
					if(ind == 0 ){
						$active = true ;
					}
					$dynamicListRows += sidebarExpencesRows(expence,$active);
				});
				remove_No_Result_FeedBack();
				addSideBarLoadingAnimation($sideSelector);
				$("#list_expences").append($dynamicListRows);
				displayExpence($expences[0].Expence_ID);
			}else{
				$HeaderFeedBack = "No result found !";
				$SubHeaderFeedBack = "";
				$IconFeedBack = "404_students.png";
				no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
			}

			removeSideBarLoadingAnimation($sideSelector);

			$(".filter-dot").css("opacity","1");

			if((expence_for.length + expence_period.length + expence_type.length) == 0){
				$(".filter-dot").css("opacity","0");
			}

			$(".dynamic-form-input-dropdown-options-filter-extra-style").css("display","none");
	
}

/* resetFilter  __________________________________*/

function resetFilter(){

	if( $(".input-text-dropdown-search").val() != "" ){

		$(".dynamic-form-input-dropdown-options-filter-extra-style").find('input[type="checkbox"]').each((ind,elm)=>{
			$(elm).prop("checked",true);
		});

		filterExpences();

	}else{

		$(".dynamic-form-input-dropdown-options-filter-extra-style").find('input[type="checkbox"]').each((ind,elm)=>{
			$(elm).prop("checked",true);
		});

		$(".dynamic-form-input-dropdown-options-filter-extra-style").css("display","none");
	
		getAllExpences();
	}



}

/* employeeByMonth  __________________________________*/

function employeeByMonth($month){

				$dynamicModalTableRows ='';

				$employeesProv = $employees ;

				$employeesProv.map((employee) =>{

					$selected = false;
					employee.employee.User_Salary = "" ;
					employee.employee.User_Salary_EEC_ID = -1 ;
					employee.employee.User_Paid_Status = 0 ;

					if($currentExpence.Employees.length > 0){

						$currentExpence.Employees.map((emp) => {

							if(emp.employee.Employe_ID == employee.employee.User_ID  ){
								$selected = true;
								employee.employee.User_Salary = emp.employee.User_Salary ;
								employee.employee.User_Salary_EEC_ID = emp.employee.User_Salary_EEC_ID ;
								for(e = 0 ; e < emp.employee.Expence_Payement.length ; e++){
									currentEmployee = emp.employee.Expence_Payement[e];
									if(currentEmployee.MonthString == $month )
									{
										employee.employee.User_Paid_Status = currentEmployee.Expence_Paid_Status ;
										break
									}
								}
							}
						});
					}else{
						$selected = false;
						employee.employee.User_Salary = "" ;
						employee.employee.User_Salary_EEC_ID = -1 ;
						employee.employee.User_Paid_Status = 0 ;
					}

					if($selected){
						$dynamicModalTableRows += employeesExecutePayementModalTableRows(employee,$currentExpence,$selected,"Edit");
					}

					employee.employee.User_Paid_Status = 0 ;

				});

				$("#ExpencesModal .row-cost").remove();
				$("#ExpencesModal .cost-container").html("");
				$("#ExpencesModal .cost-container").html($dynamicModalTableRows);
				$("#ExpencesModal .expences-extra-input-employees").css("cssText","display : inline-block !important");

				$("#ExpencesModal #expence_months_employes").attr("data-val",$month);
				$("#ExpencesModal #expence_months_employes").val(arrLang[$lang][$month]);
				$(document).find('#ExpencesModal #expence_months_employes').siblings(".input-text").text(arrLang[$lang][$month]);


}

function checkChange() {
	
}