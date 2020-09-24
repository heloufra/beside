function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output").src       = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("file").addEventListener("change", readFile);

var owl = $('.owl-carousel');
owl.owlCarousel({
      slideSpeed : 300,
      singleItem:true,
      pagination: false,
      nav:true,
      mouseDrag:false,
});
// Go to the next item
var data = {};
function submit(value,inputs){
        if (value === "subjects")
        {
          var levels = JSON.parse(data.levels);
          var subjects = {};
          if (!Array.isArray(levels.levelName))
            levels.levelName = [levels.levelName];
          for (var i = 0; i <= levels.levelName.length - 1; i++) {
            subjects[levels.levelName[i]]= $('#'+levels.levelName[i]).val();
          }
          data[value] = JSON.stringify(subjects);
        } else if (value === "classes" || value === "costs")
        {
           var temp = {};
           var levels = JSON.parse(data.levels);
          if (!Array.isArray(levels.levelName))
            levels.levelName = [levels.levelName];
          for (var i = levels.levelName.length - 1; i >= 0; i--) {
            var tempo = {}
            for (var j = inputs.length - 1; j >= 0; j--) {
              var values = $('input[name='+inputs[j]+'-'+levels.levelName[i]+']')
                  .map(function(){return $(this).val();}).get();
                  console.log("Values:",values);
              var filtered = values.filter(function (el) {
                return el != "";
              });
              tempo[inputs[j]] = filtered.length > 1 ? filtered : filtered[0];
            }
            temp[levels.levelName[i]] = tempo;
         }
          data[value] = JSON.stringify(temp);
        }
        else
        {
          var temp = {};
          for (var i = inputs.length - 1; i >= 0; i--) {
            var values = $('input[name='+inputs[i]+']')
                .map(function(){return $(this).val();}).get();
            var filtered = values.filter(function (el) {
              return el != "";
            });
            temp[inputs[i]] = filtered.length > 1 ? filtered : filtered[0];
          }
          if (temp.logo)
            temp.logo = $('#output').attr("src");
          data[value] = JSON.stringify(temp);
        }
        console.log("Data::",data);
        //$( ".alert-danger" ).remove();
        $("#"+value+ "-li img").attr("src", "assets/icons/sidebar_icons/checked.svg");
        $("#"+value +"-li span").attr("class", "side-bar-li-span-active");
        if (value !== "costs")
        {
          nextItem();
        }
        else {
           $.ajax({
            type: 'post',
            url: '/setup/save',
            data: data,
            dataType: 'json'
          })
          .done(function(res){

              /*if (result.saved)
              {
                if (value !== "costs")
                  nextItem();
              } else {
                $(".sub-container").prepend("<div style='position: absolute;width: 100%;' class='alert alert-danger' role='alert'>"+result.errors[0].errorDesc +"</div>");
              }*/
          });
        }
        if (value === "levels")
            addLevels(JSON.parse(data.levels));
        if (value === "expenses")
          addExpenses(JSON.parse(data.expenses));
       
    };


function addExpenses(data) {
  $('.expense-items').remove();
  if (Array.isArray(data.expenseName))
   for (var i = 0; i <= data.expenseName.length - 1; i++) {
    $('.expense-list').append('<li data-val="'+data.expenseName[i]+'" class="expense-items"><span class="expense_label">'+data.expenseName[i]+'</span><span class="method_label">'+data.expenseTime[i]+'</span></li>');
   }
  else
    $('.expense-list').append('<li data-val="'+data.expenseName+'" class="expense-items"><span class="expense_label">'+data.expenseName+'</span><span class="method_label">'+data.expenseTime+'</span></li>');
}

function addLevels(data) {
  $('.dynamic-form-input-container').remove();
  if (Array.isArray(data.levelName))
    for (var i = 0; i <= data.levelName.length - 1; i++) {
      $('#classes').append('<div class="dynamic-form-input-container"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input type="text" required name="classeName-'+data.levelName[i]+'"><label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
      $('#subjectsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first"><div class="dynamic-form-input"><div class="form-group group"><select class="input-text-subject-select2" multiple name="language" id="'+data.levelName[i]+'"><option value="Bangladesh">Bangladesh</option><option selected value="Barbados">Barbados</option><option selected value="Belarus">Belarus</option><option value="Belgium">Belgium</option></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
      $('#costsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" id="costs-'+data.levelName[i]+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first"><div class="dynamic-form-input"><div class="form-group group form-group-left"><input type="text" class="input-dropdown" required name="costsName-'+data.levelName[i]+'"><label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label><img class="icon button-icon" src="assets/icons/caret.svg"><ul class="dynamic-form-input-dropdown-options expense-list"></ul></div><div class="form-group group form-group-right"><input type="text" class="input-text" required name="price-'+data.levelName[i]+'"><label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
    }
  else
  {
     $('#classes').append('<div class="dynamic-form-input-container"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input type="text" required name="classeName-'+data.levelName+'"><label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
      $('#subjectsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first"><div class="dynamic-form-input"><div class="form-group group"><select class="input-text-subject-select2" multiple name="language" id="'+data.levelName+'"><option value="Bangladesh">Bangladesh</option><option selected value="Barbados">Barbados</option><option selected value="Belarus">Belarus</option><option value="Belgium">Belgium</option></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
      $('#costsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" id="costs-'+data.levelName+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first"><div class="dynamic-form-input"><div class="form-group group form-group-left"><input type="text" class="input-dropdown" required name="costsName-'+data.levelName+'"><label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label><img class="icon button-icon" src="assets/icons/caret.svg"><ul class="dynamic-form-input-dropdown-options expense-list"></ul></div><div class="form-group group form-group-right"><input type="text" class="input-text" required name="price-'+data.levelName+'"><label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
  }
  if($(".input-text-subject").length > 0){
    $(".input-text-subject").fastselect({
       userOptionAllowed: true,
       userOptionPrefix: 'new ',
       noResultsText: 'No Data',
       clearQueryOnSelect:true
    });
  }

  if($(".input-text-subject-select2").length > 0){
    $(".input-text-subject-select2").select2({
      tags: true,
      dropdownPosition: 'below',
      tokenSeparators: [',', ' '],
          minimumResultsForSearch: -1,
          templateResult: hideSelected
    });
  }

  if($(".input-text-month-select2").length > 0){
    $(".input-text-month-select2").select2({
      tags: true,
      dropdownPosition: 'below'
      /*tokenSeparators: [',', ' '],
          minimumResultsForSearch: -1,
          templateResult: hideSelected*/
    });
  }

  if($(".input-text-year-select2").length > 0){
    $(".input-text-year-select2").select2({
      tags: true,
      dropdownPosition: 'below'
      /*tokenSeparators: [',', ' '],
          minimumResultsForSearch: -1,
          templateResult: hideSelected*/
    });
  }
}

function hideSelected(value) {
      if (value && !value.selected) {
        return $('<span>' + value.text + '</span>');
      }
    }

function prev(value) {
  $("#"+value+ "-li img").attr("src", "assets/icons/sidebar_icons/unchecked.svg");
  $("#"+value +"-li span").attr("class", "side-bar-li-span-inactive");
}

function nextItem() {
    owl.trigger('owl.next');
}
// Go to the previous item
$('.customPrevBtn').click(function() {
    owl.trigger('owl.prev');
})