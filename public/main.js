//Placeholder for main form on page load
$(document).ready(function() {
  $("#search").focus();
});


//Autocomplete search field
$.getJSON("/inklist")
  .done(function(data){
    $( function() {
      $( "#search" ).autocomplete({
        source: data,
        minLength: 2,
        select: function(event, ui) { 
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

//Hamburger
function navbarDrop() {
  $('.main-nav').toggleClass("mobileNav");
}

//ADD INK DROPDOWN
/* Toggle dropdown searchbox*/
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  $("#inktoadd").focus();
  event.stopPropagation();
}
// Hide searchbox when user clicks anywhere but searchbox
$(document).click(function(event){
  if (!$(event.target).is('.searchbox, .fa, .submit-location')) {
    $(".dropdown-content").removeClass("show");
  }
});

//Reset submit icons in Add Ink dropdown
var callback = function() {
  $("#addResult").html('<i class="fa fa-plus"></i>')
};
$("input").keypress(function() {
  callback();
});
$('.searchbox, .dropbtn').click(callback);


//add ink ajax
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

//PRESS CHECKBOX LOGIC
//uncheck press checkbox if ntmd/shlf radio button checked
$(".select-checkbox").click(function(){
  $(':radio').each(function () {
    $(this).prop('checked');
    $('input[type="radio"]').prop('checked', false);
  })
});

//uncheck press checkbox if ntmd/shlf radio button checked
$(".select-radio").click(function(){
  $(':checkbox').each(function () {
    $(this).prop('checked');
    $('input[type="checkbox"]').prop('checked', false);
  })
});

//Submit search
$('#searchform').submit(function(e){
  e.preventDefault();
  $("#result").removeClass("bucket-name-placeholder");
  $("#resultloc0").html(''), 
  $("#resultloc1").html(''), 
  $("#resultloc2").html(''),
  $("#resultloc3").html(''),
  $("#resultloc4").html(''),
  $("#resultloc5").html(''),
  $("#resultloc6").html(''),
  $("#resultloc7").html(''),
  $("#resultloc8").html(''),
  $("#resultloc9").html(''),
  $('input[type="checkbox"]').prop('checked', false);
  $('input[type="radio"]').prop('checked', false);
  
  inkInput = $("#search").val().replace(/ /g, '+')

  $.ajax({
    url: "/search?q=" + inkInput
  }).done(function(r) {
    
    //bucket name
    const ink = r.data;

    if (ink) {
      $("#result").html(r.data.ink);
      $("#form").attr('data-id', r.data._id);
       //current location(s)
      var locArray = [
        $("#resultloc0").html(r.data.location[0]).html(), 
        $("#resultloc1").html(r.data.location[1]).html(), 
        $("#resultloc2").html(r.data.location[2]).html(),
        $("#resultloc3").html(r.data.location[3]).html(),
        $("#resultloc4").html(r.data.location[4]).html(),
        $("#resultloc5").html(r.data.location[5]).html(),
        $("#resultloc6").html(r.data.location[6]).html(),
        $("#resultloc7").html(r.data.location[7]).html(),
        $("#resultloc8").html(r.data.location[8]).html(),
        $("#resultloc9").html(r.data.location[9]).html()
      ]
  
      for (var i = 0; i < locArray.length; i++) {     //loop through current locations of ink 
        if (locArray[i] == 'NTMD') {                  //if locArray is press 
          $('#select-ntmd').prop('checked', true);    //check checkbox
        } 
        if (locArray[i] == 'SHLF') {            
          $('#select-shlf').prop('checked', true); 
        } 
        if (locArray[i] == 'C218') {            
          $('#select-c218').prop('checked', true); 
        } 
        if (locArray[i] == "C312") {           
          $('#select-c312').prop('checked', true);
        }
        if (locArray[i] == "C318") {           
          $('#select-c318').prop('checked', true);
        }
        if (locArray[i] == "GA18") {           
          $('#select-ga18').prop('checked', true);
        }
        if (locArray[i] == "MANL") {           
          $('#select-manl').prop('checked', true);
        }
        if (locArray[i] == "SMPL") {           
          $('#select-smpl').prop('checked', true);
        }
        if (locArray[i] == "SP10") {           
          $('#select-sp10').prop('checked', true);
        }
        if (locArray[i] == "SP14") {           
          $('#select-sp14').prop('checked', true);
        }
      }
    } else
      $("#result").html('No match found');
  }).fail(function(err) {
    console.error(err); 
  }); 
  $("#search").autocomplete( "close" );
  //CLEAR SEACHBOX
  $("#searchform").each(function(){
    this.reset();
  });
});

//JQUERY SORTABLE
// $( function() {
//   $( ".sortable" ).sortable({
//     placeholder: "ui-state-highlight"
//   });
//   $( ".sortable" ).disableSelection();
// } );

//update location
$("body").on('click', '.update-loc', function() { //CLICK PRESS NAME FROM TOP FORM
  var inkid = $(this).parent().parent().parent().attr('data-id'); //GET DATA ID OF FORM
  $.ajax({
    type: "POST",
    url: '/' + inkid + '?_method=PUT',
    data: $(this).parent().parent().parent().serialize(),
    success: function() {
      $(".inuse").load(location.href + " .inuse > * ","");  //PROBLEM
    } 
  });
});

// inuse scroll animations
$(".sortable").scroll(function() {
  let scroll = $(this).scrollTop();
  let opacity = 1 - (scroll / 500);
  if (opacity > 0) {
    $(this).siblings('.press-header').css('opacity', opacity);

    if (opacity < 0.2) {
      $(this).siblings('.press-header').css('opacity', '0.15');
    }
  }
});
$('.sortable').on('scroll', function() {
  let bottom = $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight
  if (bottom) {
    $(this).addClass('sortableFade');
    $(this).siblings('.press-header').css('opacity', '0.15');
  } else {
    $(this).removeClass('sortableFade');
  }
})


//unique id for ink in use
// var inkInUse = 0;
// $('.ui-state-default').each(function(){
//   inkInUse++;
//     var newID='ui-state-default' + inkInUse;
//     $(this).attr('id', newID);
// });

//search from inuse
$(document).on("click", ".ui-state-default", function(e){

  e.preventDefault();
  $("#result").removeClass("bucket-name-placeholder");
  $("#resultloc0").html(''), 
  $("#resultloc1").html(''), 
  $("#resultloc2").html(''),
  $("#resultloc3").html(''),
  $("#resultloc4").html(''),
  $("#resultloc5").html(''),
  $("#resultloc6").html(''),
  $("#resultloc7").html(''),
  $("#resultloc8").html(''),
  $("#resultloc9").html(''),
  $('input[type="checkbox"]').prop('checked', false);
  $('input[type="radio"]').prop('checked', false);

  inkInput = $(this).html().replace(/ /g, '+')
  // alert(inkInput)
  $.ajax({
    url: "/search?q=" + inkInput
  }).done(function(r) {
    
    //bucket name
    const ink = r.data;

    if (ink) {
      $("#result").html(r.data.ink);
      $("#form").attr('data-id', r.data._id);
       //current location(s)
      var locArray = [
        $("#resultloc0").html(r.data.location[0]).html(), 
        $("#resultloc1").html(r.data.location[1]).html(), 
        $("#resultloc2").html(r.data.location[2]).html(),
        $("#resultloc3").html(r.data.location[3]).html(),
        $("#resultloc4").html(r.data.location[4]).html(),
        $("#resultloc5").html(r.data.location[5]).html(),
        $("#resultloc6").html(r.data.location[6]).html(),
        $("#resultloc7").html(r.data.location[7]).html(),
        $("#resultloc8").html(r.data.location[8]).html(),
        $("#resultloc9").html(r.data.location[9]).html()
      ]
  
      for (var i = 0; i < locArray.length; i++) {     //loop through current locations of ink 
        if (locArray[i] == 'NTMD') {                  //if locArray is press 
          $('#select-ntmd').prop('checked', true);    //check checkbox
        } 
        if (locArray[i] == 'SHLF') {            
          $('#select-shlf').prop('checked', true); 
        } 
        if (locArray[i] == 'C218') {            
          $('#select-c218').prop('checked', true); 
        } 
        if (locArray[i] == "C312") {           
          $('#select-c312').prop('checked', true);
        }
        if (locArray[i] == "C318") {           
          $('#select-c318').prop('checked', true);
        }
        if (locArray[i] == "GA18") {           
          $('#select-ga18').prop('checked', true);
        }
        if (locArray[i] == "MANL") {           
          $('#select-manl').prop('checked', true);
        }
        if (locArray[i] == "SMPL") {           
          $('#select-smpl').prop('checked', true);
        }
        if (locArray[i] == "SP10") {           
          $('#select-sp10').prop('checked', true);
        }
        if (locArray[i] == "SP14") {           
          $('#select-sp14').prop('checked', true);
        }
      }
    } else
      $("#result").html('No match found');
  }).fail(function(err) {
    console.error(err); 
  }); 
});

//Inuse Inks Animations
$(document).ready(function scrollAnimations() {
  $(".sortable").scroll(function() {
    let scroll = $(this).scrollTop();
    let opacity = 1 - (scroll / 500);
    if (opacity > 0) {
      $(this).siblings('.press-header').css('opacity', opacity);

      if (opacity < 0.2) {
        $(this).siblings('.press-header').css('opacity', '0.15');
      }
    }
  });
  $('.sortable').on('scroll', function() {
    let bottom = $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight
    if (bottom) {
      $(this).addClass('sortableFade');
      $(this).siblings('.press-header').css('opacity', '0.15');
    } else {
      $(this).removeClass('sortableFade');
    }
  })  
});



