<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "links.php" ?>
    <title>Каталог</title>
</head>

<body>
    <?php include "header.php" ?>

    <section class="sect_delivery first_sect">
        <div class="content">
            <div class="sect_title">Каталог товаров</div>
            <div class="catalog_items">
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
<script src="js/items_<?php echo ITEMS_V; ?>.js"></script>

</html>