$(function () {
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
    $( "#subscribe" ).click(function() {
        var email = $("#subscribe_email").val();
        if (isEmail(email)){
            $.post("../php/email_subscribe.php",{email:email},function(data){
                alert(data);
            });
        }else{
            alert("Please enter the correct email address!");
        }
    });
});
