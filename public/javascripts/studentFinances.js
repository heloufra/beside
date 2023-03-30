var exams = [];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var _students=[];
var subscription=[];
var _payments=[];
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

function getStudentFinances(id) { 
	$.ajax({
	    type: 'get',
	    url: '/Finances/one',
	    dataType: 'json',
      data: {
				studentId:id
			},
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors);

	  	} else {
	  		console.log("res ",res);
	  		console.log("Finances ");
	  		$("#Finance").find('.month-row').remove();
	  		$("#Finance").find('.students_list').remove();
	  		$('#Finance').find('.row-finance').remove();
	  		var htmlmonths = '';
	  		var studentList = '';
	  		_students = res.students;
	  		filtredClass = res.students;
	  		subscription = res.subscription;
	  		academicyear = res.academicyear;
	  		_payments = res.payments;
	  		indStart = months.indexOf(res.start);
		 	indEnd = months.indexOf(res.end);
		 	var style ="";
		 	for (var i = indStart; i < months.length; i++) {
		 		if (date.getMonth() === i)
					style = 'style="background: #f9f9f9 !important"';
				else
					style = "";
				htmlmonths += '<th scope="col" class="col-text-align month-row" data-lang="'+String(months[i]).slice(0,3)+'" '+style+'>'+String(months[i]).slice(0,3)+'</th>';
				if (i === indEnd){
					break;
				}
				if (i === months.length - 1){
					i = -1;
				}
			}
			$("#Finance").find('.list-months').append(htmlmonths);
			for (var i = 0; i <= _students.length - 1; i++) {
				$('#Finance').find('.list-students').append('<tr class="students_list finance-tbody-tr" data-id="1" data-studentid="'+_students[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+_students[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+_students[i].Student_FirstName +' '+_students[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+_students[i].Classe_Label+'</span> </div> </div></td> </tr>');
				displayFinance(_students[i].Student_ID);
			}
			$("body").trigger("domChanged");
			
	  	}
	  });
}

function displayFinance(id) {
for (var i = indStart; i < months.length; i++) {
  var subscriptionStudent = subscription.filter(function (el) {
                  return el.Student_ID === id;
                });
  var paymentFiltred = _payments.filter(function (el) {
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
 	$("#FinanceBillModal").find('.months-bill').append('<tr class="row-subtotal row-expense"><td data-label="School fees" class="td-label"  data-lang="Subtotal">Subtotal</td>'+Subtotal+'</tr>')
 	for (var i = indStart; i < months.length; i++) {
 		if (date.getMonth() === i){
			style = 'style="background: #f9f9f9"';
 		}
		else{
			style = "";
		}

 		var paymentFiltred = _payments.filter(function (el) {
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
		$("#FinanceBillModal").find('.months-bill .row-subtotal').before('<tr '+style+' class="row-bill"> <td data-label="School fees" class="td-label" data-lang="'+months[i].slice(0,3)+'"> '+months[i].slice(0,3)+' </td>'+htmltPayed+' </tr>')
		if (i === indEnd)
			break;
		if (i === months.length - 1)
			i = -1;
	}
	$("#FinanceBillModal").find('.total-unpaid').html(total + ' DH');
	$("body").trigger("domChanged");
	console.log('SubTotal',Subtotal);
}

$(document).on("click","#print-button",function(event){
	var filtred = _students;

	displayBillFinance(parseInt($(this).attr('data-studentid')));
	console.log('ID:::',$(this).attr('data-studentid'));
	$("#FinanceBillModal").find('.input-img').attr('src',filtred[0].Student_Image)
	$('#FinanceModal').find('input[name="payment-classe"]').val(filtred[0].Classe_Label);
	$('#FinanceModal').find('input[name="payment-student"]').val(filtred[0].Student_FirstName + " " + filtred[0].Student_LastName);
	$("#FinanceBillModal").find('.label-full-name-modal').html(filtred[0].Student_FirstName + ' ' + filtred[0].Student_LastName);
  printJS({
    printable: 'html-content',
    scanStyles:true,
    type:'html',
    honorColor: true,
    css: ["/assets/styles/MainStyle/MainStyle.css"]
  })
	event.preventDefault();
	event.stopPropagation();
});