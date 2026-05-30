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