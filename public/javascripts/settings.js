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
	$.ajax({
		type: 'get',
		url: '/Settings/get/academic',
	})
	.done(function(res){
		$('#Academic_Year_Section').removeClass('dom-change-watcher');
		$('#Academic_Year_Section').find('input[name="AY_Label"]').val(res.academic.AY_Label);
		$('#Academic_Year_Section').find('input[name="AY_Satrtdate"]').val(res.academic.AY_Satrtdate);
		$('#Academic_Year_Section').find('input[name="AY_EndDate"]').val(res.academic.AY_EndDate);
		$('#Academic_Year_Section').addClass('dom-change-watcher');
	});
}

function getLevels() {
	$.ajax({
		type: 'get',
		url: '/Settings/get/levels',
	})
	.done(function(res){
		$('#Level_Section').find('.row-levels').remove();
		$('#Level_Section').removeClass('dom-change-watcher');
		for (var i = res.levels.length - 1; i >= 0; i--) {
			$('#Level_Section').find('#levels-container').prepend(`<div class="dynamic-form-input row-levels">
                                      <div class="form-group group">
                                        <input type="text" required value="${res.levels[i].Level_Label}" name="level-name">
                                        <label class="input-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>
                                      </div>
                                      <div class="square-button hidden">
                                        <img class="icon" src="assets/icons/minus.svg">
                                      </div>
                                    </div>`);
		}
		$('#Level_Section').addClass('dom-change-watcher');
	});
}


function getClasses() {
	$.ajax({
		type: 'get',
		url: '/Settings/get/classes',
	})
	.done(function(res){

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
	                      <label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label>
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
	                      <label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label>
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

	});
}

getClasses();

function getSubjects() {
	$.ajax({
		type: 'get',
		url: '/Settings/get/subjects',
	})
	.done(function(res){

		console.log("getSubjects : ",res);

		$('#Subject_Section').find('.row-levels').remove();
		$('#Subject_Section').removeClass('dom-change-watcher');
		for (var i = res.levels.length - 1; i >= 0; i--) {
          var filtredSubject = res.subjects.filter(subject => subject.Level_ID === res.levels[i].Level_ID);
          var htmlSubjects = ``;

          if(filtredSubject.length > 0 ){

          	  console.log("if : ", res.levels[i].Level_Label);

	          for(var j = 0;j < filtredSubject.length ; j++) {
	            htmlSubjects += `<option selected locked="locked" value="${filtredSubject[j].Subject_Label}">${filtredSubject[j].Subject_Label}</option>`;
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

          }else{

          	  var htmlSubjects = ``;

          	  console.log("else : ", res.levels[i].Level_Label);

          	  for(var j = 0;j < res.allSubjects.length ; j++) {
	            htmlSubjects += `<option value="${res.allSubjects[j].Subject_Label}">${res.allSubjects[j].Subject_Label}</option>`;
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
	$.ajax({
		type: 'get',
		url: '/Settings/get/expenses',
	})
	.done(function(res){
		$('#Expense_Section').find('.row-expenses').remove();
		$('#Expense_Section').removeClass('dom-change-watcher'); 
		for(var i = res.expenses.length - 1;i >= 0 ; i--) {
            $('#Expense_Section').find('#expense-container').prepend(`<div class="dynamic-form-input-dropdown-container row-expenses">
                                    <div class="dynamic-form-input-dropdown">
                                      <div class="dynamic-form-input">
                                        <div class="dynamic-form-input-float-adjust">
                                        <div class="form-group group form-group-left">
                                          <input type="text" class="input-text" required value="${res.expenses[i].Expense_Label}" name="expense-name" data-expense="${res.expenses[i].Expense_ID}">
                                          <label class="input-label"><span class="input-label-text">Expense name</span> <span class="input-label-bg-mask"></span></label>
                                        </div>
                                        <div class="form-group group form-group-right">
                                          <input type="text" name="payment_method" value="${res.expenses[i].Expense_PaymentMethod}" class="input-dropdown" required>
                                          <img class="icon button-icon" src="assets/icons/caret.svg">
                                          <ul class="dynamic-form-input-dropdown-options">
                                              <li data-val="Monthly">Monthly</li>
                                              <li data-val="Annual">Annual</li>
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
	});
}

function getCosts() {
	$.ajax({
		type: 'get',
		url: '/Settings/get/costs',
	})
	.done(function(res){

		console.log("getCosts ", res);

		$('#Costs_Section').find('.row-levels').remove();
		$('#Costs_Section').removeClass('dom-change-watcher');
		for (var i = res.levels.length - 1; i >= 0; i--) {
        	var filtredCosts = res.costs.filter(cost => cost.Level_ID === res.levels[i].Level_ID);
        	var htmlCosts = ``;
          	for(var j = 0;j < filtredCosts.length ; j++) {
              htmlCosts+= `<div class="dynamic-form-input-dropdown-container">
                <div class="dynamic-form-input-dropdown">
                  <div class="dynamic-form-input">
                    <div class="form-group group form-group-left">
                      <input type="text" class="input-dropdown" name="cost-name" required value="${filtredCosts[j].Expense_Label}" data-cost="${filtredCosts[j].Expense_ID}" data-level="${res.levels[i].Level_ID}">
                      <label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label>
                      <img class="icon button-icon" src="assets/icons/caret.svg">
                      <ul class="dynamic-form-input-dropdown-options">
                      </ul>
                    </div>
                    <div class="form-group group form-group-right">
                       <input type="text" class="input-text" name="cost-price" required value="${filtredCosts[j].Expense_Cost}">
                        <label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label>
                    </div>
                    <div class="square-button square-button-minus hidden">
                      <img class="icon" src="assets/icons/minus.svg">
                    </div>
                  </div>
                </div>
              </div>`
         	}
	         $('#Costs_Section').find('#costs-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed row-levels" data-level="${res.levels[i].Level_ID}">
	                                  <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>
	                                  ${htmlCosts}
	                                  <div class="square-button square-button-extra-style square-button-plus" >
	                                    <img class="icon" src="assets/icons/plus.svg">
	                                  </div>
	                                </div>`)
			}
		$('#Costs_Section').addClass('dom-change-watcher');
	});
}

function updateDetails() {

	var Institution_Name  = $('#Details_Section').find('input[name="Institution_Name"]').val();
	var Institution_Logo  = $('#Details_Section').find('#Institution_Logo').attr('src');
	var Institution_Email = $('#Details_Section').find('input[name="Institution_Email"]').val();
	var Institution_Phone = $('#Details_Section').find('input[name="Institution_Phone"]').val();
	var Institution_wtsp  = $('#Details_Section').find('input[name="Institution_wtsp"]').val();

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

	if (!Institution_wtsp){
		$('#Details_Section').find('input[name="Institution_wtsp"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(Institution_wtsp)){
			$('#Details_Section').find('input[name="Institution_wtsp"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_wtsp"]').parent(".form-group").removeClass("form-input-error");
		}
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

	if(Institution_Phone &&  Institution_wtsp && Institution_Name && Institution_Email  ){

		$.ajax({
			type: 'post',
			url: '/Settings/update/details',
			data: {
				Institution_Name:$('#Details_Section').find('input[name="Institution_Name"]').val(),
				Institution_Logo:$('#Details_Section').find('#Institution_Logo').attr('src'),
				Institution_Email:$('#Details_Section').find('input[name="Institution_Email"]').val(),
				Institution_Phone:$('#Details_Section').find('input[name="Institution_Phone"]').val(),
				Institution_wtsp:$('#Details_Section').find('input[name="Institution_wtsp"]').val()
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{
				$('.sub-container-form-footer').addClass('hide-footer');
	 			$('.sub-container-form-footer').removeClass('show-footer');
		 	}
		});

	}
}

function updateAY() {
	$.ajax({
		type: 'post',
		url: '/Settings/update/academic',
		data: {
			AY_Label:$('#Academic_Year_Section').find('input[name="AY_Label"]').val(),
			AY_EndDate:$('#Academic_Year_Section').find('input[name="AY_EndDate"]').val()
		},
		dataType: 'json'
	})
	.done(function(res){
	 	if (res.updated)
	 	{
			$('.sub-container-form-footer').addClass('hide-footer');
 			$('.sub-container-form-footer').removeClass('show-footer');
	 	}
	});
}

function updateLevels() {

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

	console.log('levels : ',levels);

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
				$('.sub-container-form-footer').addClass('hide-footer');
	 			$('.sub-container-form-footer').removeClass('show-footer');
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
	   	 			method:$(elem).parents('.row-expenses').find('input[name="payment_method"]').val()};
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

	console.log('Expenses',expenses);

	if($ExpensesLabelsErrors.length == 0 &&  $ExpensesCostsErrors.length == 0 ){
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
		 	}
		});
	}

}

function updateClasses() {

	var classes = $('#Classe_Section').find('input[name="classe-name"]').map(function(idx, elem) {
		
		if($(elem).val() != "" ){
			return {label:$(elem).val(),id:$(elem).attr('data-classe'),level:$(elem).parents('.row-levels').attr('data-level')};
		}
    	
  	}).get();

	console.log('Classes!!',classes);

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
	//dynamic-form-input-dropdown
	var costs = $('#Costs_Section').find('input[name="cost-name"]').map(function(idx, elem) {
    return {label:$(elem).val(),id:$(elem).attr('data-cost'),level:$(elem).parents('.row-levels').attr('data-level'),
    price:$(elem).parents('.dynamic-form-input-dropdown').find('input[name="cost-price"]').val()};
  }).get();
	console.log('Costs!!',costs);
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
	 		getClasses();
			$('.sub-container-form-footer').addClass('hide-footer');
 			$('.sub-container-form-footer').removeClass('show-footer');
	 	}
	});
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

	/****** prepend new options to all dropdown *********/

	$tag_data = "";

	if($(".input-text-subject-select2").length > 0){

		$(".input-text-subject-select2").select2({
		  tags: true,
		  dropdownPosition: 'below',
		  tokenSeparators: [',', ' '],
  		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected,
  		  placeholder: "Select items",
  		  templateSelection: function (data, container){

				console.log("container",container);

				var $option = $('.input-text-subject-select2 option[value="'+data.id+'"]');


				if ($option.attr('locked')){
					$(container).addClass('locked-tag');
					data.locked = true; 
					console.log('$option',$(container).attr('class'));
				}

				$(container).attr("style","background-color:#"+Math.random().toString(16).substr(2,6)+"!important;");
				data.selected=true;
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

	}

	$(".input-text-subject-select2").trigger("change");

	/****** trigger changes on select **************/

	$('.input-text-subject-select2').on('select2:select', function (e) {

		$that = $(this); 

		$dataSelect2Id = $(this).attr("data-select2-id");

		$('.input-text-subject-select2').each(function(){

			$this  = $(this);
			$exist = false;

			console.log($this.select2('data'));

			$dataSelect2IdCurrent = $(this).attr("data-select2-id");

			if($dataSelect2Id != $dataSelect2IdCurrent){

				$select2Data = $(this).select2('data');

				for($i = 0 ; $i < $select2Data.length; $i++){

				    if (String($select2Data[$i].text).toLowerCase() == String($tag_data.text).toLowerCase()) {
				       	$exist = true;
				       	break;
				    }

				}

				if(!$exist){

					var newOption = new Option($tag_data.text, $tag_data.id, false, false);
					$(this).prepend(newOption).trigger('change');

				}

			}
			
		});

		$tag_data ="";

	});

	$tag_data_unselect ="";

	$(".input-text-subject-select2").on("select2:unselect", (e) => {

		$tag_data_unselect = e.params.data;

	});

	$('.input-text-subject-select2').on('select2:open', function (e) {

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
//callSubjects();
$tag_data = "";
function callSubjects() {
  $.ajax({
          type: 'get',
          url: '/setup/subjects',
        })
        .done(function(res){
          console.log("Subjects::",res.subjects);
          if (res.subjects.length > 0)
            $(".input-text-subject-select2").select2({
              data: res.subjects,
              tags: true,
              dropdownPosition: 'below',
              tokenSeparators: [',', ' '],
              minimumResultsForSearch: -1,
              templateResult: hideSelected,
              placeholder: "Select items",
              templateSelection: function (data, container) {
                console.log("Selection>>",data);
                $tag_data = data;
                  $(container).attr("style","background-color:"+data.color+"!important;");
                  return data.text;
              },
            })
        });
 
}
}
