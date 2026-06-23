
document.addEventListener("DOMContentLoaded", function() {
    // Busca los parámetros en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const feedbackDiv = document.getElementById('form-feedback');

    if (status) {
        // Muestra el div
        feedbackDiv.style.display = 'flex';
        
        // Define el mensaje según el estado
        if (status === 'success') {
            feedbackDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Gracias por suscribirte! Pronto recibirás nuestros reportes.';
            feedbackDiv.classList.add('feedback-success');
        } else if (status === 'error') {
            feedbackDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Hubo un error al enviar tus datos. Por favor, revisalos e intentá nuevamente.';
            feedbackDiv.classList.add('feedback-error');
        }

        // Limpia la URL para que desaparezca el "?status=..." y quede prolijo
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Opcional: Ocultar el mensaje después de 6 segundos
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 6000);
    }
});