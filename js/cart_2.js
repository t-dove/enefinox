var total_items = 0;

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
let cart_items = getCookie("saved_cart_items");
if (cart_items != null && cart_items.trim() != "") {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://early.cr-house.ru/data.php?query=get_cart_items&item_ids=" + cart_items, true);
    xhr.responseType = "json";
    xhr.onload = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let result = xhr.response;
                result.forEach(element => {
                    let item_break = document.createElement("div");
                    item_break.className = "cart_item_break";
                    item_break.setAttribute('data-for_arc', element.item_arc);
                    let item_body = document.createElement("div");
                    item_body.className = "cart_item";
                    item_body.setAttribute('data-arc', element.item_arc);
                    let item_options;
                    if (element.surface == "none") {
                        item_options = "Материал: " + element.material + "<br>Размер: " + element.size;
                    } else {
                        item_options = "Поверхность: " + element.surface + "<br>Материал: " + element.material + "<br>Размер: " + element.size;
                    }
                    item_body.innerHTML = `<div class="ci_preview">
                    <div class="c_item_photo"> <img class='cart_item_photo_rounded' src="`+ element.photo + `"></div>
                    <div class="c_item_des">
                        <div class="citem_title">`+ element.name + `</div>
                        <div class="citem_des">`+ item_options + `</div>
                    </div>
                </div>
                <div class="ci_btns">
                    <div class="c_items_counter">
                        <div class="counter_btn_min counter_style" onclick='del_item("`+ element.item_arc + `");'>-</div>
                        <div class="counter_num counter_style" onclick='user_count("`+ element.item_arc + `");'>` + element.count + `</div>
                        <div class="counter_btn_pl counter_style" onclick='plus_item("`+ element.item_arc + `");'>+</div>
                    </div>
                    <div class="c_items_remove">
                        <button class="item_cart_remove" onclick='remove_items("`+ element.item_arc + `");'>Удалить</button>
                    </div>
                </div>`;
                    document.querySelector(".cart_items_block").appendChild(item_body);
                    document.querySelector(".cart_items_block").appendChild(item_break);

                });
                update_total_count();
            }
        }
    };
    xhr.onerror = (e) => {
        console.error(xhr.statusText);
    };
    xhr.send();
} else {
    document.querySelector(".items_result").remove();
    document.querySelector(".cart_items_block").innerHTML = "<div class='cart_text' style='text-align: center'>Вы не добавили ни одного товара</div>";
}

function update_total_count() {
    let currentItems = getCookie('saved_cart_items');
    let itemsArray = currentItems.split('|');
    let totalCount = itemsArray.reduce((total, item) => {
        const parts = item.split('_');
        const quantity = parseInt(parts[parts.length - 1]);
        return total + quantity;
    }, 0);
    document.querySelector(".cart_items_count").innerHTML = "товаров: " + totalCount;
}

function user_count(id) {
    let modal_body = `
    <div class='select_modal'>
    <div class='modal_title'>Укажите кол-во товаров</div>
    <div class='search_input'><input type='text' class='nfui_textbox user_items_count' placeholder='Кол-во товаров'></input></div>
    <div class='close_modal'><button class='modal_close_btn' onclick='set_items_count("`+ id + `");'>Готово</button></div>
    <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
    </div>
   `;
    let modal_window = document.createElement("div");
    modal_window.className = "modal_window";
    modal_window.innerHTML = modal_body;
    document.body.appendChild(modal_window);
    document.addEventListener("mousedown", (event) => {
        if (document.querySelector(".modal_window")) {
            if (!document.querySelector(".modal_window").contains(event.target)) {
                modal_window.remove();
            }
        }
    });
}

function set_items_count(id) {
    let count = document.querySelector(".user_items_count").value;
    if (typeof count === 'number' || count > 0) {
        close_modal();
        let currentItems = getCookie('saved_cart_items');
        let itemsArray = currentItems.split('|');
        itemsArray = itemsArray.filter(item => {
            return !item.startsWith(id);
        });
        itemsArray.push(id + '_' + count);
        const updatedItems = itemsArray.join('|');
        setCookie('saved_cart_items', updatedItems, 30);
        let get_existed_counter = document.querySelector("[data-arc='" + id + "']").querySelector(".counter_num");
        get_existed_counter.innerHTML = count;
        update_total_count();
    } else {
        close_modal();
        let error_modal_body = `
    <div class='select_modal'>
    <div class='modal_title'>Введено некорректное значение</div>
    <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
    </div>
   `;
        let modal_window = document.createElement("div");
        modal_window.className = "modal_window";
        modal_window.innerHTML = error_modal_body;
        document.body.appendChild(modal_window);
        document.addEventListener("mousedown", (event) => {
            if (document.querySelector(".modal_window")) {
                if (!document.querySelector(".modal_window").contains(event.target)) {
                    modal_window.remove();
                }
            }
        });
    }
}

function remove_items(itemToRemove) {
    let currentItems = getCookie('saved_cart_items');
    if (!currentItems) return;
    let itemsArray = currentItems.split('|');
    const isTargetItem = (item) => {
        return item.startsWith(itemToRemove + "_");
    };
    console.log(isTargetItem)
    itemsArray = itemsArray.filter(item => !isTargetItem(item));
    const updatedItems = itemsArray.join('|');
    setCookie('saved_cart_items', updatedItems, 30);
    update_total_count();
    document.querySelector("[data-arc='" + itemToRemove + "']").remove();
    document.querySelector("[data-for_arc='" + itemToRemove + "']").remove();
}

function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}
function plus_item(textToAdd) {
    const currentItems = getCookie('saved_cart_items');
    const itemsArray = currentItems ? currentItems.split('|') : [];
    let found = false;
    for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].startsWith(textToAdd)) {
            let parts = itemsArray[i].split('_');
            parts[parts.length - 1] = parseInt(parts[parts.length - 1]) + 1;
            itemsArray[i] = parts.join('_');
            found = true;
            break;
        }
    }
    if (!found) {
        itemsArray.push(textToAdd + '_1');
    }
    let updatedItems = itemsArray.join('|');
    setCookie('saved_cart_items', updatedItems, 30);
    update_total_count();
    let get_existed_counter = document.querySelector("[data-arc='" + textToAdd + "']").querySelector(".counter_num");
    get_existed_counter.innerHTML = Number(get_existed_counter.innerHTML) + 1;
}



function del_item(targetValue) {
    let currentItems = getCookie('saved_cart_items');
    if (!currentItems) return;
    let itemsArray = currentItems.split('|');
    const index = itemsArray.findIndex(item => {
        return item.startsWith(targetValue);
    });

    if (index !== -1) {
        const parts = itemsArray[index].split('_');
        if (parseInt(parts[parts.length - 1]) == 1) {
            remove_items(targetValue);
        } else {
            parts[parts.length - 1] = parseInt(parts[parts.length - 1]) - 1;
            itemsArray[index] = parts.join('_');
            let updatedItems = itemsArray.join('|');
            setCookie('saved_cart_items', updatedItems, 30);
            update_total_count();
            let get_existed_counter = document.querySelector("[data-arc='" + targetValue + "']").querySelector(".counter_num");
            get_existed_counter.innerHTML = Number(get_existed_counter.innerHTML) - 1;
        }
    }
}


function send_order() {
    let modal_body = `
    <div class='select_modal send_order_modal'>
    <div class='modal_title contact_us_title'>Свяжитесь с нами</div>
    <div class='query_fields'><input type='text' class='nfui_textarea user_name' placeholder='Ваше имя'></input>
    <input type='text' class='nfui_textarea user_phone' placeholder='Ваш телефон'></input>
    <input type='text' class='nfui_textarea user_email' placeholder='E-mail'></input>
    <textarea type='text' class='nfui_textarea user_message' placeholder='Сообщение'></textarea>
    </div>
    <div class='mark_data_collecting'><div class='mark_hitbox'></div><div class='mark_text'>Согласие на обработку перс. данных</div></div>
    <div class='close_modal'><button class='nf-ui_btn order_btn' disabled onclick='send();'>Отправить</button></div>
    <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
    </div>
   `;
    let modal_window = document.createElement("div");
    modal_window.className = "modal_window";
    modal_window.innerHTML = modal_body;
    document.body.appendChild(modal_window);
    document.addEventListener("mousedown", (event) => {
        if (document.querySelector(".modal_window")) {
            if (!document.querySelector(".modal_window").contains(event.target)) {
                modal_window.remove();
            }
        }
    });
    document.querySelector(".mark_data_collecting").onclick = () => {
        document.querySelector(".mark_hitbox").classList.toggle("mark_active");
        document.querySelector(".order_btn").disabled = !document.querySelector(".mark_hitbox").classList.contains("mark_active");
    };
}

function send() {
    let user_name = document.querySelector(".user_name").value;
    let user_phone = document.querySelector(".user_phone").value;
    let user_email = document.querySelector(".user_email").value;
    let user_message = document.querySelector(".user_message").value;
    let cart_items = getCookie("saved_cart_items");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://early.cr-house.ru/data.php?query=send_order&item_ids=" + cart_items, true);
    xhr.responseType = "json";
    var data = new FormData();
    data.append('user_name', user_name);
    data.append('user_phone', user_phone);
    data.append('user_email', user_email);
    data.append('user_message', user_message);
    xhr.onload = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let result = xhr.response;
                clear_cart();
                close_modal();
                let error_modal_body = `
    <div class='select_modal'>
    <div class='modal_title'>Спасибо за заказ! Мы свяжемся с вами в скором времени</div>
    <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
    </div>
   `;
                let modal_window = document.createElement("div");
                modal_window.className = "modal_window";
                modal_window.innerHTML = error_modal_body;
                document.body.appendChild(modal_window);
                document.addEventListener("mousedown", (event) => {
                    if (document.querySelector(".modal_window")) {
                        if (!document.querySelector(".modal_window").contains(event.target)) {
                            modal_window.remove();
                        }
                    }
                });
            } else {
                close_modal();
                let error_modal_body = `
    <div class='select_modal'>
    <div class='modal_title'>Что-то пошло не так. Попробуйте еще раз или повторите попытку через несколько минут</div>
    <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
    </div>
   `;
                let modal_window = document.createElement("div");
                modal_window.className = "modal_window";
                modal_window.innerHTML = error_modal_body;
                document.body.appendChild(modal_window);
                document.addEventListener("mousedown", (event) => {
                    if (document.querySelector(".modal_window")) {
                        if (!document.querySelector(".modal_window").contains(event.target)) {
                            modal_window.remove();
                        }
                    }
                });
            }
        }
    };
    xhr.onerror = (e) => {
        console.error(xhr.statusText);
    };
    xhr.send(data);
}

function clear_cart() {
    setCookie('saved_cart_items', "", 30);
    document.querySelector(".items_result").remove();
    document.querySelector(".cart_items_block").innerHTML = "<div class='cart_text' style='text-align: center'>Вы не добавили ни одного товара</div>";
}