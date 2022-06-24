$(document).ready(() => {
    $(".cancel_ticket").on("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        let data = $(this).data("cancel")


        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel booking!'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    "url": "/cancelTicket",
                    "method": "POST",
                    data: JSON.stringify({ id: data }),
                    contentType: "application/json; charset=utf-8",
                }).done((response) => {
                    if (response) {
                        Swal.fire(
                            'Canceled!',
                            'Your Ticket has been canceled.',
                            'success'
                        )
                        $(this).parent().parent().find('.unpaid-tag').css("display", "block");
                        $(this).parent().parent().find('.tkt-cancellation').css("display", "block");
                        $(this).parent().find('.cancel_ticket').css("display", "none")

                    } else {
                        Swal.fire(
                            'Failed to cancel!',
                            'Your ticket failed to cancel.',
                            'warning'
                        )
                    }
                }
                )
            }
        })
    })


    var specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };
    $('.fa-download').click(function () {
        Swal.fire({
            title: 'Are you sure?',
            text: "download.....!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, download it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var doc = new jsPDF();
                doc.fromHTML(
                    $('.target').html(), 15, 15,
                    { 'width': 170, 'elementHandlers': specialElementHandlers },
                    function () { doc.save('sample-file.pdf'); }
                );
                Swal.fire(
                    'Downloading...!',
                    'Your file has been downloading...',
                    'success'
                )
            }
        })


    });

})
