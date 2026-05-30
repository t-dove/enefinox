<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "links.php" ?>
    <title>Корзина</title>
</head>

<body>
<?php include "header.php" ?>
    <div class="sect_title cart_title first_sect">Корзина</div>
    <div class="sect_break"></div>
    <section class="sect_delivery">
        <div class="content">
            <div class="cart_items_block">
                <!-- <div class="cart_item">
                    
                </div>
                <div class="cart_item_break"></div> -->
            </div>
            <div class="items_result">
                <div class="items_in">
                    <div class="cart_text">Ваша корзина</div>
                    <div class="cart_items_count">товаров: 2</div>
                </div>
                <div class="cart_item_break"></div>
                <div class="btn_buy">
                    <div class="price_text">Общая стоимость будет расчитана в эл. письме</div>
                    <button class="nf-ui_btn" onclick="send_order();">Оформить заказ</button>
                </div>
            </div>
        </div>
    </section>
    <div class="sect_break"></div>
    <?php include "footer.php" ?>
</body>
<script src="js/common_<?php echo COMMON_V; ?>.js"></script>
<script src="js/cart_<?php echo CART_V; ?>.js"></script>

</html>