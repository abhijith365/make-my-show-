//seat layout helper
var orderId;
var array = [];
var arrData = [];
var totalSeats = 0;
var totalSeatNames = 0;

$(document).ready(function () {
    var arr = [];


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
            let m = d.split('<section>')

            $('body').html(`
            <link rel="stylesheet" href="/css/user/booking.css">
<section class="bkf-layout" id="seat-layout" style="display: block;">
    <div class="container">
        <header class="bkf-header">

            <div class="header-container">
                <h2>
                    <!-- Event name -->
                    <div>
                        <span class="__event-name"><a id="strEvtName" href="#"></a></span>
                        <span class="icon-a" id="sen_a" style="display: none;">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100"
                                enable-background="new 0 0 100 100" xml:space="preserve">
                                <use xlink:href="/icons/common-icons.svg#icon-a"></use>
                            </svg>
                        </span>
                        <span class="icon-u" id="sen_u" style="display: none;">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100"
                                enable-background="new 0 0 100 100" xml:space="preserve">
                                <use xlink:href="/icons/common-icons.svg#icon-u"></use>
                            </svg>
                        </span>
                        <span class="icon-ua" id="sen_ua" style="display: inline-block;">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100"
                                enable-background="new 0 0 100 100" xml:space="preserve">
                                <use xlink:href="/icons/common-icons.svg#icon-ua"></use>
                            </svg>
                        </span>
                    </div>
                    <!-- Event details such as venue name and timing -->
                    <div>
                        <span class="__event-details">
                            <span id="strVenName"></span>
                            <span>|</span>
                            <span id="strDate" style="display: inline-block !important;"></span>
                        </span>
                    </div>
                </h2>

            </div>

        </header>
        <section id="bksmile" class="bkf-container _add-ons struktur" style="display: block;">

            <div id="fnbcont" class="add-ons-container">
                <!-- Book A Smile Container -->

                <!-- Food combo Container -->

                <div class="fnb-container" id="shfnb">
                    <div class="fnb-section">
                        <div class="block">
                            <h2 class="__heading-text-plus-red" id="grab-a-bite">Grab a <span>bite!</span><br><span
                                    class="sub-head fc-text" id="text-none">Now get your favorite snack at a<span
                                        class="highlight-text"> discounted price!</span></span>
                            </h2>

                            <!-- food section -->
                            <div class="fnb-container" id="fnbcall">

                            </div>

                            <p class="__note" id="text-none" style="display:none;">Please collect your food from the
                                counter</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Order summary section -->

            <div class="bkf-order-summary-container" style="margin-top: -85px;">
                <div class="order-summary-section">
                    <div class="order-summarywrap">
                        <div class="order-summary">
                            <span class="__circle-left"></span>
                            <span class="__circle-right"></span>
                            <h2>Booking Summary</h2>

                            <ul class="__details">
                                <li>
                                    <div>
                                        <p id="naGstBrkp">

                                        </p>
                                        <span class="__ticket-cat">

                                        </span>
                                    </div>
                                    <div><span id="seatPri" class="__seat-price"></span></div>

                                </li>
                                <li>
                                    <div>
                                        <p>
                                            <span class="txt_brkp">Convenience fees</span>
                                        </p>
                                    </div>
                                    <div><span id="bkfee">Rs.47.20</span></div>
                                    <div class="__breakdown" id="intHandlingFeeBreakdown">
                                        <ul>
                                            <li><span>Base Amount</span><span>Rs.40.00</span></li>
                                            <li><span>Integrated GST (IGST) @ 18%</span><span>Rs.7.20</span></li>
                                        </ul>
                                    </div>
                                </li>
                                <li id="dOtherCharges" style="display:none;"></li>
                                <li class="_total-section">
                                    <div>
                                        Sub total
                                    </div>
                                    <div><span id="subTT" class="__sub-total"></span></div>
                                </li>
                                <li id="fdd" class="__fnb-section" style="display:none;">
                                    <div>
                                        <span class="__up-icon up-icon-fandb" onclick="showBeverages();"
                                            style="display:none;">

                                                <use xlink:href="/icons/fnb-icons.svg#icon-downwards"></use>

                                        </span>
                                        <span class="__down-icon down-icon-fandb" onclick="showBeverages();">

                                                <use xlink:href="/icons/fnb-icons.svg#icon-dropdown"></use>

                                        </span>
                                        Food &amp; Beverage
                                        <!-- <a id="fdAll" onClick="showBeverages();" href ="javascript:;">Hide All</a> -->
                                        <span class="__trash-icon" ">

                                        </span>
                                    </div>
                                    <div id="fnbTotal"></div>
                                    <p id="fnbDiscount" style="display:none;" class="__discount-text">You've got Rs.
                                        <span></span>
                                    </p>
                                </li>


                                <!-- <li id ="dOtherCharges" style="display:none;"></li> -->
                                <li id="OffDis" style="display:none;"></li>
                                <li id="basDtl" class="bas-card">
                                    <div class="__bas-logo">
                                        <div class="__bas-checkbox">
                                            <form class="struktur">
                                                <div id="bascheckboxprocessing" class="_bas-processing"
                                                    style="min-width: 0% !important;">
                                                    <div class="mini-loader" style="display: none;">
                                                        <div class="mini">
                                                        </div>
                                                    </div>
                                                    <div class="bas-container">
                                                        <div class="__tick bas-icon">
                                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                                                y="0px" viewBox="0 0 100 100"
                                                                enable-background="new 0 0 100 100"
                                                                xml:space="preserve">
                                                                <use xlink:href="/icons/bookasmile-icons.svg#icon-bas">
                                                                </use>
                                                            </svg>
                                                        </div>
                                                        <label class="__bas-logo __bas-content">
                                                            <span id="basText" class="__bas-content-text"
                                                                style="color: rgb(0, 0, 0);">Contribution to
                                                                MakeASmile</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                        </div>
                        <div class="_total-section amt-payable">
                            <div>
                                Amount Payable
                            </div>
                            <div><span id="ttPrice" class="__amount-payable"></span></div>
                        </div>
                    </div>


                    <div class="disclaimer-container">
                        <div style="width: 13px; height: 13px;">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100"
                                enable-background="new 0 0 100 100" xml:space="preserve">
                                <use xlink:href="/icons/common-icons.svg#icon-info"></use>
                            </svg>
                        </div>
                        <div
                            style="font-family: Roboto; font-size: 12px; line-height: 16px; align-items: center; letter-spacing: 0.2px; color: #404040; margin-left: 5px;">
                            By proceeding, I express my consent to complete this transaction.
                        </div>
                    </div>
                    <div class="btn-bar fnb-proceed-btn">
                        <a id="btnseatdisab" href="javascript:;" class="btn _disable" style="display: none;">Please
                            wait...</a>
                        <div id="prePay" class="bar-btn _primary _full-width __fnb-btn" href="#"
                            style="display: flex;"><span class="__totalinbtn">TOTAL:
                                 <span id="PayTotal"></span></span>Proceed
                        </div>

                    </div>

                </div>
            </div>
        </section>
    </div>
</section>
<script>
    arrData='<% -JSON.stringify(data) %>'
</script>
<script src="/js/user_helper/user_booking_helper.js"></script>

<style>
    body{
        caret-color: rgba(0,0,0,0);
    }
</style>

            `)

            //food details
            //seat price 
            var groupBy = function (xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };
            filteredArray = groupBy(arr, 'cate')
            let objectArray = Object.entries(filteredArray)
            array = objectArray;

            let seat_details = ""
            let price = 0;

            objectArray.forEach((val, inx) => {
                val[1].forEach((aVal, aInx) => {
                    seat_details += aVal.seatDetail + " "
                    price += aVal.price
                })
            })
            $(".__ticket-cat").append($('<span id="TickCat" class="seat-type" >' + objectArray[0][0] + ' -  &nbsp;' + seat_details + '<span id="TickQuantity">( ' + `${seat_details.split(" ").length - 1}` + 'Tickets )</span >' + '<br><span id="audiInfo"></span>'))
            // $("#TickQuantity").text()

            $("#seatPri").append(" Rs.  " + price + " .00")
            let amt = parseInt(price) + 47.20;
            $("#subTT").append(" Rs.  " + amt)
            $("#ttPrice").append(" Rs.  " + amt)
            $("#PayTotal").append(" Rs.  " + amt)


        })

    })


    //heading section
    let data_from_seats = JSON.parse(data);

    //add movie name 
    let movieName = `${data_from_seats[0].movie[0].movieName}`;
    let theatreName = `${data_from_seats[0].theatre[0].theatreName}`;
    let BuildingName = `${data_from_seats[0].theatre[0].BuildingName}`;
    let language = `${data_from_seats[0].movie[0].language}`;
    let screen = `${data_from_seats[0].screen[0].screenName}`
    let city = `${data_from_seats[0].theatre[0].city}`;
    let date = `${data_from_seats[0].show_seats.showByDate.shows.showTime}`;
    let time = `${date.split("T")[1]}`;
    let full_date = `${new Date(date)}`;
    data_from_seats.map(i => { totalSeats += 1; totalSeatNames += i.seatDetail })

    $('#strEvtName').append(`${movieName}`)
    $("#strVenName").append(`${theatreName} : ${city} `)
    $('#audiInfo').append(`${screen}`)
    // 'Monday,Jun 13, 2022, 03:15 PM'
    let d_time = ` ${date.split("T")[0]} ${moment(time, ["HH.mm"]).format("hh:mm A")}`
    $("#strDate").append(d_time)



    //adding foods
    let elm = ""

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




    //payment first step

    $("#prePay").click( function (e){
        e.preventDefault()
        e.stopPropagation()
    
        let price = 0;

        array.forEach((val, inx) => {
            val[1].forEach((aVal, aInx) => {
                price += aVal.price
            })
        })
        var settings = {
            "url": "/auth/api/payment",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "amount": `${Math.floor((parseInt(price) + 47.20) * 100)}`
            }),
        };
        let spinner = `<div class="text-center my-5 py-5">
                            <div class="spinner-border my-5" role="status">
                                <span class="sr-only mt-5">Loading...</span>
                            </div>
                        </div>`


        $('body').html(spinner)
        //creates new orderId everytime
        $.ajax(settings).done(function (response) {

            orderId = response.orderId;
           
            $('body').html(`
            <link rel="stylesheet" href="/css/user/payment.css">
                <section class="payments">
                    <div class="main-body-wrapper">
                        <div class="payment-container">
                            <div class="wrapper">
                                <div class="order-info">
                                    <div id="dOrderSummaryWrap" class="order-summary">
                                        <h2>Order Summary</h2>
                                        <ul id="dOrderSummary" class="__details">
                                            <li class="event">
                                            <div>
                                                <h3>${movieName} (U/A)</h3>
                                                <address>${language}, 2D</address>
                                                <address>${theatreName}: ${BuildingName}, ${city} (${theatreName})</address>
                                                <address>M-Ticket</address><span>GOLD - E7, E8</span><br>
                                                <span class="__date">${full_date.split(" ").slice(0, 4)}<br>
                                                 ${moment(time, ["HH.mm"]).format("hh:mm A")}</span>
                                                </div>
                                                <div><span class="__no-of-tickets"><b>${totalSeats}</b><br>Tickets</span></div>

                                            </li>
                                            <li class="_sub-total-section">
                                                <div>Sub Total</div>
                                                <div><span class="__sub-total">Rs. ${price }</span></div>
                                            </li>
                                            <li data-type="BookingFees">
                                                <div>
                                                    <p><span>+ Convenience fees</span></p>
                                                </div>
                                                <div><span>Rs. 47.20</span></div>
                                                <div class="__breakdown">
                                                    <ul>
                                                        <li><span>Base Amount</span><span>Rs.40.00</span></li>
                                                        <li><span>Integrated GST (IGST) @ 18%</span><span>Rs.7.20</span></li>
                                                        <li><span></span><span></span></li>
                                                        <li><span></span><span></span></li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li class="_total-section">
                                                <div class="block">
                                                    <div>Amount Payable</div>
                                                    <div><span class="__amount-payble dTotal">Rs. ${ (parseInt(price) + 47.20) } </span></div>
                                                </div>
                                            </li>
                                            

                                                <div id="Pay_now" class="bar-btn _primary _full-width __fnb-btn" href="#" style="display: flex;">
                                                        Pay
                                                </div>
                                            <div id="orderId" style="display:none;" data-orderId="${orderId}"></div>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.0/sweetalert.min.js"></script>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <script src="/js/user_helper/user_booking_helper.js"></script>
                <style>
                    body{
                        caret-color: rgba(0,0,0,0);
                    }
                </style>
            
            `);

            // $('#orderId').append(`<div id="orderId" style="display:none;" data-orderId="${orderId}"></div>`)
            // $('.event').append(m)        
        })
    });


    $('#Pay_now').click(function (e){
        e.preventDefault();

        let price = 0;
        array.forEach((val, inx) => {
            val[1].forEach((aVal, aInx) => {
                price += aVal.price
            })
        })

        var options = {
            "key": "rzp_test_RI0cuiLHb592oX",
            "amount": `${Math.floor((parseInt(price) + 47.20) * 100)}`,
            "currency": "INR",
            "name": "Make My Show",
            "description": "Pay & Checkout",
            "order_id": $('#orderId').attr("data-orderId"),
            "handler": function (response) {
                // console.log(response);
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
                var settings = {

                    "url": "/auth/api/payment/verify",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({ response }),
                }

                $.ajax(settings).done(function (response) {

                    console.log(response)

                });

            },
            "prefill": {
                //Here we are prefilling random contact
                "contact": "8606817157",
                //name and email id, so while checkout
                "name": "Abhijith v",
                "email": "abhijith@gmail.com"
            },
            "theme": {
                "color": "#f84464"
            }
        };

        //error handling
        var razorpayObject = new Razorpay(options);
        razorpayObject.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        razorpayObject.open();
    })
})




