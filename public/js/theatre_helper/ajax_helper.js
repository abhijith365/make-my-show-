
//filter function for shows 

$(document).ready(function () {
    $('.running-show').on('click', (e) => {
        e.preventDefault();

        $('#dropdownMenuButton').html(`Running Shows  &nbsp;&nbsp;`)
        $('#showHeader').html(`Running Shows`)

        // ajax call
        $.ajax({
            "url": "/theatre/shows/runningShows",
            "method": "POST",
            "timeout": 0,
            data: "{}",
            contentType: "application/json; charset=utf-8",
        }).done((res) => {

            let array = JSON.parse(res) 
            let elm = "";

            if (array) { 
                array.forEach(arr => {
                    elm += ` <div class="col-sm-4">
                                    <div class=" card">
                                        <img class="card-img-top"
                                            src="http://localhost:3000/uploads/${arr.movie[0].images[0].image_url}"
                                            style="height: 220px;" alt="Card image cap">
                                        <div class="card-body">

                                            <h3 class="card-text h4 pb-2">
                                                ${arr.movie[0].movieName}
                                            </h3>

                                            <p class="card-text ">
                                                <b>SHOW TYPE : </b>
                                                ${arr.showType}
                                            </p>
                                            <!-- <p class="card-text">
                                                <b>THEATRE NAME : </b>
                                                <!--/*arr.screen[0].screenId */-->
                                            </p> -->
                                            <p class="card-text">
                                                <b>SCREEN ID : </b>
                                                ${arr.screen[0].screenId}
                                            </p>
                                            <p class="card-text">
                                                <b>SCREEN NAME : </b>
                                                ${arr.screen[0].screenName}
                                            </p>
                                            <p class="card-text">
                                             <b> SHOW DAYS: </b>
                                                    ${new Date(arr.showByDate.startDate).toISOString().split('T')[0]}
                                                     TO
                                                 ${new Date(arr.showByDate.endDate).toISOString().split('T')[0]}
                                             </p>

                                            <div class="text-center">
                                                <a href="/theatre/show/${arr._id}"
                                                    class="btn btn-danger text-center px-5">Continue</a>
                                            </div>


                                        </div>
                                    </div>
                                </div>
            `
                })
            }else{
                 elm = `<h2 class="px-5 text-center">No shows available</h2>` 
            }
            $('#show_section').text("")
            $('#show_section').html(elm)
        })
    })

    // old show showing 
    $('.old-show').on('click', (e) => {
        e.preventDefault();

        $('#dropdownMenuButton').text("Previoues Shows")
        $('#showHeader').html("Previoues Shows")
        $.ajax({
            "url": "/theatre/shows/previouseShows",
            "method": "POST",
            data: "{}",
            contentType: "application/json; charset=utf-8",
        }).done((res) => { 

            let array = JSON.parse(res)
            let elm = "";

            if (array) {
                let array = JSON.parse(res)
                array.forEach(arr => {
                    // console.log(arr)
                    elm += ` <div class="col-sm-4">
                        <div class=" card">
                            <img class="card-img-top"
                                src="http://localhost:3000/uploads/${arr.movie[0].images[0].image_url}"
                                style="height: 220px;" alt="Card image cap">
                            <div class="card-body">

                                <h3 class="card-text h4 pb-2">
                                    ${arr.movie[0].movieName}
                                </h3>

                                <p class="card-text ">
                                    <b>SHOW TYPE : </b>
                                    ${arr.showType}
                                </p>
                               
                                <p class="card-text">
                                    <b>SCREEN ID : </b>
                                    ${arr.screen[0].screenId}
                                </p>
                                <p class="card-text">
                                    <b>SCREEN NAME : </b>
                                    ${arr.screen[0].screenName}
                                </p>
                                <p class="card-text">
                                    <b> SHOW DAYS: </b>
                                    ${new Date(arr.showByDate.startDate).toISOString().split('T')[0]}
                                        TO
                                        ${new Date(arr.showByDate.endDate).toISOString().split('T')[0]}
                                </p>

                                <div class="text-center">
                                    <a href="/theatre/show/${arr._id}"
                                        class="btn btn-danger text-center px-5">Continue</a>
                                </div>

                            </div>
                        </div>
                    </div>
                `
                })
            }else{
                elm = `<h2 class="px-5 text-center">No shows available</h2>` 
            }
            $('#show_section').text("")
            $('#show_section').html(elm)
        })
    })
})
