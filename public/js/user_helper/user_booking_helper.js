
//seat layout helper
$(document).ready(function () {
    let arr = [];
    $('.seatI a').on('click', function (e) {
        e.preventDefault();

        //checking for not selecting __blocked class // limiting 10 seats
        if ($(this).hasClass('_available') || $(this).hasClass('_selected')) {
            if ($('._selected').length < 10) {
                $(this).toggleClass('_available _selected')
            } else {
                $(this).removeClass().addClass('_available')
            }
        }

        // storing all selected items data into a array
        arr = $('._selected').map((i, e) => {
            let obj = { "seatDetail": $(e).data('num'), "price": $(e).data('price'), "id": $(e).data('id'), cate: $(e).data('cate') }
            return obj;
        }).get()


        // checking is any seat selected or not 
        if (arr.length >= 1) {
            $('#bottom_pay').css('display', "flex");
            let price = 0;
            let value = arr.map((v, i) => {
                price += parseInt(v.price);
            })

            $('#btmcntbook span').text(price)

        } else {
            $('#bottom_pay').css('display', "none")
        }
    })

    //entering ticket confirm section and food section
    $('#btmcntbook').on('click', (e) => {
        e.preventDefault();
        $.ajax({
            url: '/home/payment_one',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(arr),

        }).done((d) => {
            $('body').html(d)

            //food details
            //seat price 
            var groupBy = function (xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };
            filteredArray = groupBy(arr, 'cate')
            let zz = Object.entries(filteredArray)

            let seat_details = ""
            let price = 0;

            zz.forEach((val, inx) => {
                val[1].forEach((aVal, aInx) => {
                    seat_details += aVal.seatDetail + " "
                    price += aVal.price
                })
            })
            $(".__ticket-cat").append($('<span id="TickCat" class="seat-type" >' + zz[0][0] + ' -  &nbsp;' + seat_details + '<span id="TickQuantity">( ' + `${seat_details.split(" ").length - 1}` + 'Tickets )</span >' + '<br><span id="audiInfo">SCREEN</span>'))
            // $("#TickQuantity").text()

            $("#seatPri").append(" Rs.  " + price + " .00")
            let amt = parseInt(price) + 47.20;
            $("#subTT").append(" Rs.  " + amt)
            $("#ttPrice").append(" Rs.  " + amt)
            $("#PayTotal").append(" Rs.  " + amt)

            let seatPrice = arr.map((v, i) => {
                price += parseInt(v.price);
            })


        })

    })
    //heading section
    //parsing data 
    let data_from_seats = JSON.parse(data);
    //header 
    //add movie name 
    let movieName = `${data_from_seats[0].movie[0].movieName}`;
    let theatreName = `${data_from_seats[0].theatre[0].theatreName}`;
    let city = `${data_from_seats[0].theatre[0].city}`;
    let date = `${data_from_seats[0].show_seats.showByDate.shows.showTime}`;
    let time = `${date.split("T")[1]}`;

    $('#strEvtName').append(`${movieName}`)
    $("#strVenName").append(`${theatreName} : ${city} `)
    // 'Monday,Jun 13, 2022, 03:15 PM'
    let d_time = ` ${date.split("T")[0]} ${moment(time, ["HH.mm"]).format("hh:mm A")}`
    $("#strDate").append(d_time)

    console.log(data_from_seats)

    //adding foods
    let elm = ""

    // createdAt: 1655126845454
    // foodName: "Popcorn Cone Cheese "
    // food_qty: "120gms"
    // food_uid: "0111ed"
    // image: { image_url: '2022-06-13T13:27:25.449Zlarge-small-popcorn-boxes-ticket-260nw-529856704.jpg' }
    // price: "120"
    // theatreId: "629087fb96e2a9f4bacc1a80"
    // theatreOwn: "627ac636e50c76c3190fbb0f"
    // veg: "false"
    // _id: "62a73b3d40994be72d827e00"


    data_from_seats[0].foods.forEach((val, ind) => {
        elm +=
            `<aside class="fnb-body" data-category="PO" data-uid="${val.food_uid}">
                <div class="fnb-div">
                    <div class="img"><img
                        src=http://localhost:3000/uploads/${val.image.image_url}
                        onerror="this.src='//in.bmscdn.com/bmsin/callouts/foodc.jpg'">
                        <div class="price-tag"><span class="__amount"><svg version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 100 100" enable-background="new 0 0 100 100"
                            xml:space="preserve">
                            <use xlink:href="/icons/common-icons.svg#icon-rs"></use>
                        </svg>${val.price}</span><span class="__price-tag all-excl-combos"></span>
                        </div>
                    </div>
                    <div class="description" id="desc_1020004-2957">
                        <div class="foodtype-indicator"><svg version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14"
                            viewBox="0 0 26 24" fill="none">&gt ;<use
                                xlink:href="/icons/fnb-icons.svg#icon-veg"></use></svg></div>
                        <div class="item-desc">
                            <h2><span class="_veg"></span><span
                                class="item-sname detail-sname">${val.foodName}</span></h2>
                            <p class="tr-desc">${val.foodName}</p>
                            <p style="display:none;"
                                class="detail-desc">${val.foodName}</p>
                        </div>
                        <div class="qty"><span  class="add-btn">ADD</span><span
                                style="display:none;" class="icon-minus">
                                <div class="minus-icon"></div>
                            </span><span  class="__holder"></span>
                            <span style="display:none;" class="icon-minus">
                                <div class="plus-icon"></div>
                            </span></div>
                    </div>
                </div>
            </aside>`

    })
    $("#fnbcall").append(elm)





})

