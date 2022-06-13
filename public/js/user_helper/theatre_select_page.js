// changing class in theatre selecting section
//button class changing
$('.slick-track li').click(function (e) {
    // e.preventDefault();
    // e.stopPropagation();
    $(this).siblings().removeClass()
    $(this).siblings().addClass('date-details  slick-slide')
    $(this).removeClass()
    $(this).addClass('date-details _active slick-slide slick-current slick-active');
});

      // $(document).ready(function () {
            //     $(".date-href").click(function (e) {
            //         e.preventDefault();
            //         e.stopPropagation();

                    
            //         let id = $(this).data('id');
            //         let date = $(this).data('date');
            //         let url = $(this).data('url')
                     
            //         alert($(this).data("id") + $(this).data("date") + $(this).data("url"))

            //         $.ajax({
            //             url: url,
            //             type: "POST",
            //             contentType: "application/json",
            //             data: JSON.stringify({ "id":id, date:date }),
            //             success: (re) => {
            //                 let m = JSON.stringify(re)
            //                 $('section').html(`${m}`)
            //             }
            //         })

            //     })
            // })