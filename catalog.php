<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "links.php" ?>
    <title>Каталог</title>
</head>

<body>

    <?php include "header.php" ?>
    <section class="catalog_sect first_sect">
        <div class="content">
            <div class="sect_title">Каталог</div>
            <div class="catalog_fields">
                <div class="ctg_product_card">
                    <div class="cpc_img_box"><img class="cpc_img" src="res/img/ctg_1.png"></div>
                    <div class="cpc_title">Трубы нержавеющие</div>
                    <div class="cpc_btn">
                        <a href="items?ctg=1"><button class="nf-ui_btn_mini">Перейти</button></a>
                    </div>
                </div>
                <div class="ctg_product_card">
                    <div class="cpc_img_box"><img class="cpc_img" src="res/img/ctg_2.jpg"></div>
                    <div class="cpc_title">Отводы, Тройники, Переходы, Заглушки</div>
                    <div class="cpc_btn">
                        <a href="items?ctg=2"><button class="nf-ui_btn_mini">Перейти</button></a>
                    </div>
                </div>
                <div class="ctg_product_card">
                    <div class="cpc_img_box"><img class="cpc_img" src="res/img/ctg_3.jpg"></div>
                    <div class="cpc_title">Резьбовые Фитинги</div>
                    <div class="cpc_btn">
                        <a href="items?ctg=3"><button class="nf-ui_btn_mini">Перейти</button></a>
                    </div>
                </div>
                <div class="ctg_product_card">
                    <div class="cpc_img_box"><img class="cpc_img" src="res/img/ctg_4.avif"></div>
                    <div class="cpc_title">Фланцы, воротники</div>
                    <div class="cpc_btn">
                        <a href="items?ctg=4"><button class="nf-ui_btn_mini">Перейти</button></a>
                    </div>
                </div>
                <div class="ctg_product_card">
                    <div class="cpc_img_box"><img class="cpc_img" src="res/img/ctg_5.jpg"></div>
                    <div class="cpc_title">Запорная и Соединительная арматура</div>
                    <div class="cpc_btn">
                        <a href="items?ctg=5"><button class="nf-ui_btn_mini">Перейти</button></a>
                    </div>
                </div>
                <div class="ctg_product_card">
                    <div class="cpc_img_box"><img class="cpc_img" src="res/img/ctg_6.jpg"></div>
                    <div class="cpc_title">Прокат</div>
                    <div class="cpc_btn">
                        <a href="items?ctg=6"><button class="nf-ui_btn_mini">Перейти</button></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div class="sect_break"></div>
    <section class="contact_sect">
        <div class="c_sect_bg_blur">
            <img src="res/img/background_blur_2.png" width="1200px" height="auto">
        </div>
        <div class="content">
            <div class="contact_fields">
                <div class="title_quest">Есть вопросы?</div>
                <div class="title_contact">Свяжитесь с нами!</div>
                <div class="contact_btn">
                    <button class="nf-ui_btn send_msg_btn">Задать вопрос</button>
                </div>
            </div>
        </div>
    </section>
    <?php include "footer.php" ?>
</body>
<script src="js/common_<?php echo COMMON_V; ?>.js"></script>

</html>