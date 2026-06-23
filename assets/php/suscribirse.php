<?php
header('Content-Type: application/json; charset=utf-8');
$recaptchaSecret = '6LcZ1ActAAAAAF3uVLtb07k7uz7jgxUYky15KZg_';

$token = isset($_POST['recaptcha_token'])
    ? $_POST['recaptcha_token']
    : '';

if (empty($token)) {
    echo json_encode([
        'success' => false,
        'message' => 'Validación reCAPTCHA fallida.'
    ]);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Acceso no permitido');
}

// Sanitizar datos

$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$email  = isset($_POST['email']) ? trim($_POST['email']) : '';
// Validaciones
if (empty($nombre) || empty($email)) {
    echo json_encode([
        'success' => false,
        'message' => 'Todos los campos son obligatorios'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email inválido'
    ]);
    exit;
}
// Debug temporal
if (empty($token)) {
    error_log("Token recibido vacío. POST: " . print_r($_POST, true));
}
$mail = new PHPMailer(true);

try {

    // ==========================
    // CONFIGURACIÓN SMTP
    // ==========================
    $mail->isSMTP();

    //$mail->Host       = 'smtp.gorostiagabursatil.com'; //
    $mail->Host = 'smtp.correoseguro.co';
    $mail->SMTPAuth   = true;

    $mail->Username   = 'contacto@gorostiagabursatil.com';
    $mail->Password   = 'Sarmiento348!!!';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->CharSet = 'UTF-8';


    // ==========================
    // REMITENTE
    // ==========================
    $mail->setFrom(
        'contacto@gorostiagabursatil.com',
        'Formulario Web Gorostiaga'
    );

    // ==========================
    // DESTINATARIO
    // ==========================
    $mail->addAddress(
        'contacto@gorostiagabursatil.com',
        'Gorostiaga Bursátil'
    );
    // ==========================
    // CONTENIDO
    // ==========================
    $mail->isHTML(true);
    $mail->Subject = 'Nueva suscripción a Reportes de Mercado';

    $mail->Body = '
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
    
    <div style="background:#0f172a;padding:20px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;">
            Nueva Suscripción
        </h2>
    </div>

    <div style="padding:25px;">
        <p style="font-size:16px;color:#374151;">
            Se registró un nuevo usuario para recibir los reportes de mercado.
        </p>

        <table style="width:100%;border-collapse:collapse;">
            <tr>
                <td style="padding:10px;font-weight:bold;">Nombre:</td>
                <td style="padding:10px;">' . $nombre . '</td>
            </tr>
            <tr style="background:#f8fafc;">
                <td style="padding:10px;font-weight:bold;">Email:</td>
                <td style="padding:10px;">' . $email . '</td>
            </tr>
            <tr>
                <td style="padding:10px;font-weight:bold;">Fecha:</td>
                <td style="padding:10px;">' . date('d/m/Y H:i') . '</td>
            </tr>
        </table>

    </div>

    <div style="background:#f8fafc;padding:15px;text-align:center;color:#6b7280;font-size:12px;">
        Sitio web Gorostiaga Bursátil
    </div>

</div>';
    $mail->SMTPDebug = 0; //2 es PRUEBA

    $verify = file_get_contents(
        'https://www.google.com/recaptcha/api/siteverify?secret=' .
            $recaptchaSecret .
            '&response=' .
            $token
    );

    $captcha = json_decode($verify, true);
    /*
    if (
        !$captcha['success'] ||
        $captcha['score'] < 0.5
    ) {

        echo json_encode([
            'success' => false,
            'message' => 'No se pudo validar la solicitud.'
        ]);

        exit;
    } 
*/
    if (!$captcha['success']) {

        echo json_encode([
            'success' => false,
            'message' => 'No se pudo validar la solicitud.'
        ]);

        exit;
    }

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => '¡Gracias! Recibirás nuestros reportes en tu correo.'
    ]);
    exit;
} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'message' => 'Ocurrió un error al enviar el formulario.'
    ]);
    exit;
}
