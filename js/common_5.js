const API_URL = "https://enefinox.ru/data.php?"

document.querySelector(".bg_menu").onclick = () => {
    document.querySelector(".mobile_bg").classList.toggle("mb_hide");
};

document.querySelectorAll(".mb_switch").forEach(el => {
    el.onclick = () => {
        let domIndex = Array.from(el.parentNode.children).indexOf(el);
        document.querySelector(".mobile_bg").children[domIndex + 1].classList.toggle("bg_submenu_hide");
    };
});

document.querySelector(".head_cart").onclick = () => {
    window.location.href = "cart";
};


document.querySelectorAll(".head_logo").forEach(e => {
    e.onclick = () => {
        document.location.href = "/";
    };
});

let goUpBtn = document.createElement("div");
goUpBtn.className = "go_up_btn";


function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;
    const isInView =
        elementCenterX >= 0 &&
        elementCenterX <= (window.innerWidth || document.documentElement.clientWidth) &&
        elementCenterY >= 0 &&
        elementCenterY <= (window.innerHeight || document.documentElement.clientHeight);

    return isInView;
}




function isScrolledIntoView() {
    return window.pageYOffset > 500;
}
function updateVisibility() {

    if (isScrolledIntoView(goUpBtn)) {
        goUpBtn.style.display = 'block';

    } else {
        goUpBtn.style.display = 'none';
    }
}

goUpBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

updateVisibility();

window.addEventListener('scroll', updateVisibility);

document.body.appendChild(goUpBtn);

setInterval(() => {
    let get_main_footer = document.querySelector(".footer_cont");
    let get_footer = document.querySelector(".f_info");
    if (get_footer) {
        if (isInViewport(get_footer)) {
            goUpBtn.style.bottom = Number(get_main_footer.getBoundingClientRect().height + 25) + "px";
        } else {
            goUpBtn.style.bottom = "";
        }
    }
}, 100);

function close_modal() {
    if (document.querySelector(".modal_window")) {
        document.querySelector(".modal_window").remove();
    }
}

document.querySelector(".price_btn").onclick = () => {
    download("/res/price_list.xlsx", "price_list.xlsx");
};

document.querySelector(".price_btn_mb").onclick = () => {
    download("/res/price_list.xlsx", "price_list.xlsx");
};
if (document.querySelector(".send_msg_btn")) {
    document.querySelector(".send_msg_btn").onclick = () => {
        send_message_body();
    };
}
if (document.querySelector(".callback_btn")) {
    document.querySelector(".callback_btn").onclick = () => {
        order_callback_body();
    };
}
if (document.querySelector(".cb_btn_mb")) {
    document.querySelector(".cb_btn_mb").onclick = () => {
        order_callback_body();
    };
}
function download(path, filename) {
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
};
function order_callback_body() {
    let modal_body = `
    <div class='select_modal send_order_modal'>
    <div class='modal_title contact_us_title'>Заказать звонок</div>
    <div class='modal_des contact_us_des'>Представьтесь, мы вам перезвоним</div>
    <div class='query_fields'><input type='text' class='nfui_textarea user_name' placeholder='Ваше имя'></input>
    <input type='text' class='nfui_textarea user_phone' placeholder='+7 (___) ___-____'></input>
    <textarea type='text' class='nfui_textarea user_message' placeholder='Какие вопросы хотели бы уточнить?'></textarea>
    </div>
    <div class='mark_data_collecting'><div class='mark_hitbox'></div><div class='mark_text'>Согласие на обработку перс. данных</div></div>
    <div class='close_modal'><button class='nf-ui_btn order_btn' disabled onclick='send_callback_order();'>Заказать</button></div>
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
        checkModalActive();
        // document.querySelector(".order_btn").disabled = !document.querySelector(".mark_hitbox").classList.contains("mark_active");
    };
    document.querySelectorAll(".nfui_textarea").forEach(key => {
        key.addEventListener("keyup", (e) => {
            checkModalActive();
        })
    }
    )
    function checkModalActive() {
        let check_1 = document.querySelector(".user_name").value.trim();
        let check_2 = document.querySelector(".user_phone").value.trim().length >= 17;
        let check_5 = document.querySelector(".mark_hitbox").classList.contains("mark_active");
        document.querySelector(".order_btn").disabled = !(check_1 != "" && check_2 && check_5);
    }
    $(document).ready(function(){
        $('.user_phone').mask('+7 (000) 000-0000');
    });
}

function send_callback_order(){
    let user_name = document.querySelector(".user_name").value;
    let user_phone = document.querySelector(".user_phone").value;
    let user_message = document.querySelector(".user_message").value;
    if (user_name.trim() != "" && user_phone.trim() != "") {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + "query=send_callback_order", true);
        xhr.responseType = "json";
        var data = new FormData();
        data.append('user_name', user_name);
        data.append('user_phone', user_phone);
        data.append('user_message', user_message);
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let result = xhr.response;
                    close_modal();
                    let error_modal_body = `
    <div class='select_modal'>
    <div class='modal_title'>Спасибо за обращение! Мы перезвоним вам в ближайшее время</div>
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
}

function send_message_body() {
    let modal_body = `
    <div class='select_modal send_order_modal'>
    <div class='modal_title contact_us_title'>Свяжитесь с нами</div>
    <div class='query_fields'><input type='text' class='nfui_textarea user_name' placeholder='Ваше имя'></input>
    <input type='text' class='nfui_textarea user_phone' placeholder='Ваш телефон'></input>
    <input type='text' class='nfui_textarea user_email' placeholder='E-mail'></input>
    <textarea type='text' class='nfui_textarea user_message' placeholder='Сообщение'></textarea>
    </div>
    <div class='mark_data_collecting'><div class='mark_hitbox'></div><div class='mark_text'>Согласие на обработку перс. данных</div></div>
    <div class='close_modal'><button class='nf-ui_btn order_btn' disabled onclick='send_msg();'>Отправить</button></div>
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
        checkModalActive();
        // document.querySelector(".order_btn").disabled = !document.querySelector(".mark_hitbox").classList.contains("mark_active");
    };
    document.querySelectorAll(".nfui_textarea").forEach(key => {
        key.addEventListener("keyup", (e) => {
            checkModalActive();
        })
    }
    )
    function checkModalActive() {
        let check_1 = document.querySelector(".user_name").value.trim();
        let check_2 = document.querySelector(".user_phone").value.trim().length >= 17;
        let check_3 = document.querySelector(".user_email").value.trim();
        let check_4 = document.querySelector(".user_message").value.trim();
        let check_5 = document.querySelector(".mark_hitbox").classList.contains("mark_active");
        document.querySelector(".order_btn").disabled = !(check_1 != "" && check_2 && check_3 != "" && check_4 != "" && check_5);
    }
    $(document).ready(function(){
        $('.user_phone').mask('+7 (000) 000-0000');
    });
}

function send_msg() {
    let user_name = document.querySelector(".user_name").value;
    let user_phone = document.querySelector(".user_phone").value;
    let user_email = document.querySelector(".user_email").value;
    let user_message = document.querySelector(".user_message").value;
    if (user_name.trim() != "" && user_phone.trim() != "" && user_email.trim() != "" && user_message.trim() != "") {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + "query=send_message", true);
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
                    close_modal();
                    let error_modal_body = `
    <div class='select_modal'>
    <div class='modal_title'>Спасибо за обращение! Мы свяжемся с вами в скором времени</div>
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
}

document.addEventListener('DOMContentLoaded', (event) => {
    const currentUrl = window.location.href;
    const links = document.querySelectorAll('header a');

    links.forEach(link => {
        if (link.href === currentUrl) {
            link.style.color = '#66BFFF';
            link.href = '#';
        }
    });
});