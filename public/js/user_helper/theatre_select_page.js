// changing class in theatre selecting section
//button class changing

$(document).ready(function () {
    // for theatre data
    $('.slick-track li a').click(function (e) {

        e.preventDefault();
        e.stopPropagation();
        $(this).parent().siblings().removeClass()
        $(this).parent().siblings().addClass('date-details  slick-slide')
        $(this).parent().removeClass()
        $(this).parent().addClass('date-details _active slick-slide slick-current slick-active')


        let id = $(this).data('id');
        var date = $(this).data('date');
        let url = $(this).data('url')


        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "id": id, date: date })
        }).done(function (res) {

            let divv = "";
            res.data.map(d => d.theatres.forEach(item => {

                divv += ' <li class="list">' +
                    '<div class="listing-info">' +
                    '<div class="img-container">' +
                    '<span class="icon-star star"></span>' +
                    '</div>' +
                    '<div class="details">' +
                    '<span class="heart-it" data-id="CCKL">' +
                    '<i class="fa fa-heart" aria-hidden="true"></i>' +

                    '</span>' +
                    ' <span class="icon-location">' +
                    '<i class="fa fa-location-arrow" aria-hidden="true"></i>' +
                    '</span>' +
                    '<div class="__name ">' +
                    '<div class="__title">' +
                    '<a class="__venue-name" href="/buytickets/">' +
                    item.theatreName +
                    ' Cinemas:' + item.BuildingName +
                    ' , ' + item.city +
                    '</a>' +
                    '<div class="info-section">' +
                    '<img src="https://in.bmscdn.com/moviemode/cinemaphotoshowcase/safety_first.png"' +
                    'class="venue-info-icon lazy"' +
                    'onerror="this.src="https:/\/\in.bmscdn.com/m6/images/common/placeholder.png"; this.onerror="";">' +
                    '<div class="venue-info-text">INFO</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="st-distance _none">' +
                    '<span class="__dis-icon">' +
                    '<i class="fa fa-location-arrow" aria-hidden="true"></i>' +
                    '</svg>' +
                    '</span>' +
                    '<span class="__distance"></span>' +
                    '</div>' +
                    '<div class="unpaid-mticket-wrapper">' +

                    '<div class="__mticket-info">' +
                    '<span class="icon">' +
                    '<i class="fa fa-mobile" style="color:rgba(0, 128, 0, 0.661)"' +
                    ' aria-hidden="true"></i>' +
                    '</span>' +
                    '<label>M-Ticket</label>' +
                    '</div>' +
                    '<div class="__fnb-info ">' +
                    '<span class="icon">' +
                    '<i class="fa fa-burger-glass"></i>' +
                    '</span>' +
                    '<label>Food &amp; Beverage</label>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="body showtimes-details-container ">' +
                    '<div class="offer-details-container">' +
                    '</div>' +
                    '<div class="showtime-pill-wrapper">'
                d.showByDay.forEach(e => {
                    divv +=

                        `<div class="showtime-pill-container _sold">

                        <a class="showtime-pill show_time_url"
                            href="/home/bookticket/seat/${d._id}?&t=${e.startTime}&d=${res.obj.date}"
                            data-url="/home/bookticket/seat/${d._id}?&t=${e.startTime}&d=${res.obj.date}"
                            data-id="${d._id}" data-time="${e.startTime}" data-date="${e.startTime}&d=${res.obj.date}"
                            data-date="${res.obj.date}">      

                             <div class="__text">
                                    ${moment(e.startTime, ["HH.mm"]).format("hh:mm A")}                           
                             </div>

                        </a>
                    </div>`

                })


                divv += `</div>
                    <div class="venue-flags">
                    <span class="gold-icon"></span>
                    <span class="venue-flags-details">Cancellation Available</span>
                    </div>
                    </div>
                    </li>`


            }))
            $("#venuelist").html(divv)
            console.log(divv)
        })

    })
   
})