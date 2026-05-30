var url = new URL(window.location.href);
var c = url.searchParams.get("ctg");
if (c != null) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL+"query=get_items&ctg_id=" + c, true);
    xhr.responseType = "json";
    xhr.onload = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let result = xhr.response;
                result.items.forEach(element => {
                    let element_block = document.createElement("div");
                    element_block.className = "item_card";
                    element_block.innerHTML = "<div class='ic_photo'><img class='item_photo_rounded' src='" + element.photo + "' width='100%' height='auto' alt=''></div><div class='ic_info'><div class='ic_info_title'>" + element.name + "</div><div class='ic_info_first-option'>Марка стали: " + element.materials + "</div><div class='ic_info_btn'><button class='nf-ui_btn_mini' onclick='go_item(" + element.item_id + ");'>Перейти</button></div></div>";
                    document.querySelector(".catalog_items").appendChild(element_block);
                });
            }
        }
    };
    xhr.onerror = (e) => {
        console.error(xhr.statusText);
    };
    xhr.send();
}

function go_item(item) {
    window.location.href = "item?item_id=" + item;
}