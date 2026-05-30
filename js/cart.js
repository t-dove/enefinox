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
let cart_items = getCookie("cart_items");
if (cart_items != null && cart_items.trim() != "") {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://early.cr-house.ru/data.php?query=get_cart_items&item_ids=" + cart_items, true);
    xhr.responseType = "json";
    xhr.onload = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let result = xhr.response;
                result.forEach(element => {
                    if (!document.querySelector("[data-arc='" + element.item_arc + "']")) {
                        let item_break = document.createElement("div");
                        item_break.className = "cart_item_break";
                        item_break.setAttribute('data-for_arc', element.item_arc);
                        let item_body = document.createElement("div");
                        item_body.className = "cart_item";
                        item_body.setAttribute('data-arc', element.item_arc);
                        let item_options;
                        if(element.surface == "none"){
                            item_options = "Материал: " + element.material + "<br>Размер: " + element.size;
                        }else{
                            item_options = "Поверхность: "+ element.surface + "<br>Материал: " + element.material + "<br>Размер: " + element.size;
                        }
                        item_body.innerHTML = `<div class="ci_preview">
                    <div class="c_item_photo"> <img src="`+ element.photo + `"></div>
                    <div class="c_item_des">
                        <div class="citem_title">`+ element.name + `</div>
                        <div class="citem_des">`+item_options+`</div>
                    </div>
                </div>
                <div class="ci_btns">
                    <div class="c_items_counter">
                        <div class="counter_btn_min counter_style" onclick='del_item("`+ element.item_arc + `");'>-</div>
                        <div class="counter_num counter_style">1</div>
                        <div class="counter_btn_pl counter_style" onclick='plus_item("`+ element.item_arc + `");'>+</div>
                    </div>
                    <div class="c_items_remove">
                        <button class="item_cart_remove" onclick='remove_items("`+ element.item_arc + `");'>Удалить</button>
                    </div>
                </div>`;
                        document.querySelector(".cart_items_block").appendChild(item_body);
                        document.querySelector(".cart_items_block").appendChild(item_break);
                    } else {
                        let get_existed_counter = document.querySelector("[data-arc='" + element.item_arc + "']").querySelector(".counter_num");
                        get_existed_counter.innerHTML = Number(get_existed_counter.innerHTML) + 1;
                    }
                });
                document.querySelector(".cart_items_count").innerHTML = "товаров: " + getCookie('cart_items').split('|').filter(n => n).length;
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

function remove_items(items_to_rem) {
    let currentItems = getCookie('cart_items');
    if (!currentItems) return;
    let itemsArray = currentItems.split('|');
    itemsArray = itemsArray.filter(item => item !== items_to_rem);
    let updatedItems = itemsArray.join('|');
    updatedItems = updatedItems.replace(/\|+$/, '');
    setCookie('cart_items', updatedItems, 30);
    document.querySelector("[data-arc='" + items_to_rem + "']").remove();
    document.querySelector("[data-for_arc='" + items_to_rem + "']").remove();
    document.querySelector(".cart_items_count").innerHTML = "товаров: " + getCookie('cart_items').split('|').filter(n => n).length;
}
function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}
function plus_item(textToAdd) {
    const currentItems = getCookie('cart_items');
    const itemsArray = currentItems ? currentItems.split('|') : [];
    itemsArray.push(textToAdd);
    let updatedItems = itemsArray.join('|');
    updatedItems = updatedItems.replace(/\|+$/, '');
    setCookie('cart_items', updatedItems, 30);
    let get_existed_counter = document.querySelector("[data-arc='" + textToAdd + "']").querySelector(".counter_num");
    get_existed_counter.innerHTML = Number(get_existed_counter.innerHTML) + 1;
    document.querySelector(".cart_items_count").innerHTML = "товаров: " + itemsArray.length;
}

function del_item(targetValue) {
    let currentItems = getCookie('cart_items');
    if (!currentItems) return;
    let itemsArray = currentItems.split('|');
    const index = itemsArray.indexOf(targetValue);
    if (index !== -1 && itemsArray.indexOf(targetValue, index + 1) === -1) {
        remove_items(targetValue);
    } else if (index !== -1) {
        itemsArray.splice(index, 1);
        let updatedItems = itemsArray.join('|');
        updatedItems = updatedItems.replace(/\|+$/, '');
        setCookie('cart_items', updatedItems, 30);
        let get_existed_counter = document.querySelector("[data-arc='" + targetValue + "']").querySelector(".counter_num");
        get_existed_counter.innerHTML = Number(get_existed_counter.innerHTML) - 1;
        document.querySelector(".cart_items_count").innerHTML = "товаров: " + itemsArray.length;
    }
}