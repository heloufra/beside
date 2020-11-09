getAllFinances();
var exams = [];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];
var students=[];
var subscription=[];
var payments=[];
var indStart,indEnd;
var date = new Date();
var filtredClass = [];
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
	  		$("#Finance").find('.month-row').remove();
	  		var htmlmonths = '';
	  		var studentList = '';
	  		console.log("students::",res.students);
	  		students = res.students;
	  		filtredClass = res.students;
	  		subscription = res.subscription;
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
				if (i === indEnd)
					break;
				if (i === months.length - 1)
					i = -1;
			}
			$("#Finance").find('.list-months').append(htmlmonths);
			for (var i = 0; i <= students.length - 1; i++) {
				$('#Finance').find('.list-students').append('<tr class="students_list finance-tbody-tr" data-id="1" data-studentid="'+students[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+students[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+students[i].Student_FirstName +' '+students[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+students[i].Classe_Label+'</span> </div> </div></td> </tr>');
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
				if (isNaN(endPay.getMonth()))
					endPay = i;
				else
					endPay = endPay.getMonth();
				if (date.getMonth() >= i && i >= months.indexOf(subscriptionStudent[k].Subscription_StartDate) && endPay >= i)
				{
					var obj = '{Expence:subscriptionStudent[k].Expense_Label,Amount:subscriptionStudent[k].Expense_Cost,Status:"Unpaid",BoolStatus:"1"}'
					studentPayment += '<img src="assets/icons/check_red.svg" alt="states" data-payment="unpaid" data-exist="true"  data-type="monthly" data-expense="'+subscriptionStudent[k].Expense_ID+'" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" data-obj={"Expence":"'+subscriptionStudent[k].Expense_Label+'","Amount":'+subscriptionStudent[k].Expense_Cost+',"Status":"Unpaid","BoolStatus":"1"}/>'
				}
				else
					studentPayment += '<img class="disabled" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" src="assets/icons/check_gray.svg" alt="states"/>';
			}
			if (subscriptionStudent[k].Expense_PaymentMethod === "Annual" && indStart === i)
			{
				var obj = '{Expence:subscriptionStudent[k].Expense_Label,Amount:subscriptionStudent[k].Expense_Cost,Status:"Unpaid",BoolStatus:"1"}'
				studentPayment += '<img src="assets/icons/check_red.svg" alt="states" data-payment="unpaid" data-exist="true"   data-type="yearly" data-expense="'+subscriptionStudent[k].Expense_ID+'" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" data-obj={"Expence":"'+subscriptionStudent[k].Expense_Label+'","Amount":'+subscriptionStudent[k].Expense_Cost+',"Status":"Unpaid","BoolStatus":"1"}/>'
			}
		}
		if (date.getMonth() === i)
			style = 'style="background: #f9f9f9"';
		else
			style = "";
		$("#Finance").find('[data-studentid="'+id+'"]').append(' <td scope="col" class="col-text-align col-text-align-extra-style col-text-align-extra-style-center" '+style+'>'+studentPayment+'</td>');
		for (var j = paymentFiltred.length - 1; j >= 0; j--) {
			if (paymentFiltred[j].Expense_PaymentMethod === "Monthly")
				if (paymentFiltred[j].SP_PaidPeriod === months[i])
				{
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').attr('src',"assets/icons/check_green.svg");
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').removeClass('disabled');
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').data('obj','{"Expence":"'+paymentFiltred[j].Expense_Label+'","Amount":'+paymentFiltred[j].Expense_Cost+',"Status":"Paid","BoolStatus":"0"}');
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').attr('data-payment',"paid");
				}
			if (paymentFiltred[j].Expense_PaymentMethod === "Annual" && indStart === i)
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
	if ($('input[name=filter-payment]').val() === "Paid")
	{
	    for (var i = 0; i <= ExpenceF.length - 1; i++) {
			if($('[data-studentid='+ExpenceF[i].Student_ID+']').find('[data-payment="unpaid"]').length === $('[data-studentid='+ExpenceF[i].Student_ID+']').find('[data-exist="true"]').length )
				PaidF = PaidF.filter(function (el) {
						        return el.Student_ID !== ExpenceF[i].Student_ID;
						      });
		}
	} else if ($('input[name=filter-payment]').val() === "Unpaid")
	{
		for (var i = 0; i <= ExpenceF.length - 1; i++) {
			if($('[data-studentid='+ExpenceF[i].Student_ID+']').find('[data-payment="paid"]').length === $('[data-studentid='+ExpenceF[i].Student_ID+']').find('[data-exist="true"]').length)
				PaidF = PaidF.filter(function (el) {
						        return el.Student_ID !== ExpenceF[i].Student_ID;
						      });
		}
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