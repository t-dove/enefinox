var url = new URL(window.location.href);
var c = url.searchParams.get("item_id");

var target_info;
let cur_surface;
let cur_mark;
let cur_size;

let cur_surface_index;
let cur_mark_index;
let cur_size_index;

if (c != null) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://early.cr-house.ru/data.php?query=get_item&item_id=" + c, true);
    xhr.responseType = "json";
    xhr.onload = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let result = xhr.response;
                target_info = result;
                document.querySelector(".item_title_text").innerHTML = result.name;
                document.title = result.name;
                document.querySelector(".item_photo_url").src = result.photo;
                if (Object.keys(result.info).length == 1 && Object.keys(result.info)[0] == "none") {
                    document.querySelector(".flat_select").remove();
                    cur_surface = result.info.none;
                    document.querySelector(".mark_select").classList.remove("option_disabled");
                    cur_surface_index = 0;
                } else {
                    // console.log()
                }
            }
        }
    };
    xhr.onerror = (e) => {
        console.error(xhr.statusText);
    };
    xhr.send();
}

function in_card() {
    let cur_item = c + "_" + cur_surface_index + "_" + cur_mark_index + "_" + cur_size;
    updateCartItems(cur_item + "|");
    let modal_window = document.createElement("div");
    modal_window.className = "modal_window";
    modal_window.innerHTML = item_added_modal();
    document.body.appendChild(modal_window);
}

document.querySelector(".flat_select").onclick = (e) => {
    el = e.target;
    if (!el.classList.contains("option_disabled")) {
        setSurface();
    }
};

document.querySelector(".mark_select").onclick = (e) => {
    el = e.target;
    if (!el.classList.contains("option_disabled")) {
        setMark();
    }
};

document.querySelector(".size_select").onclick = (e) => {
    el = e.target;
    if (!el.classList.contains("option_disabled")) {
        setSize();
    }
};

function close_modal() {
    if (document.querySelector(".modal_window")) {
        document.querySelector(".modal_window").remove();
    }
}

function setSurface() {
    let modal_window = document.createElement("div");
    modal_window.className = "modal_window";
    modal_window.innerHTML = get_surface_modal_body();
    document.body.appendChild(modal_window);
    document.addEventListener("mousedown", (event) => {
        if (document.querySelector(".modal_window")) {
            if (!document.querySelector(".modal_window").contains(event.target)) {
                modal_window.remove();
            }
        }
    });
}

function setMark() {
    let modal_window = document.createElement("div");
    modal_window.className = "modal_window";
    modal_window.innerHTML = get_mark_modal_body(cur_surface);
    document.body.appendChild(modal_window);


    document.addEventListener("mousedown", (event) => {
        if (document.querySelector(".modal_window")) {
            if (!document.querySelector(".modal_window").contains(event.target)) {
                modal_window.remove();
            }
        }
    });
}

function setSize() {
    let modal_window = document.createElement("div");
    modal_window.className = "modal_window";
    modal_window.innerHTML = get_size_modal_body(cur_surface);
    document.body.appendChild(modal_window);


    document.addEventListener("mousedown", (event) => {
        if (document.querySelector(".modal_window")) {
            if (!document.querySelector(".modal_window").contains(event.target)) {
                modal_window.remove();
            }
        }
    });
}


function set_size_search(el) {
    let get_list = document.querySelector(".modal_list_items");
    get_list.querySelectorAll(".item_list_material").forEach(element => {
        if (element.innerHTML.toLocaleLowerCase().includes(el.value.toLocaleLowerCase()) && el.value.trim() != "") {
            element.style = "";
        } else if (el.value.trim() == "") {
            element.style = "";
        } else {
            element.style = "display: none";
        }
    });

}

function item_added_modal() {
    return `
   <div class='select_modal'>
   <div class='modal_title'>Товар добавлен в <a href='cart' style='color: #66BFFF;'>корзину!</a></div>
   <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
   </div>
  `;
}

function get_size_modal_body(mark) {
    let materials_list = "";
    cur_mark.forEach((element, index) => {
        materials_list += "<div class='item_list_material' onclick='select_size(" + index + ");'>" + element + "</div>";
    });
    return `
   <div class='select_modal'>
   <div class='modal_title'>Выберите размер</div>
   <div class='search_input'><input type='text' class='nfui_textbox' placeholder='Поиск' onkeyup='set_size_search(this);'></input></div>
   <div class='modal_list_items'>`+ materials_list + `</div>
   <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
   </div>
  `;
}

function get_mark_modal_body(surface) {
    let materials_list = "";
    Object.keys(surface).forEach((element, index) => {
        materials_list += "<div class='item_list_material' onclick='select_material(" + index + ", this);'>" + element + "</div>";
    });
    return `
   <div class='select_modal'>
   <div class='modal_title'>Выберите материал</div>
   <div class='modal_list_items'>`+ materials_list + `</div>
   <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
   </div>
  `;
}

function get_surface_modal_body() {
    let materials_list = "";
    Object.keys(target_info.info).forEach((element, index) => {
        materials_list += "<div class='item_list_material' onclick='select_surface(" + index + ", this);'>" + element + "</div>";
    });
    return `
   <div class='select_modal'>
   <div class='modal_title'>Выберите тип поверхности</div>
   <div class='modal_list_items'>`+ materials_list + `</div>
   <div class='close_modal'><button class='modal_close_btn' onclick='close_modal();'>Закрыть</button></div>
   </div>
  `;
}

function select_surface(index, matertial) {
    cur_surface = target_info.info[matertial.innerHTML];
    cur_size = null;
    cur_mark = null;
    cur_surface_index = index;
    document.querySelector(".flat_select").innerHTML = matertial.innerHTML;
    document.querySelector(".modal_window").remove();
    document.querySelector(".mark_select").classList.remove("option_disabled");
    document.querySelector(".size_select").innerHTML = "Размер";
    document.querySelector(".mark_select").innerHTML = "Марка стали";
    document.querySelector(".in_card_btn").disabled = true;
    document.querySelector(".size_select").classList.add("option_disabled");

}

function select_material(index, matertial) {
    cur_mark = cur_surface[matertial.innerHTML];
    cur_size = null;
    cur_mark_index = index;
    document.querySelector(".mark_select").innerHTML = Object.keys(cur_surface)[index];
    document.querySelector(".modal_window").remove();
    document.querySelector(".size_select").classList.remove("option_disabled");
    document.querySelector(".size_select").innerHTML = "Размер";
    document.querySelector(".in_card_btn").disabled = true;
}

function select_size(index) {
    cur_size = index;
    document.querySelector(".size_select").innerHTML = cur_mark[index];
    document.querySelector(".modal_window").remove();
    document.querySelector(".in_card_btn").disabled = false;
}

function updateCartItems(textToAdd) {
    const currentItems = getCookie('cart_items');
    const itemsArray = currentItems ? currentItems.split('|') : [];
    itemsArray.push(textToAdd);
    let updatedItems = itemsArray.join('|');
    updatedItems = updatedItems.replace(/\|+$/, '');
    setCookie('cart_items', updatedItems, 30);
}

function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

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
