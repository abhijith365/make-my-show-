$(document).ready(()=>{
    $("#headerSideNav").click( function () {
        $("#sideNav").toggleClass('d-block d-none')
    })
    $(".gPINdS").click(function(){
        
        if ($(this).data('id') == 'purchace'){
            location.href = "/tickets"
        }
        else if ($(this).data('id') == "setting"){
            location.href = "/profile"
        }
    })
})


