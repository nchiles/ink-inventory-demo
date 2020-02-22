//Dim background and show loading animation on page load
var $loading = $('#loadingDiv, #backgroundDim').hide();
$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });

//Autocomplete search field
$.getJSON("/inklist")
  .done(function(data){
    $( function() {
      $( "#search" ).autocomplete({
        source: data,
        minLength: 2,
        select: function(ui) { 
          $("#search").val(ui.item.label);
          $("#searchform").submit();
          $("#searchform").each(function(){
            this.reset();
          });
        }
      });
    });
  })
  .fail(function(){
    console.log("error getting inklist");
  })


//Sroll top - when the user scrolls down 20px, show button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollTopBtn").style.display = "none";
  }
}

function topFunction() {
  $("html, body").animate({ scrollTop: 0 })
}


//Search and go to ink
$('#scrollform').on('submit', function(e){  
  e.preventDefault(); 
  var ink = '#' + $('#search').val().split(' ').join('_');
  window.scrollTo(0, $(ink).offset().top - $(window).height()/10);
});


//Add Ink dropdown
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  $("#inktoadd").focus();
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('#addform')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


//Hamburger
function navbarDrop() {
  $('.main-nav').toggleClass("mobileNav");
}


//Add Ink ajax
$('#addform').on('submit', function(e){
  e.preventDefault(); 

  ink = $("#inktoadd").val()

  $.ajax({
    type: "POST",
    url: 'add-ink',
    data: {
      ink: ink,
    }
  }).done (function(r) {
      if (ink) {
        $("#addResult").html('<i class="fa fa-check"></i>');
      } else {
        $("#addResult").html("error");
      }
  }).fail(function(err) {
    console.error(err);
    $("#addResult").html('<i class="fa fa-times"></i>'); 
  });
  $('#addform').each(function(){
    this.reset();
  });
});


//Press checkbox button logic
//uncheck press checkbox if ntmd/shlf radio button checked
$(".select-checkbox").click(function(){
  $(this).prop('checked');
  $(this).parent().parent().siblings().children().children('input[type="radio"]').prop('checked', false);
});
  
//uncheck press checkbox if ntmd/shlf radio button checked
$(".select-radio").click(function(){
  $(this).prop('checked');
  $(this).parent().parent().siblings().children().children('input[type="checkbox"]').prop('checked', false);
});

//update location of ink by clicking checkbox
$(".update-form").click(function() {
  var inkid = $(this).parent().parent().parent().parent().attr('data-id');
  $.ajax({
    type: "POST",
    url: '/all-inks/' + inkid + '?_method=PUT',
    data: $(this).parent().parent().parent().parent().serialize(),
    success: function() {
    }
  });
});


//Give each ink form a unique ID from the bucket-name text (used when searching for an ink)
$('.allInksForms').each(function(){
    var newID = $(this).find(".bucket-name").text().split(' ').join('_');
    $(this).attr('id', newID);
});


//Give each input a unique ID - (used when changing location of ink)
var a = 0;
$('.select-ntmd-input').each(function(){
    a++;
    var newID='select-ntmd-input' + a;
    $(this).attr('id', newID);
});

var b = 0;
$('.select-shlf-input').each(function(){
  b++;
  var newID='select-shlf-input' + b;
  $(this).attr('id', newID);
});

var c = 0;
$('.select-c218-input').each(function(){
  c++;
  var newID='select-c218-input' + c;
  $(this).attr('id', newID);
});

var d = 0;
$('.select-c312-input').each(function(){
  d++;
  var newID='select-c312-input' + d;
  $(this).attr('id', newID);
});

var e = 0;
$('.select-c318-input').each(function(){
  e++;
  var newID='select-c318-input' + e;
  $(this).attr('id', newID);
});

var f = 0;
$('.select-ga18-input').each(function(){
  f++;
  var newID='select-ga18-input' + f;
  $(this).attr('id', newID);
});

var g = 0;
$('.select-manl-input').each(function(){
  g++;
  var newID='select-manl-input' + g;
  $(this).attr('id', newID);
});

var h = 0;
$('.select-smpl-input').each(function(){
  h++;
  var newID='select-smpl-input' + h;
  $(this).attr('id', newID);
});

var i = 0;
$('.select-sp10-input').each(function(){
  i++;
  var newID='select-sp10-input' + i;
  $(this).attr('id', newID);
});

var j = 0;
$('.select-sp14-input').each(function(){
  j++;
  var newID='select-sp14-input' + j;
  $(this).attr('id', newID);
});


//Give each label a unique ID - (used when changing location of ink)
var aa = 0;
$('.select-ntmd-label').each(function(){
    aa++;
    var newID='select-ntmd-input' + aa;
    $(this).attr('for', newID);
});

var bb = 0;
$('.select-shlf-label').each(function(){
  bb++;
  var newID='select-shlf-input' + bb;
  $(this).attr('for', newID);
});

var cc = 0;
$('.select-c218-label').each(function(){
  cc++;
  var newID='select-c218-input' + cc;
  $(this).attr('for', newID);
});

var dd = 0;
$('.select-c312-label').each(function(){
  dd++;
  var newID='select-c312-input' + dd;
  $(this).attr('for', newID);
});

var ee = 0;
$('.select-c318-label').each(function(){
  ee++;
  var newID='select-c318-input' + ee;
  $(this).attr('for', newID);
});

var ff = 0;
$('.select-ga18-label').each(function(){
  ff++;
  var newID='select-ga18-input' + ff;
  $(this).attr('for', newID);
});

var gg = 0;
$('.select-manl-label').each(function(){
  gg++;
  var newID='select-manl-input' + gg;
  $(this).attr('for', newID);
});

var hh = 0;
$('.select-smpl-label').each(function(){
  hh++;
  var newID='select-smpl-input' + hh;
  $(this).attr('for', newID);
});

var ii = 0;
$('.select-sp10-label').each(function(){
  ii++;
  var newID='select-sp10-input' + ii;
  $(this).attr('for', newID);
});

var jj = 0;
$('.select-sp14-label').each(function(){
  jj++;
  var newID='select-sp14-input' + jj;
  $(this).attr('for', newID);
});

