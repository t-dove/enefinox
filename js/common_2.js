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

goUpBtn.onclick = ()=>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

updateVisibility();

window.addEventListener('scroll', updateVisibility);

document.body.appendChild(goUpBtn);

function close_modal() {
    if (document.querySelector(".modal_window")) {
        document.querySelector(".modal_window").remove();
    }
}

document.querySelector(".price_btn").onclick = ()=>{
    download("/res/price_list.xlsx","price_list.xlsx");
};

document.querySelector(".price_btn_mb").onclick = ()=>{
    download("/res/price_list.xlsx","price_list.xlsx");
};

function download(path, filename){
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}; 