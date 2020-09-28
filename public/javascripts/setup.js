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


// Go to the next item
var data = {};
function validation(value,temp) {
  $( ".alert-danger" ).remove();
  if (value==="detail" && (!temp.logo || !temp.email || !temp.phone || !temp.school || !temp.logo || !temp.whatsapp))
     return false;
  if (value==="academic" && (!temp.end || !temp.start || !temp.year))
    return false;
  if (value==="levels" && !temp.levelName)
    return false;
  if (value==="expenses" && !temp.expenseName)
    return false;
  if (value==="classes")
  {
    var levels = JSON.parse(data.levels);
    if (Array.isArray(levels))
    {
      for (var i = levels.length - 1; i >= 0; i--) {
        if(!temp[levels[i].levelName].classeName)
          return false;
      }
    }
    else if (!temp[levels.levelName].classeName)
      return false;
  }
  if (value==="subjects")
  {
      var levels = JSON.parse(data.levels);
      if (Array.isArray(levels))
        for (var i = levels.length - 1; i >= 0; i--) {
          if(temp[levels[i].levelName].length === 0)
              return false;
        }
      else if (temp[levels.levelName].length === 0)
        return false;
  }
  if (value==="costs")
  {
      var levels = JSON.parse(data.levels);
      if (Array.isArray(levels))
        for (var i = levels.length - 1; i >= 0; i--) {
          if(!temp[levels[i].levelName].costsName || !temp[levels[i].levelName].price)
            return false;
        }
      else if (!temp[levels.levelName].costsName || !temp[levels.levelName].price)
        return false;
  }
  return true;
}

function submit(value,inputs){
  var temp = {};
  if (value === "subjects")
  {
    var levels = JSON.parse(data.levels);
    if (!Array.isArray(levels.levelName))
      levels.levelName = [levels.levelName];
    for (var i = 0; i <= levels.levelName.length - 1; i++) {
      if ($('#subject-'+i).val().length > 0)
      {
         $('.subject-'+i).css("border-color", "#EFEFEF");
        temp[levels.levelName[i]]= $('#subject-'+i).val();
      }
      else {
        $('.subject-'+i).css("border-color", "#f6b8c1");
        return;
      }
    }
  } else if (value === "classes" || value === "costs")
  {
     var levels = JSON.parse(data.levels);
    if (!Array.isArray(levels.levelName))
      levels.levelName = [levels.levelName];
    for (var i = levels.levelName.length - 1; i >= 0; i--) {
      var tempo = {}
      for (var j = inputs.length - 1; j >= 0; j--) {
        var values = $('input[name='+inputs[j]+'-'+i+']')
            .map(function(){return $(this).val();}).get();
        var filtered = values.filter(function (el) {
          return el != "";
        });
        if (filtered.length > 0)
        {
          tempo[inputs[j]] = filtered.length > 1 ? filtered : filtered[0];
          $('input[name='+inputs[j]+'-'+i+']').css("border-color", "#EFEFEF");
          $('.costs-'+i).css("border-color", "#EFEFEF");
        }
        else
        {
          if (value === "costs")
          {
            $('.costs-'+i).css("border-color", "#f6b8c1");
            return;
          }
          else
          {
            $('input[name='+inputs[j]+'-'+i+']').css("border-color", "#f6b8c1");
            return;
          }
        }
      }
      temp[levels.levelName[i]] = tempo;
   }
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
      if (filtered.length > 0)
      {
        temp[inputs[i]] = filtered.length > 1 ? filtered : filtered[0];
        $('input[name='+inputs[i]+']').css("border-color", "#EFEFEF");
        $('.expensesInput').css("border-color", "#EFEFEF");
        $('.logo').css("border-color", "#EFEFEF");
      }
      else
      {
        if (value !== "expenses")
        {
          if (inputs[i] === "logo")
          $('.logo').css("border-color", "#f6b8c1");
          else
            $('input[name='+inputs[i]+']').css("border-color", "#f6b8c1");
          return;
        } else
        {
          $('.expensesInput').css("border-color", "#f6b8c1");
          return;
        }
      }
    }
    if (temp.logo)
      temp.logo = $('#output').attr("src");
  }

    data[value] = JSON.stringify(temp);
    saveData(value,data);
}

function saveData(value,data){
        
        $( ".alert-danger" ).remove();
        if (value === "levels")
          addLevels(JSON.parse(data.levels));
        if (value === "expenses")
          addExpenses(JSON.parse(data.expenses));
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
                return false;
              }*/
          });
        }
    };

function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    alert("You have entered an invalid email address!")
    return (false)
}

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
  if(data.levelName)
  {
     if (Array.isArray(data.levelName))
    for (var i = 0; i <= data.levelName.length - 1; i++) {
      $('#classes').append('<div class="dynamic-form-input-container"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input type="text" required name="classeName-'+i+'"><label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
      $('#subjectsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first subject-'+i+'"><div class="dynamic-form-input"><div class="form-group group"><select class="input-text-subject-select2" multiple name="language" id="subject-'+i+'"><option value="Bangladesh">Bangladesh</option><option selected value="Barbados">Barbados</option><option selected value="Belarus">Belarus</option><option value="Belgium">Belgium</option></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
      $('#costsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" id="costs-'+i+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first costs-'+i+'"><div class="dynamic-form-input"><div class="form-group group form-group-left"><input type="text" class="input-dropdown" required name="costsName-'+i+'"><label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label><img class="icon button-icon" src="assets/icons/caret.svg"><ul class="dynamic-form-input-dropdown-options expense-list"></ul></div><div class="form-group group form-group-right price-'+i+'"><input type="text" class="input-text" required name="price-'+i+'"><label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
    }
    else
    {
       $('#classes').append('<div class="dynamic-form-input-container"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input type="text" required name="classeName-'+0+'"><label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
        $('#subjectsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first subject-'+0+'"><div class="dynamic-form-input"><div class="form-group group"><select class="input-text-subject-select2" multiple name="language"  id="subject-'+0+'"><option value="Bangladesh">Bangladesh</option><option selected value="Barbados">Barbados</option><option selected value="Belarus">Belarus</option><option value="Belgium">Belgium</option></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
        $('#costsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" id="costs-'+0+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first costs-'+0+'"><div class="dynamic-form-input"><div class="form-group group form-group-left"><input type="text" class="input-dropdown" required name="costsName-'+0+'"><label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label><img class="icon button-icon" src="assets/icons/caret.svg"><ul class="dynamic-form-input-dropdown-options expense-list"></ul></div><div class="form-group group form-group-right price-'+0+'"><input type="text" class="input-text" required name="price-'+0+'"><label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
    }
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