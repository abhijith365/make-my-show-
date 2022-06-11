const form = document.getElementById('form')
const inp_seat_col = document.getElementById('seats_col_num')
const input__field = document.getElementById('seat_arr_id')
const title = document.getElementById('input-field');
const div = document.createElement('div');
const emptydiv = document.createElement('div');

let element = `
            <div class="form-group col-sm-3">
                      <label class="form-label" for="seats_tag_name">Enter row name</label>              
                <input required type="text" name="seats_tag_name" id="seats_tag_name" placeholder=" Enter row name" class="form-control">
                 <div class="valid-tooltip">
                                Looks good!
                            </div>
                            <div class="invalid-tooltip">
                                Please Add row name .
                            </div>
            </div>
            <div class="form-group col-sm-3">
                 <label class="form-label" for="total_seats">Enter total seats</label>
                <input required type="number" name="total_seats" id="total_seats" placeholder="Enter total seats in row" class="form-control">
                <div class="valid-tooltip">
                                Looks good!
                            </div>
                            <div class="invalid-tooltip">
                                Please Add total seats .
                            </div>
            </div>
            <div class="form-group col-sm-3">
                 <label class="form-label" for="seats_price">Enter seat price</label>
                <input required type="text" name="seats_price" id="seats_price" placeholder="Enter seat price" class="form-control">
                <div class="valid-tooltip">
                                Looks good!
                            </div>
                            <div class="invalid-tooltip">
                                Please Add seat price .
                            </div>

            </div>
            <div class="form-group col-sm-3">
                 <label class="form-label" for="seats_category">Enter seat category</label>
                <input required type="text" name="seats_category" id="seats_category" placeholder="Enter seat category" class="form-control">
                <div class="valid-tooltip">
                                Looks good!
                            </div>
                            <div class="invalid-tooltip">
                                Please Add seat category .
                            </div>

            </div>
            `;


div.innerHTML = element;
emptydiv.innerHTML = "";


inp_seat_col.addEventListener('change', (e) => {
    let num = parseInt(inp_seat_col.value)
    while (input__field.hasChildNodes()) {
        input__field.removeChild(input__field.lastChild);
    }

    if (num > 0) {
        input__field.style.display = 'flex';
        for (let i = 0; i < num; i++) {
            let clon = div.cloneNode(true);
            input__field.appendChild(clon);

        }

    } else {
        input__field.style.displays = 'none';
        while (input__field.lastElementChild) {
            input__field.removeChild(input__field.lastElementChild);
        }
    }
})
