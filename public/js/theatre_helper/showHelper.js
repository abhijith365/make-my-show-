const form = document.getElementById('form')
const inp_seat_col = document.getElementById('seats_col_num')
const input__field = document.getElementById('seat_arr_id')
const title = document.getElementById('input-field');
const div = document.createElement('div');
const emptydiv = document.createElement('div');


let elementForshow = ` <div class="px-5">
                            <div class="form-group col-sm-12 ">
                                <label class="form-label" for="time">Show Start Time</label>
                                <input required type="time" name="showStartTime" id="time" class="form-control px-5" tabindex="27">
                                    <div class="valid-tooltip">
                                         Looks good!
                                     </div>
                                    <div class="invalid-tooltip">
                                        Please Add Show Start Time .
                                     </div>
                            </div>
                            <div  class="form-group col-sm-12 ">
                                <label class="form-label" for="time">Show End Time</label>
                                <input required type="time" name="showEndTime" id="time" class="form-control px-5" tabindex="27">
                                 <div class="valid-tooltip">
                                Looks good!
                            </div>
                            <div class="invalid-tooltip">
                                Please Add Show End Time .
                            </div>
                            </div>
                      </div>
                   
`;

div.innerHTML = elementForshow;
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