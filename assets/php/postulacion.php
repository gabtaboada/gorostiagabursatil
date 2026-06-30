<?php
header('Content-Type: application/json; charset=utf-8');
 
$recaptchaSecret = '6LcZ1ActAAAAAF3uVLtb07k7uz7jgxUYky15KZg_';
 
$token = isset($_POST['recaptcha_token']) ? $_POST['recaptcha_token'] : '';
 
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
$nombre   = isset($_POST['nombre'])   ? trim($_POST['nombre'])   : '';
$email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
$area     = isset($_POST['area'])     ? trim($_POST['area'])     : '';
$mensaje  = isset($_POST['mensaje'])  ? trim($_POST['mensaje'])  : '';
 
// Validaciones
if (empty($nombre) || empty($email) || empty($area) || empty($mensaje)) {
    echo json_encode([
        'success' => false,
        'message' => 'Todos los campos obligatorios deben completarse.'
    ]);
    exit;
}
 
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'El email ingresado no es válido.'
    ]);
    exit;
}
 
// Mapa de áreas para mostrar en el mail
$areas = [
    'asesor'   => 'Asesor de Inversiones',
    'analista' => 'Analista de Mercado de Capitales',
    'atencion' => 'Atención al Cliente',
    'otro'     => 'Otro / Postulación Espontánea',
];
$areaLabel = isset($areas[$area]) ? $areas[$area] : htmlspecialchars($area);
 
// Escapar para HTML
$nombreSafe   = htmlspecialchars($nombre);
$emailSafe    = htmlspecialchars($email);
$telefonoSafe = !empty($telefono) ? htmlspecialchars($telefono) : '<em style="color:#9ca3af;">No indicado</em>';
$mensajeSafe  = nl2br(htmlspecialchars($mensaje));
 
$mail = new PHPMailer(true);
 
try {
 
    // ==========================
    // CONFIGURACIÓN SMTP
    // ==========================
    $mail->isSMTP();
    $mail->Host       = 'smtp.correoseguro.co';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'contacto@gorostiagabursatil.com';
    $mail->Password   = 'Sarmiento348!!!';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';
 
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
        /*'contacto@gorostiagabursatil.com',*/
        'gabpaginasinternet@gmail.com',
        'Gorostiaga Bursátil'
    );
 
    // Reply-To al candidato para responder directamente
    $mail->addReplyTo($email, $nombre);
 
    // ==========================
    // CONTENIDO
    // ==========================
    $mail->isHTML(true);
    $mail->Subject = 'Nueva postulación laboral: ' . $areaLabel;
 
    $mail->Body = '
<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
 
    <div style="background:#0f172a;padding:24px;text-align:center;">
        <h2 style="color:#ffffff;margin:0;font-size:20px;">
            Nueva Postulación Laboral
        </h2>
        <p style="color:#94a3b8;margin:6px 0 0;font-size:14px;">
            Gorostiaga Bursátil · Trabajá con nosotros
        </p>
    </div>
 
    <div style="padding:28px;">
        <p style="font-size:15px;color:#374151;margin-top:0;">
            Se recibió una nueva postulación desde el sitio web.
        </p>
 
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="background:#f1f5f9;">
                <td style="padding:11px 14px;font-weight:bold;color:#1e293b;width:35%;">Nombre completo</td>
                <td style="padding:11px 14px;color:#374151;">' . $nombreSafe . '</td>
            </tr>
            <tr>
                <td style="padding:11px 14px;font-weight:bold;color:#1e293b;">Email</td>
                <td style="padding:11px 14px;color:#374151;">' . $emailSafe . '</td>
            </tr>
            <tr style="background:#f1f5f9;">
                <td style="padding:11px 14px;font-weight:bold;color:#1e293b;">Teléfono</td>
                <td style="padding:11px 14px;color:#374151;">' . $telefonoSafe . '</td>
            </tr>
            <tr>
                <td style="padding:11px 14px;font-weight:bold;color:#1e293b;">Área de interés</td>
                <td style="padding:11px 14px;">
                    <span style="background:#dbeafe;color:#1d4ed8;padding:3px 10px;border-radius:20px;font-size:13px;font-weight:600;">
                        ' . $areaLabel . '
                    </span>
                </td>
            </tr>
            <tr style="background:#f1f5f9;">
                <td style="padding:11px 14px;font-weight:bold;color:#1e293b;">Fecha</td>
                <td style="padding:11px 14px;color:#374151;">' . date('d/m/Y H:i') . '</td>
            </tr>
        </table>
 
        <div style="margin-top:24px;background:#f8fafc;border-left:4px solid #1d4ed8;border-radius:4px;padding:16px;">
            <p style="font-weight:bold;color:#1e293b;margin:0 0 8px;">Mensaje del candidato:</p>
            <p style="color:#374151;margin:0;line-height:1.6;">' . $mensajeSafe . '</p>
        </div>
 
        <p style="margin-top:20px;font-size:13px;color:#6b7280;">
            Podés responder directamente a este mail para contactar al candidato.
        </p>
    </div>
 
    <div style="background:#f8fafc;padding:14px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;">
        Sitio web Gorostiaga Bursátil &mdash; Sección "Trabajá con nosotros"
    </div>
 
</div>';
 
    $mail->SMTPDebug = 0;
 
    // Verificar reCAPTCHA
    $verify  = file_get_contents(
        'https://www.google.com/recaptcha/api/siteverify?secret=' .
            $recaptchaSecret .
            '&response=' .
            $token
    );
    $captcha = json_decode($verify, true);
 
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
        'message' => '¡Gracias por postularte! Nos comunicaremos a la brevedad.'
    ]);
    exit;
 
} catch (Exception $e) {
 
    echo json_encode([
        'success' => false,
        'message' => 'Ocurrió un error al enviar la postulación.'
    ]);
    exit;
}