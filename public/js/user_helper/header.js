$(document).ready(()=>{
    $("#headerSideNav").click( function () {
        $("#sideNav").toggleClass('d-block d-none')
    })
    $(".gPINdS").click(function(){
        alert("MMM")
        console.log($(this).data('id'))
    })
})


