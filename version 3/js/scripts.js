$(function() {
    AOS.init({
        disable: 'mobile'
    });

    $("[rel=tooltip]").tooltip({html:true});

    $('#qualify-modal').on('shown.bs.modal', function (e) {
        if ($('body').width() > 768) {
            $("#pay-slider").slider({
                ticks: [0, 1500],
                ticks_labels: ['$0', '$1,500+'],
                tooltip: 'always',
                formatter: function(value) {
                    return '$' + value + '/qtr';
                }
            });
        }
         
    });

    /* SEB UPDATE 31st Jan */

    $('body').on('click', '.validatesignup', function(e){
    
        var emailsignup = $('#emailsignup').val();
        
        var passsignup = $('#passwordsignup').val();
        
        if(emailsignup == "") {
            $('#userName-error.blockdisplay').show();
        }
        if(passsignup == "") {
            $('#password-error.blockdisplay').show();
        }
       

     }) 

    $('body').on('click', '.validatelogin', function(e){
    
        var emaillogin = $('#emaillogin').val();
        
        var passlogin = $('#passwordlogin').val();
        
        if(emaillogin == "") {
            $('#userName-error-login.blockdisplay').show();
        }
        if(passlogin == "") {
            $('#password-error-login.blockdisplay').show();
        }
       

     }) 


    $('body').on('click', '.forgotpass', function(e){
         var w = jQuery(window).width();
           if (w < 992) {
             
              $('.scrolluplogin').animate({ 'marginTop': '-720px', opacity: 0 }, 1000);  
              $('.forgotpasswordbox').fadeIn(500);
              $('.form-login').fadeOut(500);
           } else {
              $('.scrolluplogin').animate({ 'marginTop': '-520px', opacity: 0 }, 1000);
               $('.forgotpasswordbox').fadeIn(500);
           } 
        
     }) 
    
    $('body').on('click', '.validatepasswordlogin', function(e){
    
        var emaillogin = $('#emailpasswordlogin').val();
        
        
        if(emaillogin == "") {
            $('#userName-error-passwordlogin.blockdisplay').show();
        }
      
       

     }) 

    $('body').on('click', '.validatepasswordsignup', function(e){
    
        var emaillogin = $('#emailpasswordsignup').val();
        
        
        if(emaillogin == "") {
            $('#userName-error-passwordsignup.blockdisplay').show();
        }
      
       

     }) 

    /* END OF UPDATE */


    var form = $("#example-form");
    form.validate({
        errorPlacement: function errorPlacement(error, element) { element.before(error); }
       
    });


    form.children("#funnel-steps").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        stepsOrientation: "vertical",
        transitionEffectSpeed: 800,
        labels: {
            finish: "Grab my Spot Now!",
            next: "Let\s Begin!",
            previous: "Previous"
        },
        onInit: function(event, currentIndex) {
            $(event.target).find('.steps').insertAfter($(event.target).find('.content'));
            $('.wizard > .content').css('height', $('.wizard > .content .body.current').outerHeight());
            $('.wizard > .content, .wizard > .actions, .wizard > .steps').removeClass('clearfix');
            $('.funnel-summary-wrapper h3').prependTo('.wizard .steps');
            $('.funnel-summary-wrapper .funnel-summary').appendTo('.wizard .steps');
            $('.steps ul li.first').addClass('done');
            
        },
        onStepChanged: function (event, currentIndex, priorIndex) { 

            if (currentIndex < priorIndex) {

               if($('#funnel-steps-t-' + currentIndex).parent('li').hasClass('first')) {
                 $('#funnel-steps-t-' + currentIndex).parent('li').removeClass('current');
                 $('#funnel-steps-t-' + currentIndex).parent('li').addClass('done');
                 $('#funnel-steps-t-' + priorIndex).parent('li').removeClass();
               } else {
                 $('#funnel-steps-t-' + priorIndex).parent('li').removeClass();
               }
              
               
              
            }

        }, 
        onStepChanging: function (event, currentIndex, newIndex) {

            
          
           

            $('.wizard > .content').css('height', $('#funnel-steps-p-' + newIndex).outerHeight());


             if (newIndex < currentIndex) {
                if( $('#funnel-steps-t-' + newIndex).parent('li').hasClass('first')) {

                  $('#funnel-steps-t-' + newIndex).parent('li').removeClass('current');
                  $('#funnel-steps-t-' + newIndex).parent('li').removeClass('done');
                  $('#funnel-steps-t-' + currentIndex).parent('li').removeClass();
                  $('#funnel-steps-t-' + currentIndex).parent('li').addClass('tempback');
               } else {

                  $('#funnel-steps-t-' + currentIndex).parent('li').removeClass();
                  $('#funnel-steps-t-' + currentIndex).parent('li').addClass('tempback');
                }
                $('.wizard > .actions a').show()
            }

            if (newIndex == 0 ) {
                $('.wizard .actions a[href="#next"]').text("Let's Begin!");

            } else {
                $('.wizard .actions a[href="#next"]').text("Continue");
            }
            if (newIndex == 1 ) {
                 var w = jQuery(window).width();
                 if (w > 991) {
                    $('.wizard > .content').css('height', '427px');
                 }   
                  if($('.emailsignin').hasClass('opened')) {
                 form.validate().settings.ignore = ":disabled";
                 return form.valid();
            } else {}
            }
            if (newIndex == 2 ) {

              var w = jQuery(window).width();
                 if (w > 991) {
                    $('.wizard > .content').css('height', '427px');
                 }   
                 var i;
                 var matches = [];
                 $('.custom-checkbox input:checked').each(function() {
                    matches.push(this.value);
                 });
                    var checklist="";
                    for (i = 0; i < matches.length; ++i) {
                        checklist += matches[i]+"<br>";
                    }
                    if(checklist == "") {
                      $('.pleaseselect').fadeIn();
                      return false;
                    } else {
                      $('.pleaseselect').hide();
                    }
            }
            if (newIndex == 3) {
                  var w = jQuery(window).width();
                 if (w < 992) {
                    $('.steps ul li:nth-child(4)').show(); 
                    $('.steps ul li:nth-child(1)').hide(); 
                  }  
                var matches = [];
                $('.custom-checkbox input:checked').each(function() {
                    matches.push(this.value);
                });
               
                var i;
                var checklist="";
                for (i = 0; i < matches.length; ++i) {
                    checklist += matches[i]+"<br>";
                    //console.log(matches[i]);
                    // do something with `substr[i]`
                }
                $('p.checklist').html(checklist);



                var radiochoice = $('input.chb:checked').val();
                 $('p.checkday').html(radiochoice);
                 $('.goalradio').html(radiochoice);
                 //alert(radiochoice);
                if(radiochoice == undefined) {
                      $('.pleaseselectradio').fadeIn();
                       if (w > 991) {
                          $('.wizard > .content').css('height', '427px');
                       }   
                      return false;
                    } else {
                      $('.pleaseselectradio').hide();
                }
               

                //$('.actions').append('<span>Limited spots available</span>');
                 $('.wizard > .actions a').hide();
            }


            return true;
        },
        onFinishing: function (event, currentIndex)
        {
            
        },
        onFinished: function (event, currentIndex) {
            window.location.href = 'dashboard.html';


        }

    });


    $('#toggle').click(function() {
        $('body').toggleClass('navbar-open');
    })
    $('body').on('click', '.emailsignin', function(e){
          e.preventDefault();
          //$('#funnel-steps .content').css('height','665px');
          $(this).addClass('opened');
           var w = jQuery(window).width();
           if (w < 992) {
               $('.wizard > .content').css('height', '440px');
              $('.disapear-email').animate({ 'marginTop': '-180px', opacity: 0 }, 1000);  
           } else {
              $('.disapear-email').animate({ 'marginTop': '-300px', opacity: 0 }, 1000);
           } 
          


          $('.enter-details').fadeIn(1000);
          $('.facebook').addClass('disabled');
          $('.google').addClass('disabled');
           

         // });
    });
   
    $(".chb").change(function()
    {
        $(".chb").prop('checked',false);
        $(this).prop('checked',true);
    });



    $('.group-tabs a').on('shown.bs.tab', function (e) {
        target = $(e.target).data('add-url') // newly activated tab
        $('#' + target).show().siblings('a').hide();
    })

    /* question sequence start*/
    $('#complete-profile .modal-body').on('scroll', function(){
        var someThreshold = 60;
        if ($('#complete-profile .modal-body').scrollTop() > someThreshold) {
            $('.modal').addClass('affix');
        }
        else {
            $('.modal').removeClass('affix');
        }
    });

    $('.update-profile input[type="radio"], .modal-footer .continue-btn').on('click', function() {
        proceed();
    });
    
    $('.update-profile input[type="checkbox"]').on('click', function() {
        checkprogress();
    });
    
    $('.modal-footer .continue-btn').on('click', function(){
      proceed();
    });
    
    //go back to previous step
    $('#complete-profile .up_arrow').on('click', function(){
      goback();
    });
  /* question sequence end*/


});
//update progress bar
function checkprogress(){
  var totalquestions = 5;
  var answered = 0;
  var progress = 0;
  if($('input[name=often]:checked').length > 0) answered++;
  if($('input[name=category]:checked').length > 0) answered++;
  $('#slide-3 input[type=checkbox]:checked').each(function(i){
          answered++;
          return false; 
  });
  
  if($('input[name=time]:checked').length > 0) answered++;
  if($('input[name=power-type]:checked').length > 0) answered++;
  progress = (answered / totalquestions)*100;
  $('.progress-bar').css('width', progress+'%');
}

//proceed to next step
function proceed(){
  checkprogress();
  if ($(window).width() < 767) {
    var currentslide = parseInt($('#complete-profile .up_arrow').attr('data-slide'));
    if(currentslide == 5){
      return false;
    } 
    
    var gotoslide = currentslide + 1;
    $( ".question-panel:nth-child("+currentslide+")" ).fadeOut( "slow", function() {
      $('#myModalLabel span').hide();
      $('.modal-footer .btn').hide();
      $( ".question-panel:nth-child("+gotoslide+")" ).fadeIn();
      $('#complete-profile .up_arrow').attr('data-slide', gotoslide);
      $('#complete-profile .up_arrow').show();
      
      if(gotoslide > 1  && gotoslide != 5) $('#myModalLabel #nearlytheretext').show();
      if(gotoslide == 3) $('.modal-footer .continue-btn').show();
      if(gotoslide == 5){ 
        $('#myModalLabel #lastquestext').show();
        $('.modal-footer .finish-btn').show();
      }
    });
  }
}

//go back to previous step
function goback(){
  var currentslide = parseInt($('#complete-profile .up_arrow').attr('data-slide'));
  var gotoslide = currentslide - 1;
  $( "#slide-"+currentslide ).fadeOut( "slow", function() {
      $('#myModalLabel span').hide();
      $('.modal-footer .btn').hide();
      $( "#slide-"+gotoslide ).fadeIn();
      $('#complete-profile .up_arrow').attr('data-slide', gotoslide);
      if(gotoslide == 1){
        $('#myModalLabel #completeprofiletext').show();
        $('#complete-profile .up_arrow').hide();
      } 
      if(gotoslide > 1) $('#myModalLabel #nearlytheretext').show();
      if(gotoslide == 3) $('.modal-footer .continue-btn').show();
      if(gotoslide == 5) $('.modal-footer .finish-btn').show();
    });
}

