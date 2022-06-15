//seat layout helper
var orderId;
var array = [];
var arrData=[];
var totalSeats=0;
var totalSeatNames=0;
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
            let objectArray = Object.entries(filteredArray)
            array=objectArray;

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

            arrData = JSON.parse(arrData)
       ;

        })

    })



    //heading section
    let data_from_seats = JSON.parse(data);
    console.log("arrData=====>",typeof(arrData),arrData)
    console.log("data_from_seats=====>", typeof (data_from_seats), data_from_seats)
   
    
    //header 
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


   let m = `
        <div>
            <h3>${movieName} (U/A)</h3>
            <address>${language}, 2D</address>
            <address>${theatreName}: ${BuildingName}, ${city} (${theatreName})</address>
            <address>M-Ticket</address><span>GOLD - E7, E8</span><br>
            <span class="__date">${full_date.split(" ").slice(0,4)}<br>
          ${moment(time, ["HH.mm"]).format("hh:mm A")}</span>
        </div>
        <div><span class="__no-of-tickets"><b>${totalSeats}</b><br>Tickets</span></div> 
    `
    

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
    
    $("#prePay").on("click", (e) => {
        
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
                "amount": `${Math.floor((parseInt(price) + 47.20) * 100) }`
            }),
        };
        let spinner = `<div class="text-center mt-5">
                            <div class="spinner-border mt-5" role="status">
                                <span class="sr-only mt-5">Loading...</span>
                            </div>
                        </div>`

        
        $('body').html(spinner)
        //creates new orderId everytime
        $.ajax(settings).done(function (response) {
            
            orderId = response.orderId;
            // console.log(response);
            
            $('body').html(response.html);
            $('#orderId').append(`<div id="orderId" style="display:none;" data-orderId="${orderId}"></div>`)
            $('.event').append(m)
            console.log(seat_details)
        })
    });


    $('#Pay_now').click((e) => {
  
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




