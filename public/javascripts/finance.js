getAllFinances();
var exams = [];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];
var students=[];
var subscription=[];
var payments=[];
var indStart,indEnd;
var date = new Date();
var filtredClass = [];
var academicyear = "2020-2021";
var StudentId = 0;

function hideSelected(value) {
  if (value && !value.selected) {
    return $('<span>' + value.text + '</span>');
  }
}

function getAllFinances(id) { 
	$.ajax({
	    type: 'get',
	    url: '/Finances/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors);

	  	} else {
	  		console.log("res ",res);
	  		$("#Finance").find('.month-row').remove();
	  		$("#Finance").find('.students_list').remove();
	  		$('#Finance').find('.row-finance').remove();
	  		$(".sections-main-sub-container-right-main").removeClass("visibility");
	  		var htmlmonths = '';
	  		var studentList = '';
	  		students = res.students;
	  		filtredClass = res.students;
	  		subscription = res.subscription;
	  		academicyear = res.academicyear;
	  		payments = res.payments;
	  		indStart = months.indexOf(res.start);
		 	indEnd = months.indexOf(res.end);
		 	var style ="";
		 	for (var i = indStart; i < months.length; i++) {
		 		if (date.getMonth() === i)
					style = 'style="background: #f9f9f9 !important"';
				else
					style = "";
				htmlmonths += '<th scope="col" class="col-text-align month-row" '+style+'>'+months[i].slice(0,3)+'</th>';
				if (i === indEnd){
					break;
				}
				if (i === months.length - 1){
					i = -1;
				}
			}
			$("#Finance").find('.list-months').append(htmlmonths);
			for (var i = 0; i <= students.length - 1; i++) {
				$('#Finance').find('.list-students').append('<tr class="students_list finance-tbody-tr" data-id="1" data-studentid="'+students[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+students[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+students[i].Student_FirstName +' '+students[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+students[i].Classe_Label+'</span> </div> </div></td> </tr>');
				$('#Finance .sections-main-sub-container-right-main').removeClass('visibility');
				displayFinance(students[i].Student_ID);
			}
			
	  	}
	  });
 }

 function displayFinance(id) {
 	for (var i = indStart; i < months.length; i++) {
 		var subscriptionStudent = subscription.filter(function (el) {
						        return el.Student_ID === id;
						      });
 		var paymentFiltred = payments.filter(function (el) {
						        return el.Student_ID === id;
						      });
 		var studentPayment = '';
		for (var k = subscriptionStudent.length - 1; k >= 0; k--) {
			if (subscriptionStudent[k].Expense_PaymentMethod === "Monthly")
			{
				var endPay = new Date(subscriptionStudent[k].Subscription_EndDate);
				if (isNaN(endPay.getMonth())){
					endPay = i;
				}
				else{
					endPay = endPay.getMonth();
				}
				if (date.getMonth() >= i && i >= months.indexOf(subscriptionStudent[k].Subscription_StartDate) && endPay >= i){
					var obj = '{Expence:subscriptionStudent[k].Expense_Label,Amount:subscriptionStudent[k].Expense_Cost,Status:"Unpaid",BoolStatus:"1"}'
					studentPayment += '<img src="assets/icons/check_red.svg" alt="states" data-payment="unpaid" data-exist="true"  data-type="monthly" data-expense="'+subscriptionStudent[k].Expense_ID+'" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" data-obj={"Expence":"'+String(subscriptionStudent[k].Expense_Label).replace(" ",".")+'","Amount":'+subscriptionStudent[k].Expense_Cost+',"Status":"Unpaid","BoolStatus":"1"}/>'
				}
				else{
					studentPayment += '<img class="disabled" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" src="assets/icons/check_gray.svg" alt="states"/>';
				}
			}
			if (subscriptionStudent[k].Expense_PaymentMethod === "Annual" && i === months.indexOf(subscriptionStudent[k].Subscription_StartDate))
			{
				var obj = '{Expence:subscriptionStudent[k].Expense_Label,Amount:subscriptionStudent[k].Expense_Cost,Status:"Unpaid",BoolStatus:"1"}'
				studentPayment += '<img src="assets/icons/check_red.svg" alt="states" data-payment="unpaid" data-exist="true"   data-type="yearly" data-expense="'+subscriptionStudent[k].Expense_ID+'" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" data-obj={"Expence":"'+String(subscriptionStudent[k].Expense_Label).replace(" ",".")+'","Amount":'+subscriptionStudent[k].Expense_Cost+',"Status":"Unpaid","BoolStatus":"1"}/>'
			}
		}
		if (date.getMonth() === i){
			style = 'style="background: #f9f9f9"';
		}
		else{
			style = "";
		}
		$("#Finance").find('[data-studentid="'+id+'"]').append(' <td scope="col" class="row-finance col-text-align col-text-align-extra-style col-text-align-extra-style-center" '+style+'>'+studentPayment+'</td>');
		for (var j = paymentFiltred.length - 1; j >= 0; j--) {
			if (paymentFiltred[j].Expense_PaymentMethod === "Monthly")
				if (paymentFiltred[j].SP_PaidPeriod === months[i])
				{
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').attr('src',"assets/icons/check_green.svg");
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').removeClass('disabled');
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').data('obj','{"Expence":"'+paymentFiltred[j].Expense_Label+'","Amount":'+paymentFiltred[j].Expense_Cost+',"Status":"Paid","BoolStatus":"0"}');
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').attr('data-payment',"paid");
				}
			if (paymentFiltred[j].Expense_PaymentMethod === "Annual" && i === months.indexOf(paymentFiltred[j].Subscription_StartDate))
			{
				$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').attr('src',"assets/icons/check_green.svg");
				$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').removeClass('disabled');
				$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').data('obj','{"Expence":"'+paymentFiltred[j].Expense_Label+'","Amount":'+paymentFiltred[j].Expense_Cost+',"Status":"Paid","BoolStatus":"0"}');
				$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').attr('data-payment',"paid");
			}

		}
		if (i === indEnd)
			break;
		if (i === months.length - 1)
			i = -1;
	}
	$('#Finance .sections-main-sub-container-right-main').removeClass('visibility');
 }

var start,end;
 function displayBillFinance(id) {
 	var subscriptionStudent = subscription.filter(function (el) {
						        return el.Student_ID === id;
						      });
 	StudentId = id;
 	$("#FinanceBillModal").find('.row-expense').remove();
 	$("#FinanceBillModal").find('.row-bill').remove();
 	var Subtotal = '';
 	for (var i = subscriptionStudent.length - 1; i >= 0; i--) {
 		if (subscriptionStudent[i].Expense_PaymentMethod ===  "Monthly")
 		{
 			$("#FinanceBillModal").find('.expense-bill').append('<th class="row-expense" scope="col">'+subscriptionStudent[i].Expense_Label+'</th>');
 			Subtotal += '<td scope="col" class="td-align-right red-color"> <span data-sub="'+subscriptionStudent[i].Expense_Label+'">0</span>Dh </td>';
 		}
 	}
 	var total = 0;
 	$("#FinanceBillModal").find('.months-bill').append('<tr class="row-subtotal row-expense"><td data-label="School fees" class="td-label">Subtotal</td>'+Subtotal+'</tr>')
 	for (var i = indStart; i < months.length; i++) {
 		if (date.getMonth() === i){
			style = 'style="background: #f9f9f9"';
 		}
		else{
			style = "";
		}

 		var paymentFiltred = payments.filter(function (el) {
						        return el.Student_ID === id;
		});

 		var studentPayment = '';
		var htmltPayed = '';
		for (var k = subscriptionStudent.length - 1; k >= 0; k--) {
	 		if (subscriptionStudent[k].Expense_PaymentMethod ===  "Monthly")
	 		{
	 			if (!Subtotal[subscriptionStudent[k].Expense_Label])
					Subtotal[subscriptionStudent[k].Expense_Label] = {unpaid:0}
	 			var endPay = new Date(subscriptionStudent[k].Subscription_EndDate);
				if (isNaN(endPay.getMonth()))
					endPay = i;
				else
					endPay = endPay.getMonth();
				if (paymentFiltred.some(e => e.SS_ID === subscriptionStudent[k].SS_ID && e.SP_PaidPeriod === months[i]))
	 			{
	 					htmltPayed += '<td scope="col"> <div class="expense_td_container"> <div class="expense_label_container"> <span class="expense_label">Paid </span> <span class="expense_label_method">'+subscriptionStudent[k].Expense_Cost+'</span> </div> <img src="assets/icons/check_green.svg" alt="states"/> </div> </td>';
	 			} else if (date.getMonth() >= i && i >= months.indexOf(subscriptionStudent[k].Subscription_StartDate) && endPay >= i)
	 			{
	 				total += parseInt(subscriptionStudent[k].Expense_Cost);
	 				$("#FinanceBillModal").find('[data-sub="'+subscriptionStudent[k].Expense_Label+'"]').html(parseInt(subscriptionStudent[k].Expense_Cost)+parseInt($("#FinanceBillModal").find('[data-sub="'+subscriptionStudent[k].Expense_Label+'"]').html()))
	 				htmltPayed += '<td scope="col"> <div class="expense_td_container"> <div class="expense_label_container"> <span class="expense_label">Unpaid </span> <span class="expense_label_method">'+subscriptionStudent[k].Expense_Cost+'</span> </div> <img src="assets/icons/check_red.svg" alt="states"/> </div> </td>';
	 			}
	 			else{
	 				htmltPayed += '<td scope="col"> <div class="expense_td_container"> <div class="expense_label_container"> <span class="expense_label"> </span> <span class="expense_label_method"></span> </div> <img class="disabled" src="assets/icons/check_gray.svg" alt="states"/> </div> </td>';
	 			}
					
	 		} else if (subscriptionStudent[k].Expense_PaymentMethod === "Annual" && i === months.indexOf(subscriptionStudent[k].Subscription_StartDate))
			{
				if (paymentFiltred.some(e => e.SS_ID === subscriptionStudent[k].SS_ID))
					$("#FinanceBillModal").find('.yearly-expense').append('<div class="row-bill sections-main-sub-container-right-main-result sections-main-sub-container-right-main-result-extra-style"> <span class="sections-main-sub-container-right-main-result-label sections-main-sub-container-right-main-result-label-extra-info"> <span class="expense_label">'+subscriptionStudent[k].Expense_Label+'</span> <span class="expense_label_method">'+subscriptionStudent[k].Expense_Cost+'</span> </span> <span class="sections-main-sub-container-right-main-result-value "><img src="assets/icons/green_check.svg" alt="states" /></span> </div> ')
				else
				{
					total += parseInt(subscriptionStudent[k].Expense_Cost);
					$("#FinanceBillModal").find('.yearly-expense').append('<div class="row-bill sections-main-sub-container-right-main-result sections-main-sub-container-right-main-result-extra-style"> <span class="sections-main-sub-container-right-main-result-label sections-main-sub-container-right-main-result-label-extra-info"> <span class="expense_label">'+subscriptionStudent[k].Expense_Label+'</span> <span class="expense_label_method">'+subscriptionStudent[k].Expense_Cost+'</span> </span> <span class="sections-main-sub-container-right-main-result-value "><img src="assets/icons/red_check.svg" alt="states" /></span> </div> ')
				}
			}
	 	}
		$("#FinanceBillModal").find('.months-bill .row-subtotal').before('<tr '+style+' class="row-bill"> <td data-label="School fees" class="td-label"> '+months[i].slice(0,3)+' </td>'+htmltPayed+' </tr>')
		if (i === indEnd)
			break;
		if (i === months.length - 1)
			i = -1;
	}
	$("#FinanceBillModal").find('.total-unpaid').html(total + ' DH')
	console.log('SubTotal',Subtotal);
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
	console.log('Payments',payments);
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
	  		$("#FinanceBillModal").modal("hide");
	  		getAllFinances();
	  	} else {
	  		console.log(res);
	  	}
	  });
}
 function executePaymentFinance() {
 	var id = StudentId;
	$('#FinanceModal').find('.monthly-rows').remove();
	$('#FinanceModal').find('.yearly-rows').remove();
	$('#FinanceModal').find('.yearly').addClass('hidden');
	$('#FinanceModal').find('.monthly').addClass('hidden');
	var MonthsFiltred = [];

	var subStudent = subscription.filter(function (el) {
	    return el.Student_ID === id;
	});

	var payStudent = payments.filter(function (el) {
	    return el.Student_ID === id;
	});

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

			$('#FinanceModal').find('.monthly').removeClass('hidden');
			$('#FinanceModal').find('.monthly').after('<div class="monthly-rows dynamic-form-input-container dynamic-form-input-container-extra-style"> <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+subStudent[i].Expense_Label+'</span> <span class="input-label-bg-mask"></span></label> <div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown dynamic-form-input-first"> <div class="dynamic-form-input"> <div class="form-group group"> <select class="input-text-month-select2 payment-select" data-val="Monthly" data-ssid="'+subStudent[i].SS_ID+'" multiple name="language"> '+htmlmonths+'</select> <img class="icon button-icon" src="assets/icons/caret.svg"> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div> </div>');
			
			/*for (var j = payFilter.length - 1; j >= 0; j--) {
		      	var option = new Option(payFilter[j].SP_PaidPeriod,payFilter[j].SP_PaidPeriod, true, true);
    			$('#FinanceModal').find('[data-ssid="'+subStudent[i].SS_ID+'"]').append(option).trigger('change');
			}*/
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


$(document).on("click",".finance-tbody-tr",function(event){
	$("#FinanceBillModal").modal("show");
	var filtred = students.filter(student => student.Student_ID === parseInt($(this).attr('data-studentid')));

	displayBillFinance(parseInt($(this).attr('data-studentid')));
	console.log('ID:::',$(this).attr('data-studentid'));
	$("#FinanceBillModal").find('.input-img').attr('src',filtred[0].Student_Image)
	$('#FinanceModal').find('input[name="payment-classe"]').val(filtred[0].Classe_Label);
	$('#FinanceModal').find('input[name="payment-student"]').val(filtred[0].Student_FirstName + " " + filtred[0].Student_LastName);
	$("#FinanceBillModal").find('.label-full-name-modal').html(filtred[0].Student_FirstName + ' ' + filtred[0].Student_LastName);
	event.preventDefault();
	event.stopPropagation();
});

if (document.getElementById("search-input")) {
 document.getElementById("search-input").addEventListener('input', function (evt) {
    $('.students_list').remove();
    
  if (this.value.replace(/\s/g, '') !== '')
  {
  	var value = new RegExp(this.value.toLowerCase().replace(/\s/g, ''));
	var filtred = filtredClass.filter(function (el) {
				var forname = el.Student_FirstName.toLowerCase() +  el.Student_LastName.toLowerCase();
				var backname = el.Student_LastName.toLowerCase()+el.Student_FirstName.toLowerCase();
			  return forname.match(value) || backname.match(value);
			});
	for (var i = 0; i <= filtred.length - 1; i++) {
				$('#Finance').find('.list-students').append('<tr class="students_list finance-tbody-tr" data-id="1" data-studentid="'+filtred[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+filtred[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Student_FirstName +' '+filtred[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Classe_Label+'</span> </div> </div></td> </tr>');
				displayFinance(filtred[i].Student_ID);
			}
  } else
  {
  	for (var i = 0; i <= filtredClass.length - 1; i++) {
				$('#Finance').find('.list-students').append('<tr class="students_list finance-tbody-tr" data-id="1" data-studentid="'+filtredClass[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+filtredClass[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtredClass[i].Student_FirstName +' '+filtredClass[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtredClass[i].Classe_Label+'</span> </div> </div></td> </tr>');
				displayFinance(filtredClass[i].Student_ID);
			}
  }
});
}


$('.finance-filter').on( "change", function() {
  var value = $(this).val();
  var ClasseF,ExpenceF,PaidF = [];
  $('.students_list').remove();
	for (var i = 0; i <= students.length - 1; i++) {
			$('#Finance').find('.list-students').append('<tr class="students_list finance-tbody-tr" data-id="1" data-studentid="'+students[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+students[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+students[i].Student_FirstName +' '+students[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+students[i].Classe_Label+'</span> </div> </div></td> </tr>');
			displayFinance(students[i].Student_ID);
		}
  if (value.replace(/\s/g, '') !== '')
  {	
  	if ( $('input[name=classe]').val() === "All" || !$('input[name=classe]').val())
		ClasseF = students;
	else
		ClasseF = students.filter(function (el) {
				  return el.Classe_Label ===  $('input[name=classe]').val() ;
				});

	console.log("Classes",ClasseF);
	ExpenceF = [];
	if ($('input[name=expense]').val() === "All" || !$('input[name=expense]').val())
		ExpenceF = ClasseF;
	else
	{
		var expenseID = $('#expenses-filter').find('[data-val='+$('input[name=expense]').val()+']').data('expenseid');
		for (var i = 0; i <= ClasseF.length - 1; i++) {
			if($('[data-studentid='+ClasseF[i].Student_ID+']').find('[data-expense='+expenseID+']').length > 0)
				ExpenceF.push(ClasseF[i]);
		}
	}
	console.log("ExpenceF",ExpenceF);
	PaidF = ExpenceF;
	var temp = [];
	if ($('input[name=filter-payment]').val() === "Paid")
	{
		temp = [];
	    for (var i = 0; i <= ExpenceF.length - 1; i++) {
			if($('[data-studentid='+ExpenceF[i].Student_ID+']').find('[data-payment="unpaid"]').length ===  0)
				temp.push(PaidF.filter(function (el) {
						        return el.Student_ID === ExpenceF[i].Student_ID;
						      })[0]);
		}
		console.log('Temp',temp)
		PaidF = temp;
	} else if ($('input[name=filter-payment]').val() === "Unpaid")
	{
		temp = [];
		for (var i = 0; i <= ExpenceF.length - 1; i++) {
			if($('[data-studentid='+ExpenceF[i].Student_ID+']').find('[data-payment="unpaid"]').length > 0)
				temp.push(PaidF.filter(function (el) {
						        return el.Student_ID === ExpenceF[i].Student_ID;
						      })[0]);
		}
		PaidF = temp;
	}

	console.log("Payments",PaidF);
	filtredClass = PaidF;
	$('.students_list').remove();
	for (var i = 0; i <= PaidF.length - 1; i++) {
			$('#Finance').find('.list-students').append('<tr class="students_list finance-tbody-tr" data-id="1" data-studentid="'+PaidF[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+PaidF[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+PaidF[i].Student_FirstName +' '+PaidF[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+PaidF[i].Classe_Label+'</span> </div> </div></td> </tr>');
			displayFinance(PaidF[i].Student_ID);
		}
  }
})