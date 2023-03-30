var oldSubjects = [];
var $alreadySelected = [];

addLoadingAnimation(".sections-main-sub-container-right");
removeLoadingAnimation(".sections-main-sub-container-right",null);

/* Costs Section _______________________*/

$(document).on("click","#Costs_Section .square-button-plus",function(){

	expenses = {};
	expenseName = [];
	expenseCost = [];
	var htmlLi = '';
	var filtred =[];
	var costId = -1;

	$(this).parent().find('.form-group-left input').each(function() {
		 filtred.push($(this).val());
	});

	//$(this).parents(".dynamic-form-input-container-extra-style-composed").find(".dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

	$(this).parent().find(".dynamic-form-input-dropdown-options li").each(function(){
		if(!expenseName.includes($(this).attr("data-val"))){
			expenseName.push($(this).attr("data-val"));
			expenseCost.push($(this).attr("data-cost"));
		}
	});

	expenses["expenseName"] = expenseName;
	expenses["expenseCost"] = expenseCost;
	 
	for (var i = expenses.expenseName.length - 1; i >= 0; i--) {
	   if (filtred.includes(expenses.expenseName[i])){
		 htmlLi += '<li data-cost="'+expenses.expenseCost[i]+'" data-val="'+expenses.expenseName[i]+'" class="hidden">'+expenses.expenseName[i]+'</li>';
	   }
	   else{
		htmlLi += '<li data-cost="'+expenses.expenseCost[i]+'" data-val="'+expenses.expenseName[i]+'">'+expenses.expenseName[i]+'</li>';
	   }
	}

	$(this).before('<div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown costs-'+$(this).parent().attr('data-level')+'"> <div class="dynamic-form-input"> <div class="form-group group form-group-left"> <input type="text" oninput="hideNext(\''+ costId + '\')" class="input-dropdown" name="cost-name" required> <label class="input-label"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> <span class="input-label-bg-mask"></span></label> <img class="icon button-icon" src="assets/icons/caret.svg"> <ul class="dynamic-form-input-dropdown-options">'+htmlLi+'</ul> </div> <div class="form-group group form-group-right"> <input type="text" class="input-text" name="cost-price" required> <label class="input-label"><span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div>');

	if (filtred.length === (expenses.expenseName.length - 1)){
	$(this).css('display','none');
	}

	$("body").trigger("domChanged");

});

$(document).on("change","#Costs_Section .input-dropdown",function(){
   var filtred =[];
   $(this).parents(".dynamic-form-input-dropdown-container").parent().find('.form-group-left input').each(function() {
		 filtred.push($(this).val());
	})
   for (var i = expenses.expenseName.length - 1; i >= 0; i--) {
	 if (expenses.expenseName[i] === $(this).val())
	   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.dynamic-form-input-dropdown-options li[data-val="'+$(this).val()+'"]').addClass('hidden');
	 else if (!filtred.includes(expenses.expenseName[i]))
	   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.dynamic-form-input-dropdown-options li[data-val="'+expenses.expenseName[i]+'"]').removeClass('hidden');
   }
   $("body").trigger("domChanged");
})

$(document).on("click","#Costs_Section .square-button-minus",function(){

   $inputVal = $(this).parents(".dynamic-form-input-dropdown-container").find('.form-group-left input').val();
   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.dynamic-form-input-dropdown-options li[data-val="'+$inputVal+'"]').removeClass('hidden');

   if($(this).parents(".dynamic-form-input-container-extra-style").children(".dynamic-form-input-dropdown-container").length <= 2 ){
	 $(this).parents(".dynamic-form-input-container-extra-style").children(".dynamic-form-input-dropdown-container").children(".dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
   }
   $(this).parents(".dynamic-form-input-dropdown-container")
   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.square-button-plus').css('display','block');
   $(this).parents(".dynamic-form-input-dropdown-container").remove();

});

/* End Costs Section _______________________*/

function getDetails() {
	$.ajax({
		type: 'get',
		url: '/Settings/get/details',
	})
	.done(function(res){
		$('#Details_Section').removeClass('dom-change-watcher');
		$('#Details_Section').find('input[name="Institution_Name"]').val(res.institution.Institution_Name);
		$('#Details_Section').find('#Institution_Logo').attr('src',res.institution.Institution_Logo);
		$('#Details_Section').find('input[name="Institution_Email"]').val(res.institution.Institution_Email);
		$('#Details_Section').find('input[name="Institution_Phone"]').val(res.institution.Institution_Phone);
		$('#Details_Section').find('input[name="Institution_wtsp"]').val(res.institution.Institution_wtsp);
		$('#Details_Section').addClass('dom-change-watcher');
	});
}

function getAcademic() {
	addLoadingAnimation(".sections-main-sub-container-right");
	$.ajax({
		type: 'get',
		url: '/Settings/get/academic',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Academic_Year_Section').removeClass('dom-change-watcher');
		$('#Academic_Year_Section').find('input[name="AY_Label"]').val(res.academic.AY_Label);
		$('#Academic_Year_Section').find('input[name="AY_Satrtdate"]').val(res.academic.AY_Satrtdate);
		$('#Academic_Year_Section').find('input[name="AY_EndDate"]').val(res.academic.AY_EndDate);
		$('#Academic_Year_Section').addClass('dom-change-watcher');
	});
}

function getLevels() {

	addLoadingAnimation(".sections-main-sub-container-right");
	
	$.ajax({
		type: 'get',
		url: '/Settings/get/levels',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Level_Section').find('.row-levels').remove();
		$('#Level_Section').removeClass('dom-change-watcher');
		for (var i = res.levels.length - 1; i >= 0; i--) {
			$('#Level_Section').find('#levels-container').prepend(`<div class="dynamic-form-input dynamic-form-input-first row-levels">
                                      <div class="form-group group">
                                        <input type="text" required value="${res.levels[i].Level_Label}" data-level="${res.levels[i].Level_ID}" name="level-name">
                                        <label class="input-label"><span class="input-label-text" data-lang="Level_name">Level name</span> <span class="input-label-bg-mask"></span></label>
                                      </div>
                                      <div class="square-button hidden">
                                        <img class="icon" src="assets/icons/minus.svg">
                                      </div>
                                    </div>`);
		}
		$('#Level_Section').addClass('dom-change-watcher');
		$("body").trigger("domChanged");
	});
}

getLevels();

function getClasses() {
	addLoadingAnimation(".sections-main-sub-container-right");	
	$.ajax({
		type: 'get',
		url: '/Settings/get/classes',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Classe_Section').find('.row-levels').remove();
		$('#Classe_Section').removeClass('dom-change-watcher');

		for (var i = res.levels.length - 1; i >= 0; i--) {

			  var filtred = res.classes.filter(classe => classe.Level_ID === res.levels[i].Level_ID);
			  var htmlClasses = ``;

			  if(filtred.length > 0 ){

	              for(var j = 0;j < filtred.length ; j++) {
	                htmlClasses += `<div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">
	                      <input type="text" required name="classe-name" value="${filtred[j].Classe_Label}" data-classe="${filtred[j].Classe_ID}" data-level="${res.levels[i].Level_ID}">
	                      <label class="input-label"><span class="input-label-text" data-lang="Class_name">Classe name</span> <span class="input-label-bg-mask"></span></label>
	                    </div>
	                  <div class="square-button square-button-minus">
	                    <img class="icon" src="assets/icons/minus.svg" >
	                  </div>
	                </div>`
	              }

	          }else{

	          		htmlClasses = `<div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">
	                      <input type="text" required name="classe-name" value="" data-classe="0" data-level="${res.levels[i].Level_ID}">
	                      <label class="input-label"><span class="input-label-text"  data-lang="Class_name">Classe name</span> <span class="input-label-bg-mask"></span></label>
	                    </div>
	                  <div class="square-button square-button-minus">
	                    <img class="icon" src="assets/icons/minus.svg" >
	                  </div>
	                </div>`
	          }

              $('#Classe_Section').find('#classes-container').prepend(`<div class="dynamic-form-input-container row-levels" data-level="${res.levels[i].Level_ID}">
	                  <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>
	                 ${htmlClasses}
	                  <div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input">
	                    <img class="icon" src="assets/icons/plus.svg">
	                  </div>
	                </div>`);

		}

		$('#Classe_Section').addClass('dom-change-watcher');

		$("body").trigger("domChanged");

	});
}

getClasses();

function getSubjects() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/subjects',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Subject_Section').find('.row-levels').remove();
		$('#Subject_Section').removeClass('dom-change-watcher');
		$level_id = -1;
		for (var i = res.levels.length - 1; i >= 0; i--) {
          var filtredSubject = res.subjects.filter((subject) => { $level_id = res.levels[i].Level_ID ; return  subject.Level_ID === res.levels[i].Level_ID});
          var htmlSubjects = ``;

          if(filtredSubject.length > 0 ){


          	  $subject_ =  [];

	          for(var j = 0;j < filtredSubject.length ; j++) {

	            htmlSubjects += `<option selected locked="locked" data-ls-id="${filtredSubject[j].LS_ID}" data-bg="${filtredSubject[j].Subject_Color}" value="${filtredSubject[j].Subject_Label}">${filtredSubject[j].Subject_Label}</option>`;

	            $subject_.push(filtredSubject[j]);

	          }

	          oldSubjects.push({"level-id":$level_id,'subject':$subject_});

	          $('#Subject_Section').find('#subjects-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style row-levels" data-level="${res.levels[i].Level_ID}">

	              <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>

	              <div class="dynamic-form-input-dropdown-container">
	                <div class="dynamic-form-input-dropdown dynamic-form-input-first">
	                  <div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">

	                        <select class="input-text-subject-select2" multiple name="language" data-level="${res.levels[i].Level_ID}">
	                        ${htmlSubjects}
	                        </select>
	                        <img class="icon button-icon" src="assets/icons/caret.svg">
	                    </div>

	                    <div class="square-button square-button-minus">
	                      <img class="icon" src="assets/icons/minus.svg">
	                    </div>

	                  </div>
	                </div>
	              </div>
	            </div>`)

          }else{

          	  var htmlSubjects = ``;

          	  

          	  for(var j = 0;j < res.allSubjects.length ; j++) {
	            htmlSubjects += `<option data-ls-id="-1" data-bg="${res.allSubjects[j].Subject_Color}" value="${res.allSubjects[j].Subject_Label}">${res.allSubjects[j].Subject_Label}</option>`;
	          }

	          $('#Subject_Section').find('#subjects-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style row-levels" data-level="${res.levels[i].Level_ID}">

	              <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>

	              <div class="dynamic-form-input-dropdown-container">
	                <div class="dynamic-form-input-dropdown dynamic-form-input-first">
	                  <div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">

	                        <select class="input-text-subject-select2" multiple name="language" data-level="${res.levels[i].Level_ID}">
	                        ${htmlSubjects}
	                        </select>
	                        <img class="icon button-icon" src="assets/icons/caret.svg">
	                    </div>

	                    <div class="square-button square-button-minus">
	                      <img class="icon" src="assets/icons/minus.svg">
	                    </div>

	                  </div>
	                </div>
	              </div>
	            </div>`)

          }

		}

		$('#Subject_Section').addClass('dom-change-watcher');
		select2Call();

	});
}

getSubjects();

function getExpenses() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/expenses',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Expense_Section').find('.row-expenses').remove();
		$('#Expense_Section').removeClass('dom-change-watcher'); 
		for(var i = res.expenses.length - 1;i >= 0 ; i--) {
            $('#Expense_Section').find('#expense-container').prepend(`<div class="dynamic-form-input-dropdown-container row-expenses">
                                    <div class="dynamic-form-input-dropdown dynamic-form-input-first">
                                      <div class="dynamic-form-input">
                                        <div class="dynamic-form-input-float-adjust">
                                        <div class="form-group group form-group-left">
                                          <input type="text" class="input-text" required value="${res.expenses[i].Expense_Label}" name="expense-name" data-expense="${res.expenses[i].Expense_ID}">
                                          <label class="input-label"><span class="input-label-text" data-lang="Expense_name" >Expense name</span> <span class="input-label-bg-mask"></span></label>
                                        </div>
                                        <div class="form-group group form-group-right">
                                          <input type="text" name="payment_method" value="${arrLang[$lang][res.expenses[i].Expense_PaymentMethod]}" class="input-dropdown" required  data-lang="${res.expenses[i].Expense_PaymentMethod}" 
                                          	  readonly data-val="${res.expenses[i].Expense_PaymentMethod}">
                                          <img class="icon button-icon" src="assets/icons/caret.svg">
                                          <ul class="dynamic-form-input-dropdown-options">
                                              <li data-val="Monthly" data-lang="Monthly">Monthly</li>
                                              <li data-val="Annual" data-lang="Annual">Annual</li>
                                          </ul>
                                        </div>
                                        </div>
                                        <div class="square-button square-button-minus hidden">
                                          <img class="icon" src="assets/icons/minus.svg">
                                        </div>
                                      </div>
                                    </div>
                                  </div>`)
        }
        $('#Expense_Section').addClass('dom-change-watcher');
        $("body").trigger("domChanged");
	});
}

getExpenses();

function getCosts() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/costs',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Costs_Section').find('.row-levels').remove();
		$('#Costs_Section').removeClass('dom-change-watcher');
		for (var i = res.levels.length - 1; i >= 0; i--) {
        	var filtredCosts = res.costs.filter(cost => cost.Level_ID === res.levels[i].Level_ID);
        	

        	 if(filtredCosts.length > 0 ){

        	 		var htmlCosts = ``;

		          	for(var j = 0;j < filtredCosts.length ; j++) {
		              htmlCosts+= `<div class="dynamic-form-input-dropdown-container">
		                <div class="dynamic-form-input-dropdown dynamic-form-input-first">
		                  <div class="dynamic-form-input">
		                    <div class="form-group group form-group-left form-input-disabled">
		                      <input type="text" readonly class="input-dropdown" name="cost-name" required value="${filtredCosts[j].Expense_Label}" data-cost="${filtredCosts[j].Expense_ID}" data-level="${res.levels[i].Level_ID}">
		                      <label class="input-label input-label-move-to-top"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> <span class="input-label-bg-mask"></span></label>
		                      <img class="icon button-icon" src="assets/icons/caret.svg">`;

				              htmlCosts+= `<ul class="dynamic-form-input-dropdown-options" style="display: none; opacity: 0;">`;

				              for(var ex = 0 ; ex < res.expenses.length ; ex++){

				              	 htmlCosts+= `<li data-val="${res.expenses[ex].Expense_Label}" data-cost="${res.expenses[ex].Expense_ID}">${res.expenses[ex].Expense_Label}</li>`;

				              }


				              htmlCosts+= `</ul>

		                    </div>
		                    <div class="form-group group form-group-right">
		                       <input type="text" class="input-text" name="cost-price" required value="${filtredCosts[j].Expense_Cost}">
		                        <label class="input-label"><span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label>
		                    </div>
		                    <div class="square-button square-button-minus hidden" data-count="${res.expenses.length}">
		                      <img class="icon" src="assets/icons/minus.svg">
		                    </div>
		                  </div>
		                </div>
		              </div>`;
		         	}

		         	$hidden = ''; 

		         	if(filtredCosts.length == res.expenses.length ){
		         		$hidden = 'hidden';
		         	}
			        
			        $('#Costs_Section').find('#costs-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed row-levels" data-level="${res.levels[i].Level_ID}">
                      <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>
                      ${htmlCosts}
                      <div class="square-button square-button-extra-style square-button-plus ${$hidden} " data-count="${res.expenses.length}" >
                        <img class="icon" src="assets/icons/plus.svg">
                      </div>
                    </div>`);
			}else{

					var htmlCosts = ``;

					for(var j = 0;j < res.expenses.length ; j++) {

		              htmlCosts+= `<div class="dynamic-form-input-dropdown-container">
		                <div class="dynamic-form-input-dropdown">
		                  <div class="dynamic-form-input">
		                    <div class="form-group group form-group-left">
		                      <input type="text" readonly class="input-dropdown" name="cost-name" required value="${res.expenses[j].Expense_Label}" data-cost="${res.expenses[j].Expense_ID}" data-level="${res.levels[i].Level_ID}">
		                      <label class="input-label input-label-move-to-top"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> 
		                      <span class="input-label-bg-mask"></span></label>
		                      <img class="icon button-icon" src="assets/icons/caret.svg">
		                      <img class="icon button-icon" src="assets/icons/caret.svg">`;

				              htmlCosts+= `<ul class="dynamic-form-input-dropdown-options" style="display: none; opacity: 0;">`;

				              for(var ex = 0 ; ex < res.expenses.length ; ex++){

				              	 htmlCosts+= `<li data-val="${res.expenses[ex].Expense_Label}" data-cost="${res.expenses[ex].Expense_ID}">${res.expenses[ex].Expense_Label}</li>`;

				              }

				              htmlCosts+= `</ul>
		                    </div>
		                    <div class="form-group group form-group-right">
		                       <input type="text" class="input-text" name="cost-price" required >
		                        <label class="input-label"><span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label>
		                    </div>
		                    <div class="square-button square-button-minus" data-count="${res.expenses.length}">
		                      <img class="icon" src="assets/icons/minus.svg">
		                    </div>
		                  </div>
		                </div>
		              </div>`
		         	}
			        
			        $('#Costs_Section').find('#costs-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed row-levels" data-level="${res.levels[i].Level_ID}">
	                      <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>
	                      ${htmlCosts}
	                      <div class="square-button square-button-extra-style square-button-plus hidden" data-count="${res.expenses.length}">
	                        <img class="icon" src="assets/icons/plus.svg">
	                      </div>
	                    </div>`);
					}

			}

			$('#Costs_Section').addClass('dom-change-watcher');
			$("body").trigger("domChanged");
	});
}

getCosts();

function getGallery() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/gallery',
	})
	.done(function(res){
		console.log("res =>",res);
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Gallery_Section').find('#sortable').html("");
		$('#Gallery_Section').removeClass('dom-change-watcher');
		//
		$pictures = "";

		res.Gallery.map((pic) =>{
			$(document).find("#sortable").append(CreateNewGalleryPic(pic["Institution_Gallery_Url"]));
			// sortable
			sortableInit();
		});
		
		$('#Gallery_Section').find('#sortable').append();
		$('#Gallery_Section').addClass('dom-change-watcher');
		$("body").trigger("domChanged");
	});
}

getGallery();

function updateDetails() {

	var Institution_Name  = $('#Details_Section').find('input[name="Institution_Name"]').val();
	var Institution_Logo  = $('#Details_Section').find('#Institution_Logo').attr('src');
	var Institution_Email = $('#Details_Section').find('input[name="Institution_Email"]').val();
	var Institution_Phone = $('#Details_Section').find('input[name="Institution_Phone"]').val();
	var Institution_Adress  = $('#Details_Section').find('input[name="Institution_Adress"]').val();

	if (!Institution_Name){
		$('#Details_Section').find('input[name="Institution_Name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('input[name="Institution_Name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!Institution_Phone){
		$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(Institution_Phone)){
			$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!Institution_Adress){
		$('#Details_Section').find('input[name="Institution_Adress"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('input[name="Institution_Adress"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!Institution_Email){
		$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(Institution_Email)){
			$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if(Institution_Phone &&  Institution_Adress && Institution_Name && Institution_Email  ){

		addLoadingAnimation(".sections-main-sub-container-right");
		

		$.ajax({
			type: 'post',
			url: '/Settings/update/details',
			data: {
				Institution_Name:$('#Details_Section').find('input[name="Institution_Name"]').val(),
				Institution_Logo:$('#Details_Section').find('#Institution_Logo').attr('src'),
				Institution_Email:$('#Details_Section').find('input[name="Institution_Email"]').val(),
				Institution_Phone:$('#Details_Section').find('input[name="Institution_Phone"]').val(),
				Institution_Adress:$('#Details_Section').find('input[name="Institution_Adress"]').val()
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{	
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
				$('.sub-container-form-footer').addClass('hide-footer');
	 			$('.sub-container-form-footer').removeClass('show-footer');
	 			$(".main-selected-school .side-bar-brand-label").text(Institution_Name);
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});

	}
}

function updateAY() {
	addLoadingAnimation(".sections-main-sub-container-right");
	
	$.ajax({
		type: 'post',
		url: '/Settings/update/academic',
		data: {
			AY_Label:$('#Academic_Year_Section').find('input[name="AY_Label"]').val(),
			AY_EndDate:$('#Academic_Year_Section').find('input[name="AY_EndDate"]').attr("data-val"),
			AY_Satrtdate:$('#Academic_Year_Section').find('input[name="AY_Satrtdate"]').attr("data-val")
		},
		dataType: 'json'
	})
	.done(function(res){
	 	if (res.updated)
	 	{
	 		removeLoadingAnimation(".sections-main-sub-container-right",null);
			$('.sub-container-form-footer').addClass('hide-footer');
 			$('.sub-container-form-footer').removeClass('show-footer');
	 	}else{
	 		removeLoadingAnimation(".sections-main-sub-container-right",null);
	 	}
	});
}

function updateLevels() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$levelsErrors = [];

	var levels = $('#Level_Section').find('input[name="level-name"]').map(function(idx, elem) {

	 if($(elem).val() != ""){
	 	$(elem).parents(".form-group").removeClass("form-input-error");
   	 	return {label:$(elem).val(),id:$(elem).attr('data-level')};
	 }else{
	 	$levelsErrors.push(idx);
	 	$(elem).parents(".form-group").addClass("form-input-error");
	 }

  	}).get();

	if($levelsErrors.length == 0 ){

		$.ajax({
			type: 'post',
			url: '/Settings/update/levels',
			data: {
				levels
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{
		 		getClasses();
		 		getSubjects();
		 		getCosts();
		 		getLevels();
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
				$('.sub-container-form-footer').addClass('hide-footer');
	 			$('.sub-container-form-footer').removeClass('show-footer');
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});
	}
}

function updateExpenses() {

	$ExpensesLabelsErrors = [];
	$ExpensesCostsErrors  = [];

	var expenses = $('#Expense_Section').find('input[name="expense-name"]').map(function(idx, elem) {

	     if($(elem).val() != ""){
		 	$(elem).parents(".form-group").removeClass("form-input-error");
	   	 	return {
	   	 			label:$(elem).val(),id:$(elem).attr('data-expense'),
	   	 			method:$(elem).parents('.row-expenses').find('input[name="payment_method"]').attr("data-val")};
		 }else{
		 	$ExpensesLabelsErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
		 }

  	}).get();

  	$('#Expense_Section').find('input[name="payment_method"]').map(function(idx, elem) {

	     if($(elem).val() != "" ){
		 	$(elem).parents(".form-group").removeClass("form-input-error");
		 }else{
		 	$ExpensesCostsErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
		 }

  	})

	if($ExpensesLabelsErrors.length == 0 &&  $ExpensesCostsErrors.length == 0 ){
		addLoadingAnimation(".sections-main-sub-container-right");
		$.ajax({
			type: 'post',
			url: '/Settings/update/expenses',
			data: {
				expenses
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{
		 		getExpenses();
		 		getCosts();
				$('.sub-container-form-footer').addClass('hide-footer');
	 			$('.sub-container-form-footer').removeClass('show-footer');
	 			removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});
	}

}

function updateSubjects() {

	addLoadingAnimation(".sections-main-sub-container-right");

	var $subjects = {} ;

	$('#Subject_Section .row-levels').each(function(ind,elem){

		var $subject = {};
		var $sub     = [];

		$subject["level_id"] = $(elem).attr("data-level");

		$data = $(elem).find('.input-text-subject-select2').select2('data');

		$data.map(function(el,d){

			$text = el.text;
			$id = el.subject_id;

			if (typeof $id === 'undefined') {
				$id = -1 ;
			}

			$sub.push({'text':$text,'id':$id});

		});	

		$subject["subject"] = $sub;

		if($sub.length > 0 ){
			$subjects[ind] = $subject ;
		}

	});
	
	$.ajax({
		type: 'post',
		url: '/Settings/update/subjects',
		data: {
			'subjects' : $subjects
		},
		dataType: 'json'
	})
	.done(function(res){
	 	if (res.updated)
	 	{
	 		
	 		getSubjects();
			$('.sub-container-form-footer').addClass('hide-footer');
 			$('.sub-container-form-footer').removeClass('show-footer');
			removeLoadingAnimation(".sections-main-sub-container-right",null);
	 	}else{
			removeLoadingAnimation(".sections-main-sub-container-right",null);
	 	}
	});

}

function updateClasses() {

	var classes = $('#Classe_Section').find('input[name="classe-name"]').map(function(idx, elem) {
		
		if($(elem).val() != "" ){
			return {label:$(elem).val(),id:$(elem).attr('data-classe'),level:$(elem).parents('.row-levels').attr('data-level')};
		}
    	
  	}).get();

	$.ajax({
		type: 'post',
		url: '/Settings/update/classes',
		data: {
			classes
		},
		dataType: 'json'
	})
	.done(function(res){
	 	if (res.updated)
	 	{
	 		getClasses();
			$('.sub-container-form-footer').addClass('hide-footer');
 			$('.sub-container-form-footer').removeClass('show-footer');
	 	}
	});
}

function updateCosts() {

	$CostLabelsErrors = [];
	$CostPriceErrors  = [];
	
	//dynamic-form-input-dropdown
	var costs = $('#Costs_Section').find('input[name="cost-name"]').map(function(idx, elem) {

		if($(elem).val() != ""){
		    return {
		    	label:$(elem).val(),
		    	id:$(elem).attr('data-cost'),
		    	level:$(elem).parents('.row-levels').attr('data-level'),
		    	price:$(elem).parents('.dynamic-form-input-dropdown').find('input[name="cost-price"]').val()
		    };
		}else{
		 	$CostLabelsErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
	    }

	}).get();

  	$('#Costs_Section').find('input[name="cost-price"]').map(function(idx, elem) {

	     if($(elem).val() != "" ){
		 	$(elem).parents(".form-group").removeClass("form-input-error");
		 }else{
		 	$CostPriceErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
		 }

  	});

	if($CostLabelsErrors.length == 0 &&  $CostPriceErrors.length == 0 ){

		console.log("if costs",costs);

		addLoadingAnimation(".sections-main-sub-container-right");

		$.ajax({
			type: 'post',
			url: '/Settings/update/costs',
			data: {
				costs
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{
		 		getCosts();
				$('.sub-container-form-footer').addClass('hide-footer');
	 			$('.sub-container-form-footer').removeClass('show-footer');
	 			removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});
	}
}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("Institution_Logo").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("Institution_Image").addEventListener("change", readFile);

function discard(section) {
	$('#ChangesModal').attr('data-section',section);
}

$('#ChangesModal').find('#Discard').on('click',function () {
	var section = $('#ChangesModal').attr('data-section');
	switch (section) {
	  case 'Details':
	    getDetails();
	    break;
	  case 'Academic':
	  	getAcademic();
	  	break;
	  case 'Levels':
	    getLevels();
	    break;
	  case 'Classes':
	    getClasses();
	    break;
	  case 'Subjects':
	    getSubjects();
	    break;
	  case 'Expenses':
	    getExpenses();
	    break;
	  case 'Costs':
	    getCosts();
	    break;
	  case 'Gallery':
		getGallery();
		break;
	  default:
	    console.log(`Sorry, we are out of ${section}.`);
	}
	$('.sub-container-form-footer-container .sub-container-form-footer').addClass('hide-footer');
 	$('.sub-container-form-footer-container .sub-container-form-footer').removeClass('show-footer');
});

select2Call();

function hideSelected(value) {
  if (value && !value.selected) {
    return $('<span>' + value.text + '</span>');
  }
}

function select2Call() {

	$tag_data = "";

	$alreadySelected = [];

	$(".input-text-subject-select2").each(function(ind,elem){

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
				      }

				}).on("select2:unselecting", function(e) {
					    var self = $(this);
					    setTimeout(function() {
					        self.select2('close');
					    }, 0);
				});

				$this.trigger("change");

			/****** trigger changes on select **************/

			$(".input-text-subject-select2").on('select2:select', function (e) {

				callSubjects();

				$that = $(this); 

				$dataSelect2Id = $(this).attr("data-select2-id");

				$dataSelect2Data = $that.select2('data') ;

				$dataSelect2DataText = $dataSelect2Data[$dataSelect2Data.length - 1 ].text;

				$('.input-text-subject-select2').each(function(){

					$thisEach  = $(this);

					$exist = false;

					$dataSelect2IdCurrent = $thisEach.attr("data-select2-id");

					if($dataSelect2Id != $dataSelect2IdCurrent ){

							$select2Data = $thisEach.select2('data');

							for($i = 0 ; $i < $select2Data.length; $i++) {
							    if (String($select2Data[$i].text).toLowerCase() == String($dataSelect2DataText).toLowerCase()) {
							       	$exist = true;
							       	break;
							    }
							}

							if(!$exist ){
								var newOption = new Option($dataSelect2DataText, $dataSelect2DataText , false, false);
								$thisEach.prepend(newOption).trigger('change');
							}
					}
					
				});

			});

			$tag_data_unselect ="";

			$(".input-text-subject-select2").on("select2:unselect", (e) => {

				callSubjects();

				$tag_data_unselect = e.params.data;

			});

			$(".input-text-subject-select2").on('select2:open', function (e) {

				var a = new Array();

			    $(this).children("option").each(function(x){

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

			});

			/****** End prepend new options to all dropdown *********/

			$tag_data = "";

	});

	callSubjects();
	
}

function callSubjects() {

  $.ajax({
          type: 'post',
          url: '/Settings/subjects',
        })
        .done(function(res){

          if (res.subjects.length > 0){

          		 $(".input-text-subject-select2").each(function(){

          		 	$this = $(this);

		            $this.select2({
		              data: res.subjects,
		              tags: true,
		              dropdownPosition: 'below',
		              tokenSeparators: [','],
		              minimumResultsForSearch: -1,
		              templateResult: hideSelected,
		              placeholder: "",
		              templateSelection: function (data, container) {

		                  $(container).attr("style","background-color:"+data.color+"!important;");

		                  var $option = $this.find('option[value="'+data.id+'"]');

		                  $option.attr("data-bg",data.color);
		                  $option.attr("data-subject-id",data.Subject_ID);

						  if ($alreadySelected.includes(data.id+"_"+$this.attr("data-level"))){
						  	$(container).addClass('locked-tag');
						  	$option.attr("locked",true);
							data.locked = true; 
						  }

					      data.selected=true;
					      data.subject_id = data.Subject_ID;
					      data.ls_id = $option.attr("data-ls-id");
						  $tag_data = data;
					      return data.text;

		              }

		            });

		            $this.trigger("change");

	        	});

        	}
        });
 
}

/************ Sortable *********************/

$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-remove",function () {
	$('#Gallery_Section .sub-container-form-footer').removeClass('hide-footer');
	$('#Gallery_Section .sub-container-form-footer').addClass('show-footer');
});

function updateGallery(){

	$Gloabl_Gallary = [];

    $('#sortable li').each((ind,elm)=>{
      $Gloabl_Gallary.push({
        "url":$(elm).find(".input-img").attr("src"),
        "id":$(elm).find(".sections-main-sub-container-right-main-header-option-list-li-remove").attr("data-id")
      });
    });

	$.ajax({
		type: 'post',
		url: '/Settings/update/gallery',
	   data: {
			"gallery": $Gloabl_Gallary
		},
		dataType: 'json'
	})
	.done(function(res){
		getGallery();
		$('#Gallery_Section .sub-container-form-footer').addClass('hide-footer');
 		$('#Gallery_Section .sub-container-form-footer').removeClass('show-footer');
	});
}

/************ Sortable *********************/

$gallery_selected_element = '';
$gallery_selected_element_state = "Add";

/* .gallery_add_new ________________________*/

$(document).on("click",".gallery_add_new",function (e) {
  $gallery_selected_element_state = "Add";
  $("#gallery_file").trigger("click");
});

/* End .gallery_add_new ________________________*/

// sortable
sortableInit();

$(document).on("click",".ui-state-default",function (e) {
  $gallery_selected_element_state = "Edit";
  $gallery_selected_element = $(this).find(".input-img")[0];
  $("#gallery_file").trigger("click");
});

function readGalleryFiles() {
  if (this.files && this.files.length > 0 ) {
    for(f=0 ; f < this.files.length ; f++ ){
      var FR= new FileReader();
      FR.addEventListener("load", function(e) {
        if($gallery_selected_element_state == "Add"){
          $(document).find("#sortable").append(CreateNewGalleryPic(e.target.result));
          // sortable
          sortableInit();
          // show customNextBtn
          toggleCustomNextBtn();
        }else{
          $($gallery_selected_element).attr("src",e.target.result);
        }
      });
      FR.readAsDataURL(this.files[f]);
      // empty
      $('#gallery_file').attr('value', '');
    };
  }
}

document.getElementById("gallery_file").addEventListener("change", readGalleryFiles);

/* Create New Gallery Pic ________________________*/

$(document).on("click","#Gallery_Section .sections-main-sub-container-right-main-header-option-list-li-remove",function (e) {
  e.preventDefault();
  e.stopPropagation();
  if($(this).attr("data-id") == -1){
    $(this).parents(".ui-state-default").remove();
	atLeast3Pics();
  }
  // show customNextBtn
  toggleCustomNextBtn();
});

/* Create New Gallery Pic ________________________*/

function CreateNewGalleryPic(src) {
  $pic = `<li class="ui-state-default">
            <div class="input-img-container input-square-img-container logo">
              <img class="input-img" src="${src}" data-src="${src}" class="gallery-output">
              <div class="input-img-container-mask">
                  <!-- sections-main-sub-container-right-main-header-option-list ------------------------------>
                  <div class="sections-main-sub-container-right-main-header-option-list">
                    <div class="sections-main-sub-container-right-main-header-option-list-li sections-main-sub-container-right-main-header-option-list-li-edit">
                      <img src="assets/icons/edit.svg" alt="edit"/>
                    </div>                
                    <div class="sections-main-sub-container-right-main-header-option-list-li sections-main-sub-container-right-main-header-option-list-li-remove" data-id="-1">
                      <img src="assets/icons/delete.svg" alt="delete">
                    </div>
                  </div>
                  <!-- sections-main-sub-container-right-main-header-option-list ------------------------------>
              </div>
            </div>
          </li>`;
  return $pic;
}

/* sortableInit ________________________*/

function sortableInit() {
  window.sortable = $("#sortable").sortable({
    stop : (event,ui)=>{
      $pictures = [];
      $(".ui-state-default .input-img").each((ind,elm)=>{
        $pictures.push({
          "position":(ind+1),
          "url":$(elm).attr("src")
        })
      });
	  $('#Gallery_Section .sub-container-form-footer').removeClass('hide-footer');
	  $('#Gallery_Section .sub-container-form-footer').addClass('show-footer');
    },
    cancel: ".static"
  }).disableSelection();

  // at Least 3 Pics
  atLeast3Pics();
  
}

/* toggleCustomNextBtn ________________________*/

function toggleCustomNextBtn() {

  $Gloabl_Gallary =[];

  if($('#sortable li').length >= 3 ){
    $("#Gallery_Section .sub-container-form-footer .customNextBtn").removeClass("hidden");
	$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","inline-block");
  }else{
    $("#Gallery_Section .sub-container-form-footer .customNextBtn").addClass("hidden");
	$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","none");
  }
  
  $('#sortable li').each((ind,elm)=>{
    $Gloabl_Gallary.push({
      "url":$(elm).find(".input-img").attr("src"),
      "id":$(elm).find(".sections-main-sub-container-right-main-header-option-list-li-remove").attr("data-id")
    });
  });

  atLeast3Pics();
 
}

/* Drag to upload  ________________________*/

const eventChange = new Event('change');
var $dropzone = document.querySelector('.import-file-container');
var input = document.getElementById('gallery_file');
var input_file = $('#gallery_file');

$dropzone.ondragover = function (e) { 
  e.preventDefault(); 
  this.classList.add('dragover');
};
$dropzone.ondragleave = function (e) { 
    e.preventDefault();
    this.classList.remove('dragover');
};
$dropzone.ondrop = function (e) {
    e.preventDefault();
    this.classList.remove('dragover');
    input.files = e.dataTransfer.files;
    $gallery_selected_element_state = "Add";
    input.dispatchEvent(eventChange);
}


/**************** */

function atLeast3Pics() {
	if($('#sortable li').length > 3 ){
		$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","inline-block");
	  }else{
		$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","none");
	  }
}

/** .modal-confirm-button *************************/

$(document).on("click",".modal-confirm-button",function(event) {
	$("#ChangesModal").modal("hide");
})

