<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'php_mailer/Exception.php';
require 'php_mailer/PHPMailer.php';
require 'php_mailer/SMTP.php';
include "tg_api.php";
const TG_TOKEN = "";
const ADMIN_IDS = [5877176602, 157207562];
$tg = new tg_api(TG_TOKEN);

class base
{
    function sql_query($query, $params = null, $return_id = false)
    {
        $host = 'localhost';
        $user = 'nf_inox_usr';
        $pass = 'Pa2OEEwkezThpxog';
        $db_name = 'nf_inox';
        $link = new PDO('mysql:dbname=' . $db_name . ';host=' . $host, $user, $pass);
        $link->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
        $link->exec("set names utf8mb4");
        $sth = $link->prepare($query);
        $result_succ = $sth->execute($params);
        if ($return_id)
            $result['insert_id'] = $link->lastInsertId();
        $result['result'] = $sth->fetchAll(PDO::FETCH_ASSOC);
        $result['succ'] = $result_succ;
        $link = null;
        return $result;
    }
}
$database = new base();

if ($_GET['query'] === 'get_items') {
    $ctg = $_GET['ctg_id'];
    $query_result = $database->sql_query("SELECT * FROM `catalog_item` WHERE `ctg_id` = ?", array($ctg))['result'];
    $items = array();
    foreach ($query_result as $row) {
        $unique_materials = array();
        $options = json_decode($row['options'], true);
        $materials = array();
        foreach ($options as $surface => $materials_sizes) {
            $materials = array_merge($materials, array_keys($materials_sizes));
        }
        $materials = array_unique($materials);
        $unique_materials = array_merge($unique_materials, $materials);
        $photo_link = '';
        if (!empty($row['photo'])) {
            $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/' . $row['photo'];
        } else {
            $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/slot.png';
        }
        $item = array(
            'item_id' => $row['id'],
            'name' => $row['name'],
            'photo' => $photo_link,
            'materials' => implode(', ', $unique_materials)
        );

        // Добавляем товар в массив
        $items[] = $item;
    }

    echo json_encode(array('items' => $items), JSON_UNESCAPED_UNICODE);
} else if ($_GET['query'] === 'get_item') {
    $item_id = $_GET['item_id'];
    $query_result = $database->sql_query("SELECT * FROM `catalog_item` WHERE `id` = ?", array($item_id))['result'];
    $item_info = array();

    foreach ($query_result as $row) {
        $photo_link = '';
        if (!empty($row['photo'])) {
            $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/' . $row['photo'];
        } else {
            $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/slot.png';
        }
        $item_info = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'photo' => $photo_link,
            'des' => $row['des'],
            'info' => json_decode($row['options'], true)
        );
    }
    echo json_encode($item_info);
} else if ($_GET['query'] === 'get_cart_items') {
    $item_ids = $_GET['item_ids'];
    $items = explode('|', $item_ids);

    $cart_items = array();

    foreach ($items as $item) {

        $item_parts = explode('_', $item);
        $item_id = $item_parts[0];
        $surface_index = $item_parts[1];
        $material_index = $item_parts[2];
        $size_index = $item_parts[3];
        $count = $item_parts[4];
        $item_arc = $item_id . "_" . $surface_index . "_" . $material_index . "_" . $size_index;
        $query_result = $database->sql_query("SELECT name, photo, options FROM `catalog_item` WHERE `id` = ?", array($item_id))['result'];

        foreach ($query_result as $row) {
            $options = json_decode($row['options'], true);
            $surface_name = array_keys($options)[$surface_index];
            $material_name = array_keys($options[$surface_name])[$material_index];
            $size = $options[$surface_name][$material_name][$size_index];

            $photo_link = '';
            if (!empty($row['photo'])) {
                $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/' . $row['photo'];
            } else {
                $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/slot.png';
            }

            $cart_items[] = array(
                'item_arc' => $item_arc,
                'name' => $row['name'],
                'photo' => $photo_link,
                'surface' => $surface_name,
                'material' => $material_name,
                'size' => $size,
                'count' => $count
            );
        }
    }

    echo json_encode($cart_items);
} else if ($_GET['query'] === 'send_order') {
    $item_ids = $_GET['item_ids'];
    $user_name = $_POST['user_name'];
    $user_phone = $_POST['user_phone'];
    $user_email = $_POST['user_email'];
    $user_message = $_POST['user_message'];
    $user_message = $user_message == "" || $user_message == null ? "Доп.сообщение не указано" : $user_message;
    $items = explode('|', $item_ids);
    $user_order = "";
    foreach ($items as $item) {

        $item_parts = explode('_', $item);
        $item_id = $item_parts[0];
        $surface_index = $item_parts[1];
        $material_index = $item_parts[2];
        $size_index = $item_parts[3];
        $count = $item_parts[4];
        $item_arc = $item_id . "_" . $surface_index . "_" . $material_index . "_" . $size_index;
        $query_result = $database->sql_query("SELECT * FROM `catalog_item` WHERE `id` = ?", array($item_id))['result'];

        foreach ($query_result as $row) {
            $options = json_decode($row['options'], true);
            $surface_name = array_keys($options)[$surface_index];
            $material_name = array_keys($options[$surface_name])[$material_index];
            $size = $options[$surface_name][$material_name][$size_index];

            // $photo_link = '';
            // if (!empty($row['photo'])) {
            //     $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/' . $row['photo'];
            // } else {
            //     $photo_link = 'https://' . $_SERVER['HTTP_HOST'] . '/res/slots/slot.png';
            // }
            $user_order .=  $row['name'] . ", поверхность: " . $surface_name . ", материал: " . $material_name . "(" . $size . "), кол-во: " . $count . "<br>";
            $user_order_tg .=  " • " . $row['name'] . ", поверхность: " . $surface_name . ", материал: " . $material_name . "(" . $size . "), кол-во: " . $count . "\n";
        }
    }
    $order_text = "Поступил новый заказ<br>Имя клиента: " . $user_name . "<br>Телефон: " . $user_phone . "<br>Почта: " . $user_email . "<br>Сообщение: " . $user_message;
    $order_text .= "<br>Детали заказа: <br>" . $user_order;
    $order_text_tg = "Поступил новый заказ\nИмя клиента: " . $user_name . "\nТелефон: " . $user_phone . "\nПочта: " . $user_email . "\nСообщение: " . $user_message;
    $order_text_tg .= "\nДетали заказа: \n\n" . $user_order_tg;
    send_tg($order_text_tg);
    $result = send_email("New order", $order_text, "Новый заказ", "sale@enefplus.ru");
    // $result = send_email("Новый заказ", $order_text, "Новый заказ", "aliosha.golubev@yandex.ru");
    echo "done";
} else if ($_GET['query'] === 'send_message') {
    $user_name = $_POST['user_name'];
    $user_phone = $_POST['user_phone'];
    $user_email = $_POST['user_email'];
    $user_message = $_POST['user_message'];
    $user_message = $user_message == "" || $user_message == null ? "Пусто" : $user_message;
    $msg_text = "Поступило новое сообщение<br>Имя клиента: " . $user_name . "<br>Телефон: " . $user_phone . "<br>Почта: " . $user_email . "<br>Сообщение: " . $user_message;
    $msg_text_tg = "Поступило новое сообщение\nИмя клиента: " . $user_name . "\nТелефон: " . $user_phone . "\nПочта: " . $user_email . "\nСообщение: " . $user_message;
    send_tg($msg_text_tg);
    $result = send_email("New message", $msg_text, "Новое сообщение", "sale@enefplus.ru");
    //  $result = send_email("Новый заказ", $msg_text, "Новый заказ", "aliosha.golubev@yandex.ru");
    echo "done";
} else if ($_GET['query'] === 'send_callback_order') {
    $user_name = $_POST['user_name'];
    $user_phone = $_POST['user_phone'];
    $user_message = $_POST['user_message'];
    $user_message = $user_message == "" || $user_message == null ? "Не оставлен" : $user_message;
    $msg_text = "Заказан обратный звонок<br>Имя клиента: " . $user_name . "<br>Телефон: " . $user_phone . "<br>Комментарий: " . $user_message;
    $msg_text_tg = "Заказан обратный звонок\nИмя клиента: " . $user_name . "\nТелефон: " . $user_phone . "\nКомментарий: " . $user_message;
    send_tg($msg_text_tg);
     $result = send_email("New callback", $msg_text, "Обратный звонок", "sale@enefplus.ru");
   // $result =  send_email("New callback", $msg_text, "Обратный звонок", "aliosha.golubev@yandex.ru");
    echo "done";
} else {
    echo "Error";
}


function send_tg($text, $test = false)
{
    global $tg;
    if (!$test) {
        foreach (ADMIN_IDS as $id) {
            $tg->sendMessage($id, $text);
        }
    }else{
        $tg->sendMessage(1256291036, $text);
    }
}


function send_email($alt_body, $body, $subject, $to)
{
    $mail = new PHPMailer(true);
    try {
        // Settings
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = 'enefinox.ru';                     //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = 'orders@enefinox.ru';                     //SMTP username
        $mail->Password   = 'OJa464SMDxl6RmUd';                               //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
        $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        $mail->CharSet = "UTF-8";
        // Content
        $mail->setFrom('orders@enefinox.ru');
        $mail->FromName = "ООО \"ЭНЭФ ПЛЮС\"";
        $mail->addAddress($to);
        $mail->isHTML(true);                       // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody = $alt_body;

        $mail->DKIM_domain = 'enefinox.ru';
        $mail->DKIM_private = '/var/www/enefinox_ru_usr65/data/key-private.pem';
        $mail->DKIM_selector = 'mail';
        $result = $mail->send();
        return $result;
    } catch (Exception $e) {
        return ($mail->ErrorInfo); //echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
