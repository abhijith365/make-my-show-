
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
            // console.log(zz)
            //     < span id = "TickCat" class="__seat-type" > 
            // PLATINUM - D7, D8 
            // < span id = "TickQuantity" > (2 Tickets )</span ></span >
            let seat_details  = ""
           let price = 0;
            seat_details += zz[0][0]+" -  "
            zz.forEach((val,inx)=>{
                val[1].forEach((aVal,aInx)=>{
                    seat_details += aVal.seatDetail+"  "
                    price+=aVal.price
                })
            })
            $(".").append(seat_details + `< span id = "TickQuantity" >( ${seat_details.split("  ").length - 1} Tickets )</span >`)
            // $("#TickQuantity").text()
            console.log(seat_details,price)

            
            let seatPrice = arr.map((v, i) => {
                price += parseInt(v.price);
            })


        })

    })

    //adding foods
    let elem = `
                    <aside class="fnb-body" data-category="PO">
                    <div class="fnb-div">
                        <div class="img"><img
                                src="//in.bmscdn.com/bmsin/v2/Web-v2/d-combo/1020004_17082018144718.jpg"
                                onerror="this.src='//in.bmscdn.com/bmsin/callouts/foodc.jpg'">
                            <div class="price-tag"><span class="__amount"><svg version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                        viewBox="0 0 100 100" enable-background="new 0 0 100 100"
                                        xml:space="preserve">
                                        <use xlink:href="/icons/common-icons.svg#icon-rs"></use>
                                    </svg>60</span><span class="__price-tag all-excl-combos"></span>
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
                                        class="item-sname detail-sname">Cheese
                                        Popcorn</span></h2>
                                <p onclick="showFCDetails('1020004-2957')" class="tr-desc">Cheese
                                    Popcorn</p>
                                <p onclick="showFCDetails('1020004-2957')" style="display:none;"
                                    class="detail-desc">Cheese Popcorn</p>
                            </div>
                            <div class="qty"><span id="add-btn_1020004-2957" class="add-btn"
                                    onclick="fnAddFC('ADD','1020004-2957')">ADD</span><span
                                    id="rm_1020004-2957" style="display:none;" class="icon-minus"
                                    onclick="fnAddFC('REMOVE', '1020004-2957')">
                                    <div class="minus-icon"></div>
                                </span><span id="FD_1020004-2957" class="__holder"></span><span
                                    id="add_1020004-2957" style="display:none;" class="icon-minus"
                                    onclick="fnAddFC('ADD','1020004-2957')">
                                    <div class="plus-icon"></div>
                                </span></div>
                        </div>
                    </div>
                </aside>`



})

